import { expect, test, describe, beforeEach } from 'vitest'
import { Patron } from '@/contexts/patron/domain/patron.entity.js'
import { ValidationError } from '@/shared/errors.js'


/* In this test suite, we focus on the User entity behavior
by using the Patron entity which extends User.
*/

describe('User entity behavior (via Patron)', () => {
  describe('User construction', () => {
    test('creates user with valid data', () => {
      const patron = Patron.create({
        givenName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com',
        role: 'patron',
        position: 'Secretary',
        renovationDate: new Date('2024-01-01'),
        endingDate: new Date('2024-12-31'),
      })

      expect(patron.givenName).toBe('John')
      expect(patron.familyName).toBe('Doe')
      expect(patron.email).toBe('john.doe@example.com')
      expect(patron.role).toBe('patron')
    })

    test('validates email format', () => {
      expect(() => {
        Patron.create({
          givenName: 'John',
          familyName: 'Doe',
          email: 'invalid-email',
          role: 'patron',
          position: 'Secretary',
          renovationDate: new Date('2024-01-01'),
          endingDate: new Date('2024-12-31'),
        })
      }).toThrow(ValidationError)
    })

    test('validates role is not empty', () => {
      expect(() => {
        Patron.create({
          givenName: 'John',
          familyName: 'Doe',
          email: 'john.doe@example.com',
          role: '',
          position: 'Secretary',
          renovationDate: new Date('2024-01-01'),
          endingDate: new Date('2024-12-31'),
        })
      }).toThrow(ValidationError)
    })

    test('validates given name is not empty', () => {
      expect(() => {
        Patron.create({
          givenName: '',
          familyName: 'Doe',
          email: 'john.doe@example.com',
          role: 'patron',
          position: 'Secretary',
          renovationDate: new Date('2024-01-01'),
          endingDate: new Date('2024-12-31'),
        })
      }).toThrow(ValidationError)
    })
  })

  describe('User property setters', () => {
    let patron: Patron

    beforeEach(() => {
      patron = Patron.create({
        id: '123',
        givenName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com',
        role: 'patron',
        position: 'Secretary',
        renovationDate: new Date('2024-01-01'),
        endingDate: new Date('2024-12-31'),
      })
    })

    test('can update email with valid format', () => {
      patron.email = 'new.email@example.com'
      expect(patron.email).toBe('new.email@example.com')
    })

    test('throws error when setting invalid email', () => {
      expect(() => {
        patron.email = 'invalid-email'
      }).toThrow(ValidationError)
    })

    test('can update role', () => {
      patron.role = 'admin'
      expect(patron.role).toBe('admin')
    })

    test('throws error when setting empty role', () => {
      expect(() => {
        patron.role = ''
      }).toThrow(ValidationError)
    })

    test('can update given name', () => {
      patron.givenName = 'Jane'
      expect(patron.givenName).toBe('Jane')
    })

    test('can update family name', () => {
      patron.familyName = 'Smith'
      expect(patron.familyName).toBe('Smith')
    })
  })

  describe('User value object integration', () => {
    test('email is properly normalized', () => {
      const patron = Patron.create({
        id: '123',
        givenName: 'John',
        familyName: 'Doe',
        email: '  JOHN.DOE@EXAMPLE.COM  ',
        role: 'patron',
        position: 'Secretary',
        renovationDate: new Date('2024-01-01'),
        endingDate: new Date('2024-12-31'),
      })

      expect(patron.email).toBe('john.doe@example.com')
    })

    test('names are properly trimmed', () => {
      const patron = Patron.create({
        id: '123',
        givenName: '  John  ',
        familyName: '  Doe  ',
        email: 'john.doe@example.com',
        role: 'patron',
        position: 'Secretary',
        renovationDate: new Date('2024-01-01'),
        endingDate: new Date('2024-12-31'),
      })

      expect(patron.givenName).toBe('John')
      expect(patron.familyName).toBe('Doe')
    })
  })
})
