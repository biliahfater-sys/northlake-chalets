"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Children, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  "group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-sans font-medium tracking-tight transition-[color,background-color,border-color,transform,box-shadow] duration-500 ease-[var(--ease-glide)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-cream shadow-soft hover:bg-pine-soft hover:shadow-card",
        gold: "bg-gold text-ink shadow-soft hover:bg-gold-soft hover:shadow-card",
        outline:
          "border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-cream",
        cream:
          "border border-cream/25 bg-cream/10 text-cream backdrop-blur-md hover:bg-cream hover:text-ink",
        ghost: "text-ink hover:bg-paper-deep",
        link: "text-ink underline-offset-4 hover:text-bronze hover:underline rounded-none px-0",
      },
      size: {
        sm: "h-9 px-4 text-[0.8rem]",
        md: "h-11 px-6 text-[0.9rem]",
        lg: "h-13 px-8 text-[0.95rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
  /** Show the animated sheen sweep (default on for filled variants). */
  sheen?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild,
  sheen = true,
  children,
  ...props
}: ButtonProps) {
  const showSheen =
    sheen && (variant === "primary" || variant === "gold" || variant == null);

  const inner = (content: React.ReactNode) => (
    <>
      {showSheen && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/25 to-transparent transition-transform duration-700 ease-[var(--ease-glide)] group-hover:translate-x-full"
        />
      )}
      {/* toArray keys the re-parented children so React doesn't warn */}
      <span className="relative inline-flex items-center gap-2">
        {Children.toArray(content)}
      </span>
    </>
  );

  // asChild: merge button styling onto the child element (e.g. <a>) and
  // rebuild its content inside the sheen/label structure.
  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement>
    >;
    return cloneElement(
      child,
      {
        ...props,
        className: cn(
          button({ variant, size }),
          className,
          child.props.className,
        ),
      },
      inner(child.props.children),
    );
  }

  return (
    <button className={cn(button({ variant, size }), className)} {...props}>
      {inner(children)}
    </button>
  );
}
