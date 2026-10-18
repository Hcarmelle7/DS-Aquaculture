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
        "bg-white dark:bg-[#0b132b]/80 border backdrop-blur-xl shadow-xl",
        surbrillance
          ? "border-[#00d2ff]/50 shadow-[0_0_30px_rgba(0,210,255,0.15)] ring-1 ring-[#00d2ff]/20"
          : "border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};