import type { ApiResult, User } from "../types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export type LoginResponse = ApiResult<User>;
export type RegisterResponse = ApiResult<User>;