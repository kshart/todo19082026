import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()
  const noteSchema = useNoteSchema()
  const { data, error } = await readValidatedBody(event, data => noteSchema.note.safeParse(data))

  if (error) {
    throw createError({ status: 422, data: error.flatten().fieldErrors })
  }

  const note = await prisma.note.create({
    data: {
      title: data.title,
      todos: data.todos,
    },
  })

  broadcast.publish('note:c', null)

  return note
})
