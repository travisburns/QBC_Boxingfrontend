"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full border border-line bg-ink-3 px-4 py-3 text-cream placeholder:text-muted/60 " +
  "focus:border-accent focus:outline-none rounded-[2px]";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    try {
      // Wire to the backend when the contact endpoint is live:
      // await apiFetch("/api/contact", { method: "POST", auth: false, body: payload });
      await new Promise((r) => setTimeout(r, 500));
      void payload;
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-accent/40 bg-ink-3 p-8 text-center">
        <p className="font-display text-2xl text-cream">Message sent</p>
        <p className="mt-2 text-muted">Thanks — a coach will get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted">
          Name
        </label>
        <input id="name" name="name" required autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted">
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </div>
      {status === "error" && (
        <p className="text-sm text-[#ff5a7a]">Something went wrong. Please try again.</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
