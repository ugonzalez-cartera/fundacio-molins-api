import { ValidationError } from '../../../../infrastructure/common/error-utils.js'

export class DateRange {
  private readonly startDate: Date
  private readonly endDate: Date

  constructor(startDate: Date, endDate: Date) {
    this.validateDates(startDate, endDate)
    this.startDate = new Date(startDate)
    this.endDate = new Date(endDate)
  }

  private validateDates(startDate: Date, endDate: Date): void {
    if (!startDate || !endDate) {
      throw new ValidationError('Both start and end dates are required')
    }

    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new ValidationError('Start and end dates must be valid Date objects')
    }

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new ValidationError('Start and end dates must be valid dates')
    }

    if (startDate >= endDate) {
      throw new ValidationError('Start date must be before end date')
    }

    // Business rule: date range cannot be more than 10 years
    const maxYears = 10
    const maxMilliseconds = maxYears * 365 * 24 * 60 * 60 * 1000
    if (endDate.getTime() - startDate.getTime() > maxMilliseconds) {
      throw new ValidationError(`Date range cannot exceed ${maxYears} years`)
    }
  }

  getStartDate(): Date {
    return new Date(this.startDate)
  }

  getEndDate(): Date {
    return new Date(this.endDate)
  }

  getDurationInDays(): number {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  getDurationInMonths(): number {
    const yearDiff = this.endDate.getFullYear() - this.startDate.getFullYear()
    const monthDiff = this.endDate.getMonth() - this.startDate.getMonth()
    return yearDiff * 12 + monthDiff
  }

  getDurationInYears(): number {
    return this.getDurationInMonths() / 12
  }

  isActive(currentDate: Date = new Date()): boolean {
    return currentDate >= this.startDate && currentDate <= this.endDate
  }

  isExpired(currentDate: Date = new Date()): boolean {
    return currentDate > this.endDate
  }

  isUpcoming(currentDate: Date = new Date()): boolean {
    return currentDate < this.startDate
  }

  getDaysUntilExpiry(currentDate: Date = new Date()): number {
    if (this.isExpired(currentDate)) {
      return 0
    }
    const timeDiff = this.endDate.getTime() - currentDate.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  getDaysSinceExpiry(currentDate: Date = new Date()): number {
    if (!this.isExpired(currentDate)) {
      return 0
    }
    const timeDiff = currentDate.getTime() - this.endDate.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate
  }

  overlaps(other: DateRange): boolean {
    return this.startDate <= other.endDate && this.endDate >= other.startDate
  }

  equals(other: DateRange): boolean {
    return this.startDate.getTime() === other.startDate.getTime() &&
           this.endDate.getTime() === other.endDate.getTime()
  }

  toString(): string {
    return `${this.startDate.toISOString().split('T')[0]} to ${this.endDate.toISOString().split('T')[0]}`
  }
}
