/**
 * null/undefined를 명시적으로 처리하여 NPE 방지
 * Repository의 단일 조회 반환 타입으로 사용
 */
export type Option<T> =
  | { readonly isSome: true; readonly value: T }
  | { readonly isSome: false };

export const Option = {
  some: <T>(value: T): Option<T> => ({
    isSome: true,
    value,
  }),

  none: <T>(): Option<T> => ({
    isSome: false,
  }),

  fromNullable: <T>(value: T | null | undefined): Option<T> => {
    if (value === null || value === undefined) {
      return Option.none();
    }
    return Option.some(value);
  },

  isSome: <T>(option: Option<T>): option is { readonly isSome: true; readonly value: T } =>
    option.isSome,

  isNone: <T>(option: Option<T>): option is { readonly isSome: false } => !option.isSome,

  map: <T, U>(option: Option<T>, fn: (value: T) => U): Option<U> => {
    if (option.isSome) {
      return Option.some(fn(option.value));
    }
    return Option.none();
  },

  flatMap: <T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U> => {
    if (option.isSome) {
      return fn(option.value);
    }
    return Option.none();
  },

  unwrap: <T>(option: Option<T>): T => {
    if (option.isSome) {
      return option.value;
    }
    throw new Error('Cannot unwrap None');
  },

  unwrapOr: <T>(option: Option<T>, defaultValue: T): T => {
    if (option.isSome) {
      return option.value;
    }
    return defaultValue;
  },

  unwrapOrElse: <T>(option: Option<T>, fn: () => T): T => {
    if (option.isSome) {
      return option.value;
    }
    return fn();
  },
} as const;