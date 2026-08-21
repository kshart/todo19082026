import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  const uuid = String(event.context.params?.uuid)
  const noteSchema = useNoteSchema()
  const { success } = noteSchema.uuid.safeParse(uuid)

  if (!success) {
    throw createError({ status: 404, message: 'Заметка не найдена' })
  }

  const note = await prisma.note.findUnique({
    where: { uuid },
  })

  if (!note) {
    throw createError({ status: 404, message: 'Заметка не найдена' })
  }

  return note
})
