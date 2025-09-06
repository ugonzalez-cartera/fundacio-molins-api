import Fastify, { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyMultipart from '@fastify/multipart'

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
        routerOptions: {
          ignoreTrailingSlash: true,
        },
      }
    } else {
      console.info('Setting logging options with ALL levels.')
      return {
        logger: true,
        routerOptions: {
          ignoreTrailingSlash: true,
        },
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
    // Manually register routes instead of using autoload
    // since we're running TypeScript directly with tsx
    this.app.register(
      async fastify => {
        const patronRoutes = await import('./infrastructure/adapters/http/routes/patron.routes.js')
        await fastify.register(patronRoutes.default, { prefix: '/api/v1' })
      },
    )
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
      // console.log(`Server listening on http://${host}:${port}`)
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
