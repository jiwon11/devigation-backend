/**
 * 날짜 유틸리티
 */

export const DateUtil = {
  now: (): Date => new Date(),

  toISOString: (date: Date): string => date.toISOString(),

  fromISOString: (isoString: string): Date => new Date(isoString),

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addHours: (date: Date, hours: number): Date => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  },

  addMinutes: (date: Date, minutes: number): Date => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  },

  isBefore: (date: Date, compare: Date): boolean => date.getTime() < compare.getTime(),

  isAfter: (date: Date, compare: Date): boolean => date.getTime() > compare.getTime(),

  isSameDay: (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },

  differenceInMinutes: (date1: Date, date2: Date): number => {
    return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60));
  },

  differenceInHours: (date1: Date, date2: Date): number => {
    return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60));
  },

  differenceInDays: (date1: Date, date2: Date): number => {
    return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
  },
} as const;