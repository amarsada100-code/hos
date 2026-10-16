
module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }]
        ]
      }
    ]
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  testMatch: ["**/?(*.)+(test).jsx"],

  clearMocks: true
};
