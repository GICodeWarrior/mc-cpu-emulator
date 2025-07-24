import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "no-undef": "off",
      "no-with": "off",
      "no-fallthrough": "off",
      "no-useless-escape": "off",
      "no-dupe-keys": "off",
      "no-control-regex": "off",
      "no-func-assign": "off",
      "no-cond-assign": "off",
      "no-constant-binary-expression": "off",
      "no-self-assign": "off",
      "no-unused-vars": "off", // 🔥 en büyük kural bu
      "no-redeclare": "off",
      "no-empty": "off",
    },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    // ⛔️ Minify edilmiş veya harici dosyaları dışla
    files: [
      "**/*.min.js",
      "**/vendor/**/*.js",
      "**/dist/**/*.js",
      "**/build/**/*.js",
      "**/node_modules/**/*.js",
      "**/third_party/**/*.js",
      "**/third-party/**/*.js",
      "**/libs/**/*.js",
      "**/lib/**/*.js",
      "**/externals/**/*.js",
      "**/external/**/*.js",
    ],
    rules: {
      all: "off",
    },
  },
]);
