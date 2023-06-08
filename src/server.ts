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

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

Container.set<PrismaClient>(constants.PRISMA_CLIENT, prisma)
useContainer(Container)

useExpressServer(app, {
  routePrefix: '/api/v1',
  validation: { whitelist: true },
  controllers: [CategoryController],
})

app.get('/health', (_, res) => {
  res.status(200).json({ message: 'API is running...' })
})

export default app
