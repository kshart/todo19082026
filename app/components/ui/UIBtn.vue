<script setup lang="ts">
</script>

<template>
  <button class="ui-btn">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.ui-btn {
  background: #d9d9d9;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  text-wrap: nowrap;
  cursor: pointer;
  transition: background ease-out 0.1s;

  @include on-hover {
    background: #F59846;
  }
}
</style>
