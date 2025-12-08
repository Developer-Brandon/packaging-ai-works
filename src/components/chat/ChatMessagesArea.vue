<!-- src/components/chat/ChatMessagesArea.vue -->
<template>
  <div class="chat-messages-area" ref="messagesContainer">
    <!-- ==================== 빈 상태 ==================== -->
    <div v-if="messages.length === 0" class="chat-empty-state">
      <div class="chat-empty-icon">💬</div>
      <p class="chat-empty-text">대화를 시작해보세요!</p>
    </div>

    <!-- ==================== 메시지 리스트 ==================== -->
    <div v-else class="chat-messages-list">
      <ChatMessage
        v-for="(message, index) in messages"
        :key="`msg-${index}`"
        :message="message"
        :index="index"
        @action="handleMessageAction"
      />

      <!-- ==================== 로딩 상태 ==================== -->
      <div v-if="isLoading" class="chat-loading">
        <div class="chat-loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ChatMessagesArea.vue - 메시지 표시 영역
 *
 * Props:
 * - messages: Array - 채팅 메시지 배열
 * - isLoading: Boolean - AI 응답 대기 중 여부
 *
 * Emits:
 * - scroll-to-bottom: 하단으로 스크롤
 *
 * Vue3 vs Vue2 차이:
 * ==================
 * Vue2:
 * - props: {} 객체 선언
 * - 스크롤은 $refs 사용
 *
 * Vue3:
 * - defineProps()로 TypeScript 지원
 * - ref를 직접 템플릿에서 사용 가능
 */

import { defineProps, defineEmits, ref, watch, onUpdated, nextTick } from "vue";
import ChatMessage from "./ChatMessage.vue";

/* ==================== Props ==================== */
defineProps({
  messages: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

/* ==================== Emits ==================== */
const emit = defineEmits(["scroll-to-bottom"]);

/* ==================== Refs ==================== */
const messagesContainer = ref(null);

/* ==================== Watch ==================== */
/**
 * messages 변경 시 자동 스크롤
 *
 * 동작:
 * 1. messages 배열 변경 감지
 * 2. nextTick() 대기 (DOM 업데이트 완료)
 * 3. 스크롤바를 하단으로 이동
 */
watch(
  () => [
    /* messages.length */
  ],
  async () => {
    await nextTick();
    scrollToBottom();
  }
);

/* ==================== 라이프사이클 ==================== */
onUpdated(() => {
  // DOM 업데이트 후 스크롤
  nextTick(() => {
    scrollToBottom();
  });
});

/* ==================== 메서드 ==================== */
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleMessageAction = (action) => {
  console.log("💬 메시지 액션:", action);
  // TODO: 메시지 액션 처리 (복사, 재생성 등)
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;
@use "@/assets/styles/whole_animations.scss" as *;

/* ==================== 메시지 영역 컨테이너 ==================== */
.chat-messages-area {
  flex: 1;
  overflow-y: auto;
  padding: var.$spacing-4;
  display: flex;
  flex-direction: column;
  gap: var.$spacing-3;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var.$gray-300;
    border-radius: 4px;

    &:hover {
      background: var.$gray-400;
    }
  }
}

/* ==================== 빈 상태 ==================== */
.chat-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var.$spacing-4;
  color: var.$text-muted;
  animation: fadeIn 0.5s ease-out;
}

.chat-empty-icon {
  font-size: 3rem;
  opacity: 0.6;
}

.chat-empty-text {
  font-size: var.$font-size-lg;
  margin: 0;
}

/* ==================== 메시지 리스트 ==================== */
.chat-messages-list {
  display: flex;
  flex-direction: column;
  gap: var.$spacing-3;
}

/* ==================== 로딩 인디케이터 ==================== */
.chat-loading {
  display: flex;
  align-items: center;
  gap: var.$spacing-2;
  padding: var.$spacing-3 var.$spacing-4;
  animation: fadeIn 0.3s ease-out;
}

.chat-loading-dots {
  display: flex;
  gap: var.$spacing-1;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--primary-color);
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}
</style>
