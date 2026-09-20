/**
 * src/features/auth/auth.types.ts
 *
 * Types for user entity, authentication tokens, credentials, and API payloads.
 */

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type SignupResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  tokens: AuthTokens;
};
