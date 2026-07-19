// Les 22 arcanes du tarot de Legends & Bonk.
// Chaque carte a trois niveaux de sort (du moins puissant au plus puissant),
// sauf le Fou (carte 0, le joker) qui n'a qu'un seul effet.
// image : nom du fichier dans image-db/tarot/ (null = illustration pas encore dessinée).

const TAROTS_IMG_DIR = "../image-db/tarot/";

const TAROTS = [
  {
    num: "0",
    nom: "Le Fou",
    image: null,
    niveaux: [
      "Effet du Fou à écrire…",
    ],
  },
  {
    num: "I",
    nom: "Le Bateleur",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "II",
    nom: "La Papesse",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "III",
    nom: "L'Impératrice",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "IV",
    nom: "L'Empereur",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "V",
    nom: "Le Pape",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "VI",
    nom: "L'Amoureux",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "VII",
    nom: "Le Chariot",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "VIII",
    nom: "La Justice",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "IX",
    nom: "L'Ermite",
    image: "ermite_tarot.webp",
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "X",
    nom: "La Roue de Fortune",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XI",
    nom: "La Force",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XII",
    nom: "Le Pendu",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XIII",
    nom: "L'Arcane sans nom",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XIV",
    nom: "Tempérance",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XV",
    nom: "Le Diable",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XVI",
    nom: "La Tour",
    image: "tower_tarot.webp",
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XVII",
    nom: "L'Étoile",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XVIII",
    nom: "La Lune",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XIX",
    nom: "Le Soleil",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XX",
    nom: "Le Jugement",
    image: null,
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
  {
    num: "XXI",
    nom: "Le Monde",
    image: "monde_tarot.webp",
    niveaux: [
      "Effet du niveau I à écrire…",
      "Effet du niveau II à écrire…",
      "Effet du niveau III à écrire…",
    ],
  },
];
