module.exports = {
  testEnvironment: 'node',
  collectCoverage: false,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/lib/$1',
    '^~~$': '<rootDir>',
    '^@@$': '<rootDir>',
    '^@/(.*)$': '<rootDir>/lib/$1',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
