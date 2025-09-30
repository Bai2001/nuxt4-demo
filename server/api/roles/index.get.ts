export default defineCustomHandler(async (event) => {
  const prisma = usePrisma()
  return await prisma.roles.findMany({
    include: {
      users: true,
    },
  })
})
