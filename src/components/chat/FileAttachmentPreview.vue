<!-- src/components/chat/FileAttachmentPreview.vue -->
<template>
  <div class="file-attachment-preview" v-if="files.length > 0">
    <div class="file-attachment-list">
      <div
        v-for="(file, index) in files"
        :key="`file-${index}`"
        class="file-attachment-item"
        :class="`file-attachment-item--${getFileType(file)}`"
      >
        <!-- 파일 아이콘 -->
        <div class="file-attachment-icon">
          {{ getFileIcon(file) }}
        </div>

        <!-- 파일 정보 -->
        <div class="file-attachment-info">
          <div class="file-attachment-name">
            {{ file.name }}
          </div>
          <div class="file-attachment-size">
            {{ formatFileSize(file.size) }}
          </div>
        </div>

        <!-- 제거 버튼 -->
        <button
          class="file-attachment-remove"
          @click="$emit('remove', index)"
          title="제거"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * FileAttachmentPreview.vue - 첨부 파일 미리보기
 *
 * Props:
 * - files: Array<File> - 첨부된 파일들
 *
 * Emits:
 * - remove: 파일 제거
 */

import { defineProps, defineEmits } from "vue";

defineProps({
  files: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["remove"]);

/* ==================== 메서드 ==================== */
const getFileType = (file) => {
  const ext = file.name.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return "image";
  } else if (ext === "pdf") {
    return "pdf";
  } else if (["doc", "docx"].includes(ext)) {
    return "document";
  } else {
    return "file";
  }
};

const getFileIcon = (file) => {
  const type = getFileType(file);
  const icons = {
    image: "🖼️",
    pdf: "📄",
    document: "📝",
    file: "📎",
  };
  return icons[type] || "📎";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/whole_variables.scss" as var;

.file-attachment-preview {
  padding: var.$spacing-3 var.$spacing-4;
  background-color: var.$gray-50;
  border-radius: var.$border-radius-lg;
}

.file-attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: var.$spacing-2;
}

.file-attachment-item {
  display: flex;
  align-items: center;
  gap: var.$spacing-2;
  padding: var.$spacing-2 var.$spacing-3;
  background-color: var.$bg-primary;
  border: 1px solid var.$gray-200;
  border-radius: var.$border-radius-base;
  flex: 1;
  min-width: 200px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(var(--primary-color), 0.1);
  }
}

.file-attachment-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.file-attachment-info {
  display: flex;
  flex-direction: column;
  gap: var.$spacing-1;
  flex: 1;
  min-width: 0;
}

.file-attachment-name {
  font-size: var.$font-size-sm;
  font-weight: 600;
  color: var.$text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-attachment-size {
  font-size: var.$font-size-xs;
  color: var.$text-muted;
}

.file-attachment-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var.$text-muted;
  padding: var.$spacing-1;
  border-radius: var.$border-radius-base;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(220, 38, 38, 0.1);
    color: #dc2626;
  }
}
</style>
