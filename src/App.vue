<!-- src/App.vue -->
<template>
  <!-- 
    동적으로 layout을 변경합니다.
    
    route.meta.layout에 따라:
    - "AuthLayout" -> AuthLayout 컴포넌트 렌더링
    - "MainLayout" -> MainLayout 컴포넌트 렌더링
    - 없음 -> router-view만 렌더링
    
    Vue3 특징:
    - :is로 동적 컴포넌트 렌더링
    - v-if로 조건부 렌더링
  -->
  <component :is="currentLayout" v-if="currentLayout">
    <router-view />
  </component>

  <!-- layout이 없는 경우 -->
  <router-view v-else />
</template>

<script setup>
/**
 * App.vue - 루트 컴포넌트
 *
 * 역할:
 * 1. 현재 route의 layout 정보를 읽음
 * 2. 해당 layout 컴포넌트를 동적으로 로드
 * 3. router-view를 layout 내부에 렌더링
 * 4. 앱 초기화 시 세션 자동 복구
 *
 * 동작 흐름:
 * 1. onMounted: 앱 시작 시 세션 복구
 * 2. computed (currentLayout): 현재 route의 layout 결정
 * 3. template: 해당 layout 렌더링
 */

import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// ==================== layout 컴포넌트 import ====================
import AuthLayout from "@/layout/AuthLayout.vue";
import MainLayout from "@/layout/MainLayout.vue";

// ==================== router 및 store ====================
const route = useRoute();
const authStore = useAuthStore();

// ==================== layout 매핑 객체 ====================
/**
 * layoutComponents: 레이아웃 매핑
 *
 * meta.layout의 값을 여기서 컴포넌트로 변환합니다.
 * 예: "AuthLayout" -> AuthLayout 컴포넌트
 *
 * 새로운 layout을 추가할 때:
 * 1. import로 컴포넌트 불러오기
 * 2. 이 객체에 추가
 * 3. router/index.js의 meta.layout에 이름 지정
 */
const layoutComponents = {
  AuthLayout,
  MainLayout,
};

// ==================== 계산된 속성: 현재 layout ====================
/**
 * currentLayout: 현재 route에 필요한 layout 컴포넌트
 *
 * 동작:
 * - route.meta.layout의 값을 읽어서
 * - layoutComponents에서 해당 컴포넌트를 반환
 * - route가 변경되면 자동으로 재계산
 *
 * computed는 자동으로 의존성을 추적하고,
 * route.meta.layout이 변경되면 자동으로 재계산됩니다.
 *
 * Vue2 vs Vue3:
 * Vue2: computed() { return ... }
 * Vue3: const currentLayout = computed(() => ...)
 */
const currentLayout = computed(() => {
  // 현재 route의 meta.layout 값 가져오기
  const layoutName = route.meta.layout;

  // 개발 로그 (라우트 변경 시 확인용)
  console.log("📍 현재 route:", route.path);
  console.log("🎨 현재 layout:", layoutName);
  console.log("🔒 로그인 상태:", authStore.isLoggedIn);

  // layoutComponents에서 해당 컴포넌트 반환
  // 없으면 undefined (v-if에서 false 처리)
  return layoutComponents[layoutName];
});

// ==================== 라이프사이클: 앱 초기화 ====================
/**
 * onMounted: 앱이 처음 마운트될 때 실행
 *
 * 동작:
 * 1. localStorage에서 세션 데이터 복원
 * 2. 인증 상태 복구
 * 3. 라우터가 올바른 페이지로 네비게이션
 *
 * 페이지 새로고침 시 동작:
 * 1. App.vue가 다시 마운트됨
 * 2. onMounted에서 restoreSession() 호출
 * 3. authStore.isLoggedIn이 복원됨
 * 4. 라우터 가드에서 인증 상태를 확인하고 올바른 페이지로 이동
 *
 * Vue2 vs Vue3:
 * Vue2: mounted() { ... }
 * Vue3: onMounted(() => { ... })
 */
onMounted(() => {
  // ✅ 앱 시작 시 가장 먼저 세션 복구
  authStore.restoreSession();

  console.log("✅ 앱 초기화 완료");
  console.log("🔑 세션 상태:", authStore.isLoggedIn);
  console.log("👤 사용자:", authStore.user);
  console.log("🎨 현재 layout:", currentLayout.value?.name || "none");
});
</script>

<style scoped>
/* 
  App.vue는 layout 렌더링만 담당하므로 
  여기서는 스타일을 정의하지 않습니다.
  
  각 layout(AuthLayout, MainLayout)에서 
  자체 스타일을 정의합니다.
*/
</style>
