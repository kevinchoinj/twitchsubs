import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import path from "path";
import fs from "fs";

/*
replace /path with path
const htmlTransform = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      return html.replace(/src="\/([^"]*)"/g, 'src="$1"').replace(/href="\/([^"]*)"/g, 'href="$1"');
    },
  };
};
*/

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),
      reactVirtualized(),
      // htmlTransform(),
    ],
    build: {
      outDir: "build",
    },
    server: {
      open: true,
      port: 8111,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      coverage: {
        reporter: ["text", "html"],
        exclude: [
          "node_modules/",
          "src/setupTests.ts",
          "**/*.test.jsx",
          "**/*.test.js",
          "**/*.test.tsx",
          "**/*.test.ts",
        ],
      },
    },
  };
});

const WRONG_CODE = "import { bpfrpt_proptype_WindowScroller } from \"../WindowScroller.js\";";
export function reactVirtualized() {
  return {
    name: "my:react-virtualized",
    configResolved() {
      const file = require
        .resolve("react-virtualized")
        .replace(
          path.join("dist", "commonjs", "index.js"),
          path.join("dist", "es", "WindowScroller", "utils", "onScroll.js")
        );
      const code = fs.readFileSync(file, "utf-8");
      const modified = code.replace(WRONG_CODE, "");
      fs.writeFileSync(file, modified);
    },
  };
}