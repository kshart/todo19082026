<template>
  <div>
    <TPageHeader>
      <NuxtLink to="/">
        <img
          class="logo"
          src="/images/logo.webp"
        >
      </NuxtLink>
      <div>
        <NuxtLink
          to="https://github.com/kshart/todo19082026"
          class="icon-github"
          external
          areaLabel="Github"
        />
      </div>
    </TPageHeader>

    <TPageMain>
      <slot />
    </TPageMain>
  </div>
</template>

<style scoped lang="scss">
.logo {
  height: 50px;
}

.icon-github {
  width: 30px;
  height: 30px;
}
</style>
