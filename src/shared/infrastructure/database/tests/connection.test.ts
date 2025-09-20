import { describe, test, expect } from 'vitest'

import { DatabaseConnection } from '../connection'

describe('Database Connection', () => {
  test('should return the same instance (singleton)', () => {
    const instance1 = DatabaseConnection.getInstance()
    const instance2 = DatabaseConnection.getInstance()
    expect(instance1).toBe(instance2)
  })
})
