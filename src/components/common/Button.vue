<!--
  Button.vue
  
  재사용 가능한 버튼 컴포넌트
  로그인, 취소, 제출 등 다양한 버튼을 통일된 스타일로 제공합니다.
  
  Props:
  - variant: 'primary' (파랑), 'secondary' (흰색), 'danger' (빨강) 등
  - size: 'sm' (작음), 'md' (중간), 'lg' (큼)
  - disabled: 비활성화
  - loading: 로딩 중 (로딩 인디케이터 표시)
  - fullWidth: 부모 너비에 맞춤
  - type: 'button', 'submit', 'reset' 등 (form 요소용)
  
  Slots:
  - default: 버튼 텍스트 또는 내용
  
  Events:
  - click: 버튼 클릭 이벤트
  
  사용 예시:
  <Button variant="primary" size="lg" @click="handleLogin">
    로그인
  </Button>
-->

<template>
  <!-- 
    버튼 요소
    
    :class 바인딩으로 variant, size 등에 따라 다른 클래스 적용
  -->
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full-width': fullWidth },
      { 'btn-loading': loading },
    ]"
    @click="$emit('click')"
  >
    <!-- 
      로딩 중일 때: 로딩 스피너 표시
    -->
    <span v-if="loading" class="btn-spinner"></span>

    <!-- 
      버튼 텍스트/내용
      
      로딩 중이면 loading 슬롯, 아니면 default 슬롯 사용
    -->
    <span v-if="loading" class="btn-loading-text">
      <slot name="loading">로그인 중...</slot>
    </span>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
/**
 * Vue3 <script setup>로 작성된 버튼 컴포넌트
 *
 * 특징:
 * 1. Props 정의: defineProps
 * 2. Emits 정의: defineEmits
 * 3. 변수/함수 자동 노출 (반드시 return 불필요)
 * 4. 코드 간결하고 가독성 좋음
 */

/* ==================== Props ==================== */

const props = defineProps({
  /**
   * 버튼 스타일 변형
   *
   * 'primary': 주요 버튼 (보라색) - 로그인, 제출 등
   * 'secondary': 보조 버튼 (흰색) - 취소, 이전 등
   * 'danger': 위험 버튼 (빨강) - 삭제, 거절 등
   * 'link': 링크 스타일 버튼 (텍스트만)
   */
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "danger", "link"].includes(value),
  },

  /**
   * 버튼 크기
   *
   * 'sm': 작음 (32px)
   * 'md': 중간 (40px) - 기본값
   * 'lg': 큼 (50px) - 로그인 등 주요 버튼
   */
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },

  /**
   * 비활성화 여부
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * 로딩 상태
   * true이면 스피너 표시 및 클릭 불가
   */
  loading: {
    type: Boolean,
    default: false,
  },

  /**
   * 부모 너비에 맞출지 여부
   *
   * true: width: 100%
   * false: width: 자동 (content 기반)
   */
  fullWidth: {
    type: Boolean,
    default: false,
  },

  /**
   * HTML button type 속성
   *
   * 'button': 일반 버튼
   * 'submit': form 제출
   * 'reset': form 초기화
   */
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
});

/* ==================== Emits ==================== */

/**
 * 버튼 클릭 이벤트
 *
 * 사용:
 * <Button @click="handleLogin" />
 */
defineEmits(["click"]);
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables" as *;
@use "@/assets/styles/whole_animations" as *;

/* ==================== 기본 버튼 스타일 ==================== */

.btn {
  /* 
    기본 속성
    
    display: inline-flex는 텍스트와 아이콘을 정렬하기 좋음
  */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;

  /* 
    테두리 및 라운드
  */
  border: none;
  border-radius: $border-radius-base;

  /* 
    폰트 설정
  */
  font-family: $font-primary;
  font-weight: $font-weight-semibold;
  font-size: $font-size-base;

  /* 
    일반적인 전환 효과
  */
  transition: all $transition-base;

  /* 
    커서
  */
  cursor: pointer;

  /* 
    사용자 선택 방지 (드래그 방지)
  */
  user-select: none;

  /* 
    포커스 스타일 (키보드 접근성)
  */
  &:focus {
    outline: 2px solid $primary-color;
    outline-offset: 2px;
  }

  /* 
    비활성화 상태
  */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    /* 
      비활성화 시 호버/액티브 효과 제거
    */
    &:hover,
    &:active {
      transform: none;
      box-shadow: none;
    }
  }
}

/* ==================== 크기별 스타일 ==================== */

.btn-sm {
  /* 작은 버튼 (32px) */
  height: 32px;
  padding: 0 $spacing-3;
  font-size: $font-size-sm;
}

.btn-md {
  /* 중간 버튼 (40px) - 기본값 */
  height: 40px;
  padding: 0 $spacing-4;
}

.btn-lg {
  /* 큰 버튼 (50px) - 주요 액션 */
  height: 50px;
  padding: 0 $spacing-6;
  font-size: $font-size-lg;
}

/* ==================== 전체 너비 ==================== */

.btn-full-width {
  width: 100%;
}

/* ==================== 변형별 스타일 ==================== */

/* Primary 버튼 (주요 - 보라색) */
.btn-primary {
  background: linear-gradient(
    135deg,
    $primary-color 0%,
    $primary-dark-color 100%
  );
  color: $white;
  box-shadow: $shadow-md;

  &:hover:not(:disabled) {
    /* 
      호버 시: 그림자 증가, 약간 확대
    */
    box-shadow: $shadow-lg;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    /* 
      클릭 시: 아래로 눌린 효과
    */
    transform: translateY(0);
  }
}

/* Secondary 버튼 (보조 - 흰색 테두리) */
.btn-secondary {
  background-color: $white;
  color: $primary-color;
  border: 2px solid $primary-color;

  &:hover:not(:disabled) {
    background-color: rgba($primary-color, 0.05);
  }

  &:active:not(:disabled) {
    background-color: rgba($primary-color, 0.1);
  }
}

/* Danger 버튼 (위험 - 빨강) */
.btn-danger {
  background-color: $danger-color;
  color: $white;

  &:hover:not(:disabled) {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
    background-color: $primary-pure-color;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

/* Link 버튼 (링크 스타일 - 텍스트만) */
.btn-link {
  background-color: transparent;
  color: $primary-color;
  padding: 0;

  &:hover:not(:disabled) {
    text-decoration: underline;
    color: $primary-dark-color;
  }
}

/* ==================== 로딩 상태 ==================== */

.btn-loading {
  /* 
    로딩 중: 포인터 이벤트 차단 (추가 보안)
  */
  pointer-events: none;
}

.btn-spinner {
  /* 
    회전 아이콘 (로딩 인디케이터)
    
    animation: spin은 animations.scss에 정의됨
  */
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba($white, 0.3);
  border-top-color: $white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  /* 
    Dark 변형: 다른 색상 사용
  */
  .btn-secondary & {
    border-color: rgba($primary-color, 0.3);
    border-top-color: $primary-color;
  }
}

.btn-loading-text {
  /* 
    로딩 중 텍스트 (선택사항)
  */
  display: flex;
  align-items: center;
  gap: $spacing-1;
}
</style>
