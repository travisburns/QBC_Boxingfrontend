"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { AuthShell, authInputClass, FieldLabel, AuthLink } from "@/components/auth/AuthShell";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        firstName: String(form.get("firstName")),
        lastName: String(form.get("lastName")),
        email: String(form.get("email")),
        password,
      });
      router.push(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create your account.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="firstName">First name</FieldLabel>
          <input id="firstName" name="firstName" required autoComplete="given-name" className={authInputClass} />
        </div>
        <div>
          <FieldLabel htmlFor="lastName">Last name</FieldLabel>
          <input id="lastName" name="lastName" required autoComplete="family-name" className={authInputClass} />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <input id="email" name="email" type="email" required autoComplete="email" className={authInputClass} />
      </div>
      <div>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={authInputClass}
        />
        <p className="mt-1.5 text-xs text-muted">At least 8 characters.</p>
      </div>
      {error && <p className="text-sm text-[#ff5a7a]">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join Apex"
      title="Create Account"
      footer={<>Already a member? <AuthLink href="/login">Log in</AuthLink></>}
    >
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
