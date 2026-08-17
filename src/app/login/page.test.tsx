import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "@/lib/api";

const push = vi.fn();
let nextParam: string | null = null;
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  useSearchParams: () => ({ get: (k: string) => (k === "next" ? nextParam : null) }),
}));

const apiFetch = vi.fn();
let tokenStore: string | null = null;
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    apiFetch: (...a: unknown[]) => apiFetch(...a),
    getToken: () => tokenStore,
    setToken: (t: string | null) => {
      tokenStore = t;
    },
  };
});

import { AuthProvider } from "@/lib/auth";
import LoginPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>,
  );
}

beforeEach(() => {
  push.mockReset();
  apiFetch.mockReset();
  tokenStore = null;
  nextParam = null;
});

describe("LoginPage", () => {
  it("submits credentials and redirects to /account by default", async () => {
    apiFetch.mockResolvedValueOnce({
      token: "t",
      expiresAtUtc: "",
      user: { id: "1", email: "a@b.c", firstName: "A", lastName: "B", roles: [] },
    });
    renderPage();

    await userEvent.type(screen.getByLabelText(/email/i), "a@b.c");
    await userEvent.type(screen.getByLabelText(/password/i), "password1");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/account"));
    expect(apiFetch).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { email: "a@b.c", password: "password1" },
    });
  });

  it("honors a ?next= destination after login (e.g. bounced from checkout)", async () => {
    nextParam = "/checkout?plan=boxing";
    apiFetch.mockResolvedValueOnce({
      token: "t",
      expiresAtUtc: "",
      user: { id: "1", email: "a@b.c", firstName: "A", lastName: "B", roles: [] },
    });
    renderPage();

    await userEvent.type(screen.getByLabelText(/email/i), "a@b.c");
    await userEvent.type(screen.getByLabelText(/password/i), "password1");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/checkout?plan=boxing"));
  });

  it("shows the server's error message and does not redirect on bad credentials", async () => {
    apiFetch.mockRejectedValueOnce(new ApiError("Invalid email or password.", 401));
    renderPage();

    await userEvent.type(screen.getByLabelText(/email/i), "a@b.c");
    await userEvent.type(screen.getByLabelText(/password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
