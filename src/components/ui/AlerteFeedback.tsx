import React from "react";
import { AlertCircle, Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlerteFeedbackProps {
  type: "succes" | "erreur";
  message: React.ReactNode;
  styleSurface?: "standard" | "plein";
  className?: string;
}

export const AlerteFeedback: React.FC<AlerteFeedbackProps> = ({
  type,
  message,
  styleSurface = "standard",
  className,
}) => {
  const estSucces = type === "succes";

  const classesSurface =
    styleSurface === "plein"
      ? estSucces
        ? "p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-sm font-bold text-emerald-700 dark:text-emerald-300"
        : "p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-sm font-bold text-red-700 dark:text-red-300"
      : estSucces
        ? "p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-bold"
        : "p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold";

  return (
    <div className={cn(classesSurface, "flex items-center gap-3 animate-in fade-in", className)}>
      {estSucces ? (
        styleSurface === "plein" ? (
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
        ) : (
          <Check className="w-5 h-5 shrink-0" />
        )
      ) : (
        <AlertCircle
          className={cn("w-5 h-5 shrink-0", styleSurface === "plein" && "text-red-500")}
        />
      )}
      <span>{message}</span>
    </div>
  );
};
