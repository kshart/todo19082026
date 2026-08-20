<template>
  <main class="t-page-main">
    <div class="t-page-main__wrapper">
      <slot />
    </div>
  </main>
</template>

<style scoped lang="scss">
.t-page-main {
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 1;
}

.t-page-main__wrapper {
  width: var(--ui-content);
}
</style>
