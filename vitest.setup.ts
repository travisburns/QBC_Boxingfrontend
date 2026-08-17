import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Ensure every test starts from a clean DOM and a clean localStorage so token
// state never leaks between the auth tests.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
