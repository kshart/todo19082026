<script setup lang="ts">
const perPage = 10
const scrollRef = useTemplateRef('scroll')
const { data } = await useFetch<Paginator<TNote>>(`/api/note/search?perPage=${perPage}`)

const notes = ref<TNote[]>(data.value?.data || [])

const eventsForPull = computed(() => ['note:c', 'note:delete'])
const eventsForUpdate = computed(() => ['note:u'])

if (import.meta.client) {
  useSocketSubscribe(eventsForPull, async () => {
    await new Promise(res => setTimeout(res, 500))
    await scrollRef.value?.cleanup()
    notes.value = []
  })

  useSocketSubscribe(eventsForUpdate, (event: string, data: unknown) => {
    const note = data as TNote
    const index = notes.value.findIndex(n => n.uuid === note.uuid)

    if (index >= 0) {
      notes.value[index] = note
    }
  })
}

async function pullCallback(currentPage: number): Promise<'empty' | 'pull' | 'finish'> {
  const { data, total, page, totalPages } = await $fetch<Paginator<TNote>>(`/api/note/search?perPage=${perPage}&page=${currentPage}`)

  if (!total) {
    return 'empty'
  }

  notes.value = notes.value.concat(data)

  if (page + 1 >= totalPages) {
    return 'finish'
  }

  return 'pull'
}
</script>

<template>
  <div class="index-page">
    <img
      class="page-background"
      src="/images/background.webp"
    >
    <TNoteCreatorMini class="note-creator" />

    <div class="card-list">
      <TNoteCardMini
        v-for="note of notes"
        :key="note.uuid"
        :note="note"
      />
      <UIInfiniteScroll
        ref="scroll"
        :firstPage="1"
        :pullCallback="pullCallback"
      >
        <template #loading>Загружаю...</template>
        <template #empty>
          <img
            class="cat-image"
            src="/images/cat.webp"
          >
        </template>
      </UIInfiniteScroll>
    </div>
  </div>
</template>e

<style scoped lang="scss">
.index-page {
  padding-top: 200px;
}

.page-background {
  position: absolute;
  top: 0;
  left: 0;
  height: 400px;
  width: 100%;
  object-fit: cover;
  z-index: -1;
  pointer-events: none;
}

.note-creator {
  filter: drop-shadow(0px 0px 15px #ccc);
}

.card-list {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  filter: drop-shadow(0px 0px 15px #ccc);
}
</style>
