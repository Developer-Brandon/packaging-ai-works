<!-- src/components/sidebar/MainSidebar.vue -->
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
          class="sidebar__section"
        >
          <!-- 섹션 제목 -->
          <h3 class="sidebar__section-title">{{ section.title }}</h3>

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
              <span class="sidebar__chat-title">{{ chat.title }}</span>

              <!-- 호버 시 삭제 버튼 -->
              <div class="sidebar__chat-actions">
                <button
                  class="sidebar__chat-action-btn"
                  @click.stop="deleteChat(chat.id)"
                  title="삭제"
                >
                  🗑️
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
      <button class="sidebar__user-profile">
        <img
          src="@/assets/images/main/sidebar/mynaui_sidebar_default_thumbnail.png"
          alt="프로필"
          class="sidebar__user-avatar"
        />
        <div class="sidebar__user-info">
          <span class="sidebar__user-name">{{ userName }}</span>
          <span class="sidebar__user-role">manager</span>
        </div>
      </button>

      <!-- 하단 메뉴 버튼들 -->
      <div class="sidebar__footer-menu">
        <button class="sidebar__footer-menu-btn" title="계정 정보">⚙️</button>
        <button
          class="sidebar__footer-menu-btn"
          @click="logout"
          title="로그아웃"
        >
          🚪
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/configStore";

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
  console.log("📝 채팅 선택:", chat.title);
  activeChatId.value = chat.id;

  // 모바일에서 사이드바 닫기
  emit("close");
};

const deleteChat = (chatId) => {
  console.log("🗑️ 채팅 삭제:", chatId);

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
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;

/* ==================== SideBar 전체 구조 ==================== */
.sidebar {
  /* Flexbox 수직 정렬 */
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var.$bg-primary;
  border-right: 1px solid var.$gray-200;

  /* 스크롤 가능 */
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
}

/* ==================== SideBar Header (로고만) ==================== */
// 헤더
.sidebar__header {
  padding: var.$spacing-6;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid var.$gray-100;
  flex-shrink: 0;
}

// 로고
.sidebar__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--color-border-light);
  &-image {
    width: 61px; // 로고 너비
    height: 29px; // 로고 높이
    object-fit: contain; // 이미지 비율 유지하며 크기 조정
    transition: all 0.3s ease;
    image-rendering: crisp-edges; // 선명도 개선
  }
}

/* ==================== 새 채팅 버튼 ==================== */
.sidebar__new-chat-btn {
  cursor: pointer;
  margin: 0 var.$spacing-6;
  margin-top: 28px;
  padding: var.$spacing-3 var.$spacing-4;
  border: 2px solid var(--primary-color);
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

  &:hover {
    background-color: var(--primary-color);
    color: var.$white;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(208, 2, 27, 0.2);
  }

  /* 클릭 효과 */
  &:active {
    transform: scale(0.98);
  }

  flex-shrink: 0;
}

.sidebar__new-chat-text {
  font-size: 14px;
}

/* ==================== 검색창 ==================== */
.sidebar__search {
  /* 검색 영역 */
  position: relative;
  margin: 32px 24px;
  flex-shrink: 0;
}

