import React from "react";
import { cn } from "@/lib/utils";

interface ProprietesCarte extends React.HTMLAttributes<HTMLDivElement> {
  surbrillance?: boolean;
}

export const Carte: React.FC<ProprietesCarte> = ({
  surbrillance = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl p-5 transition-all duration-300",
        "bg-[#0b132b]/80 dark:bg-[#0b132b]/80 border backdrop-blur-xl shadow-xl",
        surbrillance
          ? "border-[#00d2ff]/40 shadow-[0_0_30px_rgba(0,210,255,0.12)]"
          : "border-slate-800/80 hover:border-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};