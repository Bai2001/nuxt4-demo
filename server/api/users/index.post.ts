import { z } from 'zod'

export const userSchema = z.object({
  id: z.number().optional(),
  username: z.string().trim(),
  password_hash: z.string().trim(),
  role_id: z.number(),
  is_active: z.boolean().optional().default(true),
  created_at: z.date().optional(),
})

export default defineCustomHandler(async (event) => {
  const prisma = usePrisma()
  const body = await readBody(event)

  const user = userSchema.parse(body)
  return await prisma.users.create({
    data: user,
  })
})
