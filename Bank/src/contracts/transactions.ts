import type {
  ApiResult,
  NewTransaction,
  Transaction,
} from "../types";

export type GetTransactionsResponse = ApiResult<Transaction[]>;

export type CreateTransactionRequest = NewTransaction;

export type CreateTransactionResponse = ApiResult<Transaction>;