export interface CustomerData {
  email: string
  firstName: string
  lastName: string
  password: string
}

export function createUniqueCustomer(): CustomerData {
  const uniqueId = `${Date.now()}-${crypto.randomUUID()}`

  return {
    email: `northstar-${uniqueId}@example.test`,
    firstName: 'Northstar',
    lastName: 'Customer',
    password: `Test-${crypto.randomUUID()}-A1!`,
  }
}
