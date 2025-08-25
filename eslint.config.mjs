// eslint.config.mjs (root)
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import n from "eslint-plugin-n";
import eslintPluginImport from "eslint-plugin-import";

export default [
  // 基础 JS 规则
  js.configs.recommended,

  // TS 支持（即便后端才用 TS，前端也可共用）
  ...tseslint.configs.recommended,

  // 通用环境
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,   // 前端
        ...globals.node       // 后端
      }
    }
  },

  // React（前端会生效，后端不会用到 JSX 即可忽略）
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { react: reactPlugin, "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      "react/jsx-uses-react": "off",   // 新版不需要
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  },

  // Node / import 规则（后端更相关）
  {
    plugins: { n, import: eslintPluginImport },
    rules: {
      "n/no-missing-import": "off", // 与 TS/路径别名常冲突，关闭或按需启用
      "import/order": ["warn", { "newlines-between": "always" }]
    }
  },

  // 关闭与 Prettier 冲突的格式化规则
  {
    rules: {
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off"
    }
  }
];