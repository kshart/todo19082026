import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()
  const uuid = String(event.context.params?.uuid)

  await prisma.note.delete({
    where: { uuid },
  })

  broadcast.publish('note:delete', { uuid })

  return true
})
