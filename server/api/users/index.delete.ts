import { z } from 'zod'

export const userSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, '必须是数字')
    .transform((val) => Number(val)),
})

export default defineCustomHandler(async (event) => {
  const prisma = usePrisma()

  const data = userSchema.parse(getQuery(event))

  return await prisma.users.delete({
    where: {
      id: data.id,
    },
  })
})
