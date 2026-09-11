import React from "react";
import { CommandePoisson } from "@/types";
import { MapPin, Phone, User, Calendar, CheckCircle, XCircle, Truck, Clock } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Bouton } from "@/components/ui/Bouton";

interface CommandeCardProps {
  commande: CommandePoisson;
}

export const CommandeCard: React.FC<CommandeCardProps> = ({ commande }) => {
  const { mettreAJourStatutCommande } = useAppStore();

  const handleStatut = async (nouveauStatut: CommandePoisson["statut"]) => {
    await mettreAJourStatutCommande(commande.id, nouveauStatut);
  };

  const getStatutBadge = () => {
    switch (commande.statut) {
      case "en_attente":
        return <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> En attente</span>;
      case "en_livraison":
        return <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> En livraison</span>;
      case "livree":
        return <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Livrée</span>;
      case "annulee":
        return <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Annulée</span>;
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 hover:border-[#00d2ff]/30 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-white">{commande.codeCommande}</h3>
          <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            {new Date(commande.creeLe).toLocaleDateString('fr-FR', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        {getStatutBadge()}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-slate-500 mt-0.5" />
          <div>
            <p className="text-white font-medium">{commande.nomClient}</p>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              <Phone className="w-3 h-3" /> {commande.telephone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
          <div>
            <p className="text-white font-medium">{commande.ville}</p>
            <p className="text-slate-400 text-sm">{commande.quartier}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">Produit</span>
          <span className="font-bold text-white capitalize">{commande.preparation === 'vivant' ? 'Silure Vivant' : 'Silure Nettoyé'}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">Quantité</span>
          <span className="font-bold text-white">{commande.poidsKg} kg</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
          <span className="text-slate-400 text-sm">Total à payer</span>
          <span className="font-black text-[#00d2ff] text-lg">{commande.prixTotal.toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      {commande.remarques && (
        <div className="mb-6 p-3 bg-blue-900/10 border border-blue-900/30 rounded-xl">
          <p className="text-sm text-slate-300"><span className="font-bold text-blue-400">Note :</span> {commande.remarques}</p>
        </div>
      )}

      {/* Actions */}
      {commande.statut === "en_attente" && (
        <div className="grid grid-cols-2 gap-3">
          <Bouton variante="discret" onClick={() => handleStatut("annulee")}>Refuser</Bouton>
          <Bouton variante="primaire" onClick={() => handleStatut("en_livraison")}>Valider (En livraison)</Bouton>
        </div>
      )}

      {commande.statut === "en_livraison" && (
        <div className="grid grid-cols-1 gap-3">
          <Bouton variante="primaire" onClick={() => handleStatut("livree")}>Marquer comme Livrée</Bouton>
        </div>
      )}
    </div>
  );
};
