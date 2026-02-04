/**
 * 문자열 유틸리티
 */

export const StringUtil = {
  isEmpty: (value: string | null | undefined): boolean => {
    return value === null || value === undefined || value.trim().length === 0;
  },

  isNotEmpty: (value: string | null | undefined): value is string => {
    return !StringUtil.isEmpty(value);
  },

  truncate: (value: string, maxLength: number, suffix = '...'): string => {
    if (value.length <= maxLength) {
      return value;
    }
    return value.slice(0, maxLength - suffix.length) + suffix;
  },

  capitalize: (value: string): string => {
    if (value.length === 0) {
      return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  },

  toSnakeCase: (value: string): string => {
    return value
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  },

  toCamelCase: (value: string): string => {
    return value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
  },

  toKebabCase: (value: string): string => {
    return value
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  },

  stripHtml: (value: string): string => {
    return value.replace(/<[^>]*>/g, '');
  },

  escapeHtml: (value: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return value.replace(/[&<>"']/g, (char) => map[char] ?? char);
  },
} as const;