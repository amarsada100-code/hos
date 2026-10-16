
module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": [
      "babel-jest",
      {
        presets: [
          require.resolve("@babel/preset-env"),
          [
            require.resolve("@babel/preset-react"),
            { runtime: "automatic" }
          ]
        ]
      }
    ]
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  testMatch: ["**/?(*.)+(test).jsx"],

  clearMocks: true
};
