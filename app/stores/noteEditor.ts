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

  async function noteFetch(noteUuid: string) {
    const noteModel = await $fetch<TNote>(`/api/note/${noteUuid}`)

    note.value = noteModel
    form.value.title = noteModel.title
    form.value.todos = noteModel.todos
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
      historyUndoPush()
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
    noteSave,
    noteDelete,
    todoCreate,
    todoDelete,
    undo,
    redo,
    historyTyping,

    undoHistory,
    redoHistory,
  }
})
