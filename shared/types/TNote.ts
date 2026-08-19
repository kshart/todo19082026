import type { Note } from './prisma'

export interface TTodo {
  description: string
  checked: boolean
}

export interface TNote extends Omit<Note, 'todos'> {
  todos: TTodo[]
}

export type TNoteUpdateData = Partial<
  Pick<TNote, 'title' | 'todos'>
>
