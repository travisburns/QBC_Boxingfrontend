import Link from "next/link";
import { clsx } from "@/lib/clsx";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.12em] " +
  "transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none rounded-[2px] " +
  "text-sm select-none";

const sizes: Record<Size, string> = {
  md: "px-5 py-3",
  lg: "px-7 py-4 text-[15px]",
};

const variants: Record<Variant, string> = {
  solid: "bg-accent text-accent-ink hover:bg-accent-600 active:bg-accent-700",
  outline:
    "border border-line-strong text-cream hover:border-accent hover:text-accent bg-transparent",
  ghost: "text-cream hover:text-accent bg-transparent",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "solid",
  size = "md",
  className,
  type = "button",
  ...rest
}: CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={clsx(base, sizes[size], variants[variant], className)}
      {...rest}
    />
  );
}

export function ButtonLink({
  variant = "solid",
  size = "md",
  className,
  href,
  children,
  ...rest
}: CommonProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(base, sizes[size], variants[variant], className)}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={clsx(base, sizes[size], variants[variant], className)}>
      {children}
    </Link>
  );
}
