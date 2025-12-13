<!-- src/components/main/MainPage.vue -->
<template>
  <!-- 메인 콘텐츠 영역 -->
  <main class="main-content">
    <!-- ==================== 1. 인사말 영역 ==================== -->
    <section class="greeting-section">
      <div class="greeting-container no-drag">
        <!-- 제목 영역: 동적으로 서버에서 받은 인사말 텍스트 렌더링 -->
        <h1 class="greeting-title">
          안녕하세요. <span class="user-name">{{ authStore.userName }}</span
          >님!
        </h1>
        <!-- 설명 텍스트 영역: 부드러운 아래쪽 애니메이션으로 진입 -->
        <p class="greeting-description">오늘은 어떤 업무를 시작해볼까요?</p>
      </div>
    </section>

    <!-- ==================== 2. 에이전트 카드 영역 (캐러셀 포함) ==================== -->
    <section class="card-list-section no-drag">
      <div class="card-list-section__greeting">
        <p class="card-list-section__greeting__text">
          <span class="grow-anim">✨</span>자주 사용하는 AI Agent
        </p>
      </div>

      <!-- ✨ 캐러셀 컨테이너 (모바일에서만 슬라이더) -->
      <div class="card-carousel">
        <!-- 카드들을 감싸는 슬라이더 -->
        <div
          class="card-carousel__inner"
          :style="{
            transform: `translateX(-${currentCardIndex * 100}%)`,
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }"
        >
          <AgentCard
            :card-index="0"
            type="normal"
            @agent-select="handleAgentSelect"
          />
          <AgentCard
            :card-index="1"
            type="normal"
            @agent-select="handleAgentSelect"
          />
          <AgentCard
            :card-index="2"
            type="faq"
            @agent-select="handleAgentSelect"
          />
        </div>

        <!-- 캐러셀 점(indicators) - 모바일에서만 표시 -->
        <div class="card-carousel__indicators">
          <button
            v-for="(_, index) in 2"
            :key="index"
            class="carousel-dot"
            :class="{ 'carousel-dot--active': index === currentCardIndex }"
            @click="goToCard(index)"
            :aria-label="`Go to agent card ${index + 1}`"
            type="button"
          />
        </div>
      </div>
    </section>

    <!-- ==================== 3. 채팅 입력 영역 ==================== -->
    <section class="chat-section">
      <ChatInputField
        v-model="chatMessage"
        :attached-files="attachedFiles"
        @send="handleSend"
        @attach-file="handleAttachFile"
        @remove-file="handleRemoveFile"
      />
    </section>
  </main>
</template>

<script setup>
/**
 * MainPage.vue - 메인 페이지 (캐러셀 기능 포함)
 *
 * 기능:
 * - 인사말 섹션
 * - 에이전트 카드 3개 (일반 2개 + FAQ 1개)
 *   - 데스크톱: 3개 카드 동시 표시
 *   - 모바일: 1개 카드 + 캐러셀 슬라이더 + 점 지표
 * - 채팅 입력 필드
 *
 * Vue3 Composition API 사용
 */

import { ref, onMounted } from "vue";
import AgentCard from "@/components/main/card/AgentCard.vue";
import ChatInputField from "@/components/chat/ChatInputField.vue";
import { useConfigStore } from "@/stores/configStore";
import { useAuthStore } from "@/stores/auth";

/* ==================== 반응형 상태 ==================== */

/**
 * currentCardIndex: 현재 표시되는 카드의 인덱스 (모바일 캐러셀용)
 *
 * - 값: 0, 1, 2 (3개 카드)
 * - goToCard(), nextCard(), prevCard()로 변경
 * - 점 클릭 시: goToCard() 호출
 */
const currentCardIndex = ref(0);

/**
 * 채팅 메시지 및 첨부 파일
 */
const chatMessage = ref("");
const attachedFiles = ref([]);

const configStore = useConfigStore();
const authStore = useAuthStore();

/* ==================== 캐러셀 제어 함수 ==================== */

/**
 * goToCard: 특정 인덱스의 카드로 이동
 *
 * @param {number} index - 카드 인덱스 (0, 1, 2)
 *
 * 사용처:
 * - 점 클릭 시
 */
const goToCard = (index) => {
  console.log(`🎯 카드 ${index}로 이동`);
  currentCardIndex.value = index;
};

/**
 * nextCard: 다음 카드로 이동 (순환)
 *
 * 동작:
 * - currentCardIndex를 1씩 증가
 * - 마지막 카드(2)에서 → 첫 번째 카드(0)로 이동 (순환)
 */
const nextCard = () => {
  currentCardIndex.value = (currentCardIndex.value + 1) % 3;
  console.log(`➡️ 다음 카드 (현재: ${currentCardIndex.value})`);
};

/**
 * prevCard: 이전 카드로 이동 (순환)
 *
 * 동작:
 * - currentCardIndex를 1씩 감소
 * - 첫 번째 카드(0)에서 → 마지막 카드(2)로 이동 (순환)
 */
