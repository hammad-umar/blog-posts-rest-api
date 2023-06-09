import { Express, Request, Response } from 'express'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import log from '../helpers/logger'
import { version } from '../../package.json'

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blogify Rest API Docs',
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/controllers/*.ts', './src/server.ts', './src/dtos/**/*.ts'],
}

const swaggerSpec = swaggerJsDoc(options)

const swaggerDocs = (app: Express, port: number): void => {
  // Swagger page
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Swagger JSON format docs
  app.get('/api/v1/docs.json', (_: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(swaggerSpec)
  })

  log.info(`Swaggers docs available at > http://localhost:${port}/api/v1/docs`)
}

export default swaggerDocs
