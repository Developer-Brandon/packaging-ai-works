<!--
  로그인 페이지 메인 컴포넌트
-->
<template>
  <!-- 
    로그인 페이지 전체 컨테이너
  -->
  <div class="login-page">
    <div class="login-page__inner">
      <div class="login-form-section">
        <div class="login-container">
          <div class="login-header">
            <h1 class="login-title">로그인</h1>
            <p class="login-subtitle">OCI AI Works 에 오신것을 환영합니다</p>
          </div>
          <form class="login-form" @submit.prevent="handleLogin">
            <!-- ========== 이메일 입력 필드 ========== -->
            <div class="form-group email-group" @keydown.enter="handleLogin">
              <InputField
                v-model="email"
                type="email"
                placeholder="ID(email)"
                :error="formErrors.email"
                :disabled="isLoading"
              >
                <CommonIcon :src="emailIconPath" />
              </InputField>
            </div>
            <!-- ========== 비밀번호 입력 필드 ========== -->
            <div class="form-group password-group" @keydown.enter="handleLogin">
              <InputField
                v-model="password"
                type="password"
                placeholder="Password"
                :error="formErrors.password"
                :disabled="isLoading"
              >
                <CommonIcon :src="passwordIconPath" />
              </InputField>
            </div>
            <!-- ========== 에러 메시지 (전체 폼) ========== -->
            <div v-if="error" class="form-error">
              <span class="error-text">{{ error }}</span>
            </div>
            <!-- ========== 체크박스: 아이디 저장 ========== -->
            <Checkbox
              v-model="rememberEmail"
              label="아이디 저장"
              class="remember-email-checkbox"
            />
          </form>
          <!-- ========== 로그인 버튼 ========== -->
          <Button
            class="login-button"
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            :loading="isLoading"
            @click="handleLogin"
          >
            로그인
          </Button>
          <div class="login-footer">
            <button
              type="button"
              class="link-button"
              @click="handleForgotPassword"
            >
              비밀번호 찾기
            </button>
            <span class="divider">|</span>
            <button type="button" class="link-button" @click="handleSignup">
              계정 생성
            </button>
          </div>
        </div>
      </div>
      <!-- 배경 그라디언트 + 애니메이션 요소들 -->
      <div class="login-graphic-section">
        <!-- 배경 색상 컨테이너 -->
        <div class="graphic-background"></div>
      </div>
    </div>
  </div>
  <PrimaryPopup
    v-if="showPopup"
    :title="popupConfig.title"
    :message="popupConfig.message"
    :confirmText="popupConfig.confirmText"
    @confirm="closePopup"
    @close="closePopup"
  />
</template>

<script setup>
/**
 * Vue3 Composition API with <script setup>
 *
 * Vue2 (Options API):
 * ```
 * export default {
 *   data() { return { email: '', password: '', ... } },
 *   computed: { isFormValid() { ... } },
 *   methods: { handleLogin() { ... } },
 *   mounted() { ... }
 * }
 * ```
 *
 * Vue3 (Composition API + <script setup>):
 * - 변수는 ref()로 감싸기
 * - 함수는 일반 함수로 정의
 * - 자동으로 템플릿에 노출 (return 불필요)
 * - 코드 순서를 자유롭게 배열 가능
 * - 더 나은 타입 추론 (TypeScript 친화적)
 */

import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import InputField from "@/components/common/InputField.vue";
import Button from "@/components/common/Button.vue";
import Checkbox from "@/components/common/Checkbox.vue";
import CommonIcon from "@/components/icon/CommonIcon.vue";
import PrimaryPopup from "../components/modals/PrimaryPopup.vue";

const emailIconPath = new URL(
  "@/assets/images/login/icon/email.png",
  import.meta.url
).href;
const passwordIconPath = new URL(
  "@/assets/images/login/icon/key.png",
  import.meta.url
).href;

/* ==================== 인증 스토어 ==================== */

/**
 * Pinia 스토어 가져오기
 *
 * useAuthStore()를 호출하여 인증 스토어 사용
 * 이제 authStore.login(), authStore.user 등 사용 가능
 */
const authStore = useAuthStore();

/* ==================== Refs (리액티브 상태) ==================== */

/**
 * ref()로 감싼 변수들
 *
 * Vue2:
 * data() {
 *   return { email: '', password: '' }
 * }
 *
 * Vue3:
 * const email = ref('')
 *
 * 템플릿에서: {{ email }} (자동 unwrap)
 * 스크립트에서: email.value
 */

// 입력 필드 관리 변수
const email = ref("");
const password = ref("");

// UI 상태 관리 변수
const isLoading = ref(false);
const rememberEmail = ref(false);

// 에러 처리 관리 변수
const error = ref(null);
const formErrors = ref({ email: null, password: null });

// 팝업 상태 관리 변수
const showPopup = ref(false);
const popupConfig = ref({
  title: "",
  message: "",
  confirmText: "확인",
});

/* ==================== Computed (파생 데이터) ==================== */

