import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <button
      className={cn(
        "group inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300",
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