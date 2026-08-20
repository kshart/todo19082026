<script setup lang="ts">
const props = defineProps<{
  todo: TTodo
}>()
</script>

<template>
  <div class="t-todo">
    <TCheckbox :modelValue="props.todo.checked" />
    <div>{{ props.todo.description }}</div>
  </div>
</template>

<style scoped lang="scss">
.t-todo {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
