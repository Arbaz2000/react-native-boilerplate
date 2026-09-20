/**
 * src/features/auth/auth.types.ts
 *
 * Types for user entity, authentication tokens, and credentials.
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
