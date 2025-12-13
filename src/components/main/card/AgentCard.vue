<!-- src/components/main/card/AgentCard.vue -->
<!-- 
  ========================================
  AgentCard 컴포넌트
  ========================================
  
  역할: 
    - 3가지 AI Agent 카드를 하나의 컴포넌트로 통합
    - configStore에서 cardIndex를 기반으로 데이터 동적 로드
    - type prop으로 'normal' 또는 'faq' 레이아웃 렌더링
  
  Props:
    - cardIndex: 카드 배열 인덱스 (0, 1, 2)
    - type: 카드 타입 ('normal' | 'faq')
  
  Emits:
    - agent-select: 카드 클릭 시 발생
  
  Vue2 vs Vue3 차이점:
    - Vue2: data(), computed 형태로 상태 관리
    - Vue3: ref(), computed() 함수 형태로 상태 관리 (script setup)
    - Vue2: this.cardInfo로 접근
    - Vue3: cardInfo.value 또는 직접 접근 (computed에서는 자동 언래핑)
-->

<template>
  <!-- 메인 카드 컨테이너 -->
  <div
    class="agent-card"
    :class="{ 'agent-card--faq': type === 'faq' }"
    @click="selectAgent"
    @keydown.enter="selectAgent"
    role="button"
    tabindex="0"
  >
    <!-- ==================== NORMAL 타입 (아이콘 + 제목 + 설명) ==================== -->
    <template v-if="type === 'normal'">
      <!-- 배경 효과 (옵션) -->
      <div class="card-background"></div>

      <!-- 카드 콘텐츠 컨테이너 -->
      <div class="card-content">
        <!-- 아이콘 영역 (원형 배경) -->
        <div class="agent-icon-wrapper">
          <!-- CommonIcon 컴포넌트: 이미지 렌더링 및 크기 조정 -->
          <CommonIcon :src="cardThumbnailUrl" :size="100" />
        </div>

        <!-- 에이전트 이름 (제목) -->
        <h3 class="agent-name">
          {{ cardInfo.title }}
        </h3>

        <!-- 에이전트 설명 텍스트 -->
        <p class="agent-description">
          {{ cardInfo.explain }}
        </p>
      </div>
    </template>

    <!-- ==================== FAQ 타입 (배경색 + 제목 + 질문 리스트) ==================== -->
    <template v-else-if="type === 'faq'">
      <!-- 카드 콘텐츠 컨테이너 (배경색 동적 적용) -->
      <div
        class="card-content card-content--faq"
        :style="{
          backgroundColor: configStore.backgroundGradientStandardColor,
        }"
      >
        <!-- FAQ 카드 제목 -->
        <h3 class="agent-name">
          {{ cardInfo.title }}
        </h3>

        <!-- FAQ 질문 리스트 (최대 4개) -->
        <ul class="faq-list">
          <!-- 
            randomQuestions computed에서 최대 4개의 질문을 랜덤으로 선택
            v-for로 각 질문을 li로 렌더링
          -->
          <li
            class="faq"
            v-for="(question, index) in randomQuestions"
            :key="index"
          >
            {{ question }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup>
/**
 * ========================================
 * Script Setup (Vue3 Composition API)
 * ========================================
 *
 * Vue2에서는 export default { data(), computed, methods } 형태
 * Vue3에서는 <script setup>을 사용하여 더 간결한 코드 작성
 *
 * 장점:
 * - 더 간결한 구문
 * - 자동으로 상위 scope에서 define*를 찾아 처리
 * - defineProps, defineEmits, defineExpose 사용 가능
 */

import { computed } from "vue";
import CommonIcon from "@/components/icon/CommonIcon.vue";
import { useConfigStore } from "@/stores/configStore";

/**
 * Props 정의
 *
 * Vue2: props: { cardIndex: Number, type: String }
 * Vue3: defineProps()로 타입 안전성 확보
 *
 * Props 설명:
 * - cardIndex: configStore.aiAgentCards 배열의 인덱스
 * - type: 'normal' (아이콘+제목+설명) 또는 'faq' (배경색+제목+질문)
 */
const props = defineProps({
  cardIndex: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 2, // 0, 1, 2만 가능
  },
  type: {
    type: String,
    default: "normal",
    validator: (value) => ["normal", "faq"].includes(value),
  },
});

