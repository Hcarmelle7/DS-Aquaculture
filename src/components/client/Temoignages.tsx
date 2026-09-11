"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { TemoignageClient } from "@/types";
import { Star, MessageSquarePlus, CheckCircle2, User, Quote } from "lucide-react";

export const SectionTemoignages: React.FC = () => {
  const { langue } = useAppStore();
  const [avis, setAvis] = useState<TemoignageClient[]>([]);
  const [formOuvert, setFormOuvert] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);

  // Champs du formulaire
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("Douala");
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");

  const chargerAvis = async () => {
    const { data } = await supabase
      .from("customer_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setAvis(
        data.map((d) => ({
          id: d.id,
          nomAuteur: d.author_name,
          ville: d.city,
          note: d.rating,
          commentaire: d.comment,
          creeLe: d.created_at,
        }))
      );
    }
  };

  useEffect(() => {
    chargerAvis();
  }, []);

  const soumettreAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !commentaire.trim()) return;

    setChargement(true);
    const { error } = await supabase.from("customer_reviews").insert({
      author_name: nom,
      city: ville,
      rating: note,
      comment: commentaire,
    });

    if (!error) {
      setSucces(true);
      setNom("");
      setCommentaire("");
      chargerAvis();
      setTimeout(() => {
        setSucces(false);
        setFormOuvert(false);
      }, 2000);
    }
    setChargement(false);
  };

  return (
    <section id="temoignages" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold tracking-widest text-[#00d2ff] uppercase">
            Retours d'expérience
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {langue === "fr" ? "Avis & Témoignages Clients" : "Customer Reviews"}
          </h2>
        </div>

        <button
          onClick={() => setFormOuvert(!formOuvert)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-[#00d2ff]/40 text-[#00d2ff] font-bold text-xs hover:bg-[#00d2ff] hover:text-slate-950 transition active:scale-95"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{langue === "fr" ? "Laisser un avis" : "Leave a review"}</span>
        </button>
      </div>

      {/* Modal / Formulaire d'envoi rapide */}
      {formOuvert && (
        <form
          onSubmit={soumettreAvis}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-cyan-500/40 shadow-xl space-y-3 animate-flottement"
        >
          <h3 className="font-bold text-sm text-[#00d2ff]">Votre retour sur notre poisson ou formation</h3>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Votre Nom (ex: Paul M.)"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-[#00d2ff]"
            />
            <input
              type="text"
              required
              placeholder="Ville / Quartier (ex: Douala)"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-[#00d2ff]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Note :</span>
            {[1, 2, 3, 4, 5].map((etoile) => (
              <button
                key={etoile}
                type="button"
                onClick={() => setNote(etoile)}
                className={`p-1 transition ${etoile <= note ? "text-amber-400" : "text-slate-300 dark:text-slate-700"}`}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            ))}
          </div>

          <textarea
            required
            rows={3}
            placeholder="Partagez votre avis sur la fraîcheur, la livraison ou le goût..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-[#00d2ff]"
          />

          {succes ? (
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Merci ! Votre avis est publié.
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFormOuvert(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={chargement}
                className="px-4 py-2 rounded-xl bg-[#00d2ff] text-slate-950 font-bold text-xs shadow-md"
              >
                {chargement ? "Publication..." : "Publier l'avis"}
              </button>
            </div>
          )}
        </form>
      )}

      {/* Grille des témoignages reçus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {avis.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-[#0b132b]/80 border border-slate-200 dark:border-slate-800/90 shadow-md flex flex-col justify-between space-y-3 relative group hover:border-[#00d2ff]/50 transition-colors"
          >
            <Quote className="absolute top-4 right-4 w-6 h-6 text-slate-200 dark:text-slate-800 pointer-events-none group-hover:text-[#00d2ff]/20 transition-colors" />

            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: item.note }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "{item.commentaire}"
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <div className="w-7 h-7 rounded-full bg-cyan-500/10 text-[#00d2ff] flex items-center justify-center text-xs font-black">
                {item.nomAuteur.charAt(0)}
              </div>
              <div>
                <h4 className="font-extrabold text-xs">{item.nomAuteur}</h4>
                <p className="text-[10px] text-slate-400">{item.ville}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionTemoignages;