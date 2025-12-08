// src/components/chat/composables/useChatLogic.js

/**
 * useChatLogic.js - 채팅 로직 Composable
 *
 * Vue3 Composable이란?
 * ====================
 * - 함수형으로 재사용 가능한 로직을 캡슐화
 * - 상태(ref), 계산(computed), 메서드를 하나로 묶음
 * - 여러 컴포넌트에서 같은 로직 공유 가능
 *
 * Vue2와의 비교:
 * - Vue2: Mixin (로직 혼합, 네이밍 충돌 위험)
 * - Vue3: Composable (명시적, 타입 안전, 재사용성 높음)
 *
 * 사용 예시:
 * const { messages, sendMessage } = useChatLogic()
 */

import { ref, computed } from "vue";

export function useChatLogic() {
  // ==================== State ====================

  /**
   * messages: 채팅 메시지 배열
   *
   * 메시지 구조:
   * {
   *   id: string (자동 생성)
   *   role: 'user' | 'ai' | 'error'
   *   content: string
   *   timestamp: Date
   *   files?: Array<{id, name, size, type}>
   *   metadata?: Object (agentId, modelUsage 등)
   * }
   */
  const messages = ref([]);

  /**
   * inputMessage: 현재 입력 중인 메시지
   */
  const inputMessage = ref("");

  /**
   * isLoading: AI 응답 대기 중 여부
   */
  const isLoading = ref(false);

  /**
   * attachedFiles: 첨부된 파일들
   */
  const attachedFiles = ref([]);

  /**
   * selectedAgent: 선택된 AI Agent
   */
  const selectedAgent = ref({
    id: "1",
    modelName: "GPT-5",
    title: "복잡한 분석",
  });

  /**
   * chatHistory: 서버 저장용 채팅 히스토리
   * TODO: 서버에 저장되면 구조 재조정
   */
  const chatHistory = ref([]);

  // ==================== Computed ====================

  const messageCount = computed(() => messages.value.length);

  const lastMessage = computed(() => {
    return messages.value[messages.value.length - 1] || null;
  });

  // ==================== Methods ====================

  /**
   * addMessage
   *
   * 새 메시지를 메시지 배열에 추가
   *
   * @param {string} content - 메시지 내용
   * @param {string} role - 역할 ('user' | 'ai' | 'error')
   * @param {Array} files - 첨부 파일 (선택사항)
   * @param {Object} metadata - 메타데이터 (선택사항)
   */
  const addMessage = (content, role = "user", files = [], metadata = {}) => {
    if (!content && files.length === 0) {
      console.warn("⚠️ 메시지 또는 파일이 필요합니다");
      return;
    }

    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      files: files.length > 0 ? files : undefined,
      metadata,
    };

    messages.value.push(message);

    console.log(`✅ 메시지 추가 [${role}]:`, content.substring(0, 50) + "...");

    return message;
  };

  /**
   * sendMessage
   *
   * 서버에 메시지 전송
   *
   * @param {string} message - 메시지 내용
   * @param {Array} files - 첨부 파일
   * @returns {Promise<Object>} 서버 응답
   *
   * TODO: 실제 API 호출로 교체
   *
   * API 구조:
   * POST /api/chat/send
   * {
   *   message: string
   *   agentId: string
   *   files?: FormData (multipart)
   *   sessionId?: string (for conversation context)
   * }
   *
   * Response:
   * {
   *   success: boolean
   *   response: string (AI 응답)
   *   metadata: {
   *     modelUsed: string
   *     tokenUsage: number
   *     processingTime: number
   *   }
   * }
   */
  const sendMessage = async (message, files = []) => {
    isLoading.value = true;

    try {
      console.log("📤 메시지 전송 중...");
      console.log("Message:", message);
      console.log("Agent:", selectedAgent.value);
      console.log("Files:", files);

      // ============================================================
      // TODO: 실제 API 호출
      // ============================================================
      // const formData = new FormData()
      // formData.append('message', message)
      // formData.append('agentId', selectedAgent.value.id)
      // files.forEach(file => formData.append('files', file))
      //
      // const response = await fetch('/api/chat/send', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${authToken}`
      //   }
      // })
      //
      // const data = await response.json()
      // if (!response.ok) throw new Error(data.message)
      //
      // return data
      // ============================================================

      // Mock 응답 (실제 API 없을 때)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResponse = {
        success: true,
        response:
          "이것은 Mock AI 응답입니다. 실제 서버 API가 연동되면 교체되었습니다.",
        metadata: {
          modelUsed: selectedAgent.value.modelName,
          tokenUsage: 150,
          processingTime: 1500,
        },
      };

      console.log("✅ 응답 수신:", mockResponse);
      return mockResponse;
    } catch (error) {
      console.error("❌ 메시지 전송 실패:", error);
      addMessage(`오류 발생: ${error.message}`, "error");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * clearMessages
   *
   * 모든 메시지 삭제
   */
  const clearMessages = () => {
    messages.value = [];
    console.log("🗑️ 모든 메시지 삭제됨");
  };

  /**
   * deleteMessage
   *
   * 특정 메시지 삭제
   *
   * @param {string} messageId - 삭제할 메시지 ID
   */
  const deleteMessage = (messageId) => {
    const index = messages.value.findIndex((m) => m.id === messageId);
    if (index > -1) {
      messages.value.splice(index, 1);
      console.log("🗑️ 메시지 삭제:", messageId);
    }
  };

  /**
   * updateMessage
   *
   * 특정 메시지 수정
   *
   * @param {string} messageId - 메시지 ID
   * @param {Object} updates - 수정 사항
   */
  const updateMessage = (messageId, updates) => {
    const message = messages.value.find((m) => m.id === messageId);
    if (message) {
      Object.assign(message, updates);
      console.log("✏️ 메시지 수정:", messageId);
    }
  };

  /**
   * regenerateMessage
   *
   * AI 메시지 재생성
   * 마지막 사용자 메시지를 기반으로 새로운 AI 응답 생성
   *
   * TODO: 구현
   *
   * @param {string} messageId - 재생성할 메시지 ID
   */
  const regenerateMessage = async (messageId) => {
    console.log("🔄 메시지 재생성:", messageId);
    // TODO: 구현
  };

  /**
   * exportChat
   *
   * 채팅 내용 내보내기 (PDF, TXT 등)
   *
   * TODO: 구현
   */
  const exportChat = (format = "txt") => {
    console.log(`📥 채팅 내보내기 (${format}):`, messages.value);
    // TODO: 구현
  };

  // ==================== 반환 ====================
  return {
    // State
    messages,
    inputMessage,
    isLoading,
    attachedFiles,
    selectedAgent,
    chatHistory,

    // Computed
    messageCount,
    lastMessage,

    // Methods
    addMessage,
    sendMessage,
    clearMessages,
    deleteMessage,
    updateMessage,
    regenerateMessage,
    exportChat,
  };
}
