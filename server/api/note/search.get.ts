import prisma from '@@/lib/prisma'

interface NoteGetQuery extends PaginatorQuery {
}

export default defineEventHandler(async (event): Promise<Paginator<TNote>> => {
  const query = getQuery<NoteGetQuery>(event)
  const perPage = Number(query.perPage || 30)
  const page = Number(query.page || 0)

  const data = await prisma.note.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    skip: page * perPage,
    take: perPage,
  }) as unknown as TNote[]

  const total = await prisma.note.count({
  })

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  }
})
