module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/standard",
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "space-before-function-paren": ["error", "always"],
    "@typescript-eslint/interface-name-prefix": [
      "error",
      {
        prefixWithI: "always"
      }
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/camelcase": "off"
  }
};
