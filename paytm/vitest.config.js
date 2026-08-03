import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node", //tells we are tetsing backend code
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), //resolves the @ to src folder
    },
  },
});