<!-- src/components/chat/ChatInputContextMenu.vue -->
<template>
  <Teleport to="body" v-if="true">
    <div class="context-menu-overlay" @click="$emit('close')" />
    <div
      class="context-menu"
      :style="{ top: position.top, left: position.left }"
    >
      <button class="context-menu-item" @click="$emit('insert-agent')">
        <span class="context-menu-icon">➕</span>
        <span class="context-menu-text">Agent 추가</span>
      </button>

      <button class="context-menu-item" @click="$emit('attach-file')">
        <span class="context-menu-icon">📎</span>
        <span class="context-menu-text">파일 첨부</span>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  position: {
    type: Object,
    default: () => ({ top: "0px", left: "0px" }),
  },
  hasFiles: Boolean,
});

defineEmits(["insert-agent", "attach-file", "close"]);
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;

.context-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var.$z-popover - 10;
}

.context-menu {
  position: fixed;
  z-index: var.$z-popover;
  background-color: var.$bg-primary;
  border: 1px solid var.$gray-200;
  border-radius: var.$border-radius-lg;
  box-shadow: var.$shadow-lg;
  padding: var.$spacing-2 0;
  min-width: 150px;
}

.context-menu-item {
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
  }
}

.context-menu-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}
</style>
