<template>
  <aside class="sidebar">
    <!-- ==================== 로고 ==================== -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <img
          :src="configStore.logoImageUrl"
          alt="AI Works Logo"
          class="sidebar__logo-image"
        />
      </div>
    </div>
    <!-- ==================== 새 채팅 버튼 ==================== -->
    <button class="sidebar__new-chat-btn" @click="startNewChat">
      <span class="sidebar__new-chat-text">새 채팅</span>
    </button>
    <!-- ==================== 검색창 ==================== -->
    <div class="sidebar__search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="검색어를 입력해주세요"
        class="sidebar__search-input"
        @input="handleSearch"
      />
      <img
        class="sidebar__search-icon"
        src="@/assets/images/main/icon/mynaui_sidebar_searching_icon.png"
      />
    </div>
    <!-- ==================== 채팅 히스토리 섹션 ==================== -->
    <div class="sidebar__history">
      <!-- 채팅이 있는 경우 -->
      <template v-if="filteredChatSections.length > 0">
        <section
          v-for="section in filteredChatSections"
          :key="section.id"
          class="sidebar__history-section"
        >
          <!-- 섹션 제목 -->
          <h3 class="sidebar__history-section-title">{{ section.title }}</h3>

          <!-- 섹션 내 채팅 목록 -->
          <ul class="sidebar__chat-list">
            <li
              v-for="chat in section.chats"
              :key="chat.id"
              class="sidebar__chat-item"
              :class="{
                'sidebar__chat-item--active': chat.id === activeChatId,
              }"
              @click="selectChat(chat)"
            >
              <!-- 채팅 제목 -->
              <span
                class="sidebar__chat-title"
                v-if="editingChatId !== chat.id"
              >
                {{ chat.title }}
              </span>

              <!-- 편집 모드: 제목 입력 필드 -->
              <input
                v-if="editingChatId === chat.id"
                :key="`edit-${chat.id}`"
                :data-chat-id="chat.id"
                v-model="editingTitle"
                class="sidebar__chat-edit-input"
                type="text"
                @keydown="handleChatTitleKeydown($event, chat.id)"
                @blur="saveEditingChat(chat.id)"
                @click.stop
                placeholder="새로운 제목 입력..."
              />

              <!-- 호버 시 우측 메뉴 버튼 -->
              <div class="sidebar__chat-actions">
                <!-- 편집 모드가 아닐 때만 메뉴 버튼 표시 -->
                <button
                  v-if="editingChatId !== chat.id"
                  class="sidebar__chat-action-btn"
                  @click.stop="showContextMenu($event, chat.id)"
                  title="옵션"
                >
                  ⋯
                </button>
              </div>
            </li>
          </ul>
        </section>
      </template>

      <!-- 채팅이 없는 경우 -->
      <div v-else class="sidebar__empty">
        <p class="sidebar__empty-text">채팅이 없습니다.</p>
      </div>
    </div>

    <!-- ==================== SideBar Footer (사용자 정보) ==================== -->
    <div class="sidebar__footer">
      <!-- 사용자 프로필 -->
      <button class="sidebar__user-profile" @click.stop="showUserMenu($event)">
        <img
          :src="configStore.defaultProfileImage"
          alt="프로필"
          class="sidebar__user-avatar"
        />
        <div class="sidebar__user-info">
          <span class="sidebar__user-name">{{ userName }}</span>
          <span class="sidebar__user-role">manager</span>
        </div>
      </button>
    </div>
  </aside>

  <!-- =============== 우측 메뉴 (Context Menu) - 채팅 =============== -->
  <Teleport to="body" v-if="contextMenu.isVisible">
    <div class="sidebar__context-menu-overlay" @click="closeContextMenu" />
    <div
      class="sidebar__context-menu"
      :style="{
        top: contextMenu.position.top,
        left: contextMenu.position.left,
      }"
    >
      <!-- 메뉴 항목: 이름 바꾸기 -->
      <button
        class="sidebar__context-menu-item"
        @click="
          startEditingChat(
            contextMenu.chatId,
            chatSections
              .flatMap((s) => s.chats)
              .find((c) => c.id === contextMenu.chatId)?.title || ''
          )
        "
      >
        <span class="sidebar__context-menu-icon">
          <img :src="pencilIcon" />
        </span>
        <span class="sidebar__context-menu-text">이름 바꾸기</span>
      </button>

      <!-- 메뉴 항목: 삭제 -->
      <button
        class="sidebar__context-menu-item"
        @click="
          deleteChat(contextMenu.chatId);
          closeContextMenu();
        "
      >
        <span class="sidebar__context-menu-icon">
          <img :src="garbageIcon" />
        </span>
        <span class="sidebar__context-menu-text">삭제</span>
      </button>
    </div>
  </Teleport>

  <!-- =============== 우측 메뉴 (Context Menu) - 사용자 메뉴 =============== -->
  <Teleport to="body" v-if="userMenu.isVisible">
    <div class="sidebar__context-menu-overlay" @click="closeUserMenu" />
    <div
      class="sidebar__context-menu"
      :style="{
        top: userMenu.position.top,
        left: userMenu.position.left,
      }"
    >
      <!-- 메뉴 항목: 계정 정보 -->
      <!-- <button class="sidebar__context-menu-item">
        <span class="sidebar__context-menu-text">계정 정보</span>
      </button> -->

      <!-- 메뉴 항목: 로그아웃 -->
      <button
        class="sidebar__context-menu-item"
        @click="
          logout();
          closeUserMenu();
        "
      >
        <span class="sidebar__context-menu-text">로그아웃</span>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/configStore";
