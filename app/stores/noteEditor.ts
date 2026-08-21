type TNoteForm = Required<TNoteUpdateData>

export const useNoteEditor = defineStore('noteEditor', () => {
  const note = ref<TNote | null>(null)
  const form = ref<TNoteForm>({
    title: '',
    todos: [],
  })
  const undoHistory = ref<TNoteForm[]>([])
  const redoHistory = ref<TNoteForm[]>([])

  function historyClear() {
    undoHistory.value = []
    redoHistory.value = []
  }

  function noteRestoreBackup() {
    if (import.meta.server) {
      return
    }
    watch(() => note.value?.uuid, value => sessionStorage.setItem('noteEditor/uuid', value || ''))
    watch(form, value => sessionStorage.setItem('noteEditor/form', JSON.stringify(value)), { deep: true })
    watch(undoHistory, value => sessionStorage.setItem('noteEditor/undoHistory', JSON.stringify(value)), { deep: true })
    watch(redoHistory, value => sessionStorage.setItem('noteEditor/redoHistory', JSON.stringify(value)), { deep: true })

    const savedUuid = sessionStorage.getItem('noteEditor/uuid')
    if (savedUuid && savedUuid === note.value?.uuid) {
      try {
        const undoHistorySaved = JSON.parse(sessionStorage.getItem('noteEditor/undoHistory') || '')

        if (undoHistorySaved) {
          undoHistory.value = undoHistorySaved
        }
      } catch (e) {
        console.error(e)
      }

      try {
        const redoHistorySaved = JSON.parse(sessionStorage.getItem('noteEditor/redoHistory') || '')

        if (redoHistorySaved) {
          redoHistory.value = redoHistorySaved
        }
      } catch (e) {
        console.error(e)
      }

      try {
        const formSaved = JSON.parse(sessionStorage.getItem('noteEditor/form') || '')

        if (formSaved) {
          form.value = formSaved
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function noteFetch(noteUuid: string) {
    const noteModel = await $fetch<TNote>(`/api/note/${noteUuid}`, {
      onResponseError({ response }) {
        throw createError({
          statusCode: response.status,
          message: response?._data?.message,
        })
      },
    })

    note.value = noteModel
    form.value.title = noteModel.title
    form.value.todos = noteModel.todos
    historyClear()
  }

  async function noteUpdateByServer(newNote: TNote) {
    if (!note.value) {
      return
    }

    note.value = newNote
    form.value.title = newNote.title
    form.value.todos = newNote.todos
    historyClear()
  }

  async function noteSave() {
    if (!note.value) {
      throw new Error('Note not loaded')
    }

    const noteModel = await $fetch<TNote>(`/api/note/${note.value.uuid}`, { method: 'POST', body: form.value })

    note.value = noteModel
    form.value.title = noteModel.title
    form.value.todos = noteModel.todos
    historyClear()
  }

  async function noteDelete() {
    if (!note.value) {
      return
    }

    await $fetch(`/api/note/${note.value.uuid}`, { method: 'DELETE' })
  }

  function todoDelete(index: number) {
    historyUndoPush(true)
    form.value.todos.splice(index, 1)
  }

  function todoCreate(description: string) {
    historyUndoPush(true)
    form.value.todos.push({
      description,
      checked: false,
    })
  }

  function historyUndoPush(force: boolean = false) {
    undoHistory.value.unshift(structuredClone(toRaw(form.value)))

    if (force) {
      redoHistory.value = []
    }
  }

  function historyRedoPush() {
    redoHistory.value.unshift(structuredClone(toRaw(form.value)))
  }

  let historyTypingTimeoutId: ReturnType<typeof setTimeout> | null = null

  function historyTypingFinish() {
    historyTypingTimeoutId = null

    console.log('historyTypingFinish')
  }

  function historyTyping(force: boolean = false) {
    if (import.meta.server) {
      return
    }

    if (historyTypingTimeoutId) {
      clearTimeout(historyTypingTimeoutId)
    } else {
      historyUndoPush(true)
    }

    if (force) {
      historyTypingFinish()
    } else {
      historyTypingTimeoutId = setTimeout(historyTypingFinish, 10000)
    }
  }

  function undo() {
    const prevForm = undoHistory.value.splice(0, 1)[0]

    if (!prevForm) {
      return
    }

    historyRedoPush()
    form.value = prevForm
  }

  function redo() {
    const prevForm = redoHistory.value.splice(0, 1)[0]

    if (!prevForm) {
      return
    }

    historyUndoPush()
    form.value = prevForm
  }

  return {
    note,
    form,
    noteFetch,
    noteRestoreBackup,
    noteSave,
    noteDelete,
    noteUpdateByServer,
    todoCreate,
    todoDelete,
    undo,
    redo,
    historyTyping,

    undoHistory,
    redoHistory,
  }
})
