import type { Note } from './prisma'

export interface TTodo {
  description: string
  checked: boolean
}

export interface TNote extends Omit<Note, 'todos' | 'createdAt' | 'updatedAt'> {
  todos: TTodo[]
  createdAt: string
  updatedAt: string
}

export type TNoteUpdateData = Partial<
  Pick<TNote, 'title' | 'todos'>
>
