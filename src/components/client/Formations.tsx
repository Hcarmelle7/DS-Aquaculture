"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { OFFRES_FORMATIONS, TRADUCTIONS } from "@/data/contenu";
import { Carte } from "@/components/ui/Carte";
import { Bouton } from "@/components/ui/Bouton";
import { genererLienWhatsAppFormation } from "@/lib/whatsapp";
import { GraduationCap, Clock, CheckCircle2, Award } from "lucide-react";

export const Formations: React.FC = () => {
  const { langue, reglages } = useAppStore();
  const t = TRADUCTIONS[langue];
  const formations = OFFRES_FORMATIONS[langue];

  const reserverFormation = (titre: string, prix: number) => {
    const url = genererLienWhatsAppFormation({
      telephoneBrut: reglages.telephoneBrut,
      titreFormation: titre,
      prix,
      langueClient: langue,
    });
    window.open(url, "_blank");
  };

  return (
    <section id="formations" className="space-y-4 pt-2">
      {/* En-tête de section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">{t.titreFormations}</h2>
          <p className="text-xs text-slate-400">{t.sousTitreFormations}</p>
        </div>
      </div>

      {/* Liste des cartes de formation */}
      <div className="space-y-4">
        {formations.map((f) => (
          <Carte key={f.id} className="space-y-4 border-slate-800">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[#00d2ff] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <Clock className="w-3 h-3" />
                  {f.duree}
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {f.titre}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base font-black text-[#00d2ff]">
                  {f.prix.toLocaleString("fr-FR")}
                </span>
                <span className="text-[10px] font-bold text-slate-400 block">FCFA</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>

            {/* Points clés */}
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800/70 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-[#00d2ff]" />
                Au programme
              </span>
              <ul className="space-y-1.5">
                {f.pointsCles.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-300 leading-snug"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2ff] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Bouton
              variante="secondaire"
              taille="md"
              className="w-full hover:border-[#00d2ff]/40 hover:text-[#00d2ff]"
              onClick={() => reserverFormation(f.titre, f.prix)}
            >
              {t.boutonReserverFormation}
            </Bouton>
          </Carte>
        ))}
      </div>
    </section>
  );
};

export default Formations;