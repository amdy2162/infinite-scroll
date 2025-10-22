// tests/InfiniteScrollComponent.spec.js
/**
 * @vitest-environment jsdom
 */
import InfiniteScrollComponent from '@/components/vue3-infinite-scroll-demo.vue';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { github } from '@/composables/useGithubRepos';

// Mock axios/github API
vi.mock('@/composables/useGithubRepos', () => ({
  github: {
    get: vi.fn(),
  },
}));

describe('InfiniteScrollComponent', () => {
  let wrapper = null;
  let intersectionObserverCallback;
  let ioInstance;

  // Mock IntersectionObserver
  beforeEach(() => {
    ioInstance = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    globalThis.IntersectionObserver = vi.fn((callback) => {
      intersectionObserverCallback = callback;
      return ioInstance;
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    vi.clearAllMocks();
  });

  // 測試 1: 初始載入成功
  describe('初始載入', () => {
    it('應該在掛載時載入第一頁資料', async () => {
      const mockData = [
        { id: 1, full_name: 'vuejs/core', description: 'Vue 3 core', html_url: 'https://github.com/vuejs/core' },
        { id: 2, full_name: 'vuejs/vue', description: 'Vue 2', html_url: 'https://github.com/vuejs/vue' },
      ];

      github.get.mockResolvedValueOnce({ data: mockData });

      wrapper = mount(InfiniteScrollComponent);
      await flushPromises();

      expect(github.get).toHaveBeenCalledWith('/orgs/vuejs/repos', {
        params: { per_page: 30, page: 1 },
      });
      expect(wrapper.vm.reportList).toHaveLength(2);
      expect(wrapper.vm.isLoading).toBe(false);
      expect(wrapper.vm.noData).toBe(false);

      expect(globalThis.IntersectionObserver).toHaveBeenCalled();
      expect(ioInstance.observe).toHaveBeenCalled();
    });
  });

  describe('Smoke', () => {
    it('works', () => {
      expect(1 + 1).toBe(2);
    });
  });
});
