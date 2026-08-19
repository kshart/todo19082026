import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  const uuid = String(event.context.params?.uuid)

  return await prisma.note.findUnique({
    where: { uuid },
  })
})
