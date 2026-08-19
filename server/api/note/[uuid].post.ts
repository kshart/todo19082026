import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()
  const uuid = String(event.context.params?.uuid)
  const data = await readBody<TNoteUpdateData>(event)

  const note = await prisma.note.findFirstOrThrow({
    where: { uuid },
  })

  broadcast.publish('note:u', { note })

  return note
})
