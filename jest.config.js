module.exports = {
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'api/**/*.js',
    '!api/node_modules/**',
    '!**/node_modules/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ]
};