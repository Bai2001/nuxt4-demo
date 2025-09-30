import { PrismaClient } from '~~/lib/prismaClient'

const prismaClientSingleton = () => {
  const prisma = new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          console.log('operation', operation)
          console.log('model', model)
          console.log('args', args)
          return query(args)
        },
      },
    },
  })

  return prisma
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma: ReturnType<typeof prismaClientSingleton> =
  globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export default prisma
