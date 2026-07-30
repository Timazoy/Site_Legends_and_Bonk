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
      "Vous pouvez aller chercher la carte que vous voulez dans le paquet.",
    ],
  },
  {
    num: "I",
    nom: "Le Bateleur",
    image: null,
    niveaux: [
      "Ajoute +20% de PA et donne un effet de vengeance sur ces PA (quand vous êtes attaqué, vous lancez un D4 de 10% et renvoyez ces dégâts à l'attaquant).",
      "Ajoute +30% de PA et donne un effet de vengeance sur ces PA (quand vous êtes attaqué, vous lancez un D4 de 10% et renvoyez ces dégâts à l'attaquant).",
      "Ajoute +20% de PA et donne un effet de vengeance sur ces PA (quand vous êtes attaqué, vous lancez un D6 de 10% et renvoyez ces dégâts à l'attaquant).",
    ],
  },
  {
    num: "II",
    nom: "La Grande Prêtresse",
    image: null,
    niveaux: [
      "Augmente les PV max de 20% jusqu'à la fin du combat.",
      "Augmente les PV max de 30% jusqu'à la fin du combat.",
      "Augmente les PV max de 40% jusqu'à la fin du combat.",
    ],
  },
  {
    num: "III",
    nom: "L'Impératrice",
    image: null,
    niveaux: [
      "Vous effectuez une attaque classique, mais elle fera 150% de dégâts en plus et elle a ⅓ de chance d'appliquer un effet de transfert de dégâts entre vous et votre cible pendant 1T, lui transférant tous les dégâts que vous subiriez.",
      "Vous effectuez une attaque classique, mais elle fera 200% de dégâts en plus et elle a ⅓ de chance d'appliquer un effet de transfert de dégâts entre vous et votre cible pendant 1T, lui transférant tous les dégâts que vous subiriez.",
      "Vous effectuez une attaque classique, mais elle fera 200% de dégâts en plus et elle a ½ chance d'appliquer un effet de transfert de dégâts entre vous et votre cible pendant 1T, lui transférant tous les dégâts que vous subiriez.",
    ],
  },
  {
    num: "IV",
    nom: "L'Empereur",
    image: "empereur_tarot.webp",
    niveaux: [
      "Invoquez une armure vivante (PV : 20 ; PA : 20 ; VTS : 10 ; DDT : 10 ; Précision : 10 ; Dégâts : 20).",
      "Invoquez une armure vivante améliorée (PV : 30 ; PA : 30 ; VTS : 12 ; DDT : 12 ; Précision : 12 ; Dégâts : 25).",
      "Invoquez 2 armures vivantes (PV : 20 ; PA : 20 ; VTS : 10 ; DDT : 10 ; Précision : 10 ; Dégâts : 20).",
    ],
  },
  {
    num: "V",
    nom: "Le Pape",
    image: null,
    niveaux: [
      "Ajoute une résistance aux dégâts de 25% pendant 3T.",
      "Ajoute une résistance aux dégâts de 40% pendant 3T.",
      "Ajoute une résistance aux dégâts de 40% pendant 4T.",
    ],
  },
  {
    num: "VI",
    nom: "L'Amoureux",
    image: null,
    niveaux: [
      "A une chance de 40% d'appliquer l'effet amoureux à la cible.",
      "A une chance de 60% d'appliquer l'effet amoureux à la cible.",
      "A une chance de 80% d'appliquer l'effet amoureux à la cible.",
    ],
  },
  {
    num: "VII",
    nom: "Le Chariot",
    image: null,
    niveaux: [
      "Ajoute 3 aux déplacements pendant 4T.",
      "Ajoute 4 aux déplacements pendant 4T.",
      "Ajoute 4 aux déplacements pendant 5T.",
    ],
  },
  {
    num: "VIII",
    nom: "La Justice",
    image: null,
    niveaux: [
      "Pendant 2T, la cible va infliger 50% de dégâts en plus à tous ceux qui lui ont fait des dégâts.",
      "Pendant 2T, la cible va infliger 75% de dégâts en plus à tous ceux qui lui ont fait des dégâts.",
      "Pendant 3T, la cible va infliger 75% de dégâts en plus à tous ceux qui lui ont fait des dégâts.",
    ],
  },
  {
    num: "IX",
    nom: "L'Ermite",
    image: null,
    niveaux: [
      "Si la cible est seule dans une zone de 5 autour d'elle, vous la soignez de 30% de sa vie max. Sinon, vous la soignez de 10% de sa vie max pendant 3T.",
      "Si la cible est seule dans une zone de 5 autour d'elle, vous la soignez de 45% de sa vie max. Sinon, vous la soignez de 10% de sa vie max pendant 4T.",
      "Si la cible est seule dans une zone de 5 autour d'elle, vous la soignez de 60% de sa vie max. Sinon, vous la soignez de 10% de sa vie max pendant 5T.",
    ],
  },
  {
    num: "X",
    nom: "La Roue de la Fortune",
    image: null,
    niveaux: [
      "Votre pioche est agrandie de 1 carte pendant 3T.",
      "Votre pioche est agrandie de 2 cartes pendant 3T.",
      "Votre pioche est agrandie de 2 cartes pendant 5T.",
    ],
  },
  {
    num: "XI",
    nom: "La Force",
    image: null,
    niveaux: [
      "Ajoute 30% de dégâts en plus pendant 2T.",
      "Ajoute 45% de dégâts en plus pendant 2T.",
      "Ajoute 60% de dégâts en plus pendant 2T.",
    ],
  },
  {
    num: "XII",
    nom: "L'Homme Pendu",
    image: null,
    niveaux: [
      "Vous maudissez la cible : elle prendra 5% de sa vie max en dégâts par case traversée pendant son tour, et si elle ne bouge pas, elle prendra 20% de sa vie max en dégâts. La malédiction dure 4T.",
      "Vous maudissez la cible : elle prendra 7,5% de sa vie max en dégâts par case traversée pendant son tour, et si elle ne bouge pas, elle prendra 30% de sa vie max en dégâts. La malédiction dure 4T.",
      "Vous maudissez la cible : elle prendra 10% de sa vie max en dégâts par case traversée pendant son tour, et si elle ne bouge pas, elle prendra 40% de sa vie max en dégâts. La malédiction dure 4T.",
    ],
  },
  {
    num: "XIII",
    nom: "La Mort",
    image: "mort_tarot.webp",
    niveaux: [
      "Vous sacrifiez toute votre vie et vous infligez des dégâts à hauteur de 80% de votre vie max à toutes les entités dans une zone de 3.",
      "Vous sacrifiez toute votre vie et vous infligez des dégâts à hauteur de votre vie max à toutes les entités dans une zone de 3.",
      "Vous sacrifiez toute votre vie et vous infligez des dégâts à hauteur de votre vie max à toutes les entités dans une zone de 4.",
    ],
  },
  {
    num: "XIV",
    nom: "La Tempérance",
    image: "temperance_tarot.webp",
    niveaux: [
      "Annule tous les effets négatifs actifs sur la cible et la rend immunisée à tous les effets négatifs pendant 2T.",
      "Annule tous les effets négatifs actifs sur la cible et la rend immunisée à tous les effets négatifs pendant 3T.",
      "Annule tous les effets négatifs actifs sur la cible et la rend immunisée à tous les effets négatifs pendant 4T.",
    ],
  },
  {
    num: "XV",
    nom: "Le Diable",
    image: null,
    niveaux: [
      "Vos attaques réduisent maintenant la vie max au lieu des PV, et tous les PV qui seront au-dessus de la vie max seront volés pour vous les attribuer. Dure 2T.",
      "Vos attaques réduisent maintenant la vie max au lieu des PV, et tous les PV qui seront au-dessus de la vie max seront volés pour vous les attribuer. Dure 3T.",
      "Vos attaques réduisent maintenant la vie max au lieu des PV, et tous les PV qui seront au-dessus de la vie max seront volés pour vous les attribuer. Dure 4T.",
    ],
  },
  {
    num: "XVI",
    nom: "La Tour",
    image: "tower_tarot.webp",
    niveaux: [
      "Applique les effets immobilisé et incapacité à la cible pendant 1T.",
      "Applique les effets immobilisé et incapacité à la cible pendant 2T.",
      "Applique les effets immobilisé et incapacité à la cible pendant 3T.",
    ],
  },
  {
    num: "XVII",
    nom: "L'Étoile",
    image: "etoile_tarot.webp",
    niveaux: [
      "La téléportation se fait aléatoirement : un D4 détermine 4 zones sur le plateau à chaque lancer jusqu'à ce qu'il ne reste plus que 14 cases à déterminer, puis un D12 dira laquelle de ces cases sera la destination. Vous pouvez cependant relancer une fois un dé qui ne vous plaît pas.",
      "La téléportation se fait aléatoirement : un D4 détermine 4 zones sur le plateau à chaque lancer jusqu'à ce qu'il ne reste plus que 14 cases à déterminer, puis un D12 dira laquelle de ces cases sera la destination. Vous pouvez cependant relancer deux fois un dé qui ne vous plaît pas.",
      "Vous pouvez vous téléporter où bon vous semble.",
    ],
  },
  {
    num: "XVIII",
    nom: "La Lune",
    image: "lune_tarot.webp",
    niveaux: [
      "Vous repoussez ou attirez (au choix) une cible selon le résultat d'un D8.",
      "Vous repoussez ou attirez (au choix) une cible selon le résultat d'un D10.",
      "Vous repoussez ou attirez (au choix) une cible selon le résultat d'un D12.",
    ],
  },
  {
    num: "XIX",
    nom: "Le Soleil",
    image: "soleil_tarot.webp",
    niveaux: [
      "Vous créez un siphon magique sur une case : ce siphon aura une zone de 3 cases où toutes les entités seront attirées en son centre. Une fois créé, le siphon reste 3T sur le plateau et les entités prises dedans devront utiliser 2 déplacements par case pour en sortir.",
      "Vous créez un siphon magique sur une case : ce siphon aura une zone de 5 cases où toutes les entités seront attirées en son centre. Une fois créé, le siphon reste 3T sur le plateau et les entités prises dedans devront utiliser 2 déplacements par case pour en sortir.",
      "Vous créez un siphon magique sur une case : ce siphon aura une zone de 5 cases où toutes les entités seront attirées en son centre. Une fois créé, le siphon reste 4T sur le plateau et les entités prises dedans devront utiliser 2 déplacements par case pour en sortir.",
    ],
  },
  {
    num: "XX",
    nom: "Le Jugement",
    image: null,
    niveaux: [
      "Vous choisissez un adversaire et commencez un combat de dés avec lui. Le combat se fait au D20 et vous avez un avantage sur le lancer. Le perdant se verra infliger un effet de faiblesse de 30% pendant 1T.",
      "Vous choisissez un adversaire et commencez un combat de dés avec lui. Le combat se fait au D20 et vous avez un avantage sur le lancer. Le perdant se verra infliger un effet de faiblesse de 40% pendant 2T.",
      "Vous choisissez un adversaire et commencez un combat de dés avec lui. Le combat se fait au D20 et vous avez deux avantages sur le lancer. Le perdant se verra infliger un effet de faiblesse de 45% pendant 2T.",
    ],
  },
  {
    num: "XXI",
    nom: "Le Monde",
    image: "monde_tarot.webp",
    niveaux: [
      "Dans une zone de 3, vous faites tomber un astéroïde infligeant 4D20 de dégâts.",
      "Dans une zone de 4, vous faites tomber un astéroïde infligeant 4D20 de dégâts.",
      "Dans une zone de 4, vous faites tomber un astéroïde infligeant 6D20 de dégâts.",
    ],
  },
];
