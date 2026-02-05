import { ref, type Ref } from 'vue';

/**
 * 加载状态管理 composable
 */
export function useLoading(initialValue = false) {
  const loading = ref(initialValue);

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      loading.value = true;
      return await fn();
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: loading as Ref<boolean>,
    setLoading,
    withLoading,
  };
}
