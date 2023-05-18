import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import { createHtmlPlugin } from "vite-plugin-html";
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
      /*
      createHtmlPlugin({
        minify: false,
        inject: {
          data: {
            injectScript: `<script> (function() {
              console.log(1);
              if (JSON.stringify("%VITE_ENV%") === JSON.stringify("snap0") ||
                JSON.stringify("%MODE%") !== JSON.stringify("production")) {
                  return;
                }
                console.log(2);
              if (document.location.host.includes("cloudelements") || document.location.host.includes("localhost")) {
                 return;
              }
              console.log(3);
              // Fetch base element and url attribute
              const baseElement = document.getElementsByTagName('base')[0];
              console.log(4);
               baseElement.setAttribute("href", document.location.protocol + "//" + document.location.host + "/" + window.location.pathname.split("/").slice(1,4).join("/") + "/");
            
               console.log(5);
              }())</script>`,
          },
          tags: [
            {
              injectTo: "head-prepend",
              tag: "base",
              attrs: {
                href: "/",
              },
            },
          ],
        },
      }),
      */
      // htmlTransform(),
    ],
    /*
    build: {
      outDir: "build",
      rollupOptions: {
        external: ["REPLACE_VITE_UIPATH_API_URL/portal_/apollo/packages/portal-shell/3/portal-shell.esm.js"],
      },
    },
    */
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

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
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
