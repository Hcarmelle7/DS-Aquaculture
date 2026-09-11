import React from "react";
import { Carte } from "@/components/ui/Carte";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  titre: string;
  valeur: string | number;
  Icone: LucideIcon;
  description?: string;
  tendance?: "hausse" | "baisse" | "neutre";
  valeurTendance?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ titre, valeur, Icone, description, tendance, valeurTendance }) => {
  return (
    <Carte className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-400 font-semibold text-sm">{titre}</h3>
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[#00d2ff]">
          <Icone className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-black text-white">{valeur}</div>
        {(description || valeurTendance) && (
          <div className="flex items-center gap-2 mt-2 text-xs font-semibold">
            {valeurTendance && (
              <span className={tendance === "hausse" ? "text-emerald-400" : tendance === "baisse" ? "text-red-400" : "text-slate-400"}>
                {tendance === "hausse" ? "↑" : tendance === "baisse" ? "↓" : "→"} {valeurTendance}
              </span>
            )}
            {description && <span className="text-slate-500">{description}</span>}
          </div>
        )}
      </div>
    </Carte>
  );
};