import garbageIcon from "@/assets/images/main/icon/garbage.png";
import pencilIcon from "@/assets/images/main/icon/pencil.png";

/* ==================== 라우터 및 스토어 ==================== */
const router = useRouter();
const authStore = useAuthStore();
const configStore = useConfigStore();

/* ==================== 반응형 상태 (State) ==================== */

const searchQuery = ref("");
const activeChatId = ref(null);

const chatSections = ref([
  {
    id: "today",
    title: "오늘",
    chats: [
      { id: 1, title: "시나 erp 시스템 정의" },
      { id: 2, title: "ERP 도입 시 필연 구축시간 및 ..." },
      { id: 3, title: "입사 시 api설정 및 통합 점검 정의" },
    ],
  },
  {
    id: "recent",
    title: "최근",
    chats: [
      { id: 4, title: "시나 erp 시스템 정의" },
      { id: 5, title: "ERP 도입 시 필연 구축시간 및 ..." },
    ],
  },
]);

/* ==================== 우측 메뉴 (Context Menu) 상태 - 채팅 ==================== */

/**
 * contextMenu: 우측 메뉴 표시 상태 (채팅용)
 *
 * 상태 정보:
 * - isVisible: 메뉴 표시 여부
 * - chatId: 메뉴가 열린 채팅 ID
 * - position: 메뉴 위치 (top, left)
 */
const contextMenu = ref({
  isVisible: false,
  chatId: null,
  position: { top: "0px", left: "0px" },
});

/* ==================== 우측 메뉴 (Context Menu) 상태 - 사용자 메뉴 ==================== */

/**
 * userMenu: 우측 메뉴 표시 상태 (사용자 프로필용)
 *
 * 상태 정보:
 * - isVisible: 메뉴 표시 여부
 * - position: 메뉴 위치 (top, left)
 */
const userMenu = ref({
  isVisible: false,
  position: { top: "0px", left: "0px" },
});

/**
 * editingChatId: 현재 편집 중인 채팅 ID
 * - null: 편집 모드가 아님
 * - number: 편집 중인 채팅의 ID
 */
const editingChatId = ref(null);

/**
 * editingTitle: 편집 중인 제목 (임시 저장)
 */
const editingTitle = ref("");

/* ==================== 계산된 속성 (Computed) ==================== */

const userName = computed(() => authStore.user?.name || "User");

const filteredChatSections = computed(() => {
  if (!searchQuery.value.trim()) {
    return chatSections.value;
  }

  const query = searchQuery.value.toLowerCase();

  return chatSections.value
    .map((section) => ({
      ...section,
      chats: section.chats.filter((chat) =>
        chat.title.toLowerCase().includes(query)
      ),
    }))
    .filter((section) => section.chats.length > 0);
});

/* ==================== 메서드 (Methods) ==================== */

const startNewChat = () => {
  console.log("✨ 새 채팅 시작");

  const newChatId =
    Math.max(
      ...chatSections.value.flatMap((s) => s.chats.map((c) => c.id)),
      0
    ) + 1;

  const newChat = {
    id: newChatId,
    title: "새로운 채팅",
  };

  const todaySection = chatSections.value.find((s) => s.id === "today");
  if (todaySection) {
    todaySection.chats.unshift(newChat);
  }

  activeChatId.value = newChat.id;
  searchQuery.value = "";
};