const prevCard = () => {
  currentCardIndex.value = (currentCardIndex.value - 1 + 3) % 3;
  console.log(`⬅️ 이전 카드 (현재: ${currentCardIndex.value})`);
};

/* ==================== 메서드 ==================== */

/**
 * handleAgentSelect: 에이전트 카드 선택 시 호출
 *
 * @param {Object} param
 *   - cardInfo: 카드 정보
 *   - cardIndex: 카드 인덱스
 *   - type: 카드 타입 ('normal' | 'faq')
 */
const handleAgentSelect = ({ cardInfo, cardIndex, type }) => {
  console.log(`✨ Agent ${cardIndex} (${type}) selected:`, cardInfo);
  // TODO: 서버 API 호출
};

/**
 * handleSend: 메시지 전송
 */
const handleSend = ({ message, files }) => {
  console.log("📤 전송:", message, files);
  // TODO: 서버 API 호출
  chatMessage.value = "";
  attachedFiles.value = [];
};

/**
 * handleAttachFile: 파일 첨부
 */
const handleAttachFile = (files) => {
  attachedFiles.value.push(...files);
};

/**
 * handleRemoveFile: 첨부 파일 제거
 *
 * @param {number} idx - 제거할 파일의 인덱스
 */
const handleRemoveFile = (idx) => {
  attachedFiles.value.splice(idx, 1);
};

onMounted(() => {
  console.log("✅ MainPage 마운트됨");
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables" as *;
@use "@/assets/styles/whole_animations" as *;

/* ==================== 메인 콘텐츠 영역 ==================== */

/**
 * .main-content: 전체 콘텐츠 컨테이너
 * 
 * 레이아웃 원칙:
 * 1. flex 컨테이너로 설정 (세로 배치)
 * 2. padding으로 좌우 여백 추가
 * 3. max-width로 최대 너비 제한 (큰 화면에서도 가독성)
 * 4. margin: 0 auto로 중앙 정렬
 * 
 * 반응형:
 * - 데스크톱 (>1200px): padding 3rem 1rem
 * - 태블릿 (768px~1200px): padding 2rem 1rem
 * - 모바일 (<768px): padding 1.5rem 1rem
 */
.main-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 3rem 1rem; /* 상하: 48px, 좌우: 16px */
  max-width: 1200px; /* 최대 너비: 1200px */
  margin: 0 auto; /* 중앙 정렬 */

  /* 반응형: 노트북: 1441px ~ 1920px */
  @media (min-width: 769px) and (max-width: 1920px) {
    padding: 1rem 0.5rem;
  }

  /* 반응형: 태블릿 (768px ~ 1024px) */
  @media (max-width: 1024px) {
    padding: 2rem 1rem;
    max-width: 100%;
  }

  /* 반응형: 모바일 (<768px) */
  @media (max-width: 768px) {
    padding: 1rem;
    gap: $spacing-4; /* 섹션 간 간격 축소: 24px */
  }
}

/* ==================== 인사말 섹션 ==================== */

/**
 * .greeting-section: 인사말 영역
 * 
 * 애니메이션:
 * - fadeInDown 1s: 위에서 아래로 부드럽게 나타남
 * 
 * 여백:
 * - margin-bottom: 3rem (에이전트 카드와의 거리)
 */
.greeting-section {
  animation: fadeInDown 1s ease-out;
  margin-bottom: 1rem;
  /* 반응형 */
  @media (min-width: 769px) and (max-width: 1920px) {
    //
  }
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }

  /* 인사말 영역 기본 레이아웃 */
  .greeting-container {
    display: flex;
    flex-direction: column;
    gap: 0.875rem; /* 16px 정도의 간격 */
    margin-top: 4rem;
    margin-bottom: 6rem; /* 에이전트 카드와의 거리 */
    text-align: center;
    cursor: default;
    user-select: none;
    /* 반응형: 노트북: 1441px ~ 1920px */
    @media (min-width: 769px) and (max-width: 1920px) {
      margin-top: 3rem;
      margin-bottom: 1.5rem; /* 에이전트 카드와의 거리 */
    }
    @media (max-width: 768px) {
      margin-top: 2.5rem;
      margin-bottom: 0.5rem;
    }
  }

  /* 큰 제목 스타일 */
  .greeting-title {
    font-size: 2.5rem; /* 32px */
    font-weight: 350;
    color: $primary-text;
    margin: 0;
    letter-spacing: -0.02em; /* 타이포그래피 개선 */
    transition: color 0.3s ease; /* 트렌디한 hover 효과 */
    @media (min-width: 769px) and (max-width: 1920px) {
      font-size: 2rem; /* 32px */
    }
    .user-name {
      color: var(--primary-color);
      animation: textGlow 1.5s ease-in-out infinite; // 3s → 1.5s
    }
  }
  /* 설명 텍스트 스타일 */
  .greeting-description {
    font-size: 1.2rem; /* 16px */
    font-weight: 400;
    color: $secondary-text;
    margin: 0;
    line-height: 1.5;
    opacity: 0.8;
    transition: opacity 0.3s ease; /* 부드러운 색상 전환 */
    @media (min-width: 769px) and (max-width: 1920px) {
      font-size: 1rem;
    }
    &:hover {
      opacity: 1;
    }
  }
}

