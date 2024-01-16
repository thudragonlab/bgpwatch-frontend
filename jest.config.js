
module.exports = {
  testEnvironment: 'jsdom',
  // testEnvironment: "node",
  // setupFilesAfterEnv: ['jest-canvas-mock'],
  // preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.ts$": "ts-jest",
    '^.+\\.vue$': '@vue/vue2-jest',
    "^.+\\.js$": "babel-jest",
    "^.+\\.jsx$": "babel-jest",
    "^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$": "jest-transform-stub",
  },
  
  setupFiles: ["jest-localstorage-mock",'./tests/setup.js'],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^d3$": "<rootDir>/node_modules/d3/dist/d3.js",
    "^d3/(.*)$": "<rootDir>/node_modules/d3/dist/$1.js"
  },
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "vue",
  ],
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: ['**/tests/**/*.spec.{js,ts}'],
  collectCoverage: true, //是否创建报告
  collectCoverageFrom: ["src/views/*.{js,vue}","src/components/**/*.{js,vue}","!src/components/Depracated/**", "!**/node_modules/**"], //创建报告的文件来源
  reporters: [
    'default',
    'jest-junit',
    ["jest-html-reporters", {
      "publicPath": "./reports",
      "filename": "jest-html-reporters.html",
    }]
  ],
  
  coverageReporters: ['text-summary','text', 'html', 'json'], //报告的格式
};

