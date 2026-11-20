/**
 * FILE:   src/shared/types/api.ts
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Generic API shapes fixed by ../contracts/conventions.md, shared by every feature api/ file.
 *
 * WHAT TO WRITE
 *   export interface ICursorPage<TItem> { items: TItem[]; nextCursor: string | null }
 *   export interface ICursorParams { cursor?: string; limit?: number }
 *   export interface IApiErrorBody { error: string; code: ErrorCode; details?: unknown }
 *   - Infinite lists: useInfiniteQuery({ ..., getNextPageParam: (last) => last.nextCursor ?? undefined }).
 *
 * EXPORTS
 *   ICursorPage, ICursorParams, IApiErrorBody
 *
 * USED BY
 *   features/<name>/api/*, shared/lib/apiError.ts
 *
 * MAY IMPORT
 *   ./errorCodes.
 */
export {};
