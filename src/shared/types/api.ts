/**
 * FILE:   src/shared/types/api.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   Generic API shapes fixed by ../contracts/conventions.md (sections 2 and 3), shared by every
 *   feature api/ file.
 *
 * CONTENT
 *   ICursorPage<TItem>  `{ items, nextCursor }` - cursor (keyset) list response.
 *   ICursorParams       `?cursor=&limit=` (limit default 20, max 100 - server-side rule).
 *   IApiErrorBody       the error envelope `{ error, code, details? }`.
 *   - Infinite lists: useInfiniteQuery({ ..., getNextPageParam: (last) => last.nextCursor ?? undefined }).
 *
 * EXPORTS
 *   ICursorPage, ICursorParams, IApiErrorBody, IApiErrorDetails
 *
 * USED BY
 *   features/<name>/api/*, shared/lib/apiError.ts
 *
 * MAY IMPORT
 *   ./errorCodes.
 */
import type { ServerErrorCode } from './errorCodes';

export interface ICursorPage<TItem> {
  items: TItem[];
  nextCursor: string | null;
}

export interface ICursorParams {
  cursor?: string;
  limit?: number;
}

/** `details` of the envelope; for VALIDATION_FAILED `fields` maps field name -> i18n key. */
export interface IApiErrorDetails {
  fields?: Record<string, string>;
}

export interface IApiErrorBody {
  error: string;
  code: ServerErrorCode;
  details?: IApiErrorDetails;
}
