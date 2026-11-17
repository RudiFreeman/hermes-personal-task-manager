import {build} from "esbuild";
import {mkdir, copyFile} from "node:fs/promises";
await mkdir("desktop", {recursive: true});
await Promise.all([
  build({entryPoints: ["frontend/src/dashboard.mjs"], bundle: true, format: "iife", globalName: "PTMDashboard", outfile: "dashboard/dist/index.js", target: "es2022",
    footer: {js: "if (typeof module === 'object' && module.exports) module.exports = PTMDashboard;"}}),
  build({entryPoints: ["frontend/src/webapp.mjs"], bundle: true, format: "esm", outfile: "desktop/plugin.js", target: "es2022",
    external: ["react", "@hermes/plugin-sdk"], loader: {".css": "text"}}),
  build({entryPoints: ["frontend/src/preview.mjs"], bundle: true, format: "iife", outfile: "dashboard/dist/preview.js", target: "es2022",
    define: {"process.env.NODE_ENV": '"production"'}, minify: true}),
]);
await copyFile("frontend/src/style.css", "dashboard/dist/style.css");
console.log("Built Dashboard, WebApp and standalone preview from shared sources");
