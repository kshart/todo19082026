<template>
  <header class="t-page-header">
    <div class="t-page-header__wrapper">
      <slot />
    </div>
  </header>
</template>

<style scoped lang="scss">
.t-page-header {
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;

  :deep(a) {
    color: #444;
  }
}

.t-page-header__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: var(--ui-content);
  box-sizing: border-box;
  padding: 15px;
}
</style>
