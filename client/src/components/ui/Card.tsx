import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-md border border-white/5",
        "bg-gradient-to-b from-zinc-900/80 to-zinc-950/80",
        "backdrop-blur-sm",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        "transition-all duration-300 ease-out",
        className
      )}
      {...props}
    >
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl opacity-40 transition-opacity duration-300 group-hover:opacity-70" />

      {/* Soft top highlight line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative p-6">
        {children}
      </div>
    </div>
  );
};

export const CardTitle: React.FC<
  React.HTMLAttributes<HTMLHeadingElement>
> = ({ className, ...props }) => (
  <h3
    className={clsx(
      "mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-400",
      className
    )}
    {...props}
  />
);

export const CardContent: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p
    className={clsx(
      "text-sm leading-relaxed text-zinc-400",
      className
    )}
    {...props}
  />
);