import { FastifyServer } from '@/shared/infrastructure/server/fastify-server.js'
import { DatabaseConnection } from '@/shared/infrastructure/persistence/database/connection.js'
import { ApplicationLifecycle } from '@/shared/infrastructure/lifecycle/application-lifecycle.js'
import { ConfigService } from '@/shared/infrastructure/config/config.service.js'

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

  async start(): Promise<void> {
    await this.dbConnection.connect(this.config.mongoUri)

    const { port, host } = this.config

    await this.server.start(port, host)
  }
}

// Export instance for index.ts
export const app = new Application()
