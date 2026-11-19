"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { NavBar } from "@/components/client/NavBar";
import { BanniereErreurReseau } from "@/components/admin/BanniereErreurReseau";
import { cn } from "@/lib/utils";

interface AdminPageLayoutProps {
  titre: string;
  sousTitre?: string;
  Icone: LucideIcon;
  actions?: React.ReactNode;
  maxWidthClass?: string;
  paddingBottomClass?: string;
  titreClassName?: string;
  sousTitreClassName?: string;
  children: React.ReactNode;
  modals?: React.ReactNode;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  titre,
  sousTitre,
  Icone,
  actions,
  maxWidthClass = "max-w-7xl",
  paddingBottomClass = "pb-24",
  titreClassName,
  sousTitreClassName,
  children,
  modals,
}) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-300",
        paddingBottomClass
      )}
    >
      <NavBar />

      <main className={cn("p-4 sm:p-6 lg:p-8 mx-auto space-y-8", maxWidthClass)}>
        <BanniereErreurReseau />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className={cn(
                "text-3xl sm:text-4xl font-black flex items-center gap-3",
                titreClassName
              )}
            >
              <Icone className="w-8 h-8 text-[#00d2ff]" />
              {titre}
            </h1>
            {sousTitre && (
              <p className={cn("text-[var(--text-muted)] text-sm mt-1", sousTitreClassName)}>
                {sousTitre}
              </p>
            )}
          </div>
          {actions}
        </div>

        {children}
      </main>

      {modals}
    </div>
  );
};
