<script setup lang="ts">
const props = defineProps<{
  noteUuid: string | 'new'
}>()

async function createNote() {
  const result = await $fetch('/api/note/create', { method: 'POST', body: {
    title: 'some',
    todos: [
      {
        description: 'Задача 1',
        checked: false,
      }, {
        description: 'Задача 2',
        checked: false,
      }, {
        description: 'Задача 3',
        checked: false,
      }, {
        description: 'Задача 4',
        checked: false,
      }, {
        description: 'Задача 5',
        checked: false,
      }, {
        description: 'Задача 6',
        checked: false,
      },
    ],
  } })
}
</script>

<template>
  <div class="t-note-editor">
    {{ props.noteUuid }}
    <TBtn @click="createNote">create</TBtn>
  </div>
</template>

<style scoped>
.t-note-editor {
  background: #f00;
}
</style>
