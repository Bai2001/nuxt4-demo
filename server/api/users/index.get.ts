export default defineCustomHandler(async (event) => {
  const prisma = usePrisma()
  const users = await prisma.users.findMany({
    include: {
      roles: true,
    },
  })

  return { users }
})
