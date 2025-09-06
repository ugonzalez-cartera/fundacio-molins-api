import Fastify, { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyMultipart from '@fastify/multipart'
import autoload from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

export class FastifyServer {
  private app: FastifyInstance

  constructor() {
    this.app = this.createServer()
    this.setupMiddleware()
    this.setupRoutes()
    this.setupHooks()
  }

  private createServer(): FastifyInstance {
    const fastifyOptions = this.getFastifyOptions()
    return Fastify(fastifyOptions)
  }

  private getFastifyOptions() {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      return {
        disableRequestLogging: true,
        logger: {
          level: 'info',
        },
        ignoreTrailingSlash: true,
      }
    } else {
      console.info('Setting logging options with ALL levels.')
      return {
        logger: true,
        ignoreTrailingSlash: true,
      }
    }
  }

  private setupMiddleware(): void {
    this.app
      .register(fastifyCors, {})
      .register(fastifyHelmet)
      .register(fastifyMultipart, {
        limits: {
          fieldNameSize: 100,
          fieldSize: 100000,
          fields: 10,
          fileSize: 4000000, // Max 4MB
          files: 5,
          headerPairs: 1000,
        },
      })
  }

  private setupRoutes(): void {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    // Register all routes
    this.app.register(autoload, {
      dir: join(__dirname, '../adapters/http/routes'),
      options: { prefix: '/api/v1' },
      matchFilter: (path: string) => path.endsWith('.routes.js') || path.endsWith('.routes.ts'),
    })
  }

  private setupHooks(): void {
    // Add global hooks here
    // this.app.addHook('onRequest', verifyToken)
    // this.app.addHook('onRequest', authorize)

    this.app.ready(err => {
      if (!err) {
        if (process.env.NODE_ENV === 'development') {
          console.info('Fastify server ready in development mode.')
        }
      } else {
        console.error('Fastify init error', err)
      }
    })
  }

  public getInstance(): FastifyInstance {
    return this.app
  }

  public async start(port = 3000, host = '0.0.0.0'): Promise<void> {
    try {
      await this.app.listen({ port, host })
      console.log(`Server listening on http://${host}:${port}`)
    } catch (error) {
      console.error('Error starting server:', error)
      process.exit(1)
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.app.close()
      console.log('Server stopped gracefully')
    } catch (error) {
      console.error('Error stopping server:', error)
    }
  }
}
