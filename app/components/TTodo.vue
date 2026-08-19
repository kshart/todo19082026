<script setup lang="ts">
const props = defineProps<{
  todo: TTodo
}>()
</script>

<template>
  <div>
    <h3>{{ props.todo.description }}</h3>
    <div>{{ props.todo.checked }}</div>
  </div>
</template>
