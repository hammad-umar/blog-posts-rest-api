/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'node', 'json', 'js', 'jsx'],

  roots: ['<rootDir>/src'],

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup-jest.ts'],
}
