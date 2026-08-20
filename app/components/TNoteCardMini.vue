<script setup lang="ts">
const props = defineProps<{
  note: TNote
}>()
const dateFormater = useDateFormater()
const { TNoteCardMini: { maxVisibleLines } } = useAppConfig()

const todosLimited = computed<TTodo[]>(() => props.note.todos.slice(0, maxVisibleLines))
const todosHasMore = computed<boolean>(() => props.note.todos.length > todosLimited.value.length)
</script>

<template>
  <NuxtLink
    class="t-note-card-mini"
    :to="`/to/${props.note.uuid}`"
  >
    <h3 class="t-note-card-mini__title">{{ props.note.title }}</h3>
    <div class="t-note-card-mini__cardlist">
      <TTodo
        v-for="(todo, index) in todosLimited"
        :key="index"
        :todo="todo"
      />
    </div>
    <div
      class="t-note-card-mini__times"
      data-allow-mismatch
    >
      создано {{ dateFormater.default(props.note.createdAt) }} / изменено {{ dateFormater.default(props.note.updatedAt) }}
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.t-note-card-mini {
  display: block;
  padding: 15px;
  border-radius: 10px;
  background: #f5f5f5;
  transition: background ease-out 0.1s;

  :deep(a) {
    color: white;
  }

  @include on-hover {
    background: #f0f0f0;
  }
}

.t-note-card-mini__title {
  font-weight: normal;
  margin-top: 0;
  margin-bottom: 10px;
}

.t-note-card-mini__times {
  color: #ccc;
  font-size: 0.6em;
}

.t-note-card-mini__cardlist {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.9em;
}
</style>
