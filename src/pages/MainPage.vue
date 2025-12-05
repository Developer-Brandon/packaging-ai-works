<template>
  <!-- 메인 콘텐츠 영역 -->
  <main class="main-content">
    <!-- 1. 인사말 영역 -->
    <section class="greeting-section">
      <MainGreeting />
    </section>
    <!-- 2. 에이전트 카드 영역 -->
    <section class="card-list-section">
      <GreetingAgentCard />
      <MiddleAgentCard />
      <FQuestionAgentCard />
    </section>
    <!-- 3.채팅 영역-->
    <!-- TODO: 작업예정 -->
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useConfigStore } from "@/stores/configStore";
import MainGreeting from "@/components/main/MainGreeting.vue";
import GreetingAgentCard from "@/components/main/GreetingAgentCard.vue";
import MiddleAgentCard from "@/components/main/MiddleAgentCard.vue";
import FQuestionAgentCard from "../components/main/FQuestionAgentCard.vue";
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables" as *;
@use "@/assets/styles/whole_animations" as *;

.main-content {
  /* 메인 콘텐츠 영역 */
  flex: 1;
  padding: 3rem 2rem; /* 48px top/bottom, 32px left/right */
  max-width: 1200px; /* 최대 너비 제한 */
  margin: 0 auto; /* 중앙 정렬 */
  margin-top: 16rem;
  width: 100%;

  /* 반응형: 모바일 화면 */
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
}

.greeting-section {
  /* 인사말 섹션 */
  margin-bottom: 4rem; /* 에이전트 영역과의 거리 */
  /* 진입 애니메이션 */
  animation: fadeInDown 1s ease-out;
}

.card-list-section {
  display: flex; /* 가로 배치 */
  gap: 24px; /* 카드 사이 간격 */
  justify-content: center; /* 가운데 정렬 */
  align-items: stretch; /* 카드 높이 균일하게 */
  flex-wrap: nowrap; /* 줄바꿈 안 함 (원하면 wrap으로 변경 가능) */
  /* 진입 애니메이션 */
  animation: fadeInDown 2s ease-out;
}
</style>
