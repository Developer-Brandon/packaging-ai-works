<!-- src/components/service/MainGreeting.vue -->
<template>
  <div class="greeting-container">
    <!-- 제목 영역: 동적으로 서버에서 받은 인사말 텍스트 렌더링 -->
    <h1 class="greeting-title">안녕하세요. {{ authStore.userName }}님!</h1>
    <!-- 설명 텍스트 영역: 부드러운 아래쪽 애니메이션으로 진입 -->
    <p class="greeting-description">오늘은 어떤 업무를 시작해볼까요?</p>
  </div>
</template>

<script setup>
import { useConfigStore } from "@/stores/configStore";
import { useAuthStore } from "@/stores/auth";
// Vue3 Composition API 사용
// Vue2와 달리 setup() 함수 또는 <script setup> 문법 사용
// Pinia의 useConfigStore() 훅으로 configStore 접근
const configStore = useConfigStore();
const authStore = useAuthStore();
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables" as *;
@use "@/assets/styles/whole_animations" as *;

.greeting-container {
  /* 인사말 영역 기본 레이아웃 */
  display: flex;
  flex-direction: column;
  gap: 0.875rem; /* 16px 정도의 간격 */
  margin-bottom: 3rem; /* 에이전트 카드와의 거리 */
  text-align: center;
}

.greeting-title {
  /* 큰 제목 스타일 */
  font-size: 3rem; /* 32px */
  font-weight: 350;
  color: $text-primary;
  margin: 0;
  letter-spacing: -0.02em; /* 타이포그래피 개선 */

  /* 트렌디한 hover 효과 */
  transition: color 0.3s ease;
}

.greeting-description {
  /* 설명 텍스트 스타일 */
  font-size: 1.5rem; /* 16px */
  font-weight: 400;
  color: $text-secondary;
  margin: 0;
  line-height: 1.5;
  opacity: 0.8;

  /* 부드러운 색상 전환 */
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
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