/**
 * computed()로 정의된 파생 데이터
 *
 * 의존하는 값(email, password)이 변경되면 자동으로 재계산됨
 *
 * Vue2:
 * computed: { isFormValid() { ... } }
 *
 * Vue3:
 * const isFormValid = computed(() => { ... })
 */

/**
 * 폼 유효성 검사
 *
 * 이메일과 비밀번호가 모두 입력되었으면 true
 */
const isFormValid = computed(() => {
  return email.value.trim() !== "" && password.value.trim() !== "";
});

/* ==================== 메서드 (함수) ==================== */

// 팝업 표시 함수
function showPopupMessage(title, message, confirmText = "확인") {
  popupConfig.value = { title, message, confirmText };
  showPopup.value = true;
}

// 팝업 닫기 함수
function closePopup() {
  showPopup.value = false;
}

// 폼 검증 - @returns {boolean} - 유효한지 여부
function validateForm() {
  // 에러 초기화
  formErrors.value = { email: null, password: null };
  error.value = null;

  // 이메일 검증
  if (!email.value.trim()) {
    formErrors.value.email = "이메일을 입력해주세요.";
    return false;
  }

  // 이메일 형식 검증 (간단한 정규식)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    formErrors.value.email = "올바른 이메일 형식이 아닙니다.";
    return false;
  }

  // 비밀번호 검증
  if (!password.value.trim()) {
    formErrors.value.password = "비밀번호를 입력해주세요.";
    return false;
  }

  if (password.value.length < 6) {
    formErrors.value.password = "비밀번호는 6자 이상이어야 합니다.";
    return false;
  }

  return true;
}

/**
 * 로그인 처리
 *
 * async/await를 사용하여 비동기 처리
 * 로딩 중이면 중복 제출 방지
 */
async function handleLogin() {
  // 이미 로딩 중이면 중복 제출 방지
  if (isLoading.value) return;

  // 폼 검증
  if (!validateForm()) {
    return;
  }

  // 로딩 시작
  isLoading.value = true;
  error.value = null;

  try {
    /**
     * 인증 스토어의 login() 메서드 호출
     *
     * 성공하면 true, 실패하면 false 반환
     */
    const success = await authStore.login({
      email: email.value.trim(),
      password: password.value,
      rememberEmail: rememberEmail.value,
    });

    if (success) {
      console.log("✅ 로그인 성공");

      /**
       * 추후 라우터 설정 후 main page로 이동: router.push('/main')
       * 현재는 그냥 console로만 찍고 바로 routing하도록
       */
    } else {
      // 스토어에서 설정한 에러 메시지 표시
      error.value = authStore.error || "로그인 실패";
    }
  } catch (err) {
    error.value = err.message || "로그인 중 오류가 발생했습니다.";
    console.error("로그인 에러:", err);
  } finally {
    // 로딩 종료
    isLoading.value = false;
  }
}

/**
 * 비밀번호 찾기 버튼 클릭
 */
function handleForgotPassword() {
  showPopupMessage(
    "비밀번호 초기화는 계정 관리자에게 문의해주세요.",
    "※ 비밀번호 초기화는 17:00~18:00에 일괄 진행됩니다.\n - 계정 관리자 (abc@kt.com) "
  );
}

/**
 * 계정 생성 버튼 클릭
 */
function handleSignup() {
  showPopupMessage(
    "신규 계정 생성은 계정 관리자에게 문의해주세요.",
    "※신규계정 생성은 17:00~18:00에 일괄 진행됩니다.\n - 계정 관리자 (abc@kt.com)"
  );
}

/* ==================== 라이프사이클 훅 ==================== */

onMounted(() => {
  // 저장된 이메일 로드
  authStore.loadSavedEmail();

  // 저장된 이메일이 있으면 입력 필드에 채우기
  if (authStore.savedEmail) {
    email.value = authStore.savedEmail;
    rememberEmail.value = true;
  }

  console.log("✅ 로그인 페이지 로드 완료");
});
</script>

<style scoped lang="scss">
/**
 * scoped: 이 스타일은 현재 컴포넌트에만 적용
 * lang="scss": SCSS 문법 사용
 */

@use "@/assets/styles/whole_variables" as *;
@use "@/assets/styles/whole_animations" as *;

/* ==================== 전체 페이지 & 전체 페이지 내부 ==================== */

.login-page {
  /* 
    전체 화면을 차지하는 레이아웃
    
    flexbox로 중앙 정렬을 위한 설정:
    - display: flex: flexbox 컨테이너 활성화
    - justify-content: center: 수평 중앙 정렬
    - align-items: center: 수직 중앙 정렬
    - gap: 위젯 간 간격 설정
  */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: $bg-secondary;
  /* 
    반응형: 작은 화면에서는 세로 배치
  */
  @media (max-width: $breakpoint-phone) {
    flex-direction: column;
  }

  &__inner {
    /* 
      내부 컨테이너: 
      - 고정된 너비와 높이로 설정
      - 부모의 justify-content/align-items로 인해 자동으로 중앙 배치됨
      - 내부에 왼쪽/오른쪽 섹션을 배치할 때는 여기서 flex를 사용
    */
    display: flex;
    width: 970px;
    height: 600px;
    background-color: $bg-primary;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba($black, 0.1);
    /* 
      반응형: 작은 화면에서 __inner의 크기 조정
    */
    @media (max-width: $breakpoint-phone) {
      width: 100%;
      height: auto;
      flex-direction: column;
      padding: $spacing-2 !important;
    }
  }
}

