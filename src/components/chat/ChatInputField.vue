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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle
                cx="10"
                cy="10"
                r="7.25"
                :stroke="
                  isOpenAIWebSearchMode
                    ? configStore.mainColorHexCode
                    : '#6B7280'
                "
                stroke-width="1.5"
              />
              <line
                x1="3"
                y1="9.75"
                x2="17"
                y2="9.75"
                :stroke="
                  isOpenAIWebSearchMode
                    ? configStore.mainColorHexCode
                    : '#6B7280'
                "
                stroke-width="1.5"
              />
              <path
                d="M9.7735 3L9.41369 3.55793C6.75234 7.6847 6.89519 13.0215 9.7735 17V17"
                :stroke="
                  isOpenAIWebSearchMode
                    ? configStore.mainColorHexCode
                    : '#6B7280'
                "
                stroke-width="1.5"
              />
              <path
                d="M10.7265 3L11.0694 3.59398C13.4819 7.77244 13.3494 12.9503 10.7265 17V17"
                :stroke="
                  isOpenAIWebSearchMode
                    ? configStore.mainColorHexCode
                    : '#6B7280'
                "
                stroke-width="1.5"
              />
            </svg>
          </button>

          <!-- 클립 아이콘 (파일 첨부) -->
          <button
            class="icon-button"
            :class="{ 'icon-button--has-file': attachedFiles.length > 0 }"
            title="파일 첨부"
            @click="triggerFileInput"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 12.6667V7C5 4.23858 7.23858 2 10 2V2C12.7614 2 15 4.23858 15 7V14.6667C15 16.5076 13.5076 18 11.6667 18V18C9.82572 18 8.33333 16.5076 8.33333 14.6667V7.22222C8.33333 6.30175 9.07953 5.55556 10 5.55556V5.55556C10.9205 5.55556 11.6667 6.30175 11.6667 7.22222V14.4444"
                :stroke="
                  isFileUploadMode ? configStore.mainColorHexCode : '#6B7280'
                "
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <!-- 전송 버튼 (화살표) -->
          <button class="send-button" @click="sendMessage" title="전송">
            <CommonIcon :src="whiteArrow" :size="35" />
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== 버튼 영역 ==================== -->
    <div class="input-bottom-section">
      <!-- 좌측: AI Agent 버튼 -->
      <!-- :style="gradientObject" -->
      <button class="ai-agent-btn" @click="toggleAgentMenu">
        <span class="ai-agent-btn__text">
          <CommonIcon
            class="white-bright-icon"
            :src="aiAgentBrightIcon"
            :size="16"
            alt="AI agent 불빛 아이콘"
          />
          AI Agent</span
        >
      </button>

      <div class="ai-model-info no-drag">
        <div class="ai-model-info__label">
          <!--
          <span class="ai-model-info__label__text">{{
            selectedAgent.modelName
          }}</span> -->
          <!-- 커스텀 드롭다운 (위로 펼쳐짐) -->

          <div
            class="model-badge"
            :class="{ 'model-badge__hidden': isOpenAIWebSearchMode }"
            @click="toggleModelDropdown"
          >
            <AIModelLabel
              class="ai-model-info__label__image"
              :modelName="selectedModel"
              :size="18"
            />
            <span class="model-text">{{ selectedModel }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              :class="{ 'rotate-180': isModelDropdownOpen }"
              class="dropdown-arrow"
            >
              <path
                d="M4 6L7 9L10 6"
                stroke="#000000"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div v-if="isModelDropdownOpen" class="custom-dropdown" @click.stop>
              <div
                v-for="model in modelOptions"
                :key="model.value"
                class="dropdown-option"
                :class="{ selected: selectedModel === model.label }"
                @click="selectModel(model.label)"
              >
                <div class="option-text">
                  <AIModelLabel
                    class="option-text__icon"
                    :modelName="model.label"
                    :size="14"
                  />
                  <span class="option-text__title">{{ model.label }}</span>
                  &nbsp;
                  <template v-if="model.label !== '모델선택'">
                    <span class="current">{{
                      chatUsageCount.realUsageCount
                    }}</span>
                    <span class="separator">/</span>
                    <span class="total">{{
                      chatUsageCount.wholeUsageCount
                    }}</span></template
                  ><br />
                  <span class="option-text__explain">{{ model.explain }}</span>
                </div>

                <svg
                  v-if="selectedModel === model.label"
                  class="check-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M13.5 4.5L6 12L2.5 8.5"
                    :stroke="configStore.mainColorHexCode"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <span class="ai-model-info__usage">
          <span class="current">{{ chatUsageCount.realUsageCount }}</span>
          <span class="separator">/</span>
          <span class="total">{{ chatUsageCount.wholeUsageCount }}</span>
        </span>
      </div>
    </div>

    <!-- ==================== 숨겨진 파일 input ==================== -->
    <input
      ref="fileInputEl"
      type="file"
      multiple
      style="display: none"
      @change="handleFileSelect"
    />

    <!-- ==================== Agent Context Menu (Teleport) ==================== -->
    <Teleport to="body">
      <div
        v-if="agentMenuVisible"
        class="agent-menu-overlay"
        @click="closeAgentMenu"
      />
      <div v-if="agentMenuVisible" class="agent-menu">
        <div
          v-for="agent in aiAgentList"
          :key="agent.id"
          class="agent-menu__contents"
        >
          <span>{{ agent.title }}</span>
          <span>{{ agent.explain }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
/**
 * ChatInputField.vue
 */

import { ref, computed, onMounted } from "vue";
import { useConfigStore } from "@/stores/configStore";
import CommonIcon from "@/components/icon/CommonIcon.vue";
import { useGradient } from "@/composables/useGradient.js";
import aiAgentBrightIcon from "@/assets/images/icon/ai_agent_bright.png";
import whiteArrow from "@/assets/images/icon/send_button_white_arrow.png";
import aiModelIcon from "@/components/chat/AIModelLabel.vue";
const configStore = useConfigStore();

const isOpenAIWebSearchMode = ref(false);
const isFileUploadMode = ref(false);
const isModelDropdownOpen = ref(false);
const selectedModel = ref("모델선택");

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

const chatUsageCount = ref({
  realUsageCount: "100",
  wholeUsageCount: "100",
});

const aiAgentList = computed(() => [
  {
    id: "1",
    title: "사규AI",
    explain: "사내규정집 기반으로 학습한 AI agent",
  },
  {
    id: "2",
    title: "OnboardingAI",
    explain: "신입사원을 위한 온보딩 agent",
  },
]);

const modelOptions = ref([
  { value: "모델선택", label: "모델선택", explain: "" },
  {
    value: "gpt-5o",
    label: "GPT-5",
    explain: `빠른 속도와 안정적인 품질을 제공하는 모델`,
  },
  {
    value: "gpt-41",
    label: "GPT-4.1",
    explain: "빠른 속도와 안정적인 품질을 제공하는 모델",
  },
  {
    value: "gpt-4o",
    label: "GPT-4",
    explain: "표준 업무, 반복 작업, 신뢰성 높은 모델",
  },
  {
    value: "claude3",
    label: "Sonnet4.5",
    explain: "높은 언어 이해로 일상적인 작업에 좋은 모델",
  },
]);

/* ==================== Computed ==================== */
const displayMessage = computed(() => {
  return inputMessage.value || "무엇이든 물어보세요.";
});

/* ==================== Methods ==================== */

/**
 * handleEnter
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
 * 파일 input 트리거
 */
const triggerFileInput = () => {
  fileInputEl.value?.click();
  if (isFileUploadMode.value) isFileUploadMode.value = false;
  else isFileUploadMode.value = true;
};

/**
 * handleFileSelect
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

/**
 * 모델 드롭다운 관련
 */
const toggleModelDropdown = () => {
  isModelDropdownOpen.value = !isModelDropdownOpen.value;
};

const selectModel = (modelLabel) => {
  selectedModel.value = modelLabel;
  isModelDropdownOpen.value = false;
  console.log("선택된 모델:", modelLabel);
};

/* ==================== Watch ==================== */
// props.modelValue 변경 시 동기화
import { watch } from "vue";
import AIModelLabel from "./AIModelLabel.vue";

watch(
  () => props.modelValue,
  (newVal) => {
    inputMessage.value = newVal;
  }
);

onMounted(() => {
  /**
   * 문서 클릭 이벤트 리스너
   *
   * Vue2 vs Vue3:
   * - Vue2: this.$el을 사용하여 컴포넌트 요소 참조
   * - Vue3: 직접 DOM 요소에 이벤트 바인딩 가능하지만,
   *         전역 document 리스너는 여전히 필요함
   */
  // 🎯 드롭다운 관련 요소들을 클릭한 경우 무시
  const handleDocumentClick = (event) => {
    const clickedElement = event.target;
    const isInsideModelBadge = clickedElement.closest(".model-badge");
    const isInsideCustomDropdown = clickedElement.closest(".custom-dropdown");

    // 이 영역을 클릭하면 드롭다운을 닫지 않음
    if (!isInsideModelBadge && !isInsideCustomDropdown) {
      isModelDropdownOpen.value = false;
    }
  };

  document.addEventListener("click", handleDocumentClick);

  // ✅ Vue3 Composition API: onUnmounted에서 리스너 제거
  // 메모리 누수 방지!
  return () => {
    document.removeEventListener("click", handleDocumentClick);
  };
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as *;
@use "@/assets/styles/whole_animations.scss" as *;

/* ==================== 채팅 입력 필드 ==================== */
.chat-input-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  padding: $spacing-4;
  border-radius: $border-radius-xl;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.08); /* 먼 그림자 */
  animation: fadeInUp 0.4s ease-out;
  /* ==================== 메시지 표시 영역 ==================== */
  .message-display-area {
    width: 100%;
    min-height: 175px;
    align-items: flex-end;
    padding: $spacing-4 $spacing-6;
    background-color: $white;
    border-radius: $border-radius-lg;
    animation: fadeIn 0.3s ease-out;
    border: 1px solid var(--main-color);
    .message-text-area {
      min-height: 100px;
      .message-text {
        margin: 0;
        font-size: $font-size-base;
        line-height: 1.6;
        color: $primary-text;
        word-break: break-word;
      }
    }
    .ai-agent-text {
      font-size: $font-size-sm;
    }
  }
}

/* ==================== 입력 필드 하단 섹션 ==================== */
.input-bottom-section {
  display: flex;
  gap: $spacing-1;
  justify-content: space-between;
}

/* ==================== AI Agent 버튼 ==================== */
.ai-agent-btn {
  display: flex;
  width: 127px;
  height: 32px;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-2 $spacing-4;
  border: 1px solid var(--primary-color);
  border-radius: $border-radius-full;
  cursor: pointer;
  font-size: $font-size-sm;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
  background: none;
  background-color: var(--primary-color) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.08); /* 먼 그림자 */
  &__text {
    //
  }
  color: $white;
  &:hover {
    transform: scale(1.1);
    .white-bright-icon {
      transform: rotate(-80deg);
    }
  }
  &:active {
    transform: scale(0.98);
  }
}
.ai-agent-icon {
  font-size: 1rem;
}

/* ==================== 우측 아이콘 그룹 ==================== */
.action-icons-area {
  display: flex;
  justify-content: flex-end; // 🔥 오른쪽 정렬
  width: 100%; // 필요 시
  .action-icons-group {
    display: flex;
    gap: $spacing-2;
    .icon-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      padding: $spacing-1;
      border-radius: $border-radius-base;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: $gray-100;
        transform: scale(1.1);
      }
      &:active {
        transform: scale(0.95);
      }

      &--has-file {
        color: var(--primary-color, var(--primary-color));
        animation: pulse 2s ease-in-out infinite;
      }
    }
  }
}

