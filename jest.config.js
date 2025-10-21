export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/src/**/*.spec.js',           // src 資料夾內的 .spec.js
    '**/src/**/*.spec.ts',           // src 資料夾內的 .spec.ts
    '**/src/**/__tests__/**/*.js',   // src 內 __tests__ 資料夾
    '**/src/**/__tests__/**/*.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.js',
    '!src/main.ts',
  ],
};