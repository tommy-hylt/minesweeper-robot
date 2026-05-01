import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { transform } from "esbuild";

export default defineConfig({
  base: "/minesweeper-robot/",
  plugins: [
    {
      name: "js-jsx",
      async transform(code, id) {
        if (!id.endsWith(".js")) return null;
        const result = await transform(code, { loader: "jsx" });
        return { code: result.code, map: result.map };
      },
    },
    react(),
  ],
  resolve: {
    alias: {
      "@minesweeper": path.resolve(__dirname, "../minesweeper/src"),
      "@robot": path.resolve(__dirname, "../robot/src"),
      "lodash.samplesize": path.resolve(__dirname, "node_modules/lodash.samplesize"),
      "styled-components": path.resolve(__dirname, "node_modules/styled-components"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom", "styled-components"],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
});
