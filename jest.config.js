module.exports = {
  preset: "react-native",
  setupFiles: ["./jest/setup.js"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      babelConfig: true,
    },
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  cacheDirectory: ".jest/cache",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)",
    "/node_modules/(?!(react-syntax-highlighter)/)",
  ],
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
    "\\.svg": "<rootDir>/__mocks__/svgMock.js",
    "react-native-code-push": "<rootDir>/__mocks__/react-native-code-push.js",
    "@react-navigation": "<rootDir>/__mocks__/@react-navigation.js",
  },
};
