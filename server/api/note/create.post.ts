import { z } from 'zod'
import prisma from '@@/lib/prisma'

const noteSchema = z.object({
  title: z.string().max(64),
  todos: z.array(z.object({
    description: z.string().max(128),
    checked: z.boolean(),
  })),
})

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()
  const data = await readValidatedBody(event, noteSchema.parse)

  const note = await prisma.note.create({
    data: {
      title: data.title,
      todos: data.todos,
    },
  })

  broadcast.publish('note:c', null)

  return note
})
