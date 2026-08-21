import { v4 as uuidV4 } from 'uuid'
import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()
  const noteSchema = useNoteSchema()
  const uuid = String(event.context.params?.uuid)
  const { data, error } = await readValidatedBody(event, data => noteSchema.note.safeParse(data))

  if (error) {
    throw createError({ status: 422, data: error.flatten().fieldErrors })
  }

  const noteExsist = await prisma.note.count({
    where: { uuid },
  })

  if (!noteExsist) {
    throw createError({ status: 404 })
  }

  const note = await prisma.note.update({
    where: { uuid },
    data: {
      ...data,
      updatedUuid: uuidV4(),
    },
  })

  broadcast.publish('note:u', note)

  return note
})
