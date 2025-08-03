"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      style={
        {
          "--normal-bg": "var(--chart-2)",
          "--normal-text": "var(--background)",
          "--normal-border": "var(--background)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