/**
 * Emit 정의
 *
 * Vue2: this.$emit('agent-select', ...)
 * Vue3: emit('agent-select', ...)
 */
const emit = defineEmits(["agent-select"]);

/**
 * Store 인스턴스
 *
 * configStore에서 aiAgentCards 배열과 이미지 서버 URL 가져오기
 */
const configStore = useConfigStore();

/**
 * cardInfo computed
 *
 * Props의 cardIndex를 기반으로 configStore에서 해당 카드 데이터 조회
 *
 * Vue2: computed() { return ... }
 * Vue3: const cardInfo = computed(() => ...)
 *
 * 반응성:
 * - props.cardIndex가 변경되면 자동 재계산
 * - configStore.aiAgentCards가 변경되면 자동 재계산
 */
const cardInfo = computed(() => {
  return configStore.aiAgentCards[props.cardIndex] || {};
});

/**
 * cardThumbnailUrl computed (NORMAL 타입용)
 *
 * 이미지 서버 URL + 상대 경로를 조합하여 완전한 URL 생성
 *
 * 예시:
 * - configStore.imageServerUrl: "https://api.example.com/images/"
 * - cardInfo.cardThumbnailUrl: "agents/greeting.png"
 * - 결과: "https://api.example.com/images/agents/greeting.png"
 */
const cardThumbnailUrl = computed(() => {
  if (!cardInfo.value?.cardThumbnailUrl) return "";
  const thumbPath =
    configStore.imageServerUrl + cardInfo.value.cardThumbnailUrl;
  console.log("🖼️ 카드 썸네일 경로:", thumbPath);
  return thumbPath;
});

/**
 * randomQuestions computed (FAQ 타입용)
 *
 * cardInfo.questionList에서 최대 4개의 질문을 랜덤으로 선택
 *
 * 동작:
 * 1. [...cardInfo.value.questionList] - 원본 배열 복사 (원본 손상 방지)
 * 2. .sort(() => Math.random() - 0.5) - 랜덤 섞기
 * 3. .slice(0, 4) - 처음 4개만 선택
 *
 * Vue2 vs Vue3:
 * - Vue2: questionList가 변경되면 watch로 감지하고 다시 계산
 * - Vue3: computed가 자동으로 의존성 추적하고 재계산
 */
const randomQuestions = computed(() => {
  if (!cardInfo.value?.questionList) return [];

  return [...cardInfo.value.questionList] // 원본 보호를 위해 spread 연산자 사용
    .sort(() => Math.random() - 0.5) // Fisher-Yates 섞기 (단순하지만 무작위성 충분)
    .slice(0, 4); // 처음 4개만 선택
});

/**
 * selectAgent 메서드
 *
 * 카드 클릭 시 실행
 * parent 컴포넌트(MainPage.vue)로 emit 발생
 *
 * Emit 데이터:
 * - cardInfo: 선택된 에이전트의 전체 정보
 * - cardIndex: 선택된 카드의 인덱스
 * - type: 카드 타입
 */
const selectAgent = () => {
  console.log(
    `✨ Agent ${props.cardIndex} (${props.type}) 선택됨:`,
    cardInfo.value.title
  );

  emit("agent-select", {
    cardInfo: cardInfo.value,
    cardIndex: props.cardIndex,
    type: props.type,
  });
};
</script>

<style scoped lang="scss">
/**
 * ========================================
 * SCSS 스타일
 * ========================================
 * 
 * 구조:
 * 1. .agent-card - 메인 컨테이너 (공통 스타일)
 * 2. .card-background - 배경 효과
 * 3. .card-content - 콘텐츠 컨테이너 (normal 타입)
 * 4. .agent-icon-wrapper - 아이콘 원형 배경
 * 5. .faq-list - FAQ 질문 리스트 (faq 타입)
 * 
 * SCSS @use:
 * - @use로 import한 변수들은 네임스페이스를 통해 접근
 * - $primary-text, $secondary-text 등 변수 사용
 * - $transition-base 등 트랜지션 변수 사용
 */

