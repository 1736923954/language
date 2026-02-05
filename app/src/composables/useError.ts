import { ref, type Ref } from 'vue';

/**
 * 错误处理 composable
 */
export function useError() {
  const error = ref<string>('');

  const setError = (message: string) => {
    error.value = message;
    // 自动清除错误（可选）
    if (message) {
      setTimeout(() => {
        error.value = '';
      }, 5000);
    }
  };

  const clearError = () => {
    error.value = '';
  };

  const handleError = (err: any) => {
    const message = err?.message || err?.data?.message || 'An error occurred';
    setError(message);
    console.error('Error:', err);
  };

  return {
    error: error as Ref<string>,
    setError,
    clearError,
    handleError,
  };
}
