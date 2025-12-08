<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <!-- SideBar -->
    <MainSidebar
      class="main-sidebar"
      :is-open="isSidebarOpen"
      @close="closeSidebar"
    />
    <!-- Main Conent -->
    <main class="content-area" :style="gradientObject">
      <router-view />
    </main>
  </div>
</template>

<script setup>
/**
 * MainLayout.vue - 메인 페이지 전체 레이아웃
 *
 * 구성:
 * 1. Sidebar Toggle Button (항상 표시)
 * 2. MainSidebar (토글 가능)
 * 3. Content Area (메인 콘텐츠) - ✅ 동적 그래디언트 배경 적용
 * 4. Overlay (모바일/태블릿)
 *
 * Vue3 Composition API:
 * - ref(): 반응형 상태
 * - computed(): 계산된 속성
 * - onMounted/onUnmounted: 라이프사이클
 *
 * ✅ Vue2 vs Vue3 비교:
 * ======================
 *
 * Vue2 (Options API 방식):
 * ```
 * export default {
 *   data() {
 *     return {
 *       isSidebarOpen: true,
 *       isMobileOrTablet: false,
 *       gradientStyle: 'linear-gradient(135deg, #FFE6F0, #FFFFFF)'
 *     }
 *   },
 *   computed: {
 *     // 계산된 속성
 *     gradientObject() {
 *       return {
 *         background: this.gradientStyle
 *       }
 *     }
 *   },
 *   methods: {
 *     toggleSidebar() { ... },
 *     closeSidebar() { ... }
 *   },
 *   mounted() {
 *     this.handleWindowResize()
 *     window.addEventListener('resize', this.handleWindowResize)
 *   },
 *   beforeUnmount() {
 *     window.removeEventListener('resize', this.handleWindowResize)
 *   }
 * }
 * ```
 *
 * Vue3 (Composition API 방식):
 * - ref()로 반응형 상태 선언 (this.data 대신)
 * - 함수형 구조로 더 간결한 코드
 * - Composable(useGradient)로 로직 분리 가능
 * - 의존성 추적이 명시적 (어떤 변수를 사용하는지 명확)
 * - 더 나은 TypeScript 지원
 */

import { ref, onMounted } from "vue";
import MainSidebar from "@/components/sidebar/MainSidebar.vue";
import { useGradient } from "@/composables/useGradient.js";
import { useConfigStore } from "@/stores/configStore";

const configStore = useConfigStore();
/* ==================== 반응형 상태 (State) ==================== */

/**
 * isSidebarOpen: SideBar 열림 상태
 *
 * Desktop (1024px 초과): 초기값 true (기본 열려있음)
 * Tablet/Mobile: 초기값 false (기본 닫혀있음)
 */
const isSidebarOpen = ref(true);

/* ==================== Composable 연동 (동적 그래디언트) ==================== */

/**
 * useGradient Composable 사용
 *
 * Composable이란?
 * - Vue3의 로직 재사용 패턴
 * - 함수형으로 상태와 메서드를 캡슐화
 * - 여러 컴포넌트에서 같은 로직 재사용 가능
 *
 * Vue2에는 없던 개념 (Vue2는 Mixin 또는 HOC 사용)
 *
 * useGradient에서 반환하는 것:
 * - gradientStartColor: ref - 시작 색상 (#FFE6F0)
 * - gradientEndColor: ref - 종료 색상 (#FFFFFF)
 * - gradientAngle: ref - 그래디언트 각도 (135)
 * - gradientObject: computed - CSS 스타일 객체
 * - setGradient(): 함수 - 그래디언트 설정
 */
const { gradientObject, setGradient } = useGradient(); // resetGradient

/**
 * initializeGradient: 그래디언트 초기화
 *
 * MainLayout 로드 시 그래디언트 초기화
 * - 현재: 기본값 사용 (#FFE6F0 → #FFFFFF)
 * - 추후: 서버 API에서 받은 색상값 적용 가능
 *
 * 추후 구현 예시:
 * ```
 * const initializeGradient = async () => {
 *   try {
 *     const config = await fetchAppConfigFromServer()
 *     setGradient(config.gradientStart, config.gradientEnd, config.angle)
 *   } catch (error) {
 *     console.error('그래디언트 설정 실패:', error)
 *     resetGradient() // 기본값으로 초기화
 *   }
 * }
 * ```
 */
const initializeGradient = () => {
  console.log("🎨 MainLayout 그래디언트 동적 초기화");

  //  * 그래디언트 초기화
  // 파란 - #6A8DFF
  // 노란 - #FFF799
  // 검은 - #555555
  // 빨강 - #FFE6F0
  // 추후 서버에서 받은 값으로 동적 적용:
  // const config = await fetchConfigFromServer()
  // setGradient(config.gradientStart, config.gradientEnd, config.angle)
  setGradient(configStore.backgroundGradientStandardColor, "#FFFFFF", 360);
};

/* ==================== 라이프사이클 ==================== */
onMounted(() => {
  console.log("✅ MainLayout 마운트됨");

  // ✅ 그래디언트 초기화 추가
  initializeGradient();
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;

/* ==================== MainLayout 전체 구조 ==================== */
.main-layout {
  /* 
    Grid 레이아웃
  */
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 1fr;

  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
/* ==================== 메인 콘텐츠 영역 ==================== */
/**
   * ✅ 동적 그래디언트 배경
   * 
   * 이전 (고정 색상):
   * background-color: var.$bg-primary;
   * 
   * 현재 (동적 그래디언트):
   * :style="gradientObject"를 통해 런타임에 적용
   * - 시작색: #FFE6F0 (밝은 핑크)
   * - 종료색: #FFFFFF (흰색)
   * - 방향: 135도 (좌상단 → 우하단)
   * 
   * 반응형 업데이트:
   * useGradient Composable에서 색상 값이 변경되면
   * computed()를 통해 자동으로 배경 그래디언트도 업데이트됨
   * 
   * Vue2와의 비교:
   * - Vue2: data의 gradientStyle을 직접 수정하면 리렌더링
   * - Vue3: ref나 computed가 변경되면 자동으로 리렌더링 (더 효율적)
   */

.content-area {
  /* 
    Grid의 두 번째 셀 (또는 첫 번째 셀 모바일)
  */
  grid-column: 2 / 3;
  grid-row: 1 / 2;

  /* 스크롤 가능 */
  overflow-y: auto;
  overflow-x: hidden;

  /* 마진/패딩 제거 */
  margin: 0;
  padding: 0;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var.$gray-100;
  }

  &::-webkit-scrollbar-thumb {
    background: var.$gray-300;
    border-radius: 4px;

    &:hover {
      background: var.$gray-400;
    }
  }
}

/* ==================== 반응형 디자인 ==================== */

/* Tablet/Mobile (1024px 이하) */
@media (max-width: 1024px) {
  .main-layout {
    /* 1열로 변경 */
    grid-template-columns: 2fr;
    .main-sidebar {
      grid-column: 1 / 2;
    }
  }

  .content-area {
    /* 첫 번째 열 */
    grid-column: 2 / 2;
  }
}

/* Mobile (768px 이하) */
@media (max-width: 768px) {
  //
}
</style>
