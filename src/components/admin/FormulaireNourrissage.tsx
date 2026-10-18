import React, { useState } from "react";
import { Bouton } from "@/components/ui/Bouton";
import { useAppStore } from "@/store/useAppStore";

interface FormulaireNourrissageProps {
  auTermine: () => void;
}

export const FormulaireNourrissage: React.FC<FormulaireNourrissageProps> = ({ auTermine }) => {
  const { ajouterReleveNourrissage, lots, bassins } = useAppStore();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const lotsActifs = lots.filter((l) => l.statut === "en_cours");

  const [lotId, setLotId] = useState(lotsActifs.length > 0 ? lotsActifs[0].id : "");
  const [typeAliment, setTypeAliment] = useState("");
  const [quantiteKg, setQuantiteKg] = useState<number | "">("");
  const [observations, setObservations] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    if (!lotId || !typeAliment || !quantiteKg) {
      setErreur("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setChargement(true);
    
    const releve = await ajouterReleveNourrissage({
      lotId,
      typeAliment,
      quantiteKg: Number(quantiteKg),
      observations
    });

    setChargement(false);

    if (releve) {
      auTermine();
    } else {
      setErreur("Erreur lors de l'ajout du relevé.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erreur && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold">{erreur}</div>}
      
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Lot / Bassin *</label>
        <select 
          value={lotId} 
          onChange={(e) => setLotId(e.target.value)}
          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none shadow-sm"
        >
          {lotsActifs.length === 0 && <option value="">Aucun lot actif trouvé</option>}
          {lotsActifs.map(lot => {
            const bassin = bassins.find(b => b.id === lot.bassinId);
            return (
              <option key={lot.id} value={lot.id}>
                Bassin {bassin?.nom || '?'} - {lot.souche} ({lot.quantiteActuelle} poissons)
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Type d'Aliment (Taille/Marque) *</label>
        <input 
          type="text" 
          value={typeAliment} 
          onChange={(e) => setTypeAliment(e.target.value)}
          placeholder="Ex: Skretting 2mm"
          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Quantité (kg) *</label>
        <input 
          type="number" 
          step="0.1"
          value={quantiteKg} 
          onChange={(e) => setQuantiteKg(e.target.value ? Number(e.target.value) : "")}
          placeholder="Ex: 12.5"
          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Observations</label>
        <textarea 
          value={observations} 
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Comportement, appétit..."
          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none min-h-[80px] shadow-sm"
        />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Bouton type="button" variante="discret" onClick={auTermine}>Annuler</Bouton>
        <Bouton type="submit" variante="primaire" chargement={chargement}>Enregistrer</Bouton>
      </div>
    </form>
  );
};
