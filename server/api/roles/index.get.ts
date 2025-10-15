export default defineCustomHandler(async (event) => {
  return await prisma.roles.findMany({
    include: {
      users: {
        omit: {
          password_hash: true,
        },
      },
    },
  })
})
