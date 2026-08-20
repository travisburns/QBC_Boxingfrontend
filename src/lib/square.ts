/**
 * Square Web Payments SDK loader + config.
 *
 * SECURITY: only the *publishable* Application ID and Location ID live here
 * (NEXT_PUBLIC_*). Card details are entered into Square's iframe fields and
 * tokenized in the browser — the raw PAN never touches our code, our API, or
 * our database. We only ever send Square the resulting single-use token.
 */

export type SquareEnv = "sandbox" | "production";

export interface SquareConfig {
  appId: string;
  locationId: string;
  env: SquareEnv;
}

export function getSquareConfig(): SquareConfig {
  const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
  const env = (process.env.NEXT_PUBLIC_SQUARE_ENV as SquareEnv) ?? "sandbox";
  return { appId, locationId, env };
}

export function isSquareConfigured(cfg = getSquareConfig()): boolean {
  return Boolean(cfg.appId && cfg.locationId);
}

const SDK_URL: Record<SquareEnv, string> = {
  sandbox: "https://sandbox.web.squarecdn.com/v1/square.js",
  production: "https://web.squarecdn.com/v1/square.js",
};

let sdkPromise: Promise<SquareSdk> | null = null;

/** Injects the Square Web Payments SDK <script> once and resolves window.Square. */
export function loadSquareSdk(env: SquareEnv): Promise<SquareSdk> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Square SDK can only load in the browser"));
  }
  if (window.Square) return Promise.resolve(window.Square);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<SquareSdk>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL[env];
    script.async = true;
    script.onload = () => {
      if (window.Square) resolve(window.Square);
      else reject(new Error("Square SDK loaded but window.Square is missing"));
    };
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("Failed to load the Square payment SDK"));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}

/* ---- Minimal typings for the parts of the SDK we use ---- */

export interface TokenizeResult {
  status: "OK" | "Invalid" | "Cancel" | string;
  token?: string;
  errors?: { message: string }[];
}

export interface SquareCard {
  attach(selector: string | HTMLElement): Promise<void>;
  tokenize(): Promise<TokenizeResult>;
  destroy(): Promise<void>;
}

/** A digital-wallet payment method (Apple Pay / Google Pay). */
export interface SquareWallet {
  /** Google Pay renders into a button element; Apple Pay does not use attach. */
  attach?(selector: string | HTMLElement): Promise<void>;
  tokenize(): Promise<TokenizeResult>;
  destroy?(): Promise<void>;
}

/** Amount + label the wallet sheet shows the customer. */
export interface SquarePaymentRequestOptions {
  countryCode: string;
  currencyCode: string;
  total: { amount: string; label: string };
}

export interface SquarePaymentRequest {
  // Opaque handle passed to applePay()/googlePay(); shape is internal to the SDK.
  [key: string]: unknown;
}

export interface SquarePayments {
  card(options?: Record<string, unknown>): Promise<SquareCard>;
  paymentRequest(options: SquarePaymentRequestOptions): SquarePaymentRequest;
  applePay(request: SquarePaymentRequest): Promise<SquareWallet>;
  googlePay(request: SquarePaymentRequest): Promise<SquareWallet>;
}

export interface SquareSdk {
  payments(appId: string, locationId: string): SquarePayments;
}

/** Formats minor units (cents) as the major-unit string the wallet sheet needs, e.g. 2000 -> "20.00". */
export function toMajorAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

declare global {
  interface Window {
    Square?: SquareSdk;
  }
}
