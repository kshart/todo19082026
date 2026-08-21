<script setup lang="ts">
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <input
    v-model="model"
    class="ui-text-input"
  >
</template>

<style scoped lang="scss">
.ui-text-input {
  background: #eee;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background ease-out 0.1s;

  @include on-hover {
    background: #cfcfcf;
  }
}
</style>
