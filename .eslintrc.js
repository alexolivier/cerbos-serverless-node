module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "jest"],
  rules: {},
};
