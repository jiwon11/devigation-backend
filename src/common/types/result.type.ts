/**
 * 성공/실패를 명시적으로 표현하여 NPE 방지
 * 모든 UseCase의 반환 타입으로 사용
 */
export type Result<T, E extends Error = Error> =
  | { readonly success: true; readonly value: T }
  | { readonly success: false; readonly error: E };

export const Result = {
  ok: <T>(value: T): Result<T, never> => ({
    success: true,
    value,
  }),

  fail: <E extends Error>(error: E): Result<never, E> => ({
    success: false,
    error,
  }),

  isOk: <T, E extends Error>(
    result: Result<T, E>,
  ): result is { readonly success: true; readonly value: T } => result.success,

  isFail: <T, E extends Error>(
    result: Result<T, E>,
  ): result is { readonly success: false; readonly error: E } => !result.success,

  map: <T, U, E extends Error>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
    if (result.success) {
      return Result.ok(fn(result.value));
    }
    return result;
  },

  flatMap: <T, U, E extends Error>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, E>,
  ): Result<U, E> => {
    if (result.success) {
      return fn(result.value);
    }
    return result;
  },

  unwrap: <T, E extends Error>(result: Result<T, E>): T => {
    if (result.success) {
      return result.value;
    }
    throw result.error;
  },

  unwrapOr: <T, E extends Error>(result: Result<T, E>, defaultValue: T): T => {
    if (result.success) {
      return result.value;
    }
    return defaultValue;
  },
} as const;