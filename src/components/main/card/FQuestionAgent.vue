<!-- src/components/service/AgentCard.vue -->
<template>
  <div
    class="agent-card"
    @click="selectAgent"
    @keydown.enter="selectAgent"
    role="button"
    tabindex="0"
  >
    <!-- 카드 콘텐츠 -->
    <div
      class="card-content"
      :style="{
        backgroundColor: configStore.backgroundGradientStandardColor,
      }"
    >
      <!-- 에이전트 이름 -->
      <h3 class="agent-name">
        {{ cardInfo.title }}
      </h3>

      <!-- 에이전트 설명 -->
      <ul class="faq-list">
        <li
          class="faq"
          v-for="(question, index) in randomQuestions"
          :key="index"
        >
          {{ question }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useConfigStore } from "@/stores/configStore";

import { computed } from "vue";
const configStore = useConfigStore();
const cardInfo = configStore.aiAgentCards[2];

// Emit 선언 (Vue3: defineEmits 함수 사용)
const emit = defineEmits(["agent-select"]);

// 에이전트 선택 핸들러
const selectAgent = () => {
  emit("agent-select", props.agent);
};

// randomQuestion 4개 뽑기
const randomQuestions = computed(() => {
  return [...cardInfo.questionList] // 원본 복사
    .sort(() => Math.random() - 0.5) // 랜덤 섞기
    .slice(0, 4); // 4개만 선택
});
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.08); /* 먼 그림자 */

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
  /* 카드 내용 컨테이너 - z-index로 배경 위에 표시 */
  .card-content {
    position: relative;
    z-index: 1;
    padding: 1.5rem; /* 32px top/bottom, 24px left/right */
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem; /* 요소 간의 간격 */
    width: 100%;
    height: 100%;
    margin-top: -1px;
  }

  .agent-name {
    /* 에이전트 이름 */
    font-size: 1.4rem; /* 20px */
    font-weight: 700;
    color: $text-primary;
    margin-top: 5px;
  }

  .faq-list {
    // 기본 불렛 제거
    list-style: none;
    padding: 0;
    margin: 0;
    .faq {
      font-size: 11.5px;
      color: $text-primary;
      line-height: 1.3;
      padding: 8px 23px;
      background-color: $white;
      border-radius: 27px;
      text-align: left;
      overflow: hidden; // ← 넘치는 글 숨김
      text-overflow: ellipsis; // ← '…' 처리
      white-space: nowrap; // ← 한 줄로 제한
      display: block; // ← 대부분 block/inline-block이 안전
      max-width: 100%; // ← 부모 넓이 기준으로 말줄임
      &:hover {
        font-weight: 900;
        transform: scale(1.02);
        transition: $transition-base;
      }
    }
  }
}
</style>
