const userSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, '必须是数字')
    .transform((val) => Number(val))
    .optional(),
  username: z.string().trim().optional(),
  role_id: z.number().optional(),
  is_active: z.boolean().optional().default(true),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
})

export default defineCustomHandler(async (event) => {
  const query = userSchema.parse(getQuery(event))

  const usersWhere = { id: query.id }
  const users = await prisma.users.findMany({
    where: usersWhere,
    include: {
      roles: {
        select: {
          role_level: true,
          role_name: true,
        },
      },
    },
    omit: {
      password_hash: true,
    },
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
  })

  const count = await prisma.users.count({
    where: usersWhere,
  })

  // const d = Date.now()
  // while (Date.now() - d < 2000) {}

  return { users, total: count }
})
