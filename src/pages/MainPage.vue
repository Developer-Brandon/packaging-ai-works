<template>
  <!-- 메인 콘텐츠 영역 -->
  <main class="main-content">
    <!-- 1. 인사말 영역 -->
    <section class="greeting-section">
      <MainGreeting />
    </section>
    <!-- 2. 에이전트 카드 영역 -->
    <section class="card-list-section">
      <section class="card-list-section__greeting">
        <p class="card-list-section__greeting__text">
          ✨자주 사용하는 AI Agent
        </p>
      </section>
      <section class="card-list-section__inner">
        <GreetingAgentCard />
        <MiddleAgentCard />
        <FQuestionAgentCard />
      </section>
    </section>
    <!-- 3.채팅 영역-->
    <!-- <section class="chat-section-wrapper">
      <ChatSection />
    </section> -->
    <section class="chat-wrapper">
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
import { ref } from "vue";
// import { useRouter } from "vue-router";
// import { useConfigStore } from "@/stores/configStore";
import MainGreeting from "@/components/main/MainGreeting.vue";
import GreetingAgentCard from "@/components/main/GreetingAgentCard.vue";
import MiddleAgentCard from "@/components/main/MiddleAgentCard.vue";
import FQuestionAgentCard from "../components/main/FQuestionAgentCard.vue";
// import ChatSection from "@/components/chat/ChatSection.vue"
import ChatInputField from "@/components/chat/ChatInputField.vue"; // ✅ 새로 추가

const chatMessage = ref("");
const attachedFiles = ref([]);

const handleSend = ({ message, files }) => {
  console.log("📤 전송:", message, files);
  // TODO: 서버 API 호출
  chatMessage.value = "";
  attachedFiles.value = [];
};

const handleAttachFile = (files) => {
  attachedFiles.value.push(...files);
};

const handleRemoveFile = (idx) => {
  attachedFiles.value.splice(idx, 1);
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables" as *;
@use "@/assets/styles/whole_animations" as *;

/* 메인 콘텐츠 영역 */
.main-content {
  flex: 1;
  padding: 2rem 1rem; /* 48px top/bottom, 32px left/right */
  max-width: 1200px; /* 최대 너비 제한 */
  margin: 0 auto; /* 중앙 정렬 */
  margin-top: 3.5rem;
  width: 100%;

  /* 반응형: 모바일 화면 */
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
}

.greeting-section {
  /* 인사말 섹션 */
  margin-bottom: 3rem; /* 에이전트 영역과의 거리 */
  /* 진입 애니메이션 */
  animation: fadeInDown 1s ease-out;
}

.card-list-section {
  /* 진입 애니메이션 */
  animation: fadeInDown 2s ease-out;
  margin-bottom: 150px;
  &__greeting {
    width: 984px; // 우선적으로,
    margin: 0 auto;
    &__text {
      text-align: left;
      color: #686868;
      font-size: 25px;
    }
  }
  &__inner {
    display: flex; /* 가로 배치 */
    gap: 24px; /* 카드 사이 간격 */
    align-items: stretch; /* 카드 높이 균일하게 */
    justify-content: center; /* 가운데 정렬 */
    flex-wrap: nowrap; /* 줄바꿈 안 함 (원하면 wrap으로 변경 가능) */
  }
}

.chat-wrapper {
  max-width: 1064px;
  margin: 3rem auto 0;
  padding: 0 2rem;
}
</style>
