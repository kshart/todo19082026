<script setup lang="ts">
const props = defineProps<{
}>()
</script>

<template>
  <button class="t-btn">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.t-btn {
  background: #0f0;
  border-radius: 5px;
}
</style>
