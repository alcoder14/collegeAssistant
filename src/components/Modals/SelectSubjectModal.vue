<template>
  <div v-if="visible" class="modal-container" @click.self="emitClose">
    <div class="modal-window">
      <h2 class="modal-title">Select Subject</h2>
      <ul>
        <li
          v-for="subject in subjects"
          :key="subject.id"
          @click="handleSelectSubject(subject)"
        >
          <span
            :style="{ backgroundColor: subject.color }"
            class="subject-color"
          ></span>
          {{ subject.subjectName }}
        </li>
        <li @click="handleSelectNone" class="none-option">None</li>
      </ul>
    </div>
  </div>
</template>

<script setup>

import { defineProps, defineEmits } from 'vue';

defineProps({
  visible: Boolean,
  subjects: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['close', 'select-subject', 'select-none']);

const emitClose = () => emit('close');
const handleSelectSubject = (subject) => emit('select-subject', subject);
const handleSelectNone = () => emit('select-none');
</script>

<style scoped>

.modal-window ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.modal-window li {
  padding: 8px;
  margin: 5px 0;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.modal li:hover {
  background: #e2e2e2;
}
.subject-color {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
.none-option {
  color: red;
  text-align: center;
  font-weight: bold;
}
.close-btn {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  border: none;
  background-color: #ddd;
  border-radius: 6px;
  cursor: pointer;
}
.close-btn:hover {
  background-color: #ccc;
}
</style>
