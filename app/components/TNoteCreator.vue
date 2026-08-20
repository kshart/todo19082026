<script setup lang="ts">
const label = ref('Новая заметка')

async function createNote() {
  const result = await $fetch('/api/note/create', {
    method: 'POST',
    body: {
      title: label.value,
      todos: [],
    },
  })

  return navigateTo(`/to/${result.uuid}`)
}
</script>

<template>
  <div class="t-note-creator">
    <TTextInput
      v-model="label"
      class="t-note-creator__label"
    />
    <TBtn @click="createNote">Создать</TBtn>
  </div>
</template>

<style scoped>
.t-note-creator {
  display: flex;
  gap: 10px;
}

.t-note-creator__label {
  width: 100%;
}
</style>
