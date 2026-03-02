import React from "react";
import clsx from "clsx";

type ContainerWidth = "sm" | "md" | "lg" | "xl" | "full";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerWidth?: ContainerWidth;
  centered?: boolean;
}

const widths: Record<ContainerWidth, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

const Section: React.FC<SectionProps> = ({
  containerWidth = "md",
  centered = false,
  className,
  children,
  ...props
}) => {
  return (
    <section className={clsx("py-16", className)} {...props}>
      <div
        className={clsx(
          "mx-auto px-6",
          widths[containerWidth],
          centered && "text-center"
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;