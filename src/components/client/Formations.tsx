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
    <section id="formations" className="space-y-10">
      {/* En-tête de section */}
      <div className="text-center space-y-4">
        {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-black uppercase tracking-widest mx-auto">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Notre Expertise</span>
        </div> */}
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white transition-colors duration-300">
          {t.titreFormations}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          {t.sousTitreFormations}
        </p>
      </div>

      {/* Liste des cartes de formation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formations.map((f) => (
          <Carte key={f.id} className="flex flex-col h-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden">
            {/* Header Carte */}
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
              <div className="flex justify-between items-start gap-4 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-[#28a9ed] dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  {f.duree}
                </span>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {f.prix.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 block -mt-1">FCFA</span>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {f.titre}
              </h3>
            </div>

            {/* Corps Carte */}
            <div className="p-6 flex-grow flex flex-col space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {f.description}
              </p>

              {/* Points clés */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 mt-auto">
                <span className="text-[11px] uppercase font-black tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-[#28a9ed]" />
                  Au programme
                </span>
                <ul className="space-y-2.5">
                  {f.pointsCles.map((pt, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-snug font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#28a9ed] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Bouton
                variante="secondaire"
                taille="lg"
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 border-none shadow-md mt-4"
                onClick={() => reserverFormation(f.titre, f.prix)}
              >
                {t.boutonReserverFormation}
              </Bouton>
            </div>
          </Carte>
        ))}
      </div>
    </section>
  );
};

export default Formations;