/* ==================== 전송 버튼 ==================== */
.send-button {
  width: 40px;
  height: 45px;
  border-radius: 60%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
  background-color: var(--primary-color);

  &:hover:not(:disabled) {
    transform: scale(1.2);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* ==================== 모델 뱃지 ===================== */
/* 기존 모델 배지 스타일 복원 */
.model-badge {
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: 8px;
  padding: 6px 10px;
  height: 32px;
  cursor: pointer;
  position: relative;

  &__hidden {
    display: none;
  }
}

.model-text {
  color: $black;
  text-align: center;
  leading-trim: both;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.13px;
}

/* 🎯 드롭다운 화살표 회전 애니메이션 */
.dropdown-arrow {
  transition: transform 0.3s ease;

  &.rotate-180 {
    transform: rotate(180deg);
  }
}

/* 🌟 예쁜 커스텀 드롭다운 (위로 펼쳐짐) */
.custom-dropdown {
  position: absolute;
  bottom: 100%;
  left: -8px;
  right: -8px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid $gray-200;
  border-radius: 12px;
  z-index: 1000;
  overflow: hidden;
  animation: dropdownSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
  min-width: 250px;
}

@keyframes dropdownSlideUp {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 🎨 드롭다운 옵션들 */
.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 500;
  border-bottom: 1px solid rgba(37, 99, 235, 0.1);
  background: white;
  &:last-child {
    border-bottom: none;
  }

  .option-text {
    &__icon {
      margin-right: 2px;
    }
    &__title {
      font-size: 17px;
    }
    &__explain {
      white-space: pre-line;
      font-size: 10px;
    }
  }

  &:hover {
    background: linear-gradient(
      135deg,
      var(--primary-hover-color) 0%,
      $white 100%
    );
    .option-text {
    }
  }

  &.selected {
    background: var(--primary-hover-color);
    .option-text {
    }
  }
}

.option-text {
  color: #1f2937;
  transition: all 0.2s ease;
}

/* ✅ 체크 아이콘 */
.check-icon {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;

  .dropdown-option.selected & {
    opacity: 1;
    transform: scale(1);
  }
}

/* ==================== 사용량 정보 ==================== */
.ai-model-info {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  padding: 0 $spacing-3;
  flex-shrink: 0;
  &__label {
    display: flex;
    align-items: center;
    font-size: $font-size-sm;
    font-weight: 500;
    margin-right: 10px;
    &__image {
      margin-right: 2.5px;
    }
    &__text {
      display: flex;
      align-items: center;
    }
  }
  &__usage {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: $font-size-sm;
    color: $secondary-text;
    .current {
      font-weight: 600;
      color: var(--primary-color);
    }
    .separator {
      color: $gray-400;
    }
    .total {
      font-weight: 600;
      color: $secondary-text;
    }
  }
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
  top: 840px;
  left: 575px;
  background-color: $white;
  border: 1px solid $gray-200;
  border-radius: $border-radius-lg;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: $spacing-3 0;
  z-index: 1000;
  min-width: 250px;
  max-height: 400px;
  overflow-y: auto;
  transform: translate(-50%, -50%);
}

.agent-menu {
  padding: $spacing-3 $spacing-4;
  cursor: pointer;
  font-size: $font-size-sm;
  color: $primary-text !important;
  transition: all 0.2s ease;
  &__contents {
    &:hover {
      background-color: $gray-50;
      padding-left: calc($spacing-4 + $spacing-2);
    }

    &:active {
      background-color: $gray-100;
    }
  }
}

/* ==================== Hidden Textarea ==================== */
.hidden-textarea {
  position: absolute;
  left: -9999px;
  visibility: hidden;
}
</style>
