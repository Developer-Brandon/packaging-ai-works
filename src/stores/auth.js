/**
 * src/stores/auth.js
 *
 * 인증 상태 관리 스토어 (Pinia)
 *
 * 관리 항목:
 * - 사용자 정보 (이름, 이메일, 직급 등)
 * - 로그인 상태
 * - 에러 처리
 * - LocalStorage 동기화
 *
 * Vue2 vs Vue3:
 * - Vue2: Vuex (mutations 필수, boilerplate 많음)
 * - Vue3: Pinia (더 간결, mutations 선택사항)
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { saveData, getData, removeData } from "@/utils/localStorage";
import { STORAGE_KEYS } from "@/utils/constants";

/**
 * useAuthStore: 인증 스토어
 *
 * 사용 예시:
 * const authStore = useAuthStore()
 * authStore.login(credentials)
 * authStore.user
 * authStore.isLoggedIn
 */
export const useAuthStore = defineStore("auth", () => {
  /* ==================== State (상태) ==================== */

  /**
   * 현재 로그인한 사용자 정보
   *
   * 구조:
   * {
   *   id: string,
   *   name: string,
   *   email: string,
   *   role: string ('manager', 'employee' 등),
   * }
   */
  const user = ref(null);

  /**
   * 로그인 여부
   */
  const isLoggedIn = ref(false);

  /**
   * 로그인 처리 중 여부 (로딩)
   */
  const isLoading = ref(false);

  /**
   * 에러 메시지
   */
  const error = ref(null);

  /**
   * "아이디 저장" 체크 여부
   */
  const rememberEmail = ref(false);

  /**
   * 저장된 이메일 (LocalStorage에서 복원)
   */
  const savedEmail = ref("");

  /* ==================== Getters (파생 데이터) ==================== */

  /**
   * 사용자 이름 (로그인 후 그리팅)
   * "안녕하세요, 이도겸님!"
   */
  const userName = computed(() => user.value?.name || "");

  /**
   * 사용자 이메일
   */
  const userEmail = computed(() => user.value?.email || "");

  /**
   * 사용자 직급
   */
  const userRole = computed(() => user.value?.role || "");

  /* ==================== Actions (메서드) ==================== */

  /**
   * 로그인 처리
   *
   * 실제 플로우:
   * 1. 폼에서 이메일/비밀번호 입력
   * 2. 서버(SSO)로 전송
   * 3. SSO가 인증 후 토큰 반환
   * 4. 토큰을 쿠키(httpOnly)에 저장
   * 5. 사용자 정보를 이 스토어에 저장
   *
   * 현재는 시뮬레이션이지만, 인터페이스는 동일합니다.
   *
   * @param {Object} credentials - { email, password, rememberEmail }
   * @returns {Promise<boolean>} - 성공 여부
   */
  async function login(credentials) {
    isLoading.value = true;
    error.value = null;

    try {
      // 입력값 검증
      if (!credentials.email || !credentials.password) {
        throw new Error("이메일과 비밀번호를 입력해주세요.");
      }

      // 서버에 요청 (현재는 시뮬레이션: 1초 지연)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      /**
       * 실제 API 호출 코드:
       * const response = await fetch('/api/auth/login', {
       *   method: 'POST',
       *   headers: { 'Content-Type': 'application/json' },
       *   credentials: 'include', // 쿠키 포함
       *   body: JSON.stringify({
       *     email: credentials.email,
       *     password: credentials.password
       *   })
       * })
       *
       * const data = await response.json()
       *
       * if (!response.ok) {
       *   throw new Error(data.message || '로그인 실패')
       * }
       *
       * // 사용자 정보는 서버에서 받음
       * user.value = data.user
       */

      function engToKor(word) {
        const rules = [
          { en: "aionu", ko: "아이온유" },
          { en: "we", ko: "위" },
          { en: "wo", ko: "워" },
          { en: "wa", ko: "와" },
          { en: "wi", ko: "위" },
          { en: "web", ko: "웹" },
          { en: "be", ko: "베" },
          { en: "bo", ko: "보" },
          { en: "a", ko: "아" },
          { en: "e", ko: "에" },
          { en: "i", ko: "이" },
          { en: "o", ko: "오" },
          { en: "on", ko: "온" },
          { en: "u", ko: "우" },
        ];

        let result = word;
        for (const r of rules) {
          result = result.replace(new RegExp(r.en, "gi"), r.ko);
        }
        return result;
      }

      // 시뮬레이션용 더미 사용자 데이터
      const mockUser = {
        id: Date.now().toString(), // 고유 ID
        name: engToKor(credentials.email.split("@")[0]), // 이메일 앞부분을 이름으로
        email: credentials.email,
        role: "admin",
      };

      // 실제 로그인 처리
      user.value = mockUser;
      isLoggedIn.value = true;

      // "아이디 저장" 옵션 처리
      if (credentials.rememberEmail) {
        saveData(STORAGE_KEYS.SAVED_EMAIL, credentials.email);
        rememberEmail.value = true;
      } else {
        removeData(STORAGE_KEYS.SAVED_EMAIL);
        rememberEmail.value = false;
      }

      // 사용자 세션 저장 (페이지 새로고침 시 복원용)
      saveData(STORAGE_KEYS.USER_SESSION, mockUser);

      console.log("✅ 로그인 성공:", mockUser.name);
      return true;
    } catch (err) {
      // 에러 처리
      error.value = err.message || "로그인 실패";
      console.error("❌ 로그인 에러:", error.value);
      return false;
    } finally {
      // 로딩 종료
      isLoading.value = false;
    }
  }

  /**
   * 로그아웃
   */
  function logout() {
    user.value = null;
    isLoggedIn.value = false;
    error.value = null;
    rememberEmail.value = false;

    // 세션 정보 삭제
    removeData(STORAGE_KEYS.USER_SESSION);

    console.log("✅ 로그아웃 완료");
  }

  /**
   * 저장된 이메일 로드
   *
   * "아이디 저장" 옵션으로 저장된 이메일을 로드합니다.
   * 페이지 초기 로드 시 호출됩니다.
   *
   * 사용 예시 (로그인 페이지):
   * onMounted(() => {
   *   authStore.loadSavedEmail()
   *   if (authStore.savedEmail) {
   *     email.value = authStore.savedEmail
   *   }
   * })
   */
  function loadSavedEmail() {
    const email = getData(STORAGE_KEYS.SAVED_EMAIL, "");
    if (email) {
      savedEmail.value = email;
      rememberEmail.value = true;
      console.log("✅ 저장된 이메일 로드:", email);
    }
  }

  /**
   * 저장된 세션 복원
   *
   * 페이지를 새로고침했을 때 로그인 상태를 유지합니다.
   * main.js 또는 App.vue에서 초기화 시 호출합니다.
   *
   * 사용 예시 (App.vue):
   * onMounted(() => {
   *   authStore.restoreSession()
   * })
   */
  function restoreSession() {
    const savedUser = getData(STORAGE_KEYS.USER_SESSION, null);
    if (savedUser) {
      user.value = savedUser;
      isLoggedIn.value = true;
      console.log("✅ 세션 복원:", savedUser.name);
    }
  }

  /**
   * 에러 메시지 초기화
   *
   * 폼을 다시 시도할 때 이전 에러를 지웁니다.
   */
  function clearError() {
    error.value = null;
  }

  /**
   * 로그인 폼 초기화
   *
   * 로그아웃 후 폼 상태를 리셋합니다.
   */
  function resetForm() {
    error.value = null;
  }

  /* ==================== 반환 (Public API) ==================== */

  /**
   * 스토어에서 외부로 노출할 것들
   *
   * 컴포넌트에서 사용 예시:
   * const authStore = useAuthStore()
   *
   * // State 접근
   * authStore.user
   * authStore.isLoggedIn
   *
   * // Computed 접근
   * authStore.userName
   *
   * // Actions 호출
   * await authStore.login({ ... })
   */
  return {
    // ==================== State ====================
    user,
    isLoggedIn,
    isLoading,
    error,
    rememberEmail,
    savedEmail,

    // ==================== Getters ====================
    userName,
    userEmail,
    userRole,

    // ==================== Actions ====================
    login,
    logout,
    loadSavedEmail,
    restoreSession,
    clearError,
    resetForm,
  };
});