const selectChat = (chat) => {
  console.log("📖 채팅 선택:", chat.title);
  activeChatId.value = chat.id;
};

const deleteChat = (chatId) => {
  console.log("채팅 더보기:", chatId);

  if (confirm("이 채팅을 삭제하시겠습니까?")) {
    chatSections.value = chatSections.value.map((section) => ({
      ...section,
      chats: section.chats.filter((chat) => chat.id !== chatId),
    }));

    if (activeChatId.value === chatId) {
      activeChatId.value = null;
    }
  }
};

const handleSearch = () => {
  console.log("🔍 검색:", searchQuery.value);
};

const logout = () => {
  console.log("🚪 로그아웃");
  authStore.logout();
  router.push("/login");
};

/* ==================== 채팅 메뉴 메서드 ==================== */

/**
 * showContextMenu: 우측 메뉴 표시 (채팅용)
 *
 * @param {Event} event - 마우스 클릭 이벤트
 * @param {number} chatId - 메뉴를 열 채팅 ID
 *
 * 동작 흐름:
 * 1. 기본 우측클릭 메뉴 방지
 * 2. 마우스 위치 기반 메뉴 좌표 계산
 * 3. 새 메뉴 열기
 */
const showContextMenu = (event, chatId) => {
  event.preventDefault();
  event.stopPropagation();

  console.log("📋 우측 메뉴 열기:", chatId);

  contextMenu.value = {
    isVisible: true,
    chatId: chatId,
    position: {
      top: `${event.pageY}px`,
      left: `${event.pageX}px`,
    },
  };
};

/**
 * closeContextMenu: 우측 메뉴 닫기 (채팅용)
 */
const closeContextMenu = () => {
  console.log("❌ 우측 메뉴 닫기");
  contextMenu.value.isVisible = false;
  contextMenu.value.chatId = null;
};

/**
 * startEditingChat: 채팅 제목 편집 시작
 *
 * @param {number} chatId - 편집할 채팅 ID
 * @param {string} currentTitle - 현재 제목
 *
 * 동작:
 * 1. 편집 모드 활성화
 * 2. 현재 제목을 임시 저장
 * 3. 메뉴 닫기
 * 4. 자동으로 input 포커스 (Vue3 nextTick 사용)
 */
const startEditingChat = (chatId, currentTitle) => {
  console.log("✏️ 채팅 편집 시작:", chatId);

  editingChatId.value = chatId;
  editingTitle.value = currentTitle;
  closeContextMenu();

  // Vue3에서 DOM 업데이트 후 input 포커스
  nextTick(() => {
    const input = document.querySelector(
      `.sidebar__chat-edit-input[data-chat-id="${chatId}"]`
    );
    if (input) {
      input.focus();
      input.select();
    }
  });
};

/**
 * saveEditingChat: 채팅 제목 저장
 *
 * @param {number} chatId - 저장할 채팅 ID
 *
 * 동작:
 * 1. 입력값 유효성 검사 (공백 제거)
 * 2. 제목 업데이트
 * 3. 편집 모드 해제
 */
const saveEditingChat = (chatId) => {
  const newTitle = editingTitle.value.trim();

  if (!newTitle) {
    console.warn("⚠️ 제목이 비어있습니다");
    editingChatId.value = null;
    return;
  }

  console.log("💾 채팅 제목 저장:", chatId, newTitle);

  chatSections.value.forEach((section) => {
    const chat = section.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.title = newTitle;
    }
  });

  editingChatId.value = null;
  editingTitle.value = "";
};

/**
 * cancelEditingChat: 채팅 제목 편집 취소
 */
const cancelEditingChat = () => {
  console.log("❌ 채팅 제목 편집 취소");
  editingChatId.value = null;
  editingTitle.value = "";
};

/**
 * handleChatTitleKeydown: 제목 입력 중 키보드 이벤트 처리
 *
 * @param {KeyboardEvent} event
 * @param {number} chatId
 *
 * 키보드 단축키:
 * - Enter: 저장
 * - Escape: 취소
 */
const handleChatTitleKeydown = (event, chatId) => {
  if (event.key === "Enter") {
    saveEditingChat(chatId);
  } else if (event.key === "Escape") {
    cancelEditingChat();
  }
};

/* ==================== 사용자 메뉴 메서드 ==================== */

