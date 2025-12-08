<!-- src/components/chat/AgentSelector.vue -->
<template>
  <div class="agent-selector">
    <button class="agent-selector-trigger" @click="toggleDropdown">
      <span class="agent-selector-label">🤖 {{ currentAgent.modelName }}</span>
      <span class="agent-selector-chevron">▼</span>
    </button>

    <!-- 드롭다운 -->
    <Transition name="fade-scale">
      <div v-if="isOpen" class="agent-selector-dropdown">
        <div
          v-for="agent in aiAgents.filter((a) => a.type === 'chatCard')"
          :key="agent.id"
          class="agent-selector-option"
          :class="{
            'agent-selector-option--active': agent.id === currentAgent.id,
          }"
          @click="selectAgent(agent)"
        >
          <div class="agent-selector-option-header">
            <span class="agent-selector-option-name">
              {{ agent.title || agent.modelName }}
            </span>
            <span class="agent-selector-option-usage">
              {{ agent.realUsageCount }}/{{ agent.wholeUsageCount }}
            </span>
          </div>
          <div class="agent-selector-option-desc">
            {{ agent.explain || agent.modelIntroduction }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
/**
 * AgentSelector.vue - AI Agent 선택 컴포넌트
 *
 * Props:
 * - currentAgent: Object - 현재 선택된 Agent
 * - aiAgents: Array - 사용 가능한 Agent 목록
 *
 * Emits:
 * - agent-change: Agent 변경
 */

import { ref, defineProps, defineEmits } from "vue";

defineProps({
  currentAgent: {
    type: Object,
    default: () => ({}),
  },
  aiAgents: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["agent-change"]);

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectAgent = (agent) => {
  emit("agent-change", agent);
  isOpen.value = false;
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;
@use "@/assets/styles/whole_animations.scss" as *;

.agent-selector {
  position: relative;
}

.agent-selector-trigger {
  width: 100%;
  padding: var.$spacing-3 var.$spacing-4;
  border: 2px solid var.$gray-200;
  border-radius: var.$border-radius-lg;
  background-color: var.$bg-primary;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var.$font-size-base;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
  }
}

.agent-selector-label {
  color: var.$text-primary;
}

.agent-selector-chevron {
  color: var.$text-muted;
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.agent-selector-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var.$spacing-2;
  background-color: var.$bg-primary;
  border: 2px solid var.$gray-200;
  border-radius: var.$border-radius-lg;
  box-shadow: var.$shadow-lg;
  z-index: var.$z-dropdown;
  max-height: 400px;
  overflow-y: auto;
}

.agent-selector-option {
  padding: var.$spacing-3 var.$spacing-4;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var.$gray-100;

  &:hover {
    background-color: var.$gray-50;
  }

  &--active {
    background-color: rgba(var(--primary-color), 0.1);
    border-left: 4px solid var(--primary-color);
    padding-left: calc(var.$spacing-4 - 4px);
  }

  &:last-child {
    border-bottom: none;
  }
}

.agent-selector-option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var.$spacing-1;
}

.agent-selector-option-name {
  font-weight: 600;
  color: var.$text-primary;
}

.agent-selector-option-usage {
  font-size: var.$font-size-xs;
  color: var.$text-muted;
}

.agent-selector-option-desc {
  font-size: var.$font-size-sm;
  color: var.$text-secondary;
  line-height: 1.4;
}

/* ==================== Transition ==================== */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}
</style>
