export interface User {
  id: string
  userId: string
  firstName: string
  lastName: string
}

export type AccountType = 'CHECKING' | 'SAVINGS'
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'

export interface Account {
  id: string
  userId: string
  type: AccountType
  name: string
  lastFour: string
  balanceCents: number
  currency: 'USD'
}

export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  direction: 'CREDIT' | 'DEBIT'
  description: string
  amountCents: number
  createdAt: string
  status: 'COMPLETED'
  relatedAccountId?: string
}

export interface DashboardResponse {
  user: User
  accounts: Account[]
  transactions: Transaction[]
}

export interface LoginRequest {
  userId: string
  pin: string
}

export interface RegistrationRequest extends LoginRequest {
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: User
}

export interface TransactionRequest {
  type: TransactionType
  accountId: string
  destinationAccountId?: string
  amountCents: number
  note?: string
}

export interface TransactionResponse {
  accounts: Account[]
  transactions: Transaction[]
}

export interface ApiError {
  code: string
  message: string
}

export interface AuthService {
  login(request: LoginRequest): Promise<AuthResponse>
  register(request: RegistrationRequest): Promise<AuthResponse>
  logout(): void
}

export interface BankService {
  getDashboard(): Promise<DashboardResponse>
  submitTransaction(request: TransactionRequest): Promise<TransactionResponse>
}
