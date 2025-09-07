import mongoose from 'mongoose'

export class ApplicationLifecycle {
  private static instance: ApplicationLifecycle
  private shutdownHandlers: Array<() => Promise<void>> = []

  private constructor() {
    this.setupGracefulShutdown()
  }

  public static getInstance(): ApplicationLifecycle {
    if (!ApplicationLifecycle.instance) {
      ApplicationLifecycle.instance = new ApplicationLifecycle()
    }
    return ApplicationLifecycle.instance
  }

  public addShutdownHandler(handler: () => Promise<void>): void {
    this.shutdownHandlers.push(handler)
  }

  private setupGracefulShutdown(): void {
    const gracefulExit = async () => {
      console.info('>> Graceful exit initiated...')

      // Handle MongoDB connection
      await this.handleMongooseShutdown()

      // Execute all registered shutdown handlers
      for (const handler of this.shutdownHandlers) {
        try {
          await handler()
        } catch (error) {
          console.error('Error executing shutdown handler:', error)
        }
      }

      console.info('>> Exiting process...')
      process.exit(0)
    }

    process.on('SIGINT', gracefulExit) // Handle Ctrl+C
    process.on('SIGTERM', gracefulExit) // Handle termination signals
    process.on('exit', gracefulExit) // Handle normal exit
  }

  private async handleMongooseShutdown(): Promise<void> {
    console.info('>> Graceful exit. Mongoose connection status:', mongoose.connection.readyState)

    if (mongoose.connection.readyState === 1) {
      console.info('   Closing Mongoose connection...')
      await mongoose.connection.close()
      console.info('   Mongoose DB connection is now disconnected through app termination.')
    }
  }
}
