import 'reflect-metadata'

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { Container } from 'typedi'
import { PrismaClient } from '@prisma/client'
import { useExpressServer, useContainer } from 'routing-controllers'

import prisma from './libs/prisma'
import { constants } from './constants'
import { CategoryController } from './controllers/category.controller'
import { AuthController } from './controllers/auth.controller'
import { DeserializeUserMiddleware } from './middlewares/deserialize-user.middleware'
import { currentUserChecker } from './helpers/currentUserChecker'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Setup Dependency Injection.
Container.set<PrismaClient>(constants.PRISMA_CLIENT, prisma)
useContainer(Container)

// Setup existing app with routing controllers.
useExpressServer(app, {
  routePrefix: '/api/v1',
  validation: { whitelist: true },
  controllers: [CategoryController, AuthController],
  middlewares: [DeserializeUserMiddleware],
  currentUserChecker,
})

/**
 * @openapi
 * /health:
 *  get:
 *    tags:
 *     - Health Check
 *    description: Responds if the app is up and running.
 *    responses:
 *      200:
 *        description: App is up and running.
 */
app.get('/health', (_, res) => {
  res.status(200).json('API is up and running.')
})

export default app