/**
 * showUserMenu: 우측 메뉴 표시 (사용자 프로필용)
 *
 * @param {Event} event - 마우스 클릭 이벤트
 *
 * 동작:
 * 1. 클릭 이벤트 전파 방지
 * 2. 마우스 위치 기반 메뉴 좌표 계산
 * 3. 사용자 메뉴 열기
 */
const showUserMenu = (event) => {
  event.preventDefault();
  event.stopPropagation();

  console.log("📋 사용자 메뉴 열기");

  userMenu.value = {
    isVisible: true,
    position: {
      top: `${event.pageY}px`,
      left: `${event.pageX}px`,
    },
  };
};

/**
 * closeUserMenu: 우측 메뉴 닫기 (사용자 메뉴용)
 */
const closeUserMenu = () => {
  console.log("❌ 사용자 메뉴 닫기");
  userMenu.value.isVisible = false;
};

onMounted(() => {
  if (configStore.office === "KOMSCO") {
    const updateMap = {
      1: "성과 지표는 어떻게 설정되고 검증되..",
      2: "예산 집행 중 불용 되는 과다 집행 항목..",
      3: "해외 특허 분쟁 사례 및 후속 조치",
      4: "매출, 사업 성과, 예산 편성·집행 ...",
      5: "초과근무 관리 방식, 출장비 증빙 ",
    };

    chatSections.value.forEach((section) => {
      section.chats.forEach((chat) => {
        if (updateMap[chat.id]) {
          chat.title = updateMap[chat.id];
        }
      });
    });
  }

  // 문서 클릭 시 메뉴 닫기 이벤트 등록
  document.addEventListener("click", () => {
    closeContextMenu();
    closeUserMenu();
  });
});

onUnmounted(() => {
  document.removeEventListener("click", closeContextMenu);
  document.removeEventListener("click", closeUserMenu);
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;

/* ==================== SideBar 전체 구조 ==================== */
.sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var.$bg-primary;
  border-right: 1px solid var.$gray-200;

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var.$gray-300;
    border-radius: 3px;

    &:hover {
      background: var.$gray-400;
    }
  }

  /* ==================== SideBar Header (로고만) ==================== */
  &__header {
    padding: var.$spacing-5;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--color-border-light);

    &-image {
      width: 61px;
      height: 29px;
      object-fit: contain;
      transition: all 0.3s ease;
      image-rendering: crisp-edges;
    }
  }

  /* ==================== SideBar NewChat - 새 채팅 버튼 ==================== */
  &__new-chat {
    &-btn {
      cursor: pointer;
      margin: 0 var.$spacing-6;
      margin-top: 18px;
      padding: var.$spacing-3 var.$spacing-4;
      border: 1px solid var(--primary-color);
      border-radius: 8px;
      background-color: transparent;
      color: var(--primary-color);
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      height: 35px;
      flex-shrink: 0;

      &:hover {
        background-color: var(--primary-color);
        color: var.$white;
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(208, 2, 27, 0.2);
      }

      &:active {
        transform: scale(0.98);
      }
    }

    &-text {
      font-size: 14px;
    }
  }

  /* ==================== SideBar HistoryChat ==================== */
  &__history-section {
    margin-bottom: var.$spacing-4;

    &-title {
      font-size: 12px;
      font-weight: 600;
      color: var.$text-muted;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
      margin-bottom: 16px;
    }
  }
}

/* ==================== 검색창 ==================== */
.sidebar {
  &__search {
    position: relative;
    margin: 32px 24px;
    flex-shrink: 0;

    &-input {
      width: 100%;
      padding-right: 30px;
      border: none;
      border-bottom: 2px solid #5d5d5d;
      border-radius: 0;
      background-color: transparent;
      font-size: 16px;
      color: #333;

      &::placeholder {
        color: #999;
      }

      &:focus {
        outline: none;
        border-bottom-color: var(--primary-color);
        animation: underlineExpand 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      &:not(:placeholder-shown) {
        border-bottom-color: #333;
      }
    }

    &-icon {
      position: absolute;
      right: var.$spacing-4;
      top: 50%;
      transform: translateY(-50%);
      color: var.$text-muted;
      font-size: 16px;
      pointer-events: none;
    }
  }

  &__history {
    flex: 1;
    overflow-y: auto;
    padding: var.$spacing-4 24px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var.$gray-300;
      border-radius: 3px;

      &:hover {
        background: var.$gray-400;
      }
    }
  }
}

