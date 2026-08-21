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
      class="ui-modal-dialog"
    >
      <div class="ui-modal-dialog__content-wrap">
        <div class="ui-modal-dialog__content">
          <button
            class="ui-modal-dialog__close-button"
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
.ui-modal-dialog::backdrop {
  background: #00000033;
  backdrop-filter: blur(1.2px);
}

.ui-modal-dialog__content-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1001;
}

.ui-modal-dialog__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  position: relative;
  background: #eee;
  padding: 15px 30px;
  border-radius: 10px;
  max-width: 600px;
  pointer-events: all;
}

.ui-modal-dialog__close-button {
  position: absolute;
  right: 10px;
  top: 10px;
  border: none;
  background: #77777722;
  padding: 5px;
  font-size: 10px;
  border-radius: 100%;
  cursor: pointer;
  transition: background ease-out 0.1s;

  @include on-hover {
    background: #77777733;
  }
}
</style>
