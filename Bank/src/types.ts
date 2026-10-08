export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  ownerId: string;
  balance: number;
  currency: "USD";
}

export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAW"
  | "TRANSFER";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
}

export interface NewTransaction {
  type: TransactionType;
  amount: number;
  toEmail?: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: ApiError;
}