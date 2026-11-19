import React from "react";
import { cn } from "@/lib/utils";

export type VarianteBouton =
  | "primaire"
  | "secondaire"
  | "whatsapp"
  | "danger"
  | "discret"
  | "contour"
  | "neutre"
  | "degrade"
  | "rougePlein"
  | "bleu";

export type TailleBouton = "xs" | "sm" | "md" | "lg" | "iconeSm" | "icone" | "iconeLg";
export type BordureBouton = "defaut" | "aucune" | "fine" | "epaisse";
export type ArrondiBouton = "md" | "lg" | "xl" | "2xl" | "full";
export type GraisseBouton = "semibold" | "bold" | "black";

export interface ProprietesBouton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBouton;
  taille?: TailleBouton;
  bordure?: BordureBouton;
  arrondi?: ArrondiBouton;
  graisse?: GraisseBouton;
  pleineLargeur?: boolean;
  iconeGauche?: React.ReactNode;
  iconeDroite?: React.ReactNode;
  chargement?: boolean;
}

const STYLES_TAILLES: Record<TailleBouton, string> = {
  xs: "px-3 py-2 text-xs gap-1.5",
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3.5 text-base gap-2.5 w-full",
  iconeSm: "w-7 h-7 p-0",
  icone: "w-10 h-10 p-0",
  iconeLg: "w-14 h-14 p-0",
};

const STYLES_VARIANTES: Record<VarianteBouton, string> = {
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
  contour:
    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm",
  neutre:
    "bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700",
  degrade:
    "bg-gradient-to-r from-[#28a9ed] to-[#00d2ff] text-slate-950 hover:brightness-105 shadow-xl shadow-[#00d2ff]/25",
  rougePlein:
    "bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/25",
  bleu:
    "bg-[#28a9ed] hover:bg-[#208bc4] text-white",
};

const STYLES_BORDURES: Record<BordureBouton, string> = {
  defaut: "",
  aucune: "border-0",
  fine: "border",
  epaisse: "border-2",
};

const STYLES_ARRONDIS: Record<ArrondiBouton, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

const STYLES_GRAISSES: Record<GraisseBouton, string> = {
  semibold: "font-semibold",
  bold: "font-bold",
  black: "font-black",
};

export const Bouton: React.FC<ProprietesBouton> = ({
  variante = "primaire",
  taille = "md",
  bordure = "defaut",
  arrondi = "2xl",
  graisse = "bold",
  pleineLargeur = false,
  iconeGauche,
  iconeDroite,
  chargement = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const stylesDeBase =
    "inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  return (
    <button
      className={cn(
        stylesDeBase,
        STYLES_ARRONDIS[arrondi],
        STYLES_GRAISSES[graisse],
        STYLES_TAILLES[taille],
        STYLES_VARIANTES[variante],
        STYLES_BORDURES[bordure],
        pleineLargeur && "w-full",
        className
      )}
      disabled={disabled || chargement}
      {...props}
    >
      {chargement ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        iconeGauche
      )}
      {children}
      {!chargement && iconeDroite}
    </button>
  );
};
