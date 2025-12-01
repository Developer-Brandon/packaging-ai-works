/**
 * src/utils/constants.js
 *
 * 프로젝트 전체에서 사용되는 상수들을 중앙에서 관리합니다.
 *
 * 장점:
 * 1. 매직 넘버/문자열 제거 (코드 가독성 향상)
 * 2. 추후 서버로 마이그레이션 시 API 주소 한 곳만 수정
 * 3. 설정 관리 용이
 *
 * 사용 예시:
 * import { API_BASE_URL, AGENT_TYPES } from '@/utils/constants'
 *
 * fetch(`${API_BASE_URL}/${AGENT_TYPES.GPT5}`)
 */

/* ==================== 1.API 설정 및 API 엔드포인트 ==================== */

/**
 * /**
 * 1-(1).API 기본 주소
 *
 * 추후 서버 구축 후 변경:
 * http://localhost:5173 (개발)
 * https://api.example.com (프로덕션)
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5173";

/**
 * 1-(2).API 엔드포인트
 *
 * 서버 API 구조:
 * - /api/chat/send - 메시지 전송
 * - /api/agents - AI Agent 목록
 * - /api/agents/{id} - 특정 Agent 정보
 */
export const API_ENDPOINTS = {
  // 채팅
  CHAT_SEND: "/api/chat/send",
  CHAT_HISTORY: "/api/chat/history",
  // AI 에이전트
  AGENTS: "/api/agents",
  AGENT_DETAIL: "/api/agents/:id",
  // 사용자 (인증은 SSO로 처리될 예정),
  USER_PROFILE: "/api/user/profile",
  // 이미지/콘텐츠(서버에서 제공)
  IMAGES: "/api/images",
  CONTENT: "/api/content",
};

/* ==================== 2.AI Agent 타입 ==================== */

/**
 * 2-(1).지원하는 AI Agent 모델들
 */
export const AGENT_TYPES = {
  GPT_5: "GTP-5",
  GPT_4_1: "GTP-4.1",
  GPT_4: "GTP-4",
  SONNET_4_5: "Sonnet-4.5",
};

/**
 * 2-(2).Agent별 설명
 */
export const AGENT_DESCRIPTIONS = {
  "GPT-5": "복잡한 분석, 고난이도 작업에 유리한 모델",
  "Sonnet 4.5": "높은 언어 이해로 일상적인 작업에 좋은 모델",
  "GPT-4.1": "빠른 속도와 안정적인 품질을 제공하는 모델",
  "GPT-4": "표준 업무, 반복 작업, 신뢰성 높은 모델",
};

/* ==================== 3.메시지 타입 ==================== */

/**
 * 3-(1).채팅 메시지 타입
 */
export const MESSAGE_TYPES = {
  USER: "user", // 사용자 메시지
  ASSISTANT: "assistant", // AI 응답
  SYSTEM: "system", // 시스템 메시지
};

/* ==================== 4.상태 메시지 ==================== */

/**
 * 4-(1).사용자에게 보여줄 메시지들
 */
export const MESSAGES = {
  LOADING: "로딩 중입니다...",
  ERROR_NETWORK: "네트워크 연결을 확인해주세요.",
  ERROR_SERVER: "서버 오류가 발생했습니다.",
  ERROR_EMPTY_MESSAGE: "메시지를 입력해주세요.",
  SUCCESS_MESSAGE_SENT: "메시지가 전송되었습니다.",
  ERROR_MESSAGE_SEND: "메시지 전송에 실패했습니다.",
};

/* ==================== 5.브라우저 저장소 키 ==================== */

/**
 * 5-(1).LocalStorage에서 사용되는 키들
 */
export const STORAGE_KEYS = {
  // 채팅 관련
  CHAT_MESSAGES: "works_ai_chat_messages",
  // 사용자 설정
  USER_PREFERENCES: "works_ai_user_preferences",
  // 인증 관련 (로그인 페이지)
  SAVED_EMAIL: "works_ai_saved_email", // "아이디 저장" 옵션
  USER_SESSION: "works_ai_user_session", // 로그인 세션 //TODO: 로그인 세션 어떻게 관리되어지는지 확인 필요
};

/* ==================== 6.유효성 검사 ==================== */

/**
 * 6-(1).입력값 검증 규칙
 */
export const VALIDATION_RULES = {
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 6000,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 255,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    // 숫자, 대문자, 소문자 포함 필수
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  },
};

/* ==================== 7.타임아웃 설정 ==================== */

/**
 * 7-(1).다양한 작업의 타임아웃 시간 (밀리초)
 */
export const TIMEOUTS = {
  API_REQUEST: 30000, // API 요청 : 30초
  MESSAGE_DEBOUNCE: 300, // 메세지 입력 디바운스: 300ms
  TOAST_NOTIFICATION: 3000, // 토스트 알림: 3초
};

/* ==================== 8.페이지 구성 ==================== */

/**
 * 8-(1).메뉴 네비게이션 구조
 *
 * 추후 동적 메뉴 구성 시 이 데이터를 서버에서 받을 예정
 * -> 2025-11-25일 현재 기준으로써는 메뉴 증설 가능성 X, 하여 이부분은 하드코딩
 */
export const MENU_ITEMS = [
  { id: 1, label: "AI Chat", icon: "chat", path: "/chat" },
];

/* ==================== 9.파일 업로드 설정 ==================== */

/**
 * 9-(1).문서 업로드 설정
 */
export const DOCUMENT_UPLOAD = {
  ALLOWED_TYPES: ["txt", "pdf", "doc", "docx", "csv", "excel", "md", "html"],
  ALLOWED_MIME: [
    "text/plain",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
    "text/markdown",
    "text/html",
  ],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

/**
 * 9-(2).이미지 업로드 설정
 */
export const IMAGE_UPLOAD = {
  ALLOWED_TYPES: ["png", "jpeg", "jpg", "gif", "webp"],
  ALLOWED_MIME: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

/* ==================== 10. 색상 팔레트 (변수와 중복) ==================== */

/**
 * 컴포넌트에서 동적으로 색상을 사용해야 할 때
 * (SCSS 변수는 스타일링에만 사용, 동적 처리는 여기서)
 * -> TODO: 이곳에서는 필요 없어서 추후 관리자 페이지로 이관 예정
 */

/* ==================== 11. VITE 환경 변수 ==================== */

/**
 * Vite 환경 변수
 *
 * .env 파일에서 VITE_ 접두사로 시작하는 변수만 접근 가능
 *
 * 예시 (.env):
 * VITE_API_URL=http://localhost:8000
 * VITE_APP_NAME=OCI AI Web Service
 */
export const ENV = {
  BASE_API_URL: import.meta.env.VITE_API_URL || "http://localhost:5173",
  BASE_APP_NAME: import.meta.env.VITE_APP_NAME || "OCI AI Web Service",
  NODE_ENV: import.meta.env.MODE, // 'development' 또는 'production'
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
};
