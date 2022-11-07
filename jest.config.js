module.exports = {
  preset: "react-native",
  // presets: ["module:metro-react-native-babel-preset"],
  setupFiles: [
    "./node_modules/react-native-gesture-handler/jestSetup.js",
    "./jest/setup.js",
  ],
  testEnvironment: "node",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      babelConfig: true,
    },
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  cacheDirectory: ".jest/cache",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.js$": require.resolve("react-native/jest/preprocessor.js"),
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)",
  ],
  verbose: true,
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",

  testPathIgnorePatterns: ["<rootDir>/node_modules/", "\\.snap$"],
  collectCoverageFrom: ["src/**/*.tsx"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    "interfaces",
    "jestGlobalMocks.ts",
    ".module.ts",
    "<rootDir>/src/app/main.ts",
    "<rootDir>/src/assets/",
    ".mock.ts",
  ],
  coverageDirectory: "<rootDir>/coverage/",
  coverageThreshold: {
    global: {
      branches: 8,
      // functions: 30,
      lines: 8,
      statements: 8,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
    "\\.svg": "<rootDir>/__mocks__/svgMock.js",
    "react-native-code-push": "<rootDir>/__mocks__/react-native-code-push.js",
    "@react-navigation": "<rootDir>/__mocks__/@react-navigation.js",
  },
};
