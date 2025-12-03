<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <!-- 
      ✅ 토글 버튼을 SideBar 밖에 배치
      모든 화면에서 항상 보임
    -->
    <!-- <button
      class="layout__sidebar-toggle"
      @click="toggleSidebar"
      :title="isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'"
      :aria-label="isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'"
    >
      <span class="layout__toggle-icon">
        {{ isSidebarOpen ? "✕" : "☰" }}
      </span>
    </button> -->

    <!-- SideBar (토글 상태에 따라 열고 닫힘) -->
    <MainSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

    <!-- 메인 콘텐츠 영역 -->
    <!-- ✅ :style="gradientObject" 추가 - 동적 그래디언트 적용 -->
    <main class="content-area" :style="gradientObject">
      <router-view />
    </main>
  </div>

  <!-- 모바일/태블릿 오버레이 -->
  <div
    v-if="isSidebarOpen && isMobileOrTablet"
    class="layout__overlay"
    @click="closeSidebar"
  ></div>
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

import { ref, onMounted, onUnmounted } from "vue";
import MainSidebar from "@/components/sidebar/MainSidebar.vue";
import { useGradient } from "@/composables/useGradient.js";

/* ==================== 반응형 상태 (State) ==================== */

/**
 * isSidebarOpen: SideBar 열림 상태
 *
 * Desktop (1024px 초과): 초기값 true (기본 열려있음)
 * Tablet/Mobile: 초기값 false (기본 닫혀있음)
 */
const isSidebarOpen = ref(true);

/**
 * isMobileOrTablet: 현재 모바일 또는 태블릿 화면인지 확인
 */
const isMobileOrTablet = ref(false);

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
 * - resetGradient(): 함수 - 그래디언트 초기화
 */
const { gradientObject, setGradient } = useGradient(); // resetGradient

/* ==================== 메서드 (Methods) ==================== */

/**
 * toggleSidebar: SideBar 열고 닫기 토글
 *
 * Vue2와의 비교:
 * - Vue2: this.isSidebarOpen = !this.isSidebarOpen
 * - Vue3: isSidebarOpen.value = !isSidebarOpen.value (ref 사용)
 */
const toggleSidebar = () => {
  console.log("🔄 SideBar 토글:", !isSidebarOpen.value);
  isSidebarOpen.value = !isSidebarOpen.value;
};

/**
 * closeSidebar: SideBar 닫기
 *
 * 동작:
 * - 모바일/태블릿에서만 자동으로 닫기
 * - Desktop에서는 열린 상태 유지
 */
const closeSidebar = () => {
  console.log("👈 SideBar 닫기");
  // 모바일/태블릿에서만 자동으로 닫기
  if (isMobileOrTablet.value) {
    isSidebarOpen.value = false;
  }
};

/**
 * handleWindowResize: 창 크기 변경 감지
 *
 * 반응형 동작:
 * 1. 현재 창 너비 확인
 * 2. 1024px 이하: 모바일/태블릿 모드
 * 3. 1024px 초과: Desktop 모드 (SideBar 항상 열기)
 *
 * Vue2와의 비교:
 * - Vue2: window.innerWidth > 1024 ? this.sidebarOpen = true : ...
 * - Vue3: 동일한 로직이지만 ref().value로 접근
 */
const handleWindowResize = () => {
  const width = window.innerWidth;

  // 1024px 이하: 모바일/태블릿 모드
  isMobileOrTablet.value = width <= 1024;

  // Desktop: 항상 열려있음
  if (width > 1024) {
    isSidebarOpen.value = true;
  }
};

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
  console.log("🎨 MainLayout 그래디언트 초기화");

  // 현재는 기본값 사용
  // setGradient('#FFE6F0', '#FFFFFF', 135)

  // 또는 resetGradient()를 호출하면 됨
  // resetGradient()

  // 추후 서버에서 받은 값으로 동적 적용:
  // const config = await fetchConfigFromServer()
  // setGradient(config.gradientStart, config.gradientEnd, config.angle)
};

/* ==================== 라이프사이클 ==================== */

/**
 * onMounted: 컴포넌트 마운트 후 실행
 *
 * Vue2 vs Vue3:
 * - Vue2: mounted() { ... }
 * - Vue3: onMounted(() => { ... })
 *
 * 역할:
 * 1. 그래디언트 초기화
 * 2. 초기 화면 크기 감지
 * 3. 창 크기 변경 이벤트 등록
 */
