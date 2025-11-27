/**
 * src/main.js
 *
 * Vue3 애플리케이션의 진입점입니다.
 * Vue2에서는 'new Vue()' 형태였지만, Vue3에서는 'createApp()' 함수를 사용합니다.
 *
 * 중요한 변화점 (Vue2 -> Vue3):
 * 1. createApp() 함수 사용
 * 2. Vuex -> Pinia로 변경
 * 3. prototype으로 전역 속성 추가 X, provide/inject 또는 app.config.globalProperties 사용
 * 4. 라이프사이클 훅 이름 변경 (mounted, onMounted 등)
 */

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

/**
 * 전역 스타일 import
 *
 * SCSS @use 문법 사용:
 * - globals.scss: 기본 리셋, 전역 스타일
 * - variables.scss: 모든 변수들 (@forward로 재내보냄)
 * - animations.scss: 애니메이션 정의
 * - mixins.scss: SCSS 믹스인 함수들
 *
 * 각 파일은 독립적으로 import되며, @use는 네임스페이스 기반이므로
 * 중복 import되어도 성능에 영향 없습니다.
 */
import "@/assets/styles/variables.scss";
import "@/assets/styles/global/_global.scss";

/* ==================== Vue 애플리케이션 초기화 ==================== */

/**
 * createApp(App)
 *
 * Vue3에서는 createApp() 함수로 애플리케이션 인스턴스를 생성합니다.
 * App.vue를 루트 컴포넌트로 설정합니다.
 */
const app = createApp(App);

/* ==================== Pinia 스토어 설정 ==================== */

/**
 * Pinia 스토어 설정
 *
 * Pinia는 Vue3의 공식 상태관리 라이브러리입니다.
 * Vuex보다 훨씬 간단하고, TypeScript 지원이 우수합니다.
 *
 * 사용 예시:
 * import { useChatStore } from '@/stores/chat'
 * const chatStore = useChatStore()
 *
 * 특징:
 * - 각 store는 자동으로 devtools와 통합됨
 * - Hot Module Replacement (HMR) 지원
 * - 더 간단한 API (mutations 불필요)
 * - 모듈화되고 트리쉐이킹 가능
 */
app.use(createPinia());

/* ==================== 전역 프로퍼티 설정 ==================== */

/**
 * 전역 프로퍼티 설정
 *
 * 모든 컴포넌트에서 this.$appName으로 접근 가능합니다.
 *
 * 사용 예시 (Options API):
 * {{ $appName }}  // 템플릿에서 직접 사용
 *
 * 사용 예시 (Composition API):
 * import { getCurrentInstance } from 'vue'
 * const instance = getCurrentInstance()
 * const appName = instance?.appContext.config.globalProperties.$appName
 *
 * ⚠️ 주의: 민감한 정보(API 키 등)는 여기에 저장하면 안 됩니다!
 */
app.config.globalProperties.$appName = "OCI AI Works";

/**
 * 추가 전역 프로퍼티 예시 (필요시 추가)
 */
// app.config.globalProperties.$apiBaseUrl = "https://api.example.com";
// app.config.globalProperties.$version = "1.0.0";

/* ==================== 애플리케이션 마운트 ==================== */

/**
 * #app 엘리먼트에 Vue 애플리케이션을 마운트합니다.
 *
 * public/index.html의 <div id="app"></div>에 마운트됩니다.
 */
app.mount("#app");

/**
 * 마운트 후 확인 (개발 환경)
 *
 * Vite의 import.meta.env.DEV를 사용하여 개발 환경에서만 로그 출력
 */
if (import.meta.env.DEV) {
  console.log("✅ Vue3 애플리케이션 초기화 완료");
  console.log("🎨 스타일 시스템: SCSS (@forward/@use)");
  console.log("🔧 상태관리: Pinia");
  console.log("📦 개발 서버: http://localhost:5173");
}
