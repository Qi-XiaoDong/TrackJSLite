import json from "@rollup/plugin-json";
import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  input: "src/index.ts",
  output: [
    // 输出 ES 模块（适合现代前端）
    {
      file: "lib/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    // 输出 UMD 模块（适合浏览器直接引入）
    {
      file: "lib/index.umd.js",
      format: "umd",
      name: "TractJsLite", // 全局变量名
      sourcemap: true,
    },
  ],
  plugins: [
    json(),
    // 解析第三方模块
    nodeResolve({
      extensions: [".ts", ".js"],
    }),
    // 转换 CommonJS 为 ES 模块
    commonjs(),
    // 处理 TypeScript
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true, // 生成类型声明
      declarationDir: "lib/declaration", // 类型声明输出目录
    }),
  ],
  sourcemap: !isProduction,
  external: [], // 声明外部依赖（不打包进产物）
});
