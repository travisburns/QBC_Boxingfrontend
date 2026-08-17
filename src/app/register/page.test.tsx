import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "@/lib/api";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  useSearchParams: () => ({ get: () => null }),
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
import RegisterPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>,
  );
}

async function fillForm(pw: string) {
  await userEvent.type(screen.getByLabelText(/first name/i), "Mia");
  await userEvent.type(screen.getByLabelText(/last name/i), "Member");
  await userEvent.type(screen.getByLabelText(/email/i), "mia@qbc.test");
  await userEvent.type(screen.getByLabelText(/password/i), pw);
}

beforeEach(() => {
  push.mockReset();
  apiFetch.mockReset();
  tokenStore = null;
});

describe("RegisterPage", () => {
  it("creates a plan-less account and lands on /account (no billing involved)", async () => {
    apiFetch.mockResolvedValueOnce({
      token: "t",
      expiresAtUtc: "",
      user: { id: "1", email: "mia@qbc.test", firstName: "Mia", lastName: "Member", roles: [] },
    });
    renderPage();

    await fillForm("password1");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/account"));
    const [path, opts] = apiFetch.mock.calls[0];
    expect(path).toBe("/api/auth/register");
    expect(opts.body).toEqual({
      firstName: "Mia",
      lastName: "Member",
      email: "mia@qbc.test",
      password: "password1",
    });
  });

  it("blocks a too-short password client-side without calling the API", async () => {
    renderPage();
    await fillForm("short");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText("Password must be at least 8 characters."),
    ).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("surfaces a duplicate-email conflict from the server", async () => {
    apiFetch.mockRejectedValueOnce(
      new ApiError("An account with that email already exists.", 409),
    );
    renderPage();

    await fillForm("password1");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText("An account with that email already exists."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
