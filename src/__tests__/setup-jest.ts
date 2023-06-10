import prisma from '../libs/prisma'

beforeEach(async () => {
  await prisma.category.createMany({
    data: [
      {
        id: '42c26670-f7a5-4d20-9466-1a9c81465e08',
        title: 'Technology',
      },
      {
        id: '42c26670-f7a5-4d20-9466-1a9d81465e09',
        title: 'Foods',
      },
      {
        id: '42c26678-f7a7-4d20-9467-1a9d81465e10',
        title: 'Nature',
      },
      {
        id: '54d26678-f7a7-4d40-9468-1a9d81465e07',
        title: 'Animals',
      },
      {
        id: '54d26678-f8a7-4d40-9468-1a9d81465e06',
        title: 'Movies',
      },
    ],
  })
})

afterEach(async () => {
  await prisma.category.deleteMany()
})
