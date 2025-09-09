export interface AppConfig {
  port: number
  host: string
  nodeEnv: string
  mongodb: {
    uri: string
  }
  api: {
    prefix: string
  }
}

export class ConfigService {
  private static instance: ConfigService
  private config: AppConfig

  private constructor() {
    this.config = this.loadConfig()
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  private loadConfig(): AppConfig {
    return {
      port: parseInt(process.env.PORT || '3000', 10),
      host: process.env.HOST || '0.0.0.0',
      nodeEnv: process.env.NODE_ENV || 'development',
      mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fundacio-molins',
      },
      api: {
        prefix: process.env.API_PREFIX || '/api/v1',
      },
    }
  }

  public get(): AppConfig {
    return this.config
  }

  public get port(): number {
    return this.config.port
  }

  public get host(): string {
    return this.config.host
  }

  public get isDevelopment(): boolean {
    return this.config.nodeEnv === 'development'
  }

  public get isProduction(): boolean {
    return this.config.nodeEnv === 'production'
  }

  public get mongoUri(): string {
    return this.config.mongodb.uri
  }

  public get apiPrefix(): string {
    return this.config.api.prefix
  }
}
