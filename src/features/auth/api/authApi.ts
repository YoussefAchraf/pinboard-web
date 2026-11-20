/**
 * FILE:   src/features/auth/api/authApi.ts
 * LAYER:  feature api (the ONLY layer of a feature allowed to import apiClient)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Typed transport for the auth endpoints of ../contracts/openapi/auth.yaml. No React, no state,
 *   no business logic - one async function per endpoint, returning contract-shaped data.
 *
 * WHAT TO WRITE
 *   export interface ILoginPayload  { email: string; password: string }
 *   export interface ILoginResponse { user: IUser }                 // IUser from @/shared/types/domain
 *   export interface IWhoAmIResponse { user: IUser }
 *   export const authApi = {
 *     async login(payload: ILoginPayload): Promise<ILoginResponse> { return (await apiClient.post('/auth/login', payload)).data; },
 *     async logout(): Promise<void> { await apiClient.post('/auth/logout'); },
 *     async whoami(): Promise<IWhoAmIResponse> { return (await apiClient.get('/auth/whoami')).data; },
 *   };
 *   - Paths are relative to apiClient's baseURL (`<VITE_API_BASE_URL>/v1`).
 *   - /auth/refresh is NOT here: apiClient owns refresh (single-flight interceptor).
 *   - Named export only (lint). Shapes must equal the contract - never invent fields; missing
 *     data -> request in ../contracts/requests/fe-<task>-api-needs.md.
 *
 * EXPORTS
 *   const authApi, interfaces ILoginPayload, ILoginResponse, IWhoAmIResponse
 *
 * USED BY
 *   ./authQueries.ts (query/mutation option factories) - hooks never call authApi directly either.
 *
 * MAY IMPORT
 *   @/shared/lib/apiClient, @/shared/types/domain.
 */
export {};