@use "@/assets/styles/whole_variables" as *;
@use "@/assets/styles/whole_animations" as *;

/* ==================== .agent-card - 메인 컨테이너 ==================== */

/**
 * 공통 스타일 (모든 카드 타입)
 * 
 * 특징:
 * - width: 315px, height: 250px (고정 크기)
 * - border-radius: 1rem (16px 둥근 모서리)
 * - cursor: pointer (클릭 가능 표시)
 * - perspective: 1000px (3D 효과 준비)
 * 
 * 호버 애니메이션:
 * - transform: translateY(-8px) (위로 떠오르는 효과)
 * - box-shadow 확대 (깊이감 증가)
 * - cubic-bezier(0.34, 1.56, 0.64, 1) (탄성있는 애니메이션)
 * 
 * 활성 상태:
 * - transform: translateY(-4px) (호버보다 낮은 높이)
 */
.agent-card {
  /* 크기 및 기본 스타일 */
  width: 315px;
  height: 250px;
  position: relative;
  border-radius: $border-radius-lg; /* 12px -> 16px (8px에서 업그레이드) */
  overflow: hidden;
  cursor: pointer;
  perspective: 1000px;
  background: $white;
  border: 1px solid $gray-200;
  box-shadow: $shadow-base, 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  /* 접근성: 키보드 포커스 표시 */
  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  /* ==================== 호버 상태 ==================== */
  /**
   * 호버 애니메이션:
   * - 카드가 위로 떠오르는 효과 (translateY)
   * - 그림자가 커져서 깊이감 증가
   * - 부드럽고 트렌디한 느낌
   */
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  /* ==================== 활성(클릭) 상태 ==================== */
  /**
   * 클릭 시 피드백:
   * - 호버보다 낮은 높이 (누르는 느낌)
   * - 사용자의 클릭 이벤트에 대한 즉각적 반응
   */
  &:active {
    transform: translateY(-4px);
  }
}

/* ==================== .card-background - 배경 효과 (옵션) ==================== */

/**
 * 카드 배경 (normal 타입에만 사용)
 * 
 * 현재: 단순 흰색 배경
 * 추후: 그라데이션 배경으로 확장 가능
 * 
 * pointer-events: none
 * - 클릭 이벤트가 이 요소를 통과하여 상위 요소에 전달되도록 설정
 */
.card-background {
  background: $white;
  pointer-events: none;
}

/* ==================== .card-content - 콘텐츠 컨테이너 ==================== */

/**
 * 카드 내용 래퍼 (normal 타입용 기본 구조)
 * 
 * 공통 스타일:
 * - position: relative, z-index: 1 (배경 위에 표시)
 * - flexbox로 세로 중앙 정렬
 * - padding으로 내부 여백
 * 
 * normal 타입: 아이콘 + 제목 + 설명
 * faq 타입: 제목 + 질문 리스트 (배경색 동적) - .agent-card--faq에서 오버라이드
 */
.card-content {
  position: relative;
  z-index: 1;
  padding: $spacing-5; /* 1.5rem = 24px */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $spacing-4; /* 1rem = 16px */
  width: 100%;
  height: 100%;
}

/* ==================== Normal 타입 스타일 ==================== */

/**
 * Normal 타입 전용 스타일
 * 
 * .agent-card (normal):
 *   └─ .card-content
 *      ├─ .agent-icon-wrapper
 *      ├─ .agent-name
 *      └─ .agent-description
 */

/* 아이콘 영역 (normal 타입만) */
.agent-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 호버 시 회전 및 확대 애니메이션 */
  transition: transform $transition-base;

  .agent-card:hover & {
    transform: rotate(10deg) scale(1.05);
  }
}

/* 제목 (모든 타입 공통) */
.agent-name {
  font-size: $font-size-xl; /* 1.25rem = 20px */
  font-weight: $font-weight-bold;
  color: $primary-text;
  margin: $spacing-2 0 0 0;
  line-height: 1.3;
}

/* 설명 텍스트 (normal 타입만) */
.agent-description {
  font-size: $font-size-sm; /* 0.875rem = 14px */
  color: $secondary-text;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap; /* 줄바꿈 유지 */
  word-break: keep-all; /* 단어 단위로 줄바꿈 */
}

