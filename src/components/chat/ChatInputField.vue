<!-- src/components/chat/ChatInputField.vue -->
<template>
  <div class="chat-input-field">
    <!-- ==================== 메시지 표시 영역 ==================== -->
    <div class="message-display-area">
      <div class="message-text-area">
        <p class="message-text">{{ displayMessage }}</p>
      </div>
      <!-- 중앙: 우측 아이콘 그룹 (언어, 클립, 전송) -->
      <div class="action-icons-area">
        <div class="action-icons-group">
          <!-- 언어 아이콘 -->
          <button class="icon-button" title="언어 선택" @click="handleLanguage">
            🌐
          </button>

          <!-- 클립 아이콘 (파일 첨부) -->
          <button
            class="icon-button"
            :class="{ 'icon-button--has-file': attachedFiles.length > 0 }"
            title="파일 첨부"
            @click="triggerFileInput"
          >
            📎
          </button>

          <!-- 전송 버튼 (화살표) -->
          <button
            class="send-button"
            :disabled="!inputMessage.trim() && attachedFiles.length === 0"
            @click="sendMessage"
            title="전송"
          >
            >
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== 입력 필드 + 버튼 영역 ==================== -->
    <div class="input-bottom-section">
      <!-- 좌측: AI Agent 버튼 -->
      <button class="ai-agent-btn" @click="toggleAgentMenu">
        <span class="ai-agent-text">AI Agent</span>
      </button>

      <!-- 우측: 사용량 표시 -->
      <div class="usage-info">
        <span class="usage-label">{{ selectedAgent.modelName }}</span>
        <span class="usage-bar">
          <span class="usage-current">{{ selectedAgent.realUsageCount }}</span>
          <span class="usage-separator">/</span>
          <span class="usage-total">{{ selectedAgent.wholeUsageCount }}</span>
        </span>
      </div>
    </div>

    <!-- ==================== 숨겨진 입력 필드 ==================== -->
    <textarea
      v-model="inputMessage"
      class="hidden-textarea"
      placeholder="메시지 입력..."
      style="position: absolute; left: -9999px; visibility: hidden"
      @keydown.enter.prevent="handleEnter"
    />

    <!-- ==================== 숨겨진 파일 input ==================== -->
    <input
      ref="fileInputEl"
      type="file"
      multiple
      style="display: none"
      @change="handleFileSelect"
    />

    <!-- ==================== Agent 메뉴 (Teleport) ==================== -->
    <Teleport to="body">
      <div
        v-if="agentMenuVisible"
        class="agent-menu-overlay"
        @click="closeAgentMenu"
      />
      <div v-if="agentMenuVisible" class="agent-menu">
        <div v-for="agent in agentList" :key="agent.id" class="agent-menu-item">
          {{ agent.title }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
/**
 * ChatInputField.vue
 *
 * 채팅 입력 필드 컴포넌트
 *
 * 특징:
 * - 상단: 메시지 표시 영역
 * - 하단: 입력 컨트롤 (AI Agent 버튼, 아이콘 그룹, 사용량 표시)
 * - 메시지 입력은 보이지 않는 textarea에서 처리
 */

import { ref, computed, nextTick } from "vue";
import { useConfigStore } from "@/stores/configStore";

const configStore = useConfigStore();

/* ==================== Props ==================== */
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  attachedFiles: {
    type: Array,
    default: () => [],
  },
});

/* ==================== Emits ==================== */
const emit = defineEmits([
  "update:modelValue",
  "send",
  "attach-file",
  "remove-file",
]);

/* ==================== State ==================== */
const inputMessage = ref(props.modelValue || "");
const fileInputEl = ref(null);
const agentMenuVisible = ref(false);

const selectedAgent = ref({
  id: "1",
  modelName: "GPT-5",
  realUsageCount: "100",
  wholeUsageCount: "100",
});

const agentList = computed(() => configStore.aiModels || []);

/* ==================== Computed ==================== */
const displayMessage = computed(() => {
  return inputMessage.value || "무엇이든 물어보세요.";
});

/* ==================== Methods ==================== */

/**
 * handleEnter
 *
 * Enter 키: 메시지 전송
 * Shift+Enter: 줄바꿈 (기본 동작)
 */
const handleEnter = (e) => {
  if (e.shiftKey) {
    // Shift+Enter는 줄바꿈 (기본 동작)
    return;
  }

  // Enter만 누르면 전송
  e.preventDefault();
  if (inputMessage.value.trim() || props.attachedFiles.length > 0) {
    sendMessage();
  }
};

/**
 * sendMessage
 *
 * 메시지 전송 처리
 */
const sendMessage = () => {
  if (!inputMessage.value.trim() && props.attachedFiles.length === 0) {
    return;
  }

  emit("send", {
    message: inputMessage.value,
    files: props.attachedFiles,
  });

  inputMessage.value = "";
  emit("update:modelValue", "");
};

/**
 * triggerFileInput
 *
 * 파일 input 트리거
 */
