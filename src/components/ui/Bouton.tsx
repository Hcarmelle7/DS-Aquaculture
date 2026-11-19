import React from "react";
import { cn } from "@/lib/utils";

interface ProprietesBouton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primaire" | "secondaire" | "whatsapp" | "danger" | "discret";
  taille?: "sm" | "md" | "lg";
  chargement?: boolean;
}

export const Bouton: React.FC<ProprietesBouton> = ({
  variante = "primaire",
  taille = "md",
  chargement = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const stylesDeBase =
    "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none";

  const stylesTailles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5 w-full",
  };

  const stylesVariantes = {
    primaire:
      "bg-[#00d2ff] hover:bg-[#00b4db] text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.25)] hover:shadow-[0_0_25px_rgba(0,210,255,0.4)]",
    secondaire:
      "bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600",
    whatsapp:
      "bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.45)]",
    danger:
      "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30",
    discret:
      "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white",
  };

  return (
    <button
      className={cn(stylesDeBase, stylesTailles[taille], stylesVariantes[variante], className)}
      disabled={disabled || chargement}
      {...props}
    >
      {chargement ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};