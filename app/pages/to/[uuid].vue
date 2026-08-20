<script setup lang="ts">
const route = useRoute()
const noteUuid = String(route.params.uuid || '')
const noteEditor = useNoteEditor()

await callOnce(noteUuid, () => noteEditor.noteFetch(noteUuid))

if (!noteEditor.note) {
  throw createError({ statusCode: 404 })
}

useHead({
  title: `Note: ${noteEditor.note.title}`,
})

async function noteDelete() {
  await noteEditor.noteDelete()

  return navigateTo('/')
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
    <TTextInput
      v-model="noteEditor.form.title"
      @beforeinput="onBeforeInput"
      @change="onChange"
    />

    <h4>Список дел</h4>
    <TBtn @click="noteEditor.todoCreate('asd')">Добавить</TBtn>

    <div class="todo-list">
      <div
        v-for="(todo, index) in noteEditor.form.todos"
        :key="index"
        class="todo-list__record"
      >
        <TCheckbox
          :modelValue="todo.checked"
          @update:modelValue="onClickCheckbox(todo)"
        />
        <TTextInput
          v-model="todo.description"
          @beforeinput="onBeforeInput"
          @change="onChange"
        />
      </div>
    </div>

    <div class="action-list">
      <div>
        <TBtn @click="noteEditor.undo()">undo</TBtn>
        <TBtn @click="noteEditor.redo()">redo</TBtn>
      </div>
      <div>
        <TBtn @click="noteEditor.noteSave()">Сохранить</TBtn>
        <TModal>
          <TBtn>Удалить</TBtn>
          <template #content>
            <h1>Точно удалить?</h1>
            <TBtn @click="noteDelete()">Удалить</TBtn>
          </template>
        </TModal>
      </div>
    </div>
  </div>

  <h1>undoHistory</h1>
  <pre style="font-size:9px">{{ noteEditor.undoHistory }}</pre>
  <h1>redoHistory</h1>
  <pre style="font-size:9px">{{ noteEditor.redoHistory }}</pre>
</template>

<style scoped lang="scss">
.note-page {
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
</style>
