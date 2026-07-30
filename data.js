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

// Guide visuel + repère d'exécution pour chaque exercice : une icône et un
// conseil court affichés dans la fiche "Comment faire ?" (voir app.js ->
// openExerciseGuideModal). Clé = nom exact de l'exercice.
const EXERCISE_GUIDE = {
  "Développé couché barre": { icon: "🏋️‍♀️", muscle: "Pectoraux", tip: "Omoplates serrées et basses, pieds ancrés au sol, la barre descend jusqu'à la poitrine sans rebond." },
  "Développé militaire haltères": { icon: "🏋️‍♀️", muscle: "Épaules", tip: "Gainage serré, pousse les haltères à la verticale sans cambrer le bas du dos." },
  "Écarté couché haltères": { icon: "🤲", muscle: "Pectoraux", tip: "Coudes légèrement fléchis en permanence, ouvre les bras en grand arc de cercle." },
  "Élévations latérales": { icon: "🤸", muscle: "Épaules", tip: "Lève les haltères jusqu'à hauteur d'épaule, coudes légèrement fléchis, sans élan." },
  "Extension triceps poulie": { icon: "🔽", muscle: "Triceps", tip: "Coudes collés au corps, seul l'avant-bras bouge, pousse jusqu'à l'extension complète." },
  "Dips": { icon: "🤸‍♀️", muscle: "Pectoraux / Triceps", tip: "Buste penché en avant pour cibler les pecs, descends jusqu'à 90° aux coudes." },
  "Tractions (ou tirage vertical)": { icon: "🧗‍♀️", muscle: "Dos", tip: "Tire avec les coudes vers le bas, poitrine vers la barre, évite de te balancer." },
  "Rowing barre": { icon: "🚣‍♀️", muscle: "Dos", tip: "Buste penché à 45°, dos plat, tire la barre vers le nombril en serrant les omoplates." },
  "Tirage horizontal poulie": { icon: "🚣‍♀️", muscle: "Dos", tip: "Buste droit, tire la poignée vers le ventre en gardant les coudes proches du corps." },
  "Oiseau haltères": { icon: "🤲", muscle: "Épaules (arrière)", tip: "Buste penché en avant, lève les bras sur les côtés en serrant les omoplates." },
  "Curl biceps barre EZ": { icon: "💪", muscle: "Biceps", tip: "Coudes fixes le long du corps, remonte la barre sans balancer les épaules." },
  "Curl marteau": { icon: "💪", muscle: "Biceps / Avant-bras", tip: "Prise neutre (paumes face à face), coudes immobiles, monte et redescend contrôlé." },
  "Squat barre": { icon: "🏋️", muscle: "Jambes / Fessiers", tip: "Pieds largeur épaules, descends hanches en arrière, genoux dans l'axe des pieds." },
  "Presse à cuisses": { icon: "🦵", muscle: "Jambes", tip: "Pieds largeur épaules sur le plateau, descends jusqu'à 90° sans décoller le bas du dos." },
  "Fentes marchées": { icon: "🚶‍♀️", muscle: "Jambes / Fessiers", tip: "Grand pas en avant, genou arrière frôle le sol, buste droit tout le mouvement." },
  "Leg curl": { icon: "🦵", muscle: "Ischio-jambiers", tip: "Allongée ou assise, plie les jambes en amenant les talons vers les fessiers, contrôle la remontée." },
  "Hip thrust": { icon: "🍑", muscle: "Fessiers", tip: "Dos calé sur un banc, pousse le bassin vers le haut en contractant fort les fessiers en haut." },
  "Mollets debout": { icon: "🦶", muscle: "Mollets", tip: "Monte sur la pointe des pieds le plus haut possible, redescends lentement en étirant le mollet." },
  "Gainage planche": { icon: "🧘‍♀️", muscle: "Sangle abdominale", tip: "Corps aligné tête-bassin-talons, abdos et fessiers contractés, ne laisse pas le bassin tomber." },
  "Crunchs lestés": { icon: "🔁", muscle: "Abdominaux", tip: "Enroule le buste vers les genoux en expirant, redescends sans reposer la tête au sol." },
  "Relevé de jambes suspendu": { icon: "🔽", muscle: "Abdominaux (bas)", tip: "Suspendu à la barre, remonte les jambes tendues ou fléchies sans te balancer." },
  "Russian twist": { icon: "🔁", muscle: "Obliques", tip: "Buste légèrement incliné en arrière, tourne le buste de chaque côté en contrôlant le mouvement." },
  "Développé incliné haltères": { icon: "🏋️‍♀️", muscle: "Pectoraux (haut)", tip: "Banc incliné à 30-45°, pousse les haltères au-dessus des épaules hautes." },
  "Développé décliné": { icon: "🏋️‍♀️", muscle: "Pectoraux (bas)", tip: "Banc décliné, la barre descend vers le bas des pectoraux, coudes serrés." },
  "Écarté à la poulie vis-à-vis": { icon: "🤲", muscle: "Pectoraux", tip: "Face aux poulies, ramène les poignées devant toi en arc de cercle, pecs contractés." },
  "Pompes lestées": { icon: "🤸‍♀️", muscle: "Pectoraux", tip: "Corps gainé et aligné, descends jusqu'à effleurer le sol, pousse en expirant." },
  "Dips prise serrée": { icon: "🤸‍♀️", muscle: "Triceps", tip: "Buste bien vertical pour cibler les triceps, coudes proches du corps." },
  "Pull-over haltère": { icon: "🤲", muscle: "Pectoraux / Dos", tip: "Allongé perpendiculaire au banc, descends l'haltère derrière la tête bras semi-tendus." },
  "Tractions pronation": { icon: "🧗‍♀️", muscle: "Dos (largeur)", tip: "Prise large paumes vers l'avant, tire la poitrine vers la barre." },
  "Tractions supination": { icon: "🧗‍♀️", muscle: "Dos / Biceps", tip: "Prise paumes vers toi, sollicite davantage les biceps, tire fort en haut." },
  "Rowing barre buste penché": { icon: "🚣‍♀️", muscle: "Dos", tip: "Dos plat, buste penché à 45°, tire la barre vers le bas du ventre." },
  "Rowing haltère unilatéral": { icon: "🚣‍♀️", muscle: "Dos", tip: "Un genou sur le banc, tire l'haltère vers la hanche en serrant l'omoplate." },
  "Tirage vertical prise large": { icon: "🧗‍♀️", muscle: "Dos (largeur)", tip: "Tire la barre devant la poitrine, coudes vers le bas et l'extérieur." },
  "Tirage horizontal prise serrée": { icon: "🚣‍♀️", muscle: "Dos (épaisseur)", tip: "Prise serrée, tire vers le ventre en gardant le buste droit et stable." },
  "Soulevé de terre": { icon: "🏋️", muscle: "Dos / Jambes / Fessiers", tip: "Dos plat, barre proche des tibias, pousse dans le sol en te relevant, hanches et épaules montent ensemble." },
  "Superman": { icon: "🧘‍♀️", muscle: "Lombaires", tip: "Allongée sur le ventre, lève bras et jambes en même temps, tiens quelques secondes." },
  "Développé militaire barre": { icon: "🏋️‍♀️", muscle: "Épaules", tip: "Barre part de la clavicule, pousse à la verticale, fessiers et abdos gainés." },
  "Développé Arnold": { icon: "🏋️‍♀️", muscle: "Épaules", tip: "Paumes vers toi en bas, tourne les poignets en poussant vers le haut jusqu'à paumes vers l'avant." },
  "Élévations latérales haltères": { icon: "🤸", muscle: "Épaules", tip: "Lève les bras sur les côtés jusqu'à l'horizontale, sans élan, redescends lentement." },
  "Élévations frontales": { icon: "🤸", muscle: "Épaules (avant)", tip: "Lève un haltère devant toi jusqu'à hauteur d'épaule, bras quasi tendu." },
  "Oiseau (deltoïde postérieur)": { icon: "🤲", muscle: "Épaules (arrière)", tip: "Buste penché en avant, écarte les bras sur les côtés, coudes légèrement fléchis." },
  "Face pull": { icon: "🚣‍♀️", muscle: "Épaules (arrière) / Dos", tip: "Tire la corde vers le visage en écartant les mains, coudes hauts." },
  "Tirage menton": { icon: "🔼", muscle: "Épaules / Trapèzes", tip: "Remonte la barre le long du corps jusqu'au menton, coudes toujours au-dessus des mains." },
  "Curl barre EZ": { icon: "💪", muscle: "Biceps", tip: "Coudes fixes, remonte la barre en contractant le biceps, redescends lentement." },
  "Curl haltères alterné": { icon: "💪", muscle: "Biceps", tip: "Alterne bras droit/gauche, supine le poignet en montant l'haltère." },
  "Curl pupitre": { icon: "💪", muscle: "Biceps", tip: "Bras posés sur le pupitre, isole le biceps sans bouger l'épaule." },
  "Extension triceps poulie haute": { icon: "🔽", muscle: "Triceps", tip: "Coudes fixes au-dessus de la tête, tends les bras en gardant les coudes en place." },
  "Barre au front": { icon: "🔽", muscle: "Triceps", tip: "Allongé, descends la barre vers le front en gardant les coudes fixes et rentrés." },
  "Dips banc": { icon: "🤸‍♀️", muscle: "Triceps", tip: "Mains sur le banc derrière toi, descends les fessiers vers le sol, coudes vers l'arrière." },
  "Kickback triceps": { icon: "🔙", muscle: "Triceps", tip: "Buste penché, bras à l'horizontale, tends l'avant-bras vers l'arrière." },
  "Squat bulgare": { icon: "🦵", muscle: "Jambes / Fessiers", tip: "Pied arrière surélevé, descends jusqu'à ce que la cuisse avant soit parallèle au sol." },
  "Fentes arrière haltères": { icon: "🚶‍♀️", muscle: "Jambes / Fessiers", tip: "Recule une jambe, descends le genou arrière vers le sol, buste droit." },
  "Leg extension": { icon: "🦵", muscle: "Quadriceps", tip: "Assise, tends les jambes contre le rouleau sans à-coup, contracte en haut." },
  "Leg curl allongé": { icon: "🦵", muscle: "Ischio-jambiers", tip: "Allongée sur le ventre, plie les jambes en amenant les talons vers les fessiers." },
  "Soulevé de terre jambes tendues": { icon: "🏋️", muscle: "Ischio-jambiers / Fessiers", tip: "Jambes quasi tendues, pousse les hanches en arrière, dos plat, descends la barre le long des jambes." },
  "Mollets debout / assis": { icon: "🦶", muscle: "Mollets", tip: "Monte sur la pointe des pieds, marque un temps d'arrêt en haut, redescends en étirant." },
  "Hip thrust barre": { icon: "🍑", muscle: "Fessiers", tip: "Barre sur les hanches (protège avec une serviette), pousse le bassin vers le haut en contractant les fessiers." },
  "Squat sumo": { icon: "🦵", muscle: "Fessiers / Intérieur cuisses", tip: "Pieds très écartés pointes vers l'extérieur, descends en gardant le dos droit." },
  "Kickback fessier poulie": { icon: "🍑", muscle: "Fessiers", tip: "Poulie basse à la cheville, tends la jambe vers l'arrière en contractant le fessier." },
  "Abduction hanche machine": { icon: "🦵", muscle: "Fessiers (moyen)", tip: "Assise, écarte les genoux contre la résistance sans décoller le dos du dossier." },
  "Pont fessier unilatéral": { icon: "🍑", muscle: "Fessiers", tip: "Une jambe tendue en l'air, pousse le bassin vers le haut sur l'autre jambe." },
  "Gainage latéral": { icon: "🧘‍♀️", muscle: "Obliques", tip: "En appui sur l'avant-bras, corps aligné, hanche ne touche pas le sol." },
  "Ab wheel": { icon: "🔁", muscle: "Sangle abdominale", tip: "Roule vers l'avant en gardant le dos gainé, reviens avant que le bas du dos ne creuse." },
  "Mountain climbers (lent, contrôlé)": { icon: "🔁", muscle: "Sangle abdominale", tip: "Position de planche, ramène un genou vers la poitrine à la fois, bassin stable." },
};

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
