<template>
  <!-- 
    설정 로딩 중: 로딩 화면 표시
    - 서버에서 설정을 가져오는 동안 표시
    - 로딩 스피너 + 텍스트 애니메이션
  -->
  <div v-if="configStore.isLoading" class="config-loading">
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ office }} AI Works를 준비하고 있습니다...</p>
    </div>
  </div>
  <!-- 
    설정 로드 완료: 실제 앱 렌더링
    동적으로 layout을 변경합니다.
    route.meta.layout에 따라:
    - "AuthLayout" -> AuthLayout 컴포넌트 렌더링
    - "MainLayout" -> MainLayout 컴포넌트 렌더링
    - 없음 -> router-view만 렌더링
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
 * 동작 흐름:
 * 1. onMounted 실행
 *    ├─ configStore.fetchConfig() - 서버 설정 로드
 *    ├─ configStore.updateFavicon() - Favicon 변경
 *    └─ authStore.restoreSession() - 세션 복구
 * 2. computed (currentLayout) - 현재 route의 layout 결정
 * 3. template - 해당 layout 렌더링
 */
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/configStore";

// ==================== layout 컴포넌트 import ====================
import AuthLayout from "@/layout/AuthLayout.vue";
import MainLayout from "@/layout/MainLayout.vue";

// ==================== router 및 store ====================
const route = useRoute();
const authStore = useAuthStore();
const configStore = useConfigStore();

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

/**
 * Favicon 동적 변경
 */
function updateFavicon(faviconUrl) {
  if (!faviconUrl) return;

  let link = document.querySelector("link[rel~='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = faviconUrl;
}

/**
 * 회사명 (로딩 화면용)
 * configStore에서 가져오거나 기본값 사용
 */
const office = computed(() => {
  return configStore.office || "KT-DS";
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
onMounted(async () => {
  console.log("🚀 ============================================");
  console.log("🚀 App.vue 초기화 시작");
  console.log("🚀 ============================================");
  console.log("📡 1️⃣ 서버 설정 로드 시작...");
  await configStore.fetchConfig("/api/app/info");
  console.log("✅ 1️⃣ 서버 설정 로드 완료!");
  await updateFavicon(configStore.faviconImageUrl);
  console.log("✅ 파비콘 로딩 완료!");
  // ============================================================
  // 초기화 완료 로그
  // ============================================================
  console.log("🎉 ============================================");
  console.log("🎉 앱 초기화 완료!");
  console.log("📦 설정 데이터:", configStore.serverConfig);
  console.log("🏢 회사명:", configStore.office);
  console.log("🎨 로고:", configStore.logoImageUrl);
  console.log("🎨 판넬:", configStore.loginPannelImageUrl);
  console.log("🎨 메인 색상:", configStore.mainColorHexCode);

  console.log("🔒 로그인 상태:", authStore.isLoggedIn);
  console.log("👤 사용자:", authStore.user);
  console.log("🎨 현재 layout:", currentLayout.value?.name || "none");

  try {
    // 1️⃣ 서버 설정 로드 (가장 먼저!)
  } catch (error) {
    // ============================================================
    // 에러 처리
    // ============================================================
    console.error("❌ ============================================");
    console.error("❌ 앱 초기화 실패!");
    console.error("❌ ============================================");
    console.error("❌ 에러:", error);

    // 에러 발생 시에도 세션은 복구 시도
    authStore.restoreSession();

    // TODO: 에러 페이지로 이동하거나 토스트 메시지 표시
  }

  // ✅ 앱 시작 시 가장 먼저 세션 복구
  authStore.restoreSession();

  console.log("✅ 앱 초기화 완료");
  console.log("🔑 세션 상태:", authStore.isLoggedIn);
  console.log("👤 사용자:", authStore.user);
  console.log("🎨 현재 layout:", currentLayout.value?.name || "none");
});
</script>

<style lang="scss" scoped>
/**
 * ============================================================
 * 로딩 화면 스타일
 * ============================================================
 * 
 * 서버 설정을 가져오는 동안 표시되는 로딩 화면
 * 
 * 특징:
 * - 전체 화면 중앙 정렬
 * - 그라디언트 배경 (트렌디한 느낌)
 * - 회전 애니메이션 (loading-spinner)
 * - 텍스트 페이드 애니메이션 (pulse)
 */

.config-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 트렌디한 그라디언트 배경 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

  /* 배경 애니메이션 (선택사항) */
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;

  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

/**
 * 로딩 스피너 (회전 애니메이션)
 */
.loading-spinner {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/**
 * 로딩 텍스트
 */
.loading-text {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  text-align: center;

  /* 텍스트 페이드 애니메이션 */
  animation: pulse 1.5s ease-in-out infinite;

  /* 텍스트 그림자 (가독성 향상) */
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/**
 * ============================================================
 * 애니메이션 정의
 * ============================================================
 */

/* 스피너 회전 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 텍스트 페이드 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 배경 그라디언트 이동 (선택사항) */
@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
