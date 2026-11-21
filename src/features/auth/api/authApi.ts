/**
 * FILE:   src/features/auth/api/authApi.ts
 * LAYER:  feature api (the ONLY layer of a feature allowed to import apiClient)
 * STATUS: implemented
 *
 * PURPOSE
 *   Typed transport for the auth endpoints of ../contracts/openapi/auth.yaml (1.1.0). No React,
 *   no state, no business logic - one async function per endpoint, returning contract-shaped data.
 *
 * CONTENT
 *   login (POST /auth/login), logout (POST /auth/logout), whoami (GET /auth/whoami).
 *   onSessionExpired(handler): registers the apiClient session-expiry callback. It lives here
 *   because only a feature api/ folder may import apiClient (lint: app/ and routes/ may not), so the
 *   auth feature owns that wiring (../hooks/useSessionExpiry.ts) instead of App.tsx.
 *   - Paths are relative to apiClient's baseURL (`<VITE_API_BASE_URL>/v1`).
 *   - /auth/refresh is NOT here: apiClient owns refresh (single-flight interceptor).
 *   - Named export only (lint). Shapes equal the contract.
 *
 * EXPORTS
 *   const authApi, interfaces ILoginPayload, ILoginResponse, IWhoAmIResponse
 *
 * USED BY
 *   ./authQueries.ts (query/mutation option factories), ../hooks/useSessionExpiry.ts (onSessionExpired).
 *
 * MAY IMPORT
 *   @/shared/lib/apiClient, @/shared/types/domain.
 */
import { apiClient, configureApiClient } from '@/shared/lib/apiClient';
import type { IUser } from '@/shared/types/domain';

/** contract: LoginRequest */
export interface ILoginPayload {
  email: string;
  password: string;
}

/** contract: UserEnvelope */
export interface ILoginResponse {
  user: IUser;
}

/** contract: UserEnvelope */
export interface IWhoAmIResponse {
  user: IUser;
}

export const authApi = {
  async login(payload: ILoginPayload): Promise<ILoginResponse> {
    return (await apiClient.post<ILoginResponse>('/auth/login', payload)).data;
  },
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
  async whoami(): Promise<IWhoAmIResponse> {
    return (await apiClient.get<IWhoAmIResponse>('/auth/whoami')).data;
  },
  onSessionExpired(handler: () => void): void {
    configureApiClient({ onSessionExpired: handler });
  },
};