.sidebar__chat-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar__chat-item {
  padding: 8px 4px;
  color: var.$text-secondary;
  font-size: 14px;
  cursor: pointer;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var.$spacing-2;

  transition: all 0.2s ease;

  &:hover {
    background-color: var.$gray-50;
    color: var.$text-primary;
    animation: fadeInLeft 0.2s ease-out;
  }

  &--active {
    background-color: var.$gray-100;
    color: var(--primary-color);
    font-weight: 600;
    border-left: 3px solid var(--primary-color);
    padding-left: calc(var.$spacing-4 - 3px);
  }
}

.sidebar__chat-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__chat-actions {
  display: none;
  gap: var.$spacing-2;
  flex-shrink: 0;

  .sidebar__chat-item:hover & {
    display: flex;
  }
}

.sidebar__chat-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: var.$spacing-1 var.$spacing-2;
  color: var.$text-muted;
  border-radius: 4px;

  transition: all 0.2s ease;

  &:hover {
    color: var.$black;
    background-color: rgba(var(--sub-color-rgb), 0.7);
    transform: scale(1.2);
  }
}

/* ==================== 채팅 없을 때 ==================== */
.sidebar__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var.$spacing-8;
}

.sidebar__empty-text {
  color: var.$text-muted;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

/* ==================== SideBar Footer (사용자 정보) ==================== */
.sidebar__footer {
  padding: var.$spacing-4;
  border-top: 1px solid var.$gray-100;
  display: flex;
  flex-direction: column;
  gap: var.$spacing-3;
  flex-shrink: 0;
}

.sidebar__user-profile {
  background: none;
  border: none;
  cursor: pointer;
  padding: var.$spacing-2;
  border-radius: 8px;

  display: flex;
  align-items: center;
  gap: var.$spacing-3;

  transition: all 0.2s ease;

  &:hover {
    background-color: var.$gray-50;
  }

  &:active {
    background-color: var.$gray-100;
  }
}

.sidebar__user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.sidebar__user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var.$spacing-1;
}

.sidebar__user-name {
  font-weight: 600;
  font-size: 14px;
  color: var.$text-primary;
}

.sidebar__user-role {
  font-size: 12px;
  color: var.$text-muted;
}

/* ==================== 제목 편집 입력 필드 ==================== */

/**
 * 편집 모드 입력 필드
 *
 * 기존 제목 대신 입력 필드 표시
 * Enter/Escape 키로 제어
 */
.sidebar__chat-edit-input {
  flex: 1;
  border: none;
  border-bottom: 2px solid var(--primary-color);
  background: none;
  color: var.$text-primary;
  font-size: 14px;
  padding: 2px 0;

  &:focus {
    outline: none;
    border-bottom-color: var(--primary-color);
  }

  &::placeholder {
    color: var.$text-muted;
  }
}

/* ==================== 우측 메뉴 (Context Menu) ==================== */

/**
 * Teleport로 생성되는 오버레이
 * 메뉴 외부 클릭 시 메뉴 닫기를 위한 투명 레이어
 */
.sidebar__context-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var.$z-popover - 10;
}

/**
 * 우측 메뉴 컨테이너
 *
 * position: fixed
 * - Teleport로 body에 마운트되므로 fixed 사용
 * - top, left는 JavaScript에서 동적으로 설정
 *
 * z-index: var.$z-popover (1060)
 */
.sidebar__context-menu {
  position: fixed;
  z-index: var.$z-popover;

  background-color: var.$bg-primary;
  border: 1px solid var.$gray-200;
  border-radius: var.$border-radius-md;
  box-shadow: var.$shadow-lg;

  padding: var.$spacing-2 0;

  animation: scaleIn 0.2s ease-out;

  min-width: 160px;
}

/**
 * 우측 메뉴 항목 (버튼)
 *
 * flex 레이아웃으로 아이콘과 텍스트 정렬
 */
.sidebar__context-menu-item {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: var.$spacing-3;

  padding: var.$spacing-2 var.$spacing-4;

  font-size: var.$font-size-sm;
  color: var.$text-primary;
  text-align: left;

  transition: all 0.2s ease;

  &:hover {
    background-color: var.$gray-50;
    color: var.$text-primary;
  }

  &:active {
    background-color: var.$gray-100;
  }
}

/**
 * 메뉴 항목 아이콘
 */
.sidebar__context-menu-icon {
  font-size: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
}

/**
 * 메뉴 항목 텍스트
 */
.sidebar__context-menu-text {
  flex: 1;
  white-space: nowrap;
}
</style>
