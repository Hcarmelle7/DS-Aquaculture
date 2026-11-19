"use client";

import React from "react";
import { ArrowRight, Calendar, History, User } from "lucide-react";
import { Bassin, OperationLog } from "@/models";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { EtatVide } from "@/components/ui/EtatVide";

interface JournalOperationsModalProps {
  estOuvert: boolean;
  fermer: () => void;
  operationsLog: OperationLog[];
  bassins: Bassin[];
}

export const JournalOperationsModal: React.FC<JournalOperationsModalProps> = ({
  estOuvert,
  fermer,
  operationsLog,
  bassins,
}) => {
  return (
    <ModalGenerique
      estOuvert={estOuvert}
      fermer={fermer}
      titre="Journal de Traçabilité des Opérations"
    >
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        {operationsLog.length === 0 ? (
          <EtatVide
            Icone={History}
            titre="Aucune opération enregistrée pour le moment."
            message="Les calibrages, transferts et déclarations de mortalité apparaîtront ici."
            className="py-12 p-0 text-slate-500"
            iconeClassName="w-10 h-10 text-slate-400 mb-2 opacity-50"
          />
        ) : (
          <div className="space-y-3">
            {operationsLog.map((log: OperationLog) => {
              const bassinSource = bassins.find((b) => b.id === log.bassinId);
              const bassinDest = bassins.find((b) => b.id === log.destinationBassinId);

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-full uppercase text-[10px] ${
                        log.typeOperation === "calibrage"
                          ? "bg-[#00d2ff]/15 text-[#28a9ed] dark:text-[#00d2ff]"
                          : log.typeOperation === "transfert"
                            ? "bg-blue-500/15 text-blue-500"
                            : "bg-red-500/15 text-red-500"
                      }`}
                    >
                      {log.typeOperation}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(log.creeLe).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {bassinSource?.nom || "Bassin source"}
                        {bassinDest && (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-normal ml-1">
                            <ArrowRight className="w-3 h-3" />
                            {bassinDest.nom}
                          </span>
                        )}
                      </p>
                      {log.calibre && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          Calibre : {log.calibre}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-base font-black ${
                          log.quantiteDelta < 0 ? "text-red-500" : "text-emerald-500"
                        }`}
                      >
                        {log.quantiteDelta > 0 ? `+${log.quantiteDelta}` : log.quantiteDelta}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        poissons
                      </span>
                    </div>
                  </div>

                  {(log.operePar || log.remarques) && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                      {log.operePar && (
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3 h-3" />
                          {log.operePar}
                        </span>
                      )}
                      {log.remarques && (
                        <span className="italic truncate max-w-[200px]">
                          « {log.remarques} »
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ModalGenerique>
  );
};
