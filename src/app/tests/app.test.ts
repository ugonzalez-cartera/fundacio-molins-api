import { describe, expect, test, beforeEach } from 'vitest'
import { Application, app } from '@/app/app.js'

describe('Application', () => {
  let application: Application

  beforeEach(() => {
    application = new Application()
  })

  describe('Constructor and Dependencies', () => {
    test('should create an instance of Application', () => {
      expect(application).toBeInstanceOf(Application)
    })

    test('should have start method', () => {
      expect(typeof application.start).toBe('function')
    })

    test('should initialize with required dependencies', () => {
      // Test that the application can be constructed without errors
      expect(() => new Application()).not.toThrow()
    })
  })

  describe('Exported App Instance', () => {
    test('should export a default app instance', () => {
      expect(app).toBeInstanceOf(Application)
      expect(app).toBeDefined()
    })

    test('should have start method on exported instance', () => {
      expect(typeof app.start).toBe('function')
    })
  })

  describe('Application Class Structure', () => {
    test('should be a class with constructor', () => {
      expect(typeof Application).toBe('function')
      expect(Application.prototype.constructor).toBe(Application)
    })

    test('should have start method in prototype', () => {
      expect('start' in Application.prototype).toBe(true)
      expect(typeof Application.prototype.start).toBe('function')
    })

    test('should create multiple instances', () => {
      const app1 = new Application()
      const app2 = new Application()

      expect(app1).toBeInstanceOf(Application)
      expect(app2).toBeInstanceOf(Application)
      expect(app1).not.toBe(app2) // Different instances
    })
  })

  describe('Method Signatures', () => {
    test('start method should return a Promise', () => {
      // Note: We're not calling start() to avoid actual DB/server connections
      // Just checking the method exists and has correct signature
      expect(application.start).toBeDefined()
      expect(typeof application.start).toBe('function')

      // Check if it's an async function by looking at constructor name
      expect(application.start.constructor.name).toBe('AsyncFunction')
    })
  })
})
