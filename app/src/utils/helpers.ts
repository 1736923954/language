/**
 * 工具函数
 */

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 格式化数字（添加千位分隔符）
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * 获取难度等级类型
 */
export function getDifficultyType(level: string): string {
  const map: Record<string, string> = {
    A1: 'success',
    A2: 'primary',
    B1: 'warning',
    B2: 'error',
    C1: 'primary',
    C2: 'error',
  };
  return map[level] || 'info';
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * 安全获取嵌套对象属性
 */
export function safeGet<T>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let result: any = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  return result !== undefined ? result : defaultValue;
}
