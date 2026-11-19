import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EtatVideProps {
  Icone: LucideIcon;
  titre?: string;
  message: string;
  action?: React.ReactNode;
  variante?: "tableau" | "mobile" | "carteDashed";
  className?: string;
  iconeClassName?: string;
}

export const EtatVide: React.FC<EtatVideProps> = ({
  Icone,
  titre,
  message,
  action,
  variante = "tableau",
  className,
  iconeClassName,
}) => {
  if (variante === "carteDashed") {
    return (
      <div
        className={cn(
          "col-span-full py-16 flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center p-6",
          className
        )}
      >
        <Icone
          className={cn("w-12 h-12 text-slate-400 dark:text-slate-600 mb-3", iconeClassName)}
        />
        {titre && (
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{titre}</h3>
        )}
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-4">{message}</p>
        {action}
      </div>
    );
  }

  if (variante === "mobile") {
    return (
      <div
        className={cn(
          "p-8 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400",
          className
        )}
      >
        <Icone className={cn("w-10 h-10 mx-auto mb-2 opacity-20", iconeClassName)} />
        <p className="text-sm">{message}</p>
        {action}
      </div>
    );
  }

  return (
    <div className={cn("p-12 text-center text-slate-500 dark:text-slate-400", className)}>
      <Icone className={cn("w-12 h-12 mx-auto mb-3 opacity-20", iconeClassName)} />
      {titre && <p className="font-semibold text-sm">{titre}</p>}
      <p className={titre ? "text-xs text-slate-400 mt-1" : undefined}>{message}</p>
      {action}
    </div>
  );
};
