"use client";

import React from "react";
import { Children, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

export type BentoGridSize = "none" | "small" | "medium" | "large" | "full";
export type BentoGridItemProps<T extends React.ElementType = "div"> = {
  size?: BentoGridSize;
  className?: string;
  children: React.ReactNode;
  as?: T;
  hoverEffect?: "scale" | "shadow" | "both" | "none";
} & React.ComponentPropsWithoutRef<T>;

export type BentoGridProps<T extends React.ElementType = "div"> = {
  className?: string;
  children: React.ReactNode;
  gap?: number | { mobile?: number; tablet?: number; desktop?: number };
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  autoFlow?: "row" | "column" | "row dense" | "column dense";
  debug?: boolean;
  containerAs?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "className" | "children">;

const sizeClasses: Record<BentoGridSize, string> = {
  none: "col-span-1",
  small: "col-span-1 row-span-1",
  medium: "col-span-1 md:col-span-2 row-span-1",
  large: "col-span-1 md:col-span-2 row-span-2",
  full: "col-span-1 md:col-span-2 lg:col-span-4 row-span-1",
};

const hoverEffects = {
  scale: "transform transition-transform duration-300 hover:scale-[1.02]",
  shadow: "transition-shadow duration-300 hover:shadow-lg",
  both: "transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
  none: "",
};

export function BentoGridItem<T extends React.ElementType = "div">({
  size = "small",
  className,
  children,
  as: Component,
  hoverEffect = "both",
  useDefaults = true,
  ...props
}: BentoGridItemProps<T> & { useDefaults?: boolean }) {
  const Comp = (Component ?? "div") as React.ElementType;

  return (
    <Comp
      className={cn(
        useDefaults && [
          "rounded-xl bg-gradient-to-br from-card/80 to-card/60 shadow-sm hover:shadow-md backdrop-blur-sm transition-all overflow-hidden",
          sizeClasses[size],
          hoverEffects[hoverEffect],
        ],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function BentoGrid<T extends React.ElementType = "div">({
  className,
  children,
  gap = 4,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  autoFlow = "row",
  debug = false,
  containerAs,
  ...props
}: BentoGridProps<T>) {
  const { mobile = 1, tablet = 2, desktop = 4 } = columns;

  const gapClasses =
    typeof gap === "number"
      ? `gap-${gap}`
      : cn(
          `gap-${gap.mobile ?? 4}`,
          `sm:gap-${gap.tablet ?? gap.mobile ?? 4}`,
          `lg:gap-${gap.desktop ?? gap.tablet ?? gap.mobile ?? 4}`
        );

  const Container = (containerAs ?? "div") as React.ElementType;

  return (
    <Container
      className={cn(
        "grid w-full auto-rows-auto",
        `grid-cols-${mobile}`,
        `md:grid-cols-${tablet}`,
        `lg:grid-cols-${desktop}`,
        `grid-auto-flow-${autoFlow.replace(" ", "-")}`,
        gapClasses,
        debug ? "debug-grid" : "",
        className
      )}
      {...props}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child as React.ReactElement<BentoGridItemProps>, {
          // Ensure all items have consistent hover effects unless specified
          hoverEffect:
            (child.props as BentoGridItemProps).hoverEffect ?? "both",
        });
      })}
    </Container>
  );
}
