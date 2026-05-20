const validPriorities = ['critical', 'high', 'medium', 'low', 'none'] as const
const validStatuses = ['open', 'in_progress', 'awaiting_review', 'awaiting_approval', 'resolved', 'closed', 'cancelled'] as const

export function createPriorityValue(value: string) {
  if (!validPriorities.includes(value as typeof validPriorities[number])) {
    throw new Error(`Invalid priority: ${value}`)
  }

  return {
    toString: () => value,
    isCritical: () => value === 'critical',
    isHigh: () => value === 'high' || value === 'critical',
    compareTo: (other: string) => {
      const order = ['none', 'low', 'medium', 'high', 'critical']
      return order.indexOf(value) - order.indexOf(other)
    },
  }
}

export function createStatusValue(value: string) {
  if (!validStatuses.includes(value as typeof validStatuses[number])) {
    throw new Error(`Invalid status: ${value}`)
  }

  return {
    toString: () => value,
    isActive: () => ['open', 'in_progress', 'awaiting_review', 'awaiting_approval'].includes(value),
    isTerminal: () => ['resolved', 'closed', 'cancelled'].includes(value),
  }
}

export function createEmailValue(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    throw new Error(`Invalid email: ${value}`)
  }

  return {
    toString: () => value,
  }
}

export function createNonEmptyString(value: string) {
  if (!value || value.trim().length === 0) {
    throw new Error('String cannot be empty')
  }

  return {
    toString: () => value,
    length: () => value.length,
  }
}
