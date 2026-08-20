<script setup lang="ts">
const { data: notes } = await $fetch<Paginator<TNote>>('/api/note/search')
</script>

<template>
  <div class="index-page">
    <img
      v-if="notes.length"
      class="page-background"
      src="/images/background.webp"
    >
    <TNoteCreator />

    <div class="card-list">
      <TNoteCardMini
        v-for="note of notes"
        :key="note.uuid"
        :note="note"
      />
    </div>
  </div>
</template>

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

.card-list {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  filter: drop-shadow(0px 0px 15px #ccc);
}
</style>
