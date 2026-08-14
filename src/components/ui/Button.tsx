import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "group inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[var(--dark)] text-white hover:bg-[var(--accent)]",
        variant === "secondary" &&
          "bg-white text-[var(--foreground)] hover:bg-[var(--accent)]",
        variant === "outline" &&
          "border border-[var(--border)] bg-transparent hover:bg-white",
        className
      )}
    >
      {children}

      <ArrowUpRight
        size={16}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );
}