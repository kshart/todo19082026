import { FetchError } from 'ofetch'

interface Notification {
  type: 'info' | 'warn'
  title: string
  text?: string
}

export const useNotification = defineStore('notification', () => {
  const list = ref<Notification[]>([])

  function remove(notification: Notification) {
    const index = list.value.indexOf(notification)

    list.value.splice(index, 1)
  }

  function create(notification: Notification) {
    if (import.meta.server) {
      throw new Error('Уведомления нельзя создавать на сервере')
    }

    list.value.unshift(notification)
    setTimeout(() => remove(notification), 3000)
  }

  function createByFetchError(notification: Notification, error: unknown) {
    let text: string | undefined = undefined

    if (error instanceof FetchError) {
      text = Object.values(error.data.data).flat().join('\n')
    } else if (error instanceof Error) {
      text = error.message
    }

    create({
      ...notification,
      text,
    })
  }

  return {
    list: computed(() => list.value),
    remove,
    create,
    createByFetchError,
  }
})