onMounted(() => {
  console.log("✅ MainLayout 마운트됨");

  // ✅ 그래디언트 초기화 추가
  initializeGradient();

  // 초기 화면 크기 감지
  handleWindowResize();

  // 창 크기 변경 이벤트 등록
  window.addEventListener("resize", handleWindowResize);

  setGradient("#FFE6F0", "#FFFFFF", 360);

  // 파란 - #6A8DFF
  // 노란 - #FFF799
  // 검은 - #555555
  // 빨강 - #FFE6F0
});

/**
 * onUnmounted: 컴포넌트 언마운트 시 실행
 *
 * Vue2 vs Vue3:
 * - Vue2: beforeDestroy() { ... }
 * - Vue3: onUnmounted(() => { ... })
 *
 * 역할:
 * - 이벤트 리스너 제거 (메모리 누수 방지)
 */
onUnmounted(() => {
  console.log("❌ MainLayout 언마운트됨");

  // 이벤트 리스너 제거
  window.removeEventListener("resize", handleWindowResize);
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;

/* ==================== MainLayout 전체 구조 ==================== */
.main-layout {
  /* 
    Grid 레이아웃
    
    Desktop (1024px 초과):
    - grid-template-columns: 250px 1fr
    - SideBar: 항상 표시
    
    Tablet/Mobile (1024px 이하):
    - grid-template-columns: 1fr
    - SideBar: 절대위치 고정 (토글)
  */
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 1fr;

  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

/* ==================== SideBar 토글 버튼 ==================== */
.layout__sidebar-toggle {
  /* 
    ✅ SideBar 토글 버튼
    
    위치: 모든 화면에서 항상 표시
    - Desktop: SideBar 왼쪽 상단
    - Mobile: 화면 왼쪽 상단
    
    디자인: 원형 버튼 (더 이쁜 스타일)
  */
  position: fixed;
  left: 16px;
  top: 16px;
  z-index: 1000;

  /* 원형 버튼 */
  width: 44px;
  height: 44px;
  border-radius: 50%;

  /* 배경: 반투명 흰색 */
  background-color: var.$white;
  border: 2px solid var.$gray-200;

  /* 텍스트 스타일 */
  color: var.$text-primary;
  font-size: 20px;
  font-weight: 600;

  /* 버튼 스타일 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 전환 효과 */
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  /* 호버 효과 */
  &:hover {
    background-color: var.$primary-color;
    color: var.$white;
    border-color: var.$primary-color;
    box-shadow: 0 4px 12px rgba(208, 2, 27, 0.25);
    transform: scale(1.1);
  }

  /* 클릭 효과 */
  &:active {
    transform: scale(0.95);
  }

  /* Desktop: SideBar 내부에 위치하지 않도록 조정 */
  @media (min-width: 1025px) {
    left: 266px; /* SideBar(250px) + 16px padding */
  }

  /* Tablet/Mobile: 화면 왼쪽 상단 */
  @media (max-width: 1024px) {
    left: 16px;
  }
}

.layout__toggle-icon {
  /* 토글 아이콘 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* ==================== 메인 콘텐츠 영역 ==================== */
.content-area {
  /* 
    Grid의 두 번째 셀 (또는 첫 번째 셀 모바일)
  */
  grid-column: 2 / 3;
  grid-row: 1 / 2;

  /* 스크롤 가능 */
  overflow-y: auto;
  overflow-x: hidden;

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
  /* background-color: var.$bg-primary; */ /* ❌ 이전 고정 배경색 (주석 처리) */

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

/* ==================== 모바일/태블릿 오버레이 ==================== */
.layout__overlay {
  /* 
    SideBar 열렸을 때의 배경 오버레이
    
    모바일/태블릿에서만 표시
  */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease-out;
}

/* ==================== 반응형 디자인 ==================== */

/* Tablet/Mobile (1024px 이하) */
@media (max-width: 1024px) {
  .main-layout {
    /* 1열로 변경 */
    grid-template-columns: 1fr;
  }

  .content-area {
    /* 첫 번째 열 */
    grid-column: 1 / 2;
  }
}

/* Mobile (768px 이하) */
@media (max-width: 768px) {
  .layout__sidebar-toggle {
    /* 모바일: 더 작은 크기 */
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>
