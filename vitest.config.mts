import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Unit/component tests run in jsdom. E2E (Playwright) lives under e2e/ and is
// excluded here so `vitest` and `playwright test` never trip over each other.
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // happy-dom instead of jsdom: jsdom pulls in undici, which crashes on some
    // Node builds (webidl.util.markAsUncloneable). happy-dom has no such dep.
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    restoreMocks: true,
  },
});
