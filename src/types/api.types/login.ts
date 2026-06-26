export interface ApiResponse<T> {
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
}
