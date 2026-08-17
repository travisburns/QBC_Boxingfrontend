import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AuthResponse, User } from "@/lib/types";

// Mock the API layer so the auth context is tested in isolation from fetch.
const apiFetch = vi.fn();
let tokenStore: string | null = null;
vi.mock("@/lib/api", () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
  getToken: () => tokenStore,
  setToken: (t: string | null) => {
    tokenStore = t;
  },
}));

import { AuthProvider, useAuth } from "@/lib/auth";

const member: User = {
  id: "u1",
  email: "member@qbc.test",
  firstName: "Mia",
  lastName: "Member",
  roles: [],
};
const admin: User = { ...member, id: "u2", email: "owner@qbc.test", roles: ["Admin"] };

function authResponse(user: User): AuthResponse {
  return { token: "jwt-token", expiresAtUtc: new Date().toISOString(), user };
}

// A tiny probe component that surfaces the context for assertions.
function Probe() {
  const { user, loading, isAuthenticated, isAdmin, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authed">{String(isAuthenticated)}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="name">{user?.firstName ?? "-"}</span>
      <button onClick={() => login("member@qbc.test", "pw")}>login</button>
      <button
        onClick={() =>
          register({ email: "n@qbc.test", password: "password1", firstName: "N", lastName: "U" })
        }
      >
        register
      </button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
  tokenStore = null;
});

describe("AuthProvider", () => {
  it("starts unauthenticated and stops loading when there is no token", async () => {
    renderAuth();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    expect(screen.getByTestId("authed")).toHaveTextContent("false");
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("hydrates the session from an existing token via /api/auth/me", async () => {
    tokenStore = "existing-token";
    apiFetch.mockResolvedValueOnce(member);
    renderAuth();
    await waitFor(() => expect(screen.getByTestId("authed")).toHaveTextContent("true"));
    expect(apiFetch).toHaveBeenCalledWith("/api/auth/me");
    expect(screen.getByTestId("name")).toHaveTextContent("Mia");
  });

  it("clears an invalid token silently on hydration", async () => {
    tokenStore = "bad-token";
    apiFetch.mockRejectedValueOnce(new Error("401"));
    renderAuth();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    expect(screen.getByTestId("authed")).toHaveTextContent("false");
    expect(tokenStore).toBeNull();
  });

  it("logs a member in and does not flag them as admin", async () => {
    apiFetch.mockResolvedValueOnce(authResponse(member));
    renderAuth();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));

    await userEvent.click(screen.getByText("login"));

    await waitFor(() => expect(screen.getByTestId("authed")).toHaveTextContent("true"));
    expect(apiFetch).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { email: "member@qbc.test", password: "pw" },
    });
    expect(screen.getByTestId("admin")).toHaveTextContent("false");
    expect(tokenStore).toBe("jwt-token");
  });

  it("flags a user holding the Admin role as admin", async () => {
    apiFetch.mockResolvedValueOnce(authResponse(admin));
    renderAuth();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));

    await userEvent.click(screen.getByText("login"));

    await waitFor(() => expect(screen.getByTestId("admin")).toHaveTextContent("true"));
  });

  it("registers a plan-less account and authenticates it (free signup, no billing)", async () => {
    apiFetch.mockResolvedValueOnce(authResponse(member));
    renderAuth();
    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));

    await userEvent.click(screen.getByText("register"));

    await waitFor(() => expect(screen.getByTestId("authed")).toHaveTextContent("true"));
    const [path, opts] = apiFetch.mock.calls[0];
    expect(path).toBe("/api/auth/register");
    // Registration must never carry a plan/billing field — it is auth-only.
    expect(Object.keys((opts as { body: object }).body)).toEqual([
      "email",
      "password",
      "firstName",
      "lastName",
    ]);
  });

  it("logs out, clearing user and token", async () => {
    apiFetch.mockResolvedValueOnce(authResponse(member));
    renderAuth();
    await userEvent.click(screen.getByText("login"));
    await waitFor(() => expect(screen.getByTestId("authed")).toHaveTextContent("true"));

    await userEvent.click(screen.getByText("logout"));
    expect(screen.getByTestId("authed")).toHaveTextContent("false");
    expect(tokenStore).toBeNull();
  });
});
