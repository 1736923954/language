import type { RequestOptions } from '@dcloudio/uni-app';
import { REQUEST_TIMEOUT, STORAGE_KEYS } from '@/utils/constants';

// 开发环境使用相对路径走 Vite 代理，避免跨域；生产环境需配置 VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api');

interface RequestConfig extends Omit<RequestOptions, 'url' | 'success' | 'fail'> {
  showLoading?: boolean;
  showError?: boolean;
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟（毫秒）
}

interface RequestResponse<T = any> {
  data: T;
  statusCode: number;
}

class Request {
  private token: string = '';
  private retryCount = 0;

  constructor() {
    this.loadToken();
  }

  /**
   * 从本地存储加载 token
   */
  private loadToken() {
    try {
      const tokenData = uni.getStorageSync(STORAGE_KEYS.TOKEN);
      if (tokenData) {
        this.token = tokenData;
      }
    } catch (e) {
      console.error('Failed to load token:', e);
    }
  }

  /**
   * 设置 token
   */
  setToken(token: string) {
    this.token = token;
    try {
      uni.setStorageSync(STORAGE_KEYS.TOKEN, token);
    } catch (e) {
      console.error('Failed to save token:', e);
    }
  }

  /**
   * 清除 token
   */
  clearToken() {
    this.token = '';
    try {
      uni.removeStorageSync(STORAGE_KEYS.TOKEN);
    } catch (e) {
      console.error('Failed to clear token:', e);
    }
  }

  /**
   * 获取请求头
   */
  private getHeaders(config?: RequestConfig) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config?.header,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * 构建请求 URL（处理 GET 参数）
   */
  private buildUrl(url: string, method: string, data?: any): string {
    let requestUrl = `${API_BASE_URL}${url}`;
    
    // GET 请求将 params 拼接到 URL
    if (method === 'GET' && data && Object.keys(data).length > 0) {
      const query = Object.entries(data)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
      requestUrl += (url.includes('?') ? '&' : '?') + query;
    }
    
    return requestUrl;
  }

  /**
   * 显示错误提示
   */
  private showError(message: string) {
    uni.showToast({
      title: message,
      icon: 'error',
      duration: 2000,
      mask: false,
    });
  }

  /**
   * 处理响应错误
   */
  private handleResponseError(res: any, showError: boolean): never {
    const errorMsg = res.data?.message || res.data?.error || 'Request failed';
    
    if (showError) {
      this.showError(errorMsg);
    }
    
    const error = new Error(errorMsg);
    (error as any).statusCode = res.statusCode;
    (error as any).data = res.data;
    throw error;
  }

  /**
   * 处理网络错误
   */
  private handleNetworkError(err: any, showError: boolean): never {
    const errorMsg = err?.errMsg || 'Network error';
    
    if (showError) {
      this.showError(errorMsg);
    }
    
    throw new Error(errorMsg);
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 核心请求方法（带重试机制）
   */
  async request<T = any>(
    url: string,
    options?: RequestConfig
  ): Promise<RequestResponse<T>> {
    const showLoading = options?.showLoading ?? false;
    const showError = options?.showError ?? true;
    const retry = options?.retry ?? 0;
    const retryDelay = options?.retryDelay ?? 1000;

    if (showLoading) {
      uni.showLoading({ 
        title: 'Loading...',
        mask: false,
      });
    }

    const method = options?.method || 'GET';
    const requestUrl = this.buildUrl(url, method, options?.data);
    const headers = this.getHeaders(options);

    const makeRequest = (): Promise<RequestResponse<T>> => {
      return new Promise((resolve, reject) => {
        uni.request({
          url: requestUrl,
          method: method as any,
          header: headers,
          data: method !== 'GET' ? options?.data : undefined,
          timeout: options?.timeout || REQUEST_TIMEOUT,
          success: (res: any) => {
            if (showLoading) {
              uni.hideLoading();
            }

            // 401 未授权，清除 token 并跳转登录
            if (res.statusCode === 401) {
              this.clearToken();
              uni.reLaunch({ url: '/pages/login/index' });
              reject(new Error('Unauthorized'));
              return;
            }

            // 2xx 成功
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({
                data: res.data?.data !== undefined ? res.data.data : res.data,
                statusCode: res.statusCode,
              });
            } else {
              // 其他错误状态码
              reject(this.handleResponseError(res, showError));
            }
          },
          fail: (err: any) => {
            if (showLoading) {
              uni.hideLoading();
            }
            reject(this.handleNetworkError(err, showError));
          },
        });
      });
    };

    // 重试逻辑
    let lastError: any;
    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        return await makeRequest();
      } catch (err: any) {
        lastError = err;
        
        // 401 错误不重试
        if (err.statusCode === 401) {
          throw err;
        }
        
        // 最后一次尝试失败，抛出错误
        if (attempt === retry) {
          throw err;
        }
        
        // 等待后重试
        await this.sleep(retryDelay * (attempt + 1));
      }
    }

    throw lastError;
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, options?: RequestConfig) {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, options?: RequestConfig) {
    return this.request<T>(url, { ...options, method: 'POST', data });
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, options?: RequestConfig) {
    return this.request<T>(url, { ...options, method: 'PUT', data });
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, options?: RequestConfig) {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export default new Request();
