import { PrismaClient } from '@prisma/client'
import log from '../src/helpers/logger'

const prisma = new PrismaClient()

const main = async (): Promise<void> => {
  await prisma.category.deleteMany()

  await prisma.category.createMany({
    data: [
      {
        title: 'Technology',
      },
      {
        title: 'Foods',
      },
      {
        title: 'Nature',
      },
      {
        title: 'Animals',
      },
      {
        title: 'Movies',
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    log.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
