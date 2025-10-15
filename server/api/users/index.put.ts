const userSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, '必须是数字')
    .transform((val) => Number(val)),
  username: z.string().trim().optional(),
  password_hash: z.string().trim().optional(),
  role_id: z.number().optional(),
  is_active: z.boolean().optional().default(true),
  created_at: z.date().optional(),
})

export default defineCustomHandler(async (event) => {
  const body = await readBody(event)

  const data = userSchema.parse(body)

  return await prisma.users.update({
    where: { id: data.id },
    data,
  })
})
