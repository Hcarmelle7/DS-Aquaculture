import { supabase } from "@/lib/supabase";

export async function obtenirSessionActuelle() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function connecterAvecMotDePasse(email: string, motDePasse: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: motDePasse,
  });

  if (error) throw error;
  return data;
}

export async function deconnecterSession() {
  await supabase.auth.signOut();
}

