const { pathsToModuleNameMapper } = require('ts-jest')
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig')


module.exports = {
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
  testMatch: [
    '<rootDir>/projects/**/*.spec.ts',
    '<rootDir>/src/**/*.spec.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  preset: 'jest-preset-angular',
  globals: {
    "__webpack_public_path__": "writable",
  },
  resolver: "jest-preset-angular/build/resolvers/ng-jest-resolver.js",
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  collectCoverageFrom: [
    'projects/**/*.ts',
    '!projects/**/__test__/**',
    '!projects/**/cypress/**',
    '!projects/**/bootstrap.ts',
    '!**/node_modules/**',
    '!**/src/**/*.module.ts',
    '!test/**',
    '!**/polyfills.ts',
    '!**/main.ts',
    '!**/environments/**',
    '!**/icons/**',
    '!**/assets/**',
    '!**/version/**'
  ],
  maxWorkers: "60%"
};

