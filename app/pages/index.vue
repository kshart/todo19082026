<script setup lang="ts">
const { data: notes } = await $fetch<Paginator<TNote>>('/api/note/search')
</script>

<template>
  <div>
    <TNoteEditor noteUuid="new" />
    -
    <TNoteCardMini
      v-for="note of notes"
      :key="note.uuid"
      :note="note"
    />
  </div>
</template>
