"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { TemoignageClient } from "@/types";
import { TRADUCTIONS } from "@/data/contenu";
import { Star, MessageSquarePlus, CheckCircle2, User, Quote } from "lucide-react";

export const SectionTemoignages: React.FC = () => {
  const { langue } = useAppStore();
  const t = TRADUCTIONS[langue];
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
    <section id="temoignages" className="space-y-10">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {t.titreTemoignages}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            {t.sousTitreTemoignages}
          </p>
        </div>
        
        {!formOuvert && !succes && (
          <button
            onClick={() => setFormOuvert(true)}
            className="group flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 font-bold hover:border-[#28a9ed] hover:text-[#28a9ed] transition-all"
          >
            <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{t.boutonLaisserAvis}</span>
          </button>
        )}
      </div>

      {/* Modal / Formulaire d'envoi rapide */}
      {formOuvert && (
        <form
          onSubmit={soumettreAvis}
          className="p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-cyan-100 dark:border-cyan-900/50 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-500 max-w-2xl mx-auto"
        >
          <h3 className="font-black text-lg text-[#28a9ed]">Votre retour sur notre poisson ou formation</h3>
          {succes ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.messageAvisSucces}
              </h3>
            </div>
          ) : (
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {t.libelleNomClient}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#28a9ed] outline-none transition-all text-slate-900 dark:text-white font-medium"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                </div>

                {/* Ville */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {t.libelleVille}
                  </label>
                  <select
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#28a9ed] outline-none transition-all text-slate-900 dark:text-white font-medium appearance-none"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Note</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNote(val)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          val <= note ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Commentaire */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t.libelleCommentaire}
                </label>
                <textarea
                  required
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#28a9ed] outline-none transition-all text-slate-900 dark:text-white font-medium resize-none h-32"
                  placeholder="..."
                />
              </div>
            </div>
          )}

          {/* Footer form */}
          {!succes && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setFormOuvert(false)}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={chargement}
                className="px-8 py-2.5 rounded-full bg-[#28a9ed] text-white font-black text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {chargement ? "..." : t.boutonEnvoyerAvis}
              </button>
            </div>
          )}
        </form>
      )}

      {/* Grille des témoignages reçus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avis.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between space-y-4 relative group hover:-translate-y-1 transition-all duration-300"
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-100 dark:text-slate-800 pointer-events-none group-hover:text-cyan-100 dark:group-hover:text-cyan-900/30 transition-colors" />

            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: item.note }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic relative z-10 flex-grow">
              "{item.commentaire}"
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-[#28a9ed] flex items-center justify-center text-sm font-black uppercase shadow-sm">
                {item.nomAuteur.charAt(0)}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.nomAuteur}</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.ville}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionTemoignages;