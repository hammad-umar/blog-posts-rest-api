import app from './server'
import log from './helpers/logger'
import { PORT } from './env'
import swaggerDocs from './libs/swagger'

const port = PORT || 1337

const server = app.listen(port, () => {
  log.info(`Server is up on port:${port}`)

  swaggerDocs(app, port)
})

process.on('SIGTERM', () => {
  log.error('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    log.error('HTTP server closed')
    process.exit(1)
  })
})
