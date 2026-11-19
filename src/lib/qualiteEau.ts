export type { ReleveQualiteEau } from "@/types";
export type StatutQualiteEau = 'optimal' | 'vigilance' | 'critique';

export interface DiagnosticParametre {
  valeur: number;
  statut: StatutQualiteEau;
  message: string;
  badgeClasse: string;
}

export interface DiagnosticEauGlobal {
  statut: StatutQualiteEau;
  titre: string;
  classeFond: string;
  classeTexte: string;
  classeBordure: string;
  temperature: DiagnosticParametre;
  ph: DiagnosticParametre;
  oxygene: DiagnosticParametre;
}

export function evaluerTemperature(temp: number): DiagnosticParametre {
  if (temp >= 26 && temp <= 30) {
    return {
      valeur: temp,
      statut: 'optimal',
      message: 'Idéale pour la croissance (26-30°C)',
      badgeClasse: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };
  }
  if ((temp >= 24 && temp < 26) || (temp > 30 && temp <= 32)) {
    return {
      valeur: temp,
      statut: 'vigilance',
      message: 'Acceptable mais sous surveillance',
      badgeClasse: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
  }
  return {
    valeur: temp,
    statut: 'critique',
    message: temp < 24 ? 'Eau trop froide (ralentissement métabolique)' : 'Eau trop chaude (risque hypoxie)',
    badgeClasse: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };
}

export function evaluerPh(ph: number): DiagnosticParametre {
  if (ph >= 6.5 && ph <= 8.0) {
    return {
      valeur: ph,
      statut: 'optimal',
      message: 'Zone de confort parfaite (6.5-8.0)',
      badgeClasse: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };
  }
  if ((ph >= 6.0 && ph < 6.5) || (ph > 8.0 && ph <= 8.5)) {
    return {
      valeur: ph,
      statut: 'vigilance',
      message: 'Léger déséquilibre acido-basique',
      badgeClasse: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
  }
  return {
    valeur: ph,
    statut: 'critique',
    message: ph < 6.0 ? 'Acidose sévère' : 'Alcalose critique',
    badgeClasse: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };
}

export function evaluerOxygene(oxygene: number): DiagnosticParametre {
  if (oxygene >= 5.0) {
    return {
      valeur: oxygene,
      statut: 'optimal',
      message: 'Excellente oxygénation (≥ 5 mg/L)',
      badgeClasse: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };
  }
  if (oxygene >= 3.0 && oxygene < 5.0) {
    return {
      valeur: oxygene,
      statut: 'vigilance',
      message: 'Oxygénation moyenne',
      badgeClasse: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
  }
  return {
    valeur: oxygene,
    statut: 'critique',
    message: 'Hypoxie sévère (< 3 mg/L), aérer d’urgence',
    badgeClasse: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };
}

export function diagnostiquerQualiteEau(temp: number, ph: number, oxygene: number): DiagnosticEauGlobal {
  const diagTemp = evaluerTemperature(temp);
  const diagPh = evaluerPh(ph);
  const diagOxy = evaluerOxygene(oxygene);

  if (diagTemp.statut === 'critique' || diagPh.statut === 'critique' || diagOxy.statut === 'critique') {
    return {
      statut: 'critique',
      titre: 'Paramètres Critiques',
      classeFond: 'bg-red-50 dark:bg-red-950/30',
      classeTexte: 'text-red-600 dark:text-red-400',
      classeBordure: 'border-red-200 dark:border-red-900/50',
      temperature: diagTemp,
      ph: diagPh,
      oxygene: diagOxy,
    };
  }

  if (diagTemp.statut === 'vigilance' || diagPh.statut === 'vigilance' || diagOxy.statut === 'vigilance') {
    return {
      statut: 'vigilance',
      titre: 'Vigilance Modérée',
      classeFond: 'bg-amber-50 dark:bg-amber-950/30',
      classeTexte: 'text-amber-600 dark:text-amber-400',
      classeBordure: 'border-amber-200 dark:border-amber-900/50',
      temperature: diagTemp,
      ph: diagPh,
      oxygene: diagOxy,
    };
  }

  return {
    statut: 'optimal',
    titre: 'Eau Optimale',
    classeFond: 'bg-emerald-50 dark:bg-emerald-950/30',
    classeTexte: 'text-emerald-600 dark:text-emerald-400',
    classeBordure: 'border-emerald-200 dark:border-emerald-900/50',
    temperature: diagTemp,
    ph: diagPh,
    oxygene: diagOxy,
  };
}
