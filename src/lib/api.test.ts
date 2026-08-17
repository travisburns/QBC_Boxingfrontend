import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, getToken, setToken, ApiError, API_BASE } from "./api";

describe("token storage", () => {
  it("round-trips a token through localStorage", () => {
    expect(getToken()).toBeNull();
    setToken("abc.def.ghi");
    expect(getToken()).toBe("abc.def.ghi");
    expect(window.localStorage.getItem("qbc.token")).toBe("abc.def.ghi");
  });

  it("clears the token when set to null", () => {
    setToken("something");
    setToken(null);
    expect(getToken()).toBeNull();
    expect(window.localStorage.getItem("qbc.token")).toBeNull();
  });
});

describe("apiFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mockJson(body: unknown, init: { status?: number; ok?: boolean } = {}) {
    const status = init.status ?? 200;
    return {
      ok: init.ok ?? status < 400,
      status,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => body,
    } as unknown as Response;
  }

  it("prefixes the API base and parses JSON on success", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockJson({ ok: true }));
    const out = await apiFetch<{ ok: boolean }>("/api/plans", { auth: false });
    expect(out).toEqual({ ok: true });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe(`${API_BASE}/api/plans`);
  });

  it("attaches the bearer token when auth is on (default) and a token exists", async () => {
    setToken("tok-123");
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockJson({}));
    await apiFetch("/api/auth/me");
    const [, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = opts.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer tok-123");
  });

  it("does NOT attach a token when auth:false (register/login)", async () => {
    setToken("tok-123");
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockJson({}));
    await apiFetch("/api/auth/login", { method: "POST", auth: false, body: { a: 1 } });
    const [, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = opts.headers as Headers;
    expect(headers.get("Authorization")).toBeNull();
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(opts.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("throws ApiError carrying the server message and status on failure", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockJson({ message: "Invalid email or password." }, { status: 401 }),
    );
    await expect(apiFetch("/api/auth/login", { auth: false })).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
      message: "Invalid email or password.",
    });
  });

  it("wraps network failures as ApiError with status 0", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new TypeError("boom"));
    const err = await apiFetch("/api/plans", { auth: false }).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(0);
  });
});
