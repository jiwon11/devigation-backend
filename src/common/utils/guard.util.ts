/**
 * Null/Undefined 가드 유틸리티
 */

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function assertNotNull<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (isNullOrUndefined(value)) {
    throw new Error(message ?? 'Value is null or undefined');
  }
}

export function requireNotNull<T>(value: T | null | undefined, message?: string): T {
  assertNotNull(value, message);
  return value;
}

export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}