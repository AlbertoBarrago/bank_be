import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    ignores: ["test/integration/**/*.ts"],
    plugins: {
      "@typescript-eslint": typescript,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "no-console": "off",
      "@typescript-eslint/ no-floating-promises": "off",
    },
  },
];
