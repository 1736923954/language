import type { RequestOptions } from '@dcloudio/uni-app';

// 开发环境使用相对路径走 Vite 代理，避免跨域；生产环境需配置 VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api');

interface RequestConfig extends Omit<RequestOptions, 'url' | 'success' | 'fail'> {
  showLoading?: boolean;
  showError?: boolean;
}

class Request {
  private token: string = '';

  constructor() {
    this.loadToken();
  }

  private loadToken() {
    try {
      const tokenData = uni.getStorageSync('token');
      if (tokenData) {
        this.token = tokenData;
      }
    } catch (e) {
      console.error('Failed to load token:', e);
    }
  }

  setToken(token: string) {
    this.token = token;
    try {
      uni.setStorageSync('token', token);
    } catch (e) {
      console.error('Failed to save token:', e);
    }
  }

  clearToken() {
    this.token = '';
    try {
      uni.removeStorageSync('token');
    } catch (e) {
      console.error('Failed to clear token:', e);
    }
  }

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

  request<T = any>(
    url: string,
    options?: RequestConfig
  ): Promise<{ data: T; statusCode: number }> {
    return new Promise((resolve, reject) => {
      const showLoading = options?.showLoading ?? false;
      const showError = options?.showError ?? true;

      if (showLoading) {
        uni.showLoading({ title: 'Loading...' });
      }

      const method = options?.method || 'GET';
      let requestUrl = `${API_BASE_URL}${url}`;
      // GET 请求将 params 拼接到 URL，确保参数正确传递
      if (method === 'GET' && options?.data && Object.keys(options.data).length > 0) {
        const query = Object.entries(options.data)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&');
        requestUrl += (url.includes('?') ? '&' : '?') + query;
      }

      uni.request({
        url: requestUrl,
        method,
        header: this.getHeaders(options),
        data: method !== 'GET' ? options?.data : undefined,
        timeout: options?.timeout || 10000,
        success: (res: any) => {
          if (showLoading) {
            uni.hideLoading();
          }

          if (res.statusCode === 401) {
            this.clearToken();
            uni.reLaunch({ url: '/pages/login/index' });
            reject(new Error('Unauthorized'));
            return;
          }

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              data: res.data?.data || res.data,
              statusCode: res.statusCode,
            });
          } else {
            const errorMsg = res.data?.message || 'Request failed';
            if (showError) {
              uni.showToast({
                title: errorMsg,
                icon: 'error',
                duration: 2000,
              });
            }
            reject(new Error(errorMsg));
          }
        },
        fail: (err: any) => {
          if (showLoading) {
            uni.hideLoading();
          }

          if (showError) {
            uni.showToast({
              title: 'Network error',
              icon: 'error',
              duration: 2000,
            });
          }
          reject(err);
        },
      });
    });
  }

  get<T = any>(url: string, options?: RequestConfig) {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  post<T = any>(url: string, data?: any, options?: RequestConfig) {
    return this.request<T>(url, { ...options, method: 'POST', data });
  }

  put<T = any>(url: string, data?: any, options?: RequestConfig) {
    return this.request<T>(url, { ...options, method: 'PUT', data });
  }

  delete<T = any>(url: string, options?: RequestConfig) {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export default new Request();
