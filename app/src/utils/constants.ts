/**
 * 应用常量
 */

// 难度等级
export const DIFFICULTY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

// 难度等级类型映射（用于 u-tag）
export const DIFFICULTY_TYPE_MAP: Record<DifficultyLevel, string> = {
  A1: 'success',
  A2: 'primary',
  B1: 'warning',
  B2: 'error',
  C1: 'primary',
  C2: 'error',
};

// 学习状态
export const PROGRESS_STATUS = ['learning', 'reviewing', 'mastered'] as const;

export type ProgressStatus = typeof PROGRESS_STATUS[number];

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 10000;

// 防抖延迟时间（毫秒）
export const DEBOUNCE_DELAY = 300;

// 分页默认值
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// 存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  SETTINGS: 'settings',
} as const;
