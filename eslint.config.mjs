import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "indent": ["error", 2],
      "semi": ["error", "always"]
    }
  }
]);
