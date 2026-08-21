<script setup lang="ts">
const route = useRoute()
const noteUuid = String(route.params.uuid || '')
const noteEditor = useNoteEditor()
const notification = useNotification()

await callOnce(noteUuid, () => noteEditor.noteFetch(noteUuid))

onMounted(() => noteEditor.noteRestoreBackup())

if (!noteEditor.note) {
  throw createError({ statusCode: 404 })
}

useHead({
  title: `Note: ${noteEditor.note.title}`,
})

async function noteDelete() {
  try {
    await noteEditor.noteDelete()

    return navigateTo('/')
  } catch (error) {
    let text: string | undefined = undefined

    if (error instanceof Error) {
      text = error.message
    }

    notification.create({
      type: 'warn',
      title: 'Ошибка удаления',
      text,
    })
  }
}

const isSaving = ref(false)
const isDeleted = ref(false)

async function noteSave() {
  try {
    isSaving.value = true
    await noteEditor.noteSave()
  } catch (error) {
    notification.createByFetchError({
      type: 'warn',
      title: 'Ошибка сохранения',
    }, error)
  } finally {
    isSaving.value = false
  }
}

function onClickCheckbox(todo: TTodo) {
  noteEditor.historyTyping(true)
  todo.checked = !todo.checked
}

function onKeyDown(event: KeyboardEvent) {
  const isMeta = event.ctrlKey || event.metaKey

  if (!isMeta) {
    return
  }

  const isUndoKey = event.code === 'KeyZ' && !event.shiftKey

  if (isUndoKey) {
    event.preventDefault()
    noteEditor.undo()
  }

  const isRedoKey = (event.code === 'KeyZ' && event.shiftKey) || event.code === 'KeyY'

  if (isRedoKey) {
    event.preventDefault()
    noteEditor.redo()
  }
}

let isDeleteByDrag = false
function onBeforeInput(event: InputEvent) {
  isDeleteByDrag = event.inputType === 'deleteByDrag' || event.inputType === 'insertFromDrop'

  if (event.inputType === 'historyUndo') {
    event.preventDefault()
    noteEditor.undo()
    return
  } else if (event.inputType === 'historyRedo') {
    event.preventDefault()
    noteEditor.redo()
    return
  }
  noteEditor.historyTyping()
}

function onChange() {
  if (!isDeleteByDrag) {
    noteEditor.historyTyping(true)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

if (import.meta.client) {
  useSocketSubscribe(computed(() => ['note:delete']), async (event: string, data: unknown) => {
    const uuid = data as string

    if (uuid === noteUuid) {
      isDeleted.value = true
    }
  })

  useSocketSubscribe(computed(() => ['note:u']), async (event: string, data: unknown) => {
    const note = data as TNote

    await new Promise(res => setTimeout(res, 500))

    if (note.uuid === noteUuid && note.updatedUuid !== noteEditor.note?.updatedUuid) {
      noteEditor.noteUpdateByServer(note)

      notification.create({
        type: 'info',
        title: 'Заметка была измененна',
      })
    }
  })
}
</script>

<template>
  <div class="note-page">
    <h1 class="page-title">
      Редактирование
      <div class="note-uuid">
        {{ route.params.uuid }}
      </div>
    </h1>
    <h4>Название заметки</h4>
    <UITextInput
      v-model="noteEditor.form.title"
      @beforeinput="onBeforeInput"
      @change="onChange"
    />

    <h4>Список дел</h4>
    <UIBtn @click="noteEditor.todoCreate('Новая заметка')">Добавить</UIBtn>

    <div class="todo-list">
      <div
        v-for="(todo, index) in noteEditor.form.todos"
        :key="index"
        class="todo-list__record"
      >
        <UICheckbox
          :modelValue="todo.checked"
          @update:modelValue="onClickCheckbox(todo)"
        />
        <UITextInput
          v-model="todo.description"
          @beforeinput="onBeforeInput"
          @change="onChange"
        />
      </div>
    </div>

    <div class="action-list">
      <div>
        <UIBtn @click="noteEditor.undo()">undo</UIBtn>
        <UIBtn @click="noteEditor.redo()">redo</UIBtn>
      </div>
      <div>
        <UIBtn @click="noteSave()">Сохранить {{ isSaving ? '҉' : '' }}</UIBtn>
        <UIModal>
          <UIBtn>Удалить</UIBtn>
          <template #content>
            <h1>Точно удалить?</h1>
            <UIBtn @click="noteDelete()">Удалить</UIBtn>
          </template>
        </UIModal>
      </div>
    </div>

    <div
      v-if="isDeleted"
      class="overlay-is-deleted"
    >
      <h2>Заметка была удалена</h2>
      <NuxtLink to="/">
        <UIBtn>Домой</UIBtn>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.note-page {
  padding-bottom: 15px;

  .page-title {
    font-size: 1.4em;
    position: relative;

    .note-uuid {
      position: absolute;
      text-align: right;
      top: 0;
      right: 0;
      margin: 10px 0;
      font-size: 8px;
      opacity: 0.1;
      font-weight: 400;
    }
  }
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 50px;

  .todo-list__record {
    display: flex;
    gap: 5px;
  }
}

.action-list {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  &> div {
    display: flex;
    gap: 5px;
  }
}

.overlay-is-deleted {
  position: absolute;
  inset: 0;
  display: flex;
  background: #eeeeee77;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-shadow: 1px 1px 3px #777;
  backdrop-filter: blur(1.2px);
}
</style>
