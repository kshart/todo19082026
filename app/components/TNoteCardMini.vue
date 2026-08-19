<script setup lang="ts">
const props = defineProps<{
  note: TNote
}>()
const { TNoteCardMini: { maxVisibleLines } } = useAppConfig()

const todosLimited = computed<TTodo[]>(() => props.note.todos.slice(0, maxVisibleLines))
const todosHasMore = computed<boolean>(() => props.note.todos.length > todosLimited.value.length)
</script>

<template>
  <NuxtLink :to="`/to/${props.note.uuid}`">
    <h3>{{ props.note.title }}</h3>
    <div>
      <TTodo
        v-for="(todo, index) in todosLimited"
        :key="index"
        :todo="todo"
      />
      {{ todosHasMore }}
    </div>
    <div>{{ props.note.createdAt }} / {{ props.note.updatedAt }}</div>
  </NuxtLink>
</template>
