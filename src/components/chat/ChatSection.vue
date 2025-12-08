<!-- src/components/chat/ChatSection.vue -->
<template>
  <section class="chat-section">
    <!-- ==================== 메시지 영역 ==================== -->
    <ChatMessagesArea
      :messages="messages"
      :is-loading="isLoading"
      @scroll-to-bottom="scrollToBottom"
    />

    <!-- ==================== 입력 영역 ==================== -->
    <div class="chat-input-wrapper">
      <!-- AI Agent 선택기 -->
      <AgentSelector
        :current-agent="selectedAgent"
        :ai-agents="configStore.aiAgentCards"
        @agent-change="handleAgentChange"
      />

      <!-- 메시지 입력 필드 -->
      <ChatInputField
        v-model="inputMessage"
        :is-loading="isLoading"
        :attached-files="attachedFiles"
        @send="handleSendMessage"
        @attach-file="handleAttachFile"
        @remove-file="handleRemoveFile"
        @context-menu="showContextMenu"
      />

      <!-- 우클릭 컨텍스트 메뉴 -->
      <ChatInputContextMenu
        v-if="contextMenu.isVisible"
        :position="contextMenu.position"
        :has-files="attachedFiles.length > 0"
        @insert-agent="handleInsertAgent"
        @attach-file="triggerFileInput"
        @close="closeContextMenu"
      />
    </div>
  </section>
</template>

<script setup>
/**
 * ChatSection.vue - 채팅 섹션 메인 컴포넌트
 *
 * 역할:
 * - 전체 채팅 UI 통합 관리
 * - 자식 컴포넌트 데이터 흐름 조율
 * - 메시지 송수신 로직 처리
 *
 * Vue3 Composition API 특징:
 * ========================
 * Vue2 (Options API):
 * - data(), methods(), computed(), watch() 등이 분리됨
 * - 큰 컴포넌트에서 로직이 산재됨
 *
 * Vue3 (Composition API):
 * - ref(), computed(), watch() 등을 함수형으로 조합
 * - 관련 로직이 한곳에 모임 (더 읽기 쉬움)
 * - 재사용 가능한 Composable 패턴 제공
 */

import { ref, computed, onMounted, nextTick } from "vue";
import { useConfigStore } from "@/stores/configStore";
import { useChatLogic } from "@/components/chat/composables/useChatLogic";

import ChatMessagesArea from "./ChatMessagesArea.vue";
import ChatInputField from "./ChatInputField.vue";
import ChatInputContextMenu from "./ChatInputContextMenu.vue";
import AgentSelector from "./AgentSelector.vue";

/* ==================== Pinia Store 연동 ==================== */
const configStore = useConfigStore();

/* ==================== Composable에서 로직 추출 ==================== */
/**
 * useChatLogic Composable
 *
 * 반환 값:
 * - messages: ref - 채팅 메시지 배열
 * - inputMessage: ref - 입력 중인 메시지
 * - isLoading: ref - AI 응답 대기 중 여부
 * - attachedFiles: ref - 첨부된 파일들
 * - selectedAgent: ref - 선택된 AI Agent
 * - sendMessage(message, files): 메시지 전송
 * - addMessage(content, role): 메시지 추가
 * - clearMessages(): 메시지 초기화
 */
const {
  messages,
  inputMessage,
  isLoading,
  attachedFiles,
  selectedAgent,
  sendMessage,
  addMessage,
  clearMessages,
} = useChatLogic();

/* ==================== 컨텍스트 메뉴 상태 ==================== */
const contextMenu = ref({
  isVisible: false,
  position: { top: "0px", left: "0px" },
});

/* ==================== 메서드 ==================== */

/**
 * handleSendMessage
 *
 * 동작:
 * 1. 입력값 검증 (공백 제거)
 * 2. 사용자 메시지 추가
 * 3. 서버 API 호출
 * 4. AI 응답 메시지 추가
 * 5. 입력 필드 초기화
 *
 * TODO: 서버 API 연동
 * - POST /api/chat/send
 * - Request: { message, agentId, files }
 * - Response: { response, metadata }
 */
const handleSendMessage = async () => {
  const trimmedMessage = inputMessage.value.trim();

  if (!trimmedMessage && attachedFiles.value.length === 0) {
    console.warn("⚠️ 메시지 또는 파일이 없습니다");
    return;
  }

  try {
    // 사용자 메시지 추가
    addMessage(trimmedMessage, "user", attachedFiles.value);

    // 입력 초기화
    inputMessage.value = "";

    // 서버에 메시지 전송
    // TODO: API 호출 구현
    await sendMessage(trimmedMessage, attachedFiles.value);

    // AI 응답 추가 (Mock)
    // TODO: 실제 서버 응답으로 교체
    const mockResponse = "안녕하세요! 어떻게 도와드릴까요?";
    addMessage(mockResponse, "ai");

    // 자동 스크롤 (다음 업데이트 후)
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("❌ 메시지 전송 실패:", error);
    addMessage("죄송합니다. 메시지 전송에 실패했습니다.", "error");
  }
};

/**
 * handleAttachFile
 *
 * TODO: 파일 첨부 로직
 * - 파일 유효성 검사 (크기, 형식)
 * - 첨부파일 목록에 추가
 * - 미리보기 생성
 */
const handleAttachFile = (files) => {
  console.log("📎 파일 첨부:", files);
  // TODO: 구현
};

/**
 * handleRemoveFile
 *
 * TODO: 파일 제거 로직
 */
const handleRemoveFile = (fileId) => {
  console.log("🗑️ 파일 제거:", fileId);
  // TODO: 구현
};

/**
 * handleAgentChange
 *
 * TODO: AI Agent 변경 로직
 */
const handleAgentChange = (agent) => {
  console.log("🤖 AI Agent 변경:", agent);
  // TODO: 구현
};

/**
 * showContextMenu
 *
 * 우클릭 시 컨텍스트 메뉴 표시
 */
const showContextMenu = (event) => {
  event.preventDefault();
  contextMenu.value = {
    isVisible: true,
    position: {
      top: `${event.pageY}px`,
      left: `${event.pageX}px`,
    },
  };
};

const closeContextMenu = () => {
  contextMenu.value.isVisible = false;
};

const handleInsertAgent = (agentId) => {
  console.log("➕ Agent 추가:", agentId);
  closeContextMenu();
  // TODO: 구현
};

const triggerFileInput = () => {
  console.log("📁 파일 선택");
  closeContextMenu();
  // TODO: 파일 input 트리거
};

const scrollToBottom = () => {
  console.log("⬇️ 메시지 영역 하단 스크롤");
  // TODO: 구현
};

/* ==================== 라이프사이클 ==================== */
onMounted(() => {
  console.log("✅ ChatSection 마운트됨");
  // 초기 환영 메시지
  addMessage("안녕하세요! 어떤 도움이 필요하신가요?", "ai");
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;
@use "@/assets/styles/whole_animations.scss" as *;

/* ==================== 채팅 섹션 전체 ==================== */
.chat-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var.$bg-primary;
  border-radius: var.$border-radius-lg;
  overflow: hidden;
  box-shadow: var.$shadow-base;
  animation: fadeIn 0.4s ease-out;
}

/* ==================== 입력 영역 래퍼 ==================== */
.chat-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var.$spacing-3;
  padding: var.$spacing-4;
  border-top: 1px solid var.$gray-200;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: relative;
}
</style>
