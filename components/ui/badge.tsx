import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full font-sans text-[0.7rem] font-semibold uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        available:
          "border border-moss/40 bg-moss/15 text-moss",
        reserved:
          "border border-amber/40 bg-amber/15 text-amber-soft",
        private:
          "border border-lake-400/40 bg-lake/20 text-lake-400",
        neutral: "border border-line-strong bg-paper-soft text-cream-dim",
        dark: "border border-cream/20 bg-cream/10 text-cream-dim backdrop-blur-md",
      },
      size: {
        sm: "px-2.5 py-1 text-[0.64rem]",
        md: "px-3 py-1.5",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

export function Badge({
  className,
  variant,
  size,
  withDot = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge> & { withDot?: boolean }) {
  return (
    <span className={cn(badge({ variant, size }), className)} {...props}>
      {withDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
