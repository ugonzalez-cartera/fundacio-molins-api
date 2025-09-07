import Fastify, { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyMultipart from '@fastify/multipart'
import chalk from 'chalk'

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
    // Health check endpoint
    this.app.get('/healthz', async (request, reply) => {
      reply.send({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      })
    })

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
          // Add a small delay to ensure all routes are registered
          setTimeout(() => {
            this.printRoutes()
          }, 100)
        }
      } else {
        console.error('Fastify init error', err)
      }
    })
  }

  private printRoutes(): void {
    try {
      console.info(chalk.white(`\n🚀 Registered Routes (NODE_ENV: ${process.env.NODE_ENV || 'undefined'}):`))
      console.info(chalk.yellow('='.repeat(50)))

      const routes = this.app.printRoutes({ commonPrefix: false })

      if (routes.trim()) {
        // Print each line of routes in green.
        routes.split('\n').forEach(line => {
          console.info(chalk.green(line))
        })
      }

      console.info(chalk.yellow('='.repeat(50)))
      console.info('')
    } catch (error) {
      console.info(chalk.red('❌ Error printing routes:'), error)
    }
  }

  public getInstance(): FastifyInstance {
    return this.app
  }

  public async start(port = 3000, host = '0.0.0.0'): Promise<void> {
    try {
      await this.app.listen({ port, host })
      console.info(`Server listening on http://${host}:${port}`)

      // Always print routes in development (when not production)
      if (process.env.NODE_ENV !== 'production') {
        this.printRoutes()
      }
    } catch (error) {
      console.error('Error starting server:', error)
      process.exit(1)
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.app.close()
      console.info('Server stopped gracefully')
    } catch (error) {
      console.error('Error stopping server:', error)
    }
  }
}
