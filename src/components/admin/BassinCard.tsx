import React from "react";
import { Carte } from "@/components/ui/Carte";
import { Bouton } from "@/components/ui/Bouton";
import { Bassin, Lot } from "@/types";
import { Droplet, Plus, Fish } from "lucide-react";

interface BassinCardProps {
  bassin: Bassin;
  lotActif?: Lot;
  surAction: (bassinId: string) => void;
}

export const BassinCard: React.FC<BassinCardProps> = ({ bassin, lotActif, surAction }) => {
  const estVide = !lotActif || lotActif.statut !== "en_cours";

  return (
    <Carte surbrillance={!estVide} className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00d2ff]/10 text-[#00d2ff] flex items-center justify-center border border-[#00d2ff]/20">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">{bassin.nom}</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {bassin.capaciteMax} m³
            </span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          bassin.statut === "actif" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          bassin.statut === "maintenance" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
          "bg-slate-800 text-slate-400 border border-slate-700"
        }`}>
          {bassin.statut}
        </div>
      </div>

      <div className="flex-1 bg-slate-900/50 rounded-2xl p-4 mb-4 border border-slate-800/50">
        {estVide ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-6 gap-2">
            <Fish className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-slate-400 font-semibold text-sm">Ce bassin est actuellement vide.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Souche</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-1 rounded-md text-sm">{lotActif.souche}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Quantité</span>
              <span className="font-bold text-[#00d2ff]">{lotActif.quantiteActuelle} <span className="text-xs text-slate-500">poissons</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Poids moyen estimé</span>
              <span className="font-bold text-white">{lotActif.poidsMoyenInitialG} <span className="text-xs text-slate-500">g</span></span>
            </div>
          </div>
        )}
      </div>

      <Bouton 
        variante={estVide ? "primaire" : "secondaire"} 
        taille="sm" 
        onClick={() => surAction(bassin.id)}
      >
        {estVide ? (
          <>
            <Plus className="w-4 h-4" /> Ajouter un Lot
          </>
        ) : (
          <>
             Gérer le Bassin
          </>
        )}
      </Bouton>
    </Carte>
  );
};
