import React, { useState } from "react";
import { Lot } from "@/types";
import { Bouton } from "@/components/ui/Bouton";
import { useAppStore } from "@/store/useAppStore";

interface FormulaireLotProps {
  bassinId: string;
  auTermine: () => void;
}

export const FormulaireLot: React.FC<FormulaireLotProps> = ({ bassinId, auTermine }) => {
  const { ajouterLot } = useAppStore();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const [souche, setSouche] = useState("");
  const [quantite, setQuantite] = useState<number | "">("");
  const [poidsMoyen, setPoidsMoyen] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    if (!souche || !quantite || !poidsMoyen) {
      setErreur("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setChargement(true);
    
    const nouveauLot = await ajouterLot({
      bassinId,
      souche,
      quantiteInitiale: Number(quantite),
      poidsMoyenInitialG: Number(poidsMoyen)
    });

    setChargement(false);

    if (nouveauLot) {
      auTermine();
    } else {
      setErreur("Une erreur est survenue lors de l'ajout du lot.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erreur && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold">{erreur}</div>}
      
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Souche (Provenance) *</label>
        <input 
          type="text" 
          value={souche} 
          onChange={(e) => setSouche(e.target.value)}
          placeholder="Ex: Clarias Gariepinus (Ferme X)"
          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Quantité Initiale *</label>
        <input 
          type="number" 
          value={quantite} 
          onChange={(e) => setQuantite(e.target.value ? Number(e.target.value) : "")}
          placeholder="Ex: 2000"
          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Poids Moyen Initial (grammes) *</label>
        <input 
          type="number" 
          step="0.1"
          value={poidsMoyen} 
          onChange={(e) => setPoidsMoyen(e.target.value ? Number(e.target.value) : "")}
          placeholder="Ex: 5"
          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none shadow-sm"
        />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Bouton type="button" variante="discret" onClick={auTermine}>Annuler</Bouton>
        <Bouton type="submit" variante="primaire" chargement={chargement}>
          Ajouter le lot
        </Bouton>
      </div>
    </form>
  );
};
