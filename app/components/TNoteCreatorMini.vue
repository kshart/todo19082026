<script setup lang="ts">
const notification = useNotification()
const label = ref('Новая заметка')

const isCreating = ref(false)

async function createNote() {
  try {
    isCreating.value = true
    const result = await $fetch('/api/note/create', {
      method: 'POST',
      body: {
        title: label.value,
        todos: [],
      },
    })

    return navigateTo(`/to/${result.uuid}`)
  } catch (error) {
    notification.createByFetchError({
      type: 'warn',
      title: 'Ошибка',
    }, error)
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div class="t-note-creator-mini">
    <UITextInput
      v-model="label"
      class="t-note-creator-mini__label"
    />
    <UIBtn @click="createNote">Создать {{ isCreating ? '҉' : '' }}</UIBtn>
  </div>
</template>

<style scoped>
.t-note-creator-mini {
  display: flex;
  gap: 10px;
}

.t-note-creator-mini__label {
  width: 100%;
}
</style>
