import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()
  const uuid = String(event.context.params?.uuid)
  const noteSchema = useNoteSchema()
  const { success } = noteSchema.uuid.safeParse(uuid)

  if (!success) {
    throw createError({ status: 404, message: 'Заметка не найдена' })
  }

  await prisma.note.delete({
    where: { uuid },
  })

  broadcast.publish('note:delete', uuid)

  return true
})