/* ==================== 왼쪽: 로그인 폼 섹션 ==================== */

.login-form-section {
  /* 
    왼쪽 섹션: 50% 너비
    중앙 정렬로 폼이 화면 중앙에 보임
  */
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-10;
  max-width: 468px;

  /* 
    반응형: 작은 화면에서는 전체 너비
  */
  @media (max-width: $breakpoint-phone) {
    width: 100%;
    padding: $spacing-6;
  }
}

.login-container {
  /* 
    로그인 폼을 감싸는 컨테이너
    
    최대 너비 설정으로 폼이 너무 넓어지지 않음
  */
  width: 100%;
  /* 
    위에서 아래로 내려오는 애니메이션
  */
  animation: slideUp 0.5s ease-out;
  /* 
    반응형: 작은 화면에서는 전체 너비
  */
}

/* ==================== 헤더 (제목, 설명) ==================== */

.login-header {
  margin-bottom: $spacing-8;
  text-align: center;
}

.login-title {
  /* 
    "로그인" 제목
    크기, 색상, 마진 설정
  */
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin-bottom: $spacing-3;

  /* 
    페이드인 애니메이션
  */
  animation: fadeInDown 0.6s ease-out 0.2s both;
}

.login-subtitle {
  /* 
    설명 텍스트
    흐린 색상으로 보조 정보임을 표시
  */
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 1.6;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

/* ==================== 폼 ==================== */

.login-form {
  /* 
    입력 필드들을 수직으로 배치
  */
  display: flex;
  flex-direction: column;
}

.form-group {
  /* 
    입력 필드 그룹
    에러 메시지 공간 예약 (아래)
  */
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: 31px;

  /* 
    지연 애니메이션: 차례대로 나타남
  */
  animation: slideUp 0.5s ease-out 0.4s both;
}

/* ==================== 버튼 ==================== */
/* 
  Button 컴포넌트는 별도 스타일 파일에서 관리
  여기서는 버튼의 마진만 설정
*/

/* ==================== 에러 메시지 (전체 폼) ==================== */
.form-error {
  /* 
    전체 폼의 에러 메시지
    
    개별 입력 필드 에러와는 다름
    (예: 서버에서 반환한 에러)
  */
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-3;
  background-color: rgba($danger-color, 0.1);
  border-left: 4px solid $danger-color;
  border-radius: $border-radius-custom;
  color: $danger-color;
  font-size: $font-size-sm;

  /* 
    슬라이드인 애니메이션
  */
  animation: slideDown 0.3s ease-out;
}

.error-text {
  /* 에러 텍스트 */
}

/* ==================== 체크박스: 아이디 저장 ==================== */

.remember-email-checkbox {
  /* 
    체크박스 마진 조정
  */
  margin-top: $spacing-xs;
  margin-bottom: $spacing-10;
  margin-left: $spacing-1;
  animation: fadeIn 0.5s ease-out 0.5s both;
}

/* ==================== 하단 링크 ==================== */

.login-footer {
  /* 
    "비밀번호 찾기 | 계정 생성"
    중앙 정렬, 링크 스타일
  */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  text-align: center;
  font-size: $font-size-sm;
  color: $text-secondary;

  animation: fadeIn 0.5s ease-out 0.6s both;
}

.link-button {
  /* 
    링크 스타일 버튼
    배경 없이 텍스트만 표시
  */
  background: none;
  border: none;
  color: $gray-500;
  cursor: pointer;
  font-size: $font-size-sm;
  text-decoration: none;
  transition: all $transition-base;
  padding: 0;

  /* 
    호버 효과: 언더라인 + 색상 변경
  */
  &:hover {
    text-decoration: underline;
  }

  /* 
    포커스 효과 (접근성)
  */
  &:focus {
    outline: 2px solid $primary-color;
    outline-offset: 2px;
    border-radius: 2px;
  }
}

.login-button {
  border-radius: 25px;
  margin-bottom: 20px;
}

.divider {
  /* 
    링크 구분선 "|"
  */
  color: $gray-300;
}

/* ==================== 오른쪽: 배경 그래픽 섹션 ==================== */

.login-graphic-section {
  /* 
    오른쪽 섹션: 50% 너비
    
    배경 이미지/그래픽을 표시
  */
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 25px;

  /* 
    반응형: 작은 화면에서는 숨김
  */
  @media (max-width: $breakpoint-phone) {
    display: none;
  }
}

.graphic-background {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/login/banner/ai_works_banner.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 25px;
  animation: fadeIn 0.5s ease-out 0.6s both;
}
</style>
