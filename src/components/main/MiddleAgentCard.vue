<!-- src/components/service/AgentCard.vue -->
<template>
  <div
    class="agent-card"
    @click="selectAgent"
    @keydown.enter="selectAgent"
    role="button"
    tabindex="0"
  >
    <!-- 카드 배경 효과 -->
    <div class="card-background"></div>
    <!-- 카드 콘텐츠 -->
    <div class="card-content">
      <!-- 아이콘 영역 -->
      <div class="agent-icon-wrapper">
        <CommonIcon :src="cardThumbnailUrl" :size="100" />
      </div>

      <!-- 에이전트 이름 -->
      <h3 class="agent-name">
        {{ cardInfo.title }}
      </h3>

      <!-- 에이전트 설명 -->
      <p class="agent-description">
        {{ cardInfo.explain }}
      </p>
    </div>
  </div>
</template>

<script setup>
import CommonIcon from "@/components/icon/CommonIcon.vue";
import { useConfigStore } from "@/stores/configStore";

import { computed } from "vue";
const configStore = useConfigStore();
const cardInfo = configStore.aiAgentCards[1];

// Emit 선언 (Vue3: defineEmits 함수 사용)
const emit = defineEmits(["agent-select"]);

const cardThumbnailUrl = computed(() => {
  const thumbPath = configStore.imageServerUrl + cardInfo.cardThumbnailUrl;
  return thumbPath;
});

// 에이전트 선택 핸들러
const selectAgent = () => {
  emit("agent-select", props.agent);
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables" as *;
@use "@/assets/styles/whole_animations" as *;

.agent-card {
  /* 카드 컨테이너 - 클릭 가능한 버튼처럼 동작 */
  width: 315px;
  height: 250px;
  position: relative;
  border-radius: 1rem; /* 16px */
  overflow: hidden;
  cursor: pointer;

  /* 기본 배경 */
  background: $white;
  border: 1px solid $gray-200;

  /* 부드러운 전환 효과 */
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  /* 접근성: 키보드 네비게이션 포커스 표시 */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* 호버 상태: 약간 위로 올라가고 그림자 추가 (트렌디한 효과) */
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: var(--color-primary);
  }

  /* 활성 상태 (클릭 중) */
  &:active {
    transform: translateY(-4px);
  }
}

.card-background {
  /* 그라데이션 배경 (선택사항) */
  background: linear-gradient(
    135deg,
    rgba(var(--primary-color), 0.02) 0%,
    rgba(var(--sub-color), 0.02) 100%
  );
  pointer-events: none;
}

.card-content {
  /* 카드 내용 컨테이너 - z-index로 배경 위에 표시 */
  position: relative;
  z-index: 1;
  padding: 2rem 1.5rem; /* 32px top/bottom, 24px left/right */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem; /* 요소 간의 간격 */
}

.agent-icon-wrapper {
  /* 아이콘을 감싸는 래퍼 - 배경 원형 처리 */
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(var(--color-primary), 0.1) 0%,
    rgba(var(--sub-color), 0.1) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* 호버 시 회전 애니메이션 */
  .agent-card:hover & {
    transform: rotate(10deg) scale(1.05);
  }
}

.agent-name {
  /* 에이전트 이름 */
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  color: $text-primary;
  margin: 0.5rem 0 0 0;
}

.agent-description {
  /* 에이전트 설명 텍스트 */
  font-size: 0.875rem; /* 14px */
  color: $text-secondary;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap; /* 줄바꿈 유지 */
  word-break: keep-all;
}

.agent-cta {
  /* CTA (Call To Action) - 호버 시 나타남 */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.875rem;

  /* 기본적으로 투명 */
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s ease;

  /* 호버 시 나타남 */
  .agent-card:hover & {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-icon {
  /* CTA 아이콘 - 호버 시 오른쪽으로 이동 */
  transition: transform 0.3s ease;

  .agent-card:hover & {
    transform: translateX(4px);
  }
}
</style>
