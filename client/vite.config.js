import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import { createHtmlPlugin } from "vite-plugin-html";

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
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    base: "",
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),
      createHtmlPlugin({
        minify: true,
        /**
         * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
         * @default src/main.ts
         */
        // entry: "src/main.ts",
        /**
         * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
         * @default index.html
         */
        // template: "public/index.html",

        /**
         * Data that needs to be injected into the index.html ejs template
         */
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
                href: "//",
              },
            },
          ],
        },
      }),
      // htmlTransform(),
    ],
    build: {
      outDir: "build",
      rollupOptions: {
        external: ["REPLACE_VITE_UIPATH_API_URL/portal_/apollo/packages/portal-shell/3/portal-shell.esm.js"],
      },
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
