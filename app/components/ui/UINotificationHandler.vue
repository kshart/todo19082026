<script setup lang="ts">
const notification = useNotification()
</script>

<template>
  <div class="ui-notification-handler">
    <div
      v-for="({ type, title, text }, index) in notification.list"
      :key="index"
      class="notification"
      :class="`type-${type}`"
    >
      {{ title }}
      <div
        v-if="text"
        class="notification-text"
      >
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ui-notification-handler {
  position: absolute;
  right: 0;
  padding: 10px;
  pointer-events: none;
  z-index: 2;

  .notification {
    padding: 10px;
    margin-bottom: 10px;
    background: #eee;
    border-radius: 7px;
    pointer-events: all;
    max-width: 200px;

    .notification-text {
      font-size: 0.6em;
    }

    &.type-info {
      background: #eee;
    }

    &.type-warn {
      background: #ffdd93;
    }
  }
}
</style>
