import { FastifyServer } from './infrastructure/web/fastify-server.js'
import { DatabaseConnection } from './infrastructure/database/connection.js'
import { ApplicationLifecycle } from './infrastructure/lifecycle/application-lifecycle.js'
import { ConfigService } from './infrastructure/config/config.service.js'

export class Application {
  private server: FastifyServer
  private dbConnection: DatabaseConnection
  private lifecycle: ApplicationLifecycle
  private config: ConfigService

  constructor() {
    this.config = ConfigService.getInstance()
    this.server = new FastifyServer()
    this.dbConnection = DatabaseConnection.getInstance()
    this.lifecycle = ApplicationLifecycle.getInstance()
    this.setupShutdownHandlers()
  }

  private setupShutdownHandlers(): void {
    // Register server shutdown handler
    this.lifecycle.addShutdownHandler(async () => {
      await this.server.stop()
    })

    // Register database shutdown handler
    this.lifecycle.addShutdownHandler(async () => {
      await this.dbConnection.disconnect()
    })
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await this.dbConnection.connect(this.config.mongoUri)

      // Start the server
      await this.server.start(this.config.port, this.config.host)

      console.log('🚀 Application started successfully!')
      console.log(`📊 Environment: ${this.config.get().nodeEnv}`)
      console.log(`🔗 API available at: http://${this.config.host}:${this.config.port}${this.config.apiPrefix}`)
    } catch (error) {
      console.error('❌ Failed to start application:', error)
      process.exit(1)
    }
  }
}

// Export instance for server.ts
export const app = new Application()
