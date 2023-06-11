import { Action } from 'routing-controllers'
import prisma from '../libs/prisma'
import { omit } from 'lodash'

export const currentUserChecker = async (action: Action) => {
  const { response } = action
  const userId: string = response.locals.user.userId || ''

  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return omit(user, 'password')
  }
}
