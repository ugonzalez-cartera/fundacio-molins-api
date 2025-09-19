import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

import { ConfigService } from '@/shared/infrastructure/config/config.service.js'

describe('ConfigService', () => {
  // Store original env vars to restore after tests
  const originalEnv = process.env

  beforeEach(() => {
    // Reset the singleton instance before each test
    // @ts-expect-error - Accessing private static property for testing
    ConfigService.instance = undefined

    // Reset environment variables
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('Singleton Pattern', () => {
    test('should create a singleton instance', () => {
      const instance1 = ConfigService.getInstance()
      const instance2 = ConfigService.getInstance()
      expect(instance1).toBe(instance2)
    })

    test('should return same instance across multiple calls', () => {
      const instances = Array.from({ length: 5 }, () => ConfigService.getInstance())
      const [firstInstance] = instances

      instances.forEach(instance => {
        expect(instance).toBe(firstInstance)
      })
    })
  })

  describe('Configuration Loading', () => {
    test('should load default configuration when no env vars provided', () => {
      // Clear environment variables
      delete process.env.PORT
      delete process.env.HOST
      delete process.env.NODE_ENV
      delete process.env.MONGODB_URI
      delete process.env.API_PREFIX

      const instance = ConfigService.getInstance()
      const config = instance.get()

      expect(config).toEqual({
        port: 3000,
        host: '0.0.0.0',
        nodeEnv: 'development',
        mongodb: {
          uri: 'mongodb://localhost:27017/fundacio-molins',
        },
        api: {
          prefix: '/api/v1',
        },
      })
    })

    test('should load configuration from environment variables', () => {
      process.env.PORT = '8080'
      process.env.HOST = '127.0.0.1'
      process.env.NODE_ENV = 'production'
      process.env.MONGODB_URI = 'mongodb://prod-server:27017/prod-db'
      process.env.API_PREFIX = '/api/v2'

      const instance = ConfigService.getInstance()
      const config = instance.get()

      expect(config).toEqual({
        port: 8080,
        host: '127.0.0.1',
        nodeEnv: 'production',
        mongodb: {
          uri: 'mongodb://prod-server:27017/prod-db',
        },
        api: {
          prefix: '/api/v2',
        },
      })
    })

    test('should handle invalid PORT as number', () => {
      process.env.PORT = 'invalid-port'

      const instance = ConfigService.getInstance()
      const config = instance.get()

      expect(config.port).toBeNaN()
    })
  })

  describe('Individual Getters', () => {
    beforeEach(() => {
      process.env.PORT = '4000'
      process.env.HOST = 'localhost'
      process.env.NODE_ENV = 'test'
      process.env.MONGODB_URI = 'mongodb://test:27017/test-db'
      process.env.API_PREFIX = '/api/test'
    })

    test('should return correct port', () => {
      const instance = ConfigService.getInstance()
      expect(instance.port).toBe(4000)
    })

    test('should return correct host', () => {
      const instance = ConfigService.getInstance()
      expect(instance.host).toBe('localhost')
    })

    test('should return correct mongo URI', () => {
      const instance = ConfigService.getInstance()
      expect(instance.mongoUri).toBe('mongodb://test:27017/test-db')
    })

    test('should return correct API prefix', () => {
      const instance = ConfigService.getInstance()
      expect(instance.apiPrefix).toBe('/api/test')
    })
  })

  describe('Environment Detection', () => {
    test('should detect development environment', () => {
      process.env.NODE_ENV = 'development'

      const instance = ConfigService.getInstance()
      expect(instance.isDevelopment).toBe(true)
      expect(instance.isProduction).toBe(false)
    })

    test('should detect production environment', () => {
      process.env.NODE_ENV = 'production'

      const instance = ConfigService.getInstance()
      expect(instance.isDevelopment).toBe(false)
      expect(instance.isProduction).toBe(true)
    })

    test('should default to development when NODE_ENV not set', () => {
      delete process.env.NODE_ENV

      const instance = ConfigService.getInstance()
      expect(instance.isDevelopment).toBe(true)
      expect(instance.isProduction).toBe(false)
    })

    test('should handle custom environment values', () => {
      process.env.NODE_ENV = 'staging'

      const instance = ConfigService.getInstance()
      expect(instance.isDevelopment).toBe(false)
      expect(instance.isProduction).toBe(false)
    })
  })

  describe('Configuration Structure', () => {
    test('should return configuration object with correct structure', () => {
      const instance = ConfigService.getInstance()
      const config = instance.get()

      expect(config).toHaveProperty('port')
      expect(config).toHaveProperty('host')
      expect(config).toHaveProperty('nodeEnv')
      expect(config).toHaveProperty('mongodb')
      expect(config).toHaveProperty('api')

      expect(config.mongodb).toHaveProperty('uri')
      expect(config.api).toHaveProperty('prefix')
    })

    test('should return configuration with correct types', () => {
      const instance = ConfigService.getInstance()
      const config = instance.get()

      expect(typeof config.port).toBe('number')
      expect(typeof config.host).toBe('string')
      expect(typeof config.nodeEnv).toBe('string')
      expect(typeof config.mongodb.uri).toBe('string')
      expect(typeof config.api.prefix).toBe('string')
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty string PORT', () => {
      process.env.PORT = ''

      const instance = ConfigService.getInstance()
      expect(instance.port).toBe(3000) // Should fallback to default
    })

    test('should handle zero PORT', () => {
      process.env.PORT = '0'

      const instance = ConfigService.getInstance()
      expect(instance.port).toBe(0)
    })

    test('should handle negative PORT', () => {
      process.env.PORT = '-1'

      const instance = ConfigService.getInstance()
      expect(instance.port).toBe(-1)
    })

    test('should handle empty string environment variables', () => {
      process.env.HOST = ''
      process.env.NODE_ENV = ''
      process.env.MONGODB_URI = ''
      process.env.API_PREFIX = ''

      const instance = ConfigService.getInstance()
      const config = instance.get()

      expect(config.host).toBe('0.0.0.0') // Should use default
      expect(config.nodeEnv).toBe('development') // Should use default
      expect(config.mongodb.uri).toBe('mongodb://localhost:27017/fundacio-molins') // Should use default
      expect(config.api.prefix).toBe('/api/v1') // Should use default
    })
  })
})
