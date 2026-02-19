const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "semi": ["error", "always"]
    }
  }
];