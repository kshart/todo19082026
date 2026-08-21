import { z } from 'zod'

const note = z.object({
  title: z.string().min(1, { error: 'Заголовок не может быть пустым' }).max(64, { error: 'Заголовок слишком длинный' }),
  todos: z.array(z.object({
    description: z.string().min(1, { error: 'Описание todo не может быть пустым' }).max(128, { error: 'Описание todo слишком большое' }),
    checked: z.boolean(),
  })),
})

const uuid = z.uuid({ error: 'id не корректный' })

export function useNoteSchema() {
  return {
    note,
    uuid,
  }
}