const triggerFileInput = () => {
  fileInputEl.value?.click();
};

/**
 * handleFileSelect
 *
 * 파일 선택 처리
 */
const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 0) {
    emit("attach-file", files);
  }
  // input 초기화 (같은 파일 재선택 가능하게)
  e.target.value = "";
};

/**
 * handleLanguage
 *
 * 언어 선택 (TODO)
 */
const handleLanguage = () => {
  console.log("🌐 언어 선택");
};

/**
 * toggleAgentMenu
 *
 * AI Agent 메뉴 토글
 */
const toggleAgentMenu = () => {
  agentMenuVisible.value = !agentMenuVisible.value;
};

const closeAgentMenu = () => {
  agentMenuVisible.value = false;
};

/* ==================== Watch ==================== */
// props.modelValue 변경 시 동기화
import { watch } from "vue";

watch(
  () => props.modelValue,
  (newVal) => {
    inputMessage.value = newVal;
  }
);
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;
@use "@/assets/styles/whole_animations.scss" as *;

/* ==================== 전체 컨테이너 ==================== */
.chat-input-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var.$spacing-3;
  padding: var.$spacing-4;
  background-color: rgb(247, 239, 239);
  border-radius: var.$border-radius-xl;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.4s ease-out;
}

/* ==================== 메시지 표시 영역 ==================== */
.message-display-area {
  width: 100%;
  min-height: 175px;
  align-items: flex-end;
  padding: var.$spacing-3 var.$spacing-4;
  background-color: #f8f9fa;
  border-radius: var.$border-radius-lg;
  animation: fadeIn 0.3s ease-out;
}
.message-text-area {
  min-height: 100px;
  .message-text {
    margin: 0;
    font-size: var.$font-size-base;
    line-height: 1.6;
    color: var.$text-primary;
    word-break: break-word;
  }
}

/* ==================== 입력 필드 하단 섹션 ==================== */
.input-bottom-section {
  display: flex;
  gap: var.$spacing-1;
  justify-content: space-between;
}

/* ==================== AI Agent 버튼 ==================== */
.ai-agent-btn {
  display: flex;
  align-items: center;
  gap: var.$spacing-2;
  padding: var.$spacing-2 var.$spacing-4;
  border: 2px solid var(--primary-color);
  border-radius: var.$border-radius-full;
  background-color: transparent;
  color: var(--primary-color);
  cursor: pointer;
  font-size: var.$font-size-sm;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;

  &:hover {
    background-color: var(--primary-color);
    color: var.$white;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(208, 2, 27, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
}

.ai-agent-icon {
  font-size: 1rem;
}

.ai-agent-text {
  font-size: var.$font-size-sm;
}

/* ==================== 우측 아이콘 그룹 ==================== */
.action-icons-area {
  display: flex;
  justify-content: flex-end; // 🔥 오른쪽 정렬
  width: 100%; // 필요 시

  .action-icons-group {
    display: flex;
    gap: var.$spacing-2;
  }
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: var.$spacing-2;
  border-radius: var.$border-radius-base;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var.$gray-100;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &--has-file {
    color: var(--primary-color, #d0021b);
    animation: pulse 2s ease-in-out infinite;
  }
}

/* ==================== 전송 버튼 ==================== */
.send-button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  color: var.$black;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(208, 2, 27, 0.2);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: scale(1.12);
    box-shadow: 0 6px 16px rgba(208, 2, 27, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* ==================== 사용량 정보 ==================== */
.usage-info {
  display: flex;
  align-items: center;
  gap: var.$spacing-2;
  padding: 0 var.$spacing-3;
  flex-shrink: 0;
}

.usage-label {
  font-size: var.$font-size-sm;
  color: var.$text-muted;
  font-weight: 500;
}

.usage-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: var.$font-size-sm;
  color: var.$text-muted;
}

.usage-current {
  font-weight: 600;
  color: var(--primary-color, #d0021b);
}

.usage-separator {
  color: var.$gray-400;
}

.usage-total {
  font-weight: 600;
  color: var.$text-secondary;
}

/* ==================== Agent 메뉴 (Teleport) ==================== */
.agent-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.agent-menu {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var.$bg-primary;
  border: 1px solid var.$gray-200;
  border-radius: var.$border-radius-lg;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: var.$spacing-3 0;
  z-index: 1000;
  min-width: 250px;
  max-height: 400px;
  overflow-y: auto;
  animation: scaleIn 0.2s ease-out;
}

.agent-menu-item {
  padding: var.$spacing-3 var.$spacing-4;
  cursor: pointer;
  font-size: var.$font-size-sm;
  color: var.$text-primary;
  transition: all 0.2s ease;

  &:hover {
    background-color: var.$gray-50;
    padding-left: calc(var.$spacing-4 + var.$spacing-2);
  }

  &:active {
    background-color: var.$gray-100;
  }
}

/* ==================== Hidden Textarea ==================== */
.hidden-textarea {
  position: absolute;
  left: -9999px;
  visibility: hidden;
}
</style>
