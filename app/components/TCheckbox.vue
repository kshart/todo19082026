<script setup lang="ts">
const model = defineModel({ type: Boolean, default: false })
</script>

<template>
  <input
    v-model="model"
    class="t-checkbox"
    type="checkbox"
  >
</template>

<style scoped lang="scss">
.t-checkbox {
  position: relative;
  appearance: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  background: #F59846;
  box-shadow: inset 0 0 3px rgb(0, 0, 0, 0.6);
  border-radius: 5px;
  transition: background ease-out 0.1s;

  @include on-hover {
    background: color-mix(in oklch, #F59846 95%, #000);
  }

  &:checked::after {
    content: "";
    position: absolute;
    width: 30px;
    height: 30px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='30' width='30' viewBox='0 -960 960 960' stroke='%23FFFFFF' stroke-width='30' fill='%23FFFFFF'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    transition: 500ms;
  }
}
</style>
