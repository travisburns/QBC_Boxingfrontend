import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { User } from "@/lib/types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const apiFetch = vi.fn();
let tokenStore: string | null = null;
vi.mock("@/lib/api", () => ({
  apiFetch: (...a: unknown[]) => apiFetch(...a),
  getToken: () => tokenStore,
  setToken: (t: string | null) => {
    tokenStore = t;
  },
}));

import { AuthProvider } from "@/lib/auth";
import { Header } from "./Header";

const member: User = {
  id: "u1",
  email: "m@qbc.test",
  firstName: "Mia",
  lastName: "Member",
  roles: [],
};
const admin: User = { ...member, roles: ["Admin"] };

function renderHeader() {
  return render(
    <AuthProvider>
      <Header />
    </AuthProvider>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
  tokenStore = null;
});

describe("Header front door", () => {
  it("offers a free Sign Up (to /register) and Log In when logged out", async () => {
    renderHeader();

    const signUp = await screen.findAllByRole("link", { name: "Sign Up" });
    expect(signUp.length).toBeGreaterThan(0);
    signUp.forEach((a) => expect(a).toHaveAttribute("href", "/register"));

    screen
      .getAllByRole("link", { name: /log in/i })
      .forEach((a) => expect(a).toHaveAttribute("href", "/login"));

    // No paid "Join Now" and no Admin link for an anonymous visitor.
    expect(screen.queryByRole("link", { name: "Join Now" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Admin" })).toBeNull();
  });

  it("shows the paid Join Now upgrade and My Account for a logged-in member", async () => {
    tokenStore = "tok";
    apiFetch.mockResolvedValue(member);
    renderHeader();

    const joinNow = await screen.findAllByRole("link", { name: "Join Now" });
    joinNow.forEach((a) => expect(a).toHaveAttribute("href", "/membership"));
    screen
      .getAllByRole("link", { name: /my account/i })
      .forEach((a) => expect(a).toHaveAttribute("href", "/account"));

    // A member is not offered the free Sign Up, and sees no Admin link.
    expect(screen.queryByRole("link", { name: "Sign Up" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Admin" })).toBeNull();
  });

  it("reveals the Admin link only for an Admin-role user", async () => {
    tokenStore = "tok";
    apiFetch.mockResolvedValue(admin);
    renderHeader();

    await waitFor(() =>
      expect(screen.getAllByRole("link", { name: "Admin" }).length).toBeGreaterThan(0),
    );
    screen
      .getAllByRole("link", { name: "Admin" })
      .forEach((a) => expect(a).toHaveAttribute("href", "/admin"));
  });
});
