import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1) all of Next.js’s defaults
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),

  // 2) then Prettier’s recommended setup, which:
  //    • runs Prettier as an ESLint rule
  //    • turns off any ESLint rules that conflict with Prettier
  ...compat.extends("plugin:prettier/recommended"),

  // 3) finally, your custom overrides
  {
    rules: {
      // if you want to tweak Prettier’s defaults here instead of via .prettierrc:
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi:        false,
          tabWidth:    2,
        }
      ],

      // …any other custom rules you have…
    }
  }
];

export default eslintConfig;
