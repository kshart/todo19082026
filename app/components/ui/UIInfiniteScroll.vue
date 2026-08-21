<script setup lang="ts">
const props = defineProps<{
  firstPage: number
  pullCallback: (currentPage: number) => Promise<'pull' | 'finish' | 'empty'>
}>()
const containerRef = useTemplateRef('container')

const currentPage = ref(props.firstPage)
const isLoading = ref(false)
const isFinish = ref(false)
const isEmpty = ref(false)

async function pullRecords() {
  const result = await props.pullCallback(currentPage.value)

  if (result === 'finish') {
    isFinish.value = true
  } else if (result === 'empty') {
    isEmpty.value = true
  }

  currentPage.value++
  isLoading.value = false
}

function tryPull() {
  if (isLoading.value || isFinish.value) {
    return
  }

  pullRecords()

  isLoading.value = true
}

function callback(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      tryPull()
    }
  })
}

async function cleanup() {
  if (isLoading.value) {
    await new Promise<void>(res => watch(isLoading, (value) => {
      if (!value) {
        res()
      }
    }))
  }

  isLoading.value = false
  isFinish.value = false
  isEmpty.value = false
  currentPage.value = 0
}

defineExpose({ cleanup, isEmpty })

onMounted(() => {
  if (!containerRef.value) {
    return
  }

  const observer = new IntersectionObserver(callback)
  observer.observe(containerRef.value)
})
</script>

<template>
  <div ref="container" />
  <slot
    v-if="isLoading"
    name="loading"
  />
  <slot
    v-if="isEmpty"
    name="empty"
  />
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
