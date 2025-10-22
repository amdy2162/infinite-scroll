// 可選：每次測試後清 DOM（避免互相污染）
import { afterEach } from 'vitest'
import { cleanup } from '@vue/test-utils'
afterEach(() => cleanup())

// jsdom 沒有內建的 API 你要用就自己補，例如 IntersectionObserver
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
