import config from "@leftcurve/config/tsup/common.json" with { type: "json" };

import { type Options, defineConfig } from "tsup";

/**
 * @see https://tsup.egoist.dev/#usage
 */
export default defineConfig({
  ...(config as Options),
  platform: "node",
  outExtension: ({ format }) => (format === "cjs" ? { js: ".cjs" } : { js: ".js" }),
  entry: ["src/**"],
});
