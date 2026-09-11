import React, { useState } from "react";
import { Bassin } from "@/types";
import { Bouton } from "@/components/ui/Bouton";
import { useAppStore } from "@/store/useAppStore";

interface FormulaireBassinProps {
  bassinExistant?: Bassin;
  auTermine: () => void;
}

export const FormulaireBassin: React.FC<FormulaireBassinProps> = ({ bassinExistant, auTermine }) => {
  const { ajouterBassin, mettreAJourBassin } = useAppStore();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  const [nom, setNom] = useState(bassinExistant?.nom || "");
  const [categorie, setCategorie] = useState<Bassin["categorie"]>(bassinExistant?.categorie || "grossissement");
  const [capacite, setCapacite] = useState<number | "">(bassinExistant?.capaciteMaxPoissons || "");
  const [statut, setStatut] = useState<Bassin["statut"]>(bassinExistant?.statut || "actif");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    if (!nom || !capacite) {
      setErreur("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setChargement(true);
    
    let succes = false;
    if (bassinExistant) {
      succes = await mettreAJourBassin(bassinExistant.id, {
        nom,
        categorie,
        capaciteMaxPoissons: Number(capacite),
        statut
      });
    } else {
      const nouveauBassin = await ajouterBassin({
        nom,
        categorie,
        capaciteMaxPoissons: Number(capacite),
        statut
      });
      succes = !!nouveauBassin;
    }

    setChargement(false);

    if (succes) {
      auTermine();
    } else {
      setErreur("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erreur && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold">{erreur}</div>}
      
      <div>
        <label className="block text-sm font-bold text-slate-400 mb-1">Nom du Bassin *</label>
        <input 
          type="text" 
          value={nom} 
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex: Bassin A1"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-400 mb-1">Catégorie</label>
        <select 
          value={categorie} 
          onChange={(e) => setCategorie(e.target.value as Bassin["categorie"])}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-[#00d2ff] outline-none"
        >
          <option value="alevinage">Alevinage</option>
          <option value="grossissement">Grossissement</option>
          <option value="geniteurs">Géniteurs</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-400 mb-1">Capacité Max (Nombre de poissons) *</label>
        <input 
          type="number" 
          value={capacite} 
          onChange={(e) => setCapacite(e.target.value ? Number(e.target.value) : "")}
          placeholder="Ex: 5000"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-[#00d2ff] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-400 mb-1">Statut</label>
        <select 
          value={statut} 
          onChange={(e) => setStatut(e.target.value as Bassin["statut"])}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-[#00d2ff] outline-none"
        >
          <option value="actif">Actif</option>
          <option value="maintenance">En maintenance</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Bouton type="button" variante="discret" onClick={auTermine}>Annuler</Bouton>
        <Bouton type="submit" variante="primaire" chargement={chargement}>
          {bassinExistant ? "Mettre à jour" : "Créer le bassin"}
        </Bouton>
      </div>
    </form>
  );
};
