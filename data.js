// Données par défaut : programme, historique, banque d'idées.
// Tout est ensuite persisté dans localStorage (voir app.js -> Store).

const DEFAULT_PROGRAM = [
  {
    id: "day-push",
    name: "Push (Pecs / Épaules / Triceps)",
    exercises: [
      { id: "ex-1", name: "Développé couché barre", target: "4 x 8" },
      { id: "ex-2", name: "Développé militaire haltères", target: "4 x 10" },
      { id: "ex-3", name: "Écarté couché haltères", target: "3 x 12" },
      { id: "ex-4", name: "Élévations latérales", target: "3 x 15" },
      { id: "ex-5", name: "Extension triceps poulie", target: "3 x 12" },
      { id: "ex-6", name: "Dips", target: "3 x max" },
    ],
  },
  {
    id: "day-pull",
    name: "Pull (Dos / Biceps)",
    exercises: [
      { id: "ex-7", name: "Tractions (ou tirage vertical)", target: "4 x 8" },
      { id: "ex-8", name: "Rowing barre", target: "4 x 10" },
      { id: "ex-9", name: "Tirage horizontal poulie", target: "3 x 12" },
      { id: "ex-10", name: "Oiseau haltères", target: "3 x 15" },
      { id: "ex-11", name: "Curl biceps barre EZ", target: "3 x 12" },
      { id: "ex-12", name: "Curl marteau", target: "3 x 12" },
    ],
  },
  {
    id: "day-legs",
    name: "Legs (Jambes / Fessiers)",
    exercises: [
      { id: "ex-13", name: "Squat barre", target: "4 x 8" },
      { id: "ex-14", name: "Presse à cuisses", target: "4 x 10" },
      { id: "ex-15", name: "Fentes marchées", target: "3 x 12/jambe" },
      { id: "ex-16", name: "Leg curl", target: "3 x 12" },
      { id: "ex-17", name: "Hip thrust", target: "4 x 10" },
      { id: "ex-18", name: "Mollets debout", target: "4 x 15" },
    ],
  },
  {
    id: "day-abs",
    name: "Core / Gainage",
    exercises: [
      { id: "ex-19", name: "Gainage planche", target: "3 x 45s" },
      { id: "ex-20", name: "Crunchs lestés", target: "3 x 15" },
      { id: "ex-21", name: "Relevé de jambes suspendu", target: "3 x 12" },
      { id: "ex-22", name: "Russian twist", target: "3 x 20" },
    ],
  },
];

// Banque d'idées d'exercices classés par groupe musculaire, pour piocher
// des variantes et éviter la routine.
const EXERCISE_IDEAS = [
  {
    group: "Pectoraux",
    icon: "🎯",
    items: [
      "Développé couché barre",
      "Développé incliné haltères",
      "Développé décliné",
      "Écarté couché haltères",
      "Écarté à la poulie vis-à-vis",
      "Pompes lestées",
      "Dips prise serrée",
      "Pull-over haltère",
    ],
  },
  {
    group: "Dos",
    icon: "🎯",
    items: [
      "Tractions pronation",
      "Tractions supination",
      "Rowing barre buste penché",
      "Rowing haltère unilatéral",
      "Tirage vertical prise large",
      "Tirage horizontal prise serrée",
      "Soulevé de terre",
      "Superman",
    ],
  },
  {
    group: "Épaules",
    icon: "🎯",
    items: [
      "Développé militaire barre",
      "Développé Arnold",
      "Élévations latérales haltères",
      "Élévations frontales",
      "Oiseau (deltoïde postérieur)",
      "Face pull",
      "Tirage menton",
    ],
  },
  {
    group: "Bras (Biceps / Triceps)",
    icon: "🎯",
    items: [
      "Curl barre EZ",
      "Curl haltères alterné",
      "Curl marteau",
      "Curl pupitre",
      "Extension triceps poulie haute",
      "Barre au front",
      "Dips banc",
      "Kickback triceps",
    ],
  },
  {
    group: "Jambes",
    icon: "🎯",
    items: [
      "Squat barre",
      "Squat bulgare",
      "Presse à cuisses",
      "Fentes marchées",
      "Fentes arrière haltères",
      "Leg extension",
      "Leg curl allongé",
      "Soulevé de terre jambes tendues",
      "Mollets debout / assis",
    ],
  },
  {
    group: "Fessiers",
    icon: "🎯",
    items: [
      "Hip thrust barre",
      "Squat sumo",
      "Kickback fessier poulie",
      "Abduction hanche machine",
      "Pont fessier unilatéral",
    ],
  },
  {
    group: "Sangle abdominale",
    icon: "🎯",
    items: [
      "Gainage planche",
      "Gainage latéral",
      "Crunchs lestés",
      "Relevé de jambes suspendu",
      "Russian twist",
      "Ab wheel",
      "Mountain climbers (lent, contrôlé)",
    ],
  },
];

const SESSION_IDEAS_TEXT = [
  {
    title: "Full-body débutant/reprise (3x/semaine)",
    detail:
      "Squat, développé couché, rowing, développé militaire, curl, gainage. Idéal pour une reprise en douceur, tout le corps travaillé à chaque séance.",
  },
  {
    title: "Split Push / Pull / Legs (4-6x/semaine)",
    detail:
      "Alterne Push (pecs-épaules-triceps), Pull (dos-biceps) et Legs (jambes-fessiers). Permet de bien récupérer entre chaque groupe tout en s'entraînant souvent.",
  },
  {
    title: "Upper / Lower (4x/semaine)",
    detail:
      "Deux séances haut du corps, deux séances bas du corps par semaine. Bon compromis fréquence/volume pour prendre du muscle sans cardio.",
  },
  {
    title: "Séance 'summer body' ciblée",
    detail:
      "Focus épaules + abdos + fessiers en fin de séance renfo classique : élévations latérales, gainage, hip thrust. Améliore la silhouette visible sans ajouter de cardio.",
  },
];
