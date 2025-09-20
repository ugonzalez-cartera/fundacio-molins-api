import { test, describe, expect, beforeEach } from 'vitest'

import { Patron } from '@/contexts/user/patron/domain/patron.entity.js'
import { ValidationError } from '@/shared/errors.js'

describe('Patron Entity', () => {
  test('should create new Patron', () => {
    const patron = Patron.create({
      id: '123',
      givenName: 'John',
      familyName: 'Doe',
      email: 'johndoe@test.com',
      role: 'admin',
      position: 'director',
      renovationDate: new Date('2023-01-01'),
      endingDate: new Date('2024-01-01'),
    })

    expect(patron).toBeInstanceOf(Patron)
    expect(patron.givenName).toBe('John')
    expect(patron.familyName).toBe('Doe')
    expect(patron.email).toBe('johndoe@test.com')
  })
})

describe('Patron property setters', () => {
  let patron: Patron

  beforeEach(() => {
    patron = Patron.create({
      id: '123',
      givenName: 'John',
      familyName: 'Doe',
      email: 'johndoe@test.com',
      role: 'admin',
      position: 'director',
      renovationDate: new Date('2023-01-01'),
      endingDate: new Date('2024-01-01'),
    })
  })

  test('should set new position', () => {
    patron.position = 'new position'
    expect(patron.position).toBe('new position')
  })

  test('should set new renovationDate', () => {
    const newDate = new Date('2023-06-01')
    patron.renovationDate = newDate
    expect(patron.renovationDate).toEqual(newDate)
  })

  test('should set new endingDate', () => {
    const newDate = new Date('2024-06-01')
    patron.endingDate = newDate
    expect(patron.endingDate).toEqual(newDate)
  })

  test('should throw ValidationError for empty position', () => {
    expect(() => {
      patron.position = ''
    }).toThrow(ValidationError)
  })

  test('should throw ValidationError for whitespace position', () => {
    expect(() => {
      patron.position = '   '
    }).toThrow(ValidationError)
  })

  test('should throw validation error if position is too short', () => {
    expect(() => {
      patron.position = 'a'
    }).toThrow(ValidationError)
  })

  test('should throw validation error if position exceeds max length', () => {
    expect(() => {
      patron.position = 'a'.repeat(101)
    }).toThrow(ValidationError)
  })

  test('should throw validation error if position contains invalid characters', () => {
    expect(() => {
      patron.position = '?#"'
    }).toThrow(ValidationError)
  })
})

describe('Patron methods', () => {
  test('should convert to primitives', () => {
    const patron = Patron.create({
      id: '123',
      givenName: 'John',
      familyName: 'Doe',
      email: 'johndoe@test.com',
      role: 'admin',
      position: 'director',
      renovationDate: new Date('2023-01-01'),
      endingDate: new Date('2024-01-01'),
    })

    const primitives = patron.toPrimitives()

    expect(primitives).toEqual({
      givenName: 'John',
      familyName: 'Doe',
      email: 'johndoe@test.com',
      role: 'admin',
      position: 'director',
      renovationDate: new Date('2023-01-01'),
      endingDate: new Date('2024-01-01'),
    })
  })
})
