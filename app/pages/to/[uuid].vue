<script setup lang="ts">
const route = useRoute()
const noteUuid = String(route.params.uuid || '')
const noteEditor = useNoteEditor()

await callOnce(() => noteEditor.noteFetch(noteUuid))

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

function onChange(event) {
  if (!isDeleteByDrag) {
    noteEditor.historyTyping(true)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div>
    <input>
    {{ route.params.uuid }}

    <input
      v-model="noteEditor.form.title"
      @beforeinput="onBeforeInput"
      @change="onChange"
    >

    <TBtn @click="noteEditor.todoCreate('asd')">todoCreate</TBtn>

    <div
      v-for="(todo, index) in noteEditor.form.todos"
      :key="index"
    >
      <input
        v-model="todo.description"
        @beforeinput="onBeforeInput"
        @change="onChange"
      >
      <input
        v-model="todo.checked"
        type="checkbox"
        :name="`checkbox${index}`"
      >
    </div>

    <TBtn @click="noteEditor.undo()">undo</TBtn>
    <TBtn @click="noteEditor.redo()">redo</TBtn>
    <TBtn @click="noteDelete()">удалить</TBtn>

    <h1>undoHistory</h1>
    <pre style="font-size:9px">{{ noteEditor.undoHistory }}</pre>
    <h1>redoHistory</h1>
    <pre style="font-size:9px">{{ noteEditor.redoHistory }}</pre>
  </div>
</template>
