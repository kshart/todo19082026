import { z } from 'zod'
import prisma from '@@/lib/prisma'

const noteUpdateSchema = z.object({
  title: z.string().min(1).max(64),
  todos: z.array(z.object({
    description: z.string().min(1).max(128),
    checked: z.boolean(),
  })),
})

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()
  const uuid = String(event.context.params?.uuid)
  const data = await readValidatedBody(event, noteUpdateSchema.parse)

  const noteExsist = await prisma.note.count({
    where: { uuid },
  })

  if (!noteExsist) {
    throw createError({ status: 404 })
  }

  const note = await prisma.note.update({
    where: { uuid },
    data,
  })

  broadcast.publish('note:u', { note })

  return note
})