/* ==================== 에이전트 카드 섹션 ==================== */

/**
 * .card-list-section: 카드 영역 전체
 * 
 * 구조:
 * - card-list-section__greeting: 제목 영역
 * - card-carousel: 캐러셀 컨테이너 (NEW)
 * 
 * 애니메이션:
 * - fadeInDown 2s: 인사말보다 천천히 나타남 (시간차 효과)
 * 
 * 여백:
 * - margin-bottom: 120px (채팅 영역과의 거리)
 */
.card-list-section {
  animation: fadeInDown 2s ease-out;
  margin-bottom: 5rem;

  /* 반응형 */
  @media (min-width: 769px) and (max-width: 1920px) {
    margin-bottom: 1.5rem;
  }
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
}

/**
 * .card-list-section__greeting: 제목 영역
 * 
 * 구조:
 * - 최대 너비 984px (카드 영역과 동일)
 * - 좌측 정렬
 * - 중앙 정렬 (margin: 0 auto)
 * 
 * 목적:
 * - "자주 사용하는 AI Agent" 제목 표시
 * - 이모지 애니메이션 (grow-anim)
 */
.card-list-section__greeting {
  width: 100%;
  max-width: 984px;
  margin: 0 auto $spacing-6;
  color: $primary-text;

  &__text {
    text-align: left;
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
    display: flex;
    align-items: center;
    gap: $spacing-3;

    /* 반응형 */
    @media (min-width: 769px) and (max-width: 1920px) {
      font-size: 1.25rem;
    }
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  /* 이모지 반짝반짝 애니메이션 */
  .grow-anim {
    display: inline-block;
    animation: textGlow 1s ease-in-out infinite;
  }
}

/* ==================== 캐러셀 (모바일 슬라이더) ==================== */

/**
 * 캐러셀 컨테이너
 *
 * 역할:
 * - 데스크톱: 일반 컨테이너
 * - 모바일: 슬라이더 컨테이너 (overflow 숨김)
 */
.card-carousel {
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    /* 모바일: 오버플로우 숨김 (카드가 범위를 넘어가지 않도록) */
    overflow: hidden;
    /* 점들을 위한 하단 여백 */
    padding-bottom: 30px;
  }
}

/**
 * 캐러셀 내부 컨테이너 (카드들을 감싸는 래퍼)
 *
 * 역할:
 * - 데스크톱: 일반 flex 레이아웃 (3개 카드 가로 배치)
 * - 모바일: 슬라이드 애니메이션 (transform 사용)
 */
.card-carousel__inner {
  display: flex;
  gap: 24px; /* 카드 사이 간격 */
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1064px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    gap: 0 !important;
    > * {
      flex-shrink: 0;
      flex-basis: 100%;
      width: 100%;
      min-width: 100%;
    }
  }

  /* 반응형: 태블릿 (1024px 이하) */
  @media (max-width: 1024px) {
    gap: 20px;
    max-width: 100%;
  }
}

/**
 * 캐러셀 점(indicators) 컨테이너
 *
 * 역할:
 * - 현재 카드 위치 표시
 * - 모바일에서만 표시됨
 */
.card-carousel__indicators {
  display: none;

  @media (max-width: 768px) {
    /* 모바일에서만 표시 */
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10; /* 점이 앞에 보이도록 */
  }
}

/**
 * 개별 점(dot/indicator)
 *
 * 상태:
 * - 기본: 회색 투명
 * - :hover: 진한 회색
 * - --active: 브랜드 색상(빨강) + 확대
 */
.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.3); /* 흐린 회색 */
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  /**
   * 호버 상태
   * 마우스를 올렸을 때 크기 확대 + 색상 진하게
   */
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    transform: scale(1.2);
  }

  /**
   * 활성 상태 (현재 카드 표시)
   *
   * 특징:
   * - 브랜드 색상 (var(--primary-color) = 빨강)
   * - 크기 확대 (10px)
   * - 외곽 글로우 효과
   */
  &--active {
    background-color: var(--primary-color); /* 빨강 */
    width: 10px;
    height: 10px;
    box-shadow: 0 0 0 2px rgba(208, 2, 27, 0.2); /* 외곽 그림자 */
  }
}

/* ==================== 채팅 입력 섹션 ==================== */

/**
 * .chat-section: 채팅 입력 영역
 * 
 * 구조:
 * - ChatInputField 컴포넌트를 감싸는 컨테이너
 * - max-width: 1064px (카드 영역과 동일)
 * - margin: 3rem auto 0 (상단 여백 + 중앙 정렬)
 */
.chat-section {
  max-width: 1064px;
  width: 100%;
  margin: 3rem auto 0;

  /* 반응형 */
  @media (max-width: 768px) {
    margin: 0;
    margin-top: -20px;
  }
}

/* 부드러운 진입 애니메이션 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
