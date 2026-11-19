import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionCarteAdminProps {
  titre: string;
  sousTitre: string;
  Icone: LucideIcon;
  iconeContainerClassName: string;
  actionDroite?: React.ReactNode;
  children: React.ReactNode;
}

export const SectionCarteAdmin: React.FC<SectionCarteAdminProps> = ({
  titre,
  sousTitre,
  Icone,
  iconeContainerClassName,
  actionDroite,
  children,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div
        className={cn(
          "flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800",
          actionDroite && "justify-between flex-wrap"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0",
              iconeContainerClassName
            )}
          >
            <Icone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {titre}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{sousTitre}</p>
          </div>
        </div>
        {actionDroite}
      </div>

      {children}
    </div>
  );
};
