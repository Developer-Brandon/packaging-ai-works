<!-- src/components/chat/ChatMessage.vue -->
<template>
  <div
    class="chat-message"
    :class="[
      `chat-message--${message.role}`,
      { 'chat-message--error': message.role === 'error' },
    ]"
  >
    <!-- ==================== Avatar ==================== -->
    <div class="chat-message__avatar">
      <img
        :src="avatarUrl"
        :alt="`${message.role} avatar`"
        class="chat-message__avatar-image"
      />
    </div>

    <!-- ==================== 콘텐츠 ==================== -->
    <div class="chat-message__content">
      <!-- 메시지 텍스트 -->
      <div class="chat-message__text">
        <!-- TODO: Markdown 렌더링 구현 -->
        {{ message.content }}
      </div>

      <!-- 첨부 파일 (있으면) -->
      <div
        v-if="message.files && message.files.length > 0"
        class="chat-message__files"
      >
        <div
          v-for="file in message.files"
          :key="file.id"
          class="chat-message__file-item"
        >
          <!-- TODO: 파일 아이콘 표시 -->
          📄 {{ file.name }}
        </div>
      </div>

      <!-- 타임스탬프 -->
      <div class="chat-message__timestamp">
        {{ formatTime(message.timestamp) }}
      </div>
    </div>

    <!-- ==================== 액션 버튼 ==================== -->
    <div class="chat-message__actions" v-if="message.role === 'ai'">
      <button
        class="chat-message__action-btn"
        title="복사"
        @click="$emit('action', { type: 'copy', messageId: index })"
      >
        📋
      </button>
      <button
        class="chat-message__action-btn"
        title="재생성"
        @click="$emit('action', { type: 'regenerate', messageId: index })"
      >
        🔄
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * ChatMessage.vue - 개별 메시지 컴포넌트
 *
 * Props:
 * - message: Object - 메시지 데이터
 *   {
 *     role: 'user' | 'ai' | 'error'
 *     content: string
 *     timestamp: Date
 *     files?: Array<{id, name, type}>
 *   }
 * - index: Number - 메시지 인덱스
 *
 * Emits:
 * - action: 메시지 액션 (복사, 재생성 등)
 */

import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

defineEmits(["action"]);

/* ==================== Computed ==================== */
const avatarUrl = computed(() => {
  if (props.message.role === "user") {
    return "👤"; // 또는 configStore.userAvatar
  } else if (props.message.role === "ai") {
    return "🤖";
  } else if (props.message.role === "error") {
    return "⚠️";
  }
});

/* ==================== 메서드 ==================== */
const formatTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;
@use "@/assets/styles/whole_animations.scss" as *;

/* ==================== 메시지 컨테이너 ==================== */
.chat-message {
  display: flex;
  gap: var.$spacing-3;
  padding: var.$spacing-2 0;
  animation: fadeInUp 0.3s ease-out;

  &--user {
    flex-direction: row-reverse;

    .chat-message__content {
      background-color: var(--primary-color);
      color: var.$white;
      border-radius: var.$border-radius-lg var.$border-radius-base
        var.$border-radius-base var.$border-radius-lg;
    }
  }

  &--ai {
    .chat-message__content {
      background-color: var.$gray-100;
      color: var.$text-primary;
      border-radius: var.$border-radius-base var.$border-radius-lg
        var.$border-radius-lg var.$border-radius-base;
    }
  }

  &--error {
    .chat-message__content {
      background-color: rgba(220, 38, 38, 0.1);
      color: #dc2626;
      border: 1px solid rgba(220, 38, 38, 0.3);
    }
  }

  &:hover .chat-message__actions {
    opacity: 1;
  }
}

/* ==================== Avatar ==================== */
.chat-message__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var.$gray-100;
  font-size: 1.5rem;
}

.chat-message__avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==================== 콘텐츠 ==================== */
.chat-message__content {
  display: flex;
  flex-direction: column;
  gap: var.$spacing-2;
  padding: var.$spacing-3 var.$spacing-4;
  border-radius: var.$border-radius-lg;
  max-width: 70%;
  word-break: break-word;
  transition: all 0.2s ease;
}

.chat-message__text {
  line-height: 1.5;
  font-size: var.$font-size-base;
}

/* ==================== 파일 ==================== */
.chat-message__files {
  display: flex;
  flex-direction: column;
  gap: var.$spacing-2;
  margin-top: var.$spacing-2;
  padding-top: var.$spacing-2;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.chat-message__file-item {
  padding: var.$spacing-2 var.$spacing-3;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var.$border-radius-base;
  font-size: var.$font-size-sm;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

/* ==================== 타임스탬프 ==================== */
.chat-message__timestamp {
  font-size: var.$font-size-xs;
  color: var.$text-muted;
  margin-top: var.$spacing-1;
}

/* ==================== 액션 버튼 ==================== */
.chat-message__actions {
  display: flex;
  gap: var.$spacing-2;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-message__action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: var.$spacing-1;
  border-radius: var.$border-radius-base;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