.sidebar__search-input {
  /* 언더바 스타일의 검색 입력 필드 */
  width: 100%;
  padding-right: 30px; /* 아이콘 공간 확보 */
  border: none;
  border-bottom: 2px solid #5d5d5d; /* 언더바만 표시 */
  border-radius: 0;
  background-color: transparent; /* 배경 투명 */
  font-size: 16px;
  color: #333;

  &::placeholder {
    color: #999;
  }

  /* 포커스 상태 */
  &:focus {
    outline: none;
    border-bottom-color: var(--primary-color); /* 레드 색상 */
    /* 언더바가 확장되는 애니메이션 효과 */
    animation: underlineExpand 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* 입력값이 있을 때 */
  &:not(:placeholder-shown) {
    border-bottom-color: #333;
  }
}

.sidebar__search-icon {
  /* 검색 아이콘 */
  position: absolute;
  right: var.$spacing-4;
  top: 50%;
  transform: translateY(-50%);
  color: var.$text-muted;
  font-size: 16px;
  pointer-events: none;
}

/* ==================== 채팅 히스토리 ==================== */
.sidebar__history {
  /* 채팅 목록 영역 (스크롤 가능) */
  flex: 1;
  overflow-y: auto;
  padding: var.$spacing-4 24px;

  /* 스크롤바 스타일 */
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

.sidebar__section {
  /* 섹션 (예: "오늘", "최근") */
  margin-bottom: var.$spacing-4;
}

.sidebar__section-title {
  /* 섹션 제목 */
  font-size: 12px;
  font-weight: 600;
  color: var.$text-muted;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  margin-bottom: 16px;
}

.sidebar__chat-list {
  /* 채팅 목록 */
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar__chat-item {
  /* 개별 채팅 항목 */
  padding: 8px 4px;
  color: var.$text-secondary;
  font-size: 14px;
  cursor: pointer;

  /* Flexbox */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var.$spacing-2;

  /* 전환 효과 */
  transition: all 0.2s ease;

  /* 호버 효과 */
  &:hover {
    background-color: var.$gray-50;
    color: var.$text-primary;
    animation: fadeInLeft 0.2s ease-out;
  }

  /* 활성 상태 */
  &.sidebar__chat-item--active {
    background-color: var.$gray-100;
    color: var(--primary-color);
    font-weight: 600;
    border-left: 3px solid var(--primary-color);
    padding-left: calc(var.$spacing-4 - 3px);
  }
}

.sidebar__chat-title {
  /* 채팅 제목 */
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__chat-actions {
  /* 액션 버튼 영역 (삭제 버튼) */
  display: none;
  gap: var.$spacing-2;
  flex-shrink: 0;

  /* 부모 호버 시 표시 */
  .sidebar__chat-item:hover & {
    display: flex;
  }
}

.sidebar__chat-action-btn {
  /* 삭제 버튼 */
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: var.$spacing-1 var.$spacing-2;
  color: var.$text-muted;
  border-radius: 4px;

  /* 전환 효과 */
  transition: all 0.2s ease;

  &:hover {
    color: var.$danger-color;
    background-color: rgba(224, 76, 60, 0.1);
    transform: scale(1.2);
  }
}

/* ==================== 채팅 없을 때 ==================== */
.sidebar__empty {
  /* 채팅이 없을 때 표시되는 영역 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var.$spacing-8;
}

.sidebar__empty-text {
  /* "채팅이 없습니다." 텍스트 */
  color: var.$text-muted;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

/* ==================== SideBar Footer (사용자 정보) ==================== */
.sidebar__footer {
  /* 하단 고정 영역 */
  padding: var.$spacing-4;
  border-top: 1px solid var.$gray-100;
  display: flex;
  flex-direction: column;
  gap: var.$spacing-3;
  flex-shrink: 0;
}

.sidebar__user-profile {
  /* 사용자 프로필 버튼 */
  background: none;
  border: none;
  cursor: pointer;
  padding: var.$spacing-2;
  border-radius: 8px;

  /* Flexbox */
  display: flex;
  align-items: center;
  gap: var.$spacing-3;

  /* 전환 효과 */
  transition: all 0.2s ease;
}

.sidebar__user-avatar {
  /* 사용자 아바타 */
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.sidebar__user-info {
  /* 사용자 정보 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var.$spacing-1;
}

.sidebar__user-name {
  /* 사용자 이름 */
  font-weight: 600;
  font-size: 14px;
  color: var.$text-primary;
}

.sidebar__user-role {
  /* 사용자 역할 */
  font-size: 12px;
  color: var.$text-muted;
}

.sidebar__footer-menu {
  /* 하단 메뉴 버튼들 */
  display: flex;
  gap: var.$spacing-2;
  justify-content: flex-start;
}

.sidebar__footer-menu-btn {
  /* 메뉴 버튼 */
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: var.$spacing-2 var.$spacing-3;
  color: var.$text-muted;
  border-radius: 6px;

  /* 전환 효과 */
  transition: all 0.2s ease;

  /* 호버 효과 */
  &:hover {
    background-color: var.$gray-100;
    color: var.$text-primary;
    transform: rotate(15deg) scale(1.1);
  }
}
</style>