/* ==================== FAQ 타입 전용 스타일 (.agent-card--faq) ==================== */

/**
 * FAQ 타입 카드 특화 스타일
 * 
 * 기존 FQuestionAgent.vue의 구조를 정확하게 복원:
 * 
 * .agent-card--faq (배경색 동적 적용)
 *   └─ .card-content
 *      ├─ .agent-name (1.4rem)
 *      └─ .faq-list
 *         ├─ .faq
 *         ├─ .faq
 *         ├─ .faq
 *         └─ .faq
 * 
 * 중요!
 * - .agent-card--faq는 background-color를 배경에서 받음
 * - .card-content 내부에 모든 스타일이 중첩됨
 * - padding은 1.5rem이 아니라 1.5rem 유지 (기존과 동일)
 * - margin-top: -1px로 보이는 버그 복원 (기존 코드)
 */

.agent-card--faq {
  /* 배경색은 template에서 :style로 동적 적용 */

  /* Card Content (FAQ 타입) */
  .card-content {
    position: relative;
    z-index: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem; /* 요소 간의 간격 */
    width: 100%;
    height: 100%;
    margin-top: -1px; /* 기존 코드 그대로 유지 (미세 조정) */

    /* ==================== FAQ 제목 ==================== */
    /**
     * FAQ 제목 스타일
     * 
     * 기존 코드:
     * - font-size: 1.4rem (20px) - normal 타입의 $font-size-xl과 다름
     * - color: $primary-text
     * - margin-top: 5px
     * - font-weight: 700
     */
    .agent-name {
      font-size: 1.4rem; /* ⭐ 정확히 1.4rem (20px) */
      font-weight: 700;
      color: $primary-text;
      margin-top: 5px; /* ⭐ 정확히 5px */
    }

    /* ==================== FAQ 질문 리스트 ==================== */
    /**
     * FAQ 질문 컨테이너
     * 
     * 기존 코드 구조:
     * - list-style: none (불릿 제거)
     * - padding: 0
     * - margin: 0 auto
     * - width: 90%
     * - .faq 항목들이 내부 중첩
     */
    .faq-list {
      list-style: none;
      padding: 0;
      margin: 0 auto;
      width: 90%;

      /* ==================== 각 FAQ 항목 (.faq) ==================== */
      /**
       * FAQ 질문 항목 스타일
       * 
       * ⭐ 정확한 스타일:
       * - width: 100%
       * - font-size: 11.5px (정확히 11.5px!)
       * - color: $primary-text
       * - line-height: 1.2
       * - padding: 8px 23px (정확한 px 값)
       * - background-color: $white
       * - border-radius: 27px (정확히 27px!)
       * - text-align: left
       * - overflow: hidden
       * - text-overflow: ellipsis
       * - white-space: nowrap
       * - display: block
       * 
       * ⭐ 호버 상태:
       * - color: $white
       * - background-color: var(--primary-color)
       * - transition: $transition-base (0.3s ease)
       * 
       * ⚠️ 주의: gap 없음! (기존 코드와 동일)
       * 각 항목 사이의 간격은 padding만으로 관리
       */
      .faq {
        width: 100%;
        font-size: 11.5px; /* ⭐ 정확히 11.5px (px 단위!) */
        color: $primary-text;
        line-height: 1.2;
        padding: 8px 23px; /* ⭐ 정확한 px 값 */
        background-color: $white;
        border-radius: 27px; /* ⭐ 정확히 27px! */
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;

        /**
         * FAQ 항목 호버
         * 
         * 기존 코드:
         * - color: $white
         * - background-color: var(--primary-color)
         * - transition: $transition-base
         */
        &:hover {
          color: $white;
          background-color: var(--primary-color);
          transition: $transition-base;
        }
      }
    }
  }
}

/* ==================== 반응형 디자인 ==================== */

/**
 * 태블릿 이상 (768px):
 * - 기본 스타일 유지
 * 
 * 추후 추가 가능:
 * @media (max-width: $breakpoint-tablet) {
 *   .agent-card {
 *     width: 280px;
 *     height: 220px;
 *   }
 * }
 */
</style>
