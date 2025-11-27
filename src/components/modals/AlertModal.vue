<!--   경고 모달 (확인 버튼만 존재) -->
<template>
  <div class="modal-overlay" @click="handleBackgruondClick">
    <div class="modal-container" @click.stop>
      <!-- 모달 헤더-->
      <div class="modal-header">
        <h3 class="modal-title">경고</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// TODO: 여기서부터 다시
</script>
