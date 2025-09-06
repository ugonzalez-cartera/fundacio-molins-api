import mongoose from 'mongoose'

export class DatabaseConnection {
  private static instance: DatabaseConnection
  private isConnected = false

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      console.info('Already connected to database')
      return
    }

    try {
      await mongoose.connect(uri)

      this.isConnected = true
      console.info('Connected to MongoDB successfully')

      // Handle connection events
      mongoose.connection.on('error', error => {
        console.error('MongoDB connection error:', error)
      })

      mongoose.connection.on('disconnected', () => {
        console.info('MongoDB disconnected')
        this.isConnected = false
      })

      mongoose.connection.on('reconnected', () => {
        console.info('MongoDB reconnected')
        this.isConnected = true
      })
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      await mongoose.disconnect()
      this.isConnected = false
      console.info('Disconnected from MongoDB')
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
      throw error
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected
  }
}
