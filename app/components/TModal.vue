<script setup lang="ts">
// const model = defineModel({ type: Boolean, default: false })
const modalRef = useTemplateRef('modal')

function open() {
  modalRef.value?.showModal()
  // model.value = true
}

function close() {
  modalRef.value?.close()
  // model.value = false
}
</script>

<template>
  <div>
    <div @click="open()">
      <slot />
    </div>
    <dialog
      ref="modal"
      closedby="any"
      class="t-modal-dialog"
    >
      <div class="t-modal-dialog__content-wrap">
        <div class="t-modal-dialog__content">
          <button
            class="t-modal-dialog__close-button"
            @click="close()"
          >
            ❌
          </button>
          <slot name="content" />
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped lang="scss">
.t-modal-dialog::backdrop {
  background: #00000033;
  backdrop-filter: blur(1.2px);
}

.t-modal-dialog__content-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1001;
}

.t-modal-dialog__content {
  background: #eee;
  padding: 15px;
  border-radius: 7px;
  max-width: 600px;
  pointer-events: all;

  &:deep(h1) {
    margin-top: 0;
  }
}

.t-modal-dialog__close-button {
  border: none;
  background: #f00;
  padding: 6px;
  border-radius: 100%;
  cursor: pointer;
}
</style>
