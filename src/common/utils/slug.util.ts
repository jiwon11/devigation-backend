/**
 * Slug 생성 유틸리티
 */

export const SlugUtil = {
  generate: (value: string): string => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s가-힣-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  generateWithId: (value: string, id: string): string => {
    const slug = SlugUtil.generate(value);
    const shortId = id.slice(0, 8);
    return `${slug}-${shortId}`;
  },

  isValid: (value: string): boolean => {
    return /^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$/.test(value);
  },
} as const;