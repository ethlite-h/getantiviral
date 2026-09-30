import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

// Keep the policy readable in the initial HTML, using the same component as the app.
const root = fileURLToPath(new URL("../", import.meta.url));
const server = await createServer({
  root,
  appType: "custom",
  server: { middlewareMode: true, hmr: false },
  // Only one module is SSR-loaded; skip the browser dep scan of the HTML entries.
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  const { default: Privacy } = await server.ssrLoadModule("/src/Privacy.jsx");
  const markup = renderToString(React.createElement(Privacy));
  // site.html is the React shell for /privacy, /terms, /devlog (see vite.config.js).
  const template = await readFile(new URL("../dist/site.html", import.meta.url), "utf8");
  const title = "Antiviral Privacy Policy — Studio Ikigai";
  const description = "How Antiviral accesses, uses, stores, and shares Google and YouTube user data, and how to revoke access and manage your data.";
  const policyURL = "https://getantiviral.app/privacy";

  if (!template.includes('<div id="root"></div>')) {
    throw new Error("Privacy prerender could not find the app root in dist/site.html");
  }

  const html = template
    .replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/>)/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*("\s*\/>)/, `$1${policyURL}$2`)
    .replace(/(<meta (?:property|name)="(?:og|twitter):title" content=")[^"]*("\s*\/>)/g, `$1${title}$2`)
    .replace(/(<meta (?:property|name)="(?:og|twitter):description" content=")[^"]*("\s*\/>)/g, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*("\s*\/>)/, `$1${policyURL}$2`);

  await mkdir(new URL("../dist/privacy/", import.meta.url), { recursive: true });
  await writeFile(new URL("../dist/privacy/index.html", import.meta.url), html);
  console.log("Prerendered /privacy with full policy text and page metadata.");
} finally {
  await server.close();
}
