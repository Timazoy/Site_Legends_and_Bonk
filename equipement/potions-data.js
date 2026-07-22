/* ============================================================
   Données des potions — Legends & Bonk
   Chaque potion : puissance TIRÉE AU D20 à l'usage (paliers ci-dessous).
   Prix par quantité : Petite = 1 usage, Moyenne = 3 usages, Grande = 5 usages.
   Pour modifier le contenu, éditez simplement ce fichier.
   ============================================================ */
window.EQUIP_POTIONS = {

  // ordre d'affichage des étagères
  categoriesOrdre: [
    "Soin & survie",
    "Combat & puissance",
    "Résistances élémentaires",
    "Poisons & malédictions",
    "Ruse & exploration",
    "Spéciales"
  ],

  // quantités achetables (colonnes du tableau de prix)
  quantites: [
    { nom: "Petite", usages: "1 utilisation" },
    { nom: "Moyenne", usages: "3 utilisations" },
    { nom: "Grande", usages: "5 utilisations" }
  ],

  objets: [

    /* ---------- Soin & survie ---------- */
    {
      slug: "guerison", nom: "Potion de guérison", categorie: "Soin & survie",
      glow: "#558e51", img: "guerison.webp",
      tiers: [
        { nom: "Mineure", roll: "1 à 9", effet: "+15 % de PV max." },
        { nom: "Moyenne", roll: "10 à 15", effet: "+25 % de PV max." },
        { nom: "Majeure", roll: "16 à 18", effet: "+50 % de PV max." },
        { nom: "Totale", roll: "19 à 20", effet: "+75 % de PV max." }
      ],
      prix: [800, 2040, 3200]
    },
    {
      slug: "mana", nom: "Potion de mana", categorie: "Soin & survie",
      glow: "#404faa", img: "mana.webp",
      tiers: [
        { nom: "Très raffiné", roll: "1 à 9", effet: "+15 % de PM." },
        { nom: "Raffiné", roll: "10 à 15", effet: "+25 % de PM." },
        { nom: "Peu raffiné", roll: "16 à 18", effet: "+50 % de PM." },
        { nom: "Pure", roll: "19 à 20", effet: "+75 % de PM." }
      ],
      prix: [600, 1530, 2400]
    },
    {
      slug: "respiration-aquatique", nom: "Potion de respiration aquatique", categorie: "Ruse & exploration",
      glow: "#509fcf", img: "respiration-aquatique.webp",
      tiers: [
        { nom: "Légère", roll: "1 à 15", effet: "2 tours." },
        { nom: "Moyenne", roll: "16 à 19", effet: "3 tours." },
        { nom: "Forte", roll: "20", effet: "4 tours." }
      ],
      prix: [500, 1275, 2000]
    },
    {
      slug: "sommeil-angelique", nom: "Potion de sommeil angélique", categorie: "Soin & survie",
      glow: "#e7df72", img: "sommeil-angelique.webp",
      tiers: [
        { nom: "Longue", roll: "1 à 19", effet: "Prend 2 tours (TDA) = court repos." },
        { nom: "Rapide", roll: "20", effet: "Prend 1 tour (TDA) = court repos." }
      ],
      prix: [650, 1658, 2600]
    },
    {
      slug: "annulation-statut", nom: "Potion d'annulation de statut", categorie: "Soin & survie",
      glow: "#8c5c30", img: "annulation-statut.webp",
      tiers: [
        { nom: "Classique", roll: "1 à 19", effet: "Aucun effet particulier." },
        { nom: "Légendaire", roll: "20", effet: "Annulation du statut + immunisation pendant le combat." }
      ],
      prix: [800, 2040, 3200]
    },

    /* ---------- Combat & puissance ---------- */
    {
      slug: "force", nom: "Potion de force", categorie: "Combat & puissance",
      glow: "#911515", img: "force.webp",
      tiers: [
        { nom: "Mineure", roll: "1 à 9", effet: "+20 % de dégâts, dure 2 tours." },
        { nom: "Moyenne", roll: "10 à 15", effet: "+35 % de dégâts, dure 2 tours." },
        { nom: "Majeure", roll: "16 à 18", effet: "+50 % de dégâts, dure 2 tours." },
        { nom: "Exceptionnel", roll: "19 à 20", effet: "+40 % de dégâts, dure 3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "vitesse", nom: "Potion de vitesse", categorie: "Combat & puissance",
      glow: "#f9bf58", img: "vitesse.webp",
      tiers: [
        { nom: "Mineure", roll: "1 à 9", effet: "+2 en Vitesse pendant 3 tours." },
        { nom: "Moyenne", roll: "10 à 15", effet: "+3 en Vitesse pendant 3 tours." },
        { nom: "Majeure", roll: "16 à 18", effet: "+5 en Vitesse pendant 3 tours." },
        { nom: "Exceptionnel", roll: "19 à 20", effet: "+4 en Vitesse pendant 5 tours." }
      ],
      prix: [650, 1658, 2600]
    },
    {
      slug: "perce-armure", nom: "Potion de perce-armure", categorie: "Combat & puissance",
      glow: "#9b784b", img: "perce-armure.webp",
      tiers: [
        { nom: "Légère", roll: "1 à 19", effet: "Passe outre les PA pendant 1 tour." },
        { nom: "Forte", roll: "20", effet: "Passe outre les PA pendant 2 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "action", nom: "Potion d'action", categorie: "Combat & puissance",
      glow: "#b298ce", img: "action.webp",
      tiers: [
        { nom: "Éphémère", roll: "1 à 15", effet: "1 action en plus pendant 1 tour." },
        { nom: "Longue", roll: "16 à 20", effet: "1 action en plus pendant 2 tours." }
      ],
      prix: [750, 1913, 3000]
    },
    {
      slug: "sous-action", nom: "Potion de sous-action", categorie: "Combat & puissance",
      glow: "#9dc8ee", img: "sous-action.webp",
      tiers: [
        { nom: "Éphémère", roll: "1 à 15", effet: "1 sous-action en plus pendant 2 tours." },
        { nom: "Longue", roll: "16 à 20", effet: "1 sous-action en plus pendant 3 tours." }
      ],
      prix: [700, 1785, 2800]
    },

    /* ---------- Résistances élémentaires ---------- */
    {
      slug: "resistance", nom: "Potion de résistance", categorie: "Combat & puissance",
      glow: "#9b774b", img: "resistance.webp",
      note: "Réduit les dégâts subis, tous types confondus.",
      tiers: [
        { nom: "Mineure", roll: "1 à 11", effet: "-20 % de dégâts pendant 3 tours." },
        { nom: "Moyenne", roll: "12 à 16", effet: "-35 % de dégâts pendant 3 tours." },
        { nom: "Majeure", roll: "17 à 19", effet: "-50 % de dégâts pendant 3 tours." },
        { nom: "Exceptionnel", roll: "20", effet: "-40 % de dégâts pendant 5 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "res-elementaire-aleatoire", nom: "Potion de résistance élémentaire aléatoire", categorie: "Résistances élémentaires",
      glow: "#ad9990", img: "res-elementaire-aleatoire.webp",
      note: "L'élément protégé est déterminé au D8 au moment de boire la potion.",
      tiers: [
        { nom: "Aléatoire", roll: "1 à 7", effet: "Décider grâce au résultat d'un D8." },
        { nom: "Peu aléatoire", roll: "8 à 16", effet: "1 possibilité de relancer un dé." },
        { nom: "Précise", roll: "16 à 20", effet: "2 possibilités de relancer un dé." }
      ],
      prix: [600, 1530, 2400]
    },
    {
      slug: "res-feu", nom: "Potion de résistance au feu", categorie: "Résistances élémentaires",
      glow: "#cf4619", img: "res-feu.webp",
      tiers: [
        { nom: "Courte", roll: "1 à 10", effet: "1 tour." },
        { nom: "Moyenne", roll: "11 à 17", effet: "2 tours." },
        { nom: "Longue", roll: "18 à 20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "res-glace", nom: "Potion de résistance à la glace", categorie: "Résistances élémentaires",
      glow: "#86d3ea", img: "res-glace.webp",
      tiers: [
        { nom: "Courte", roll: "1 à 10", effet: "1 tour." },
        { nom: "Moyenne", roll: "11 à 17", effet: "2 tours." },
        { nom: "Longue", roll: "18 à 20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "res-foudre", nom: "Potion de résistance à la foudre", categorie: "Résistances élémentaires",
      glow: "#f9e77b", img: "res-foudre.webp",
      tiers: [
        { nom: "Courte", roll: "1 à 10", effet: "1 tour." },
        { nom: "Moyenne", roll: "11 à 17", effet: "2 tours." },
        { nom: "Longue", roll: "18 à 20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "res-eau", nom: "Potion de résistance à l'eau", categorie: "Résistances élémentaires",
      glow: "#2390c8", img: "res-eau.webp",
      tiers: [
        { nom: "Courte", roll: "1 à 10", effet: "1 tour." },
        { nom: "Moyenne", roll: "11 à 17", effet: "2 tours." },
        { nom: "Longue", roll: "18 à 20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "res-terre", nom: "Potion de résistance à la terre", categorie: "Résistances élémentaires",
      glow: "#8c692d", img: "res-terre.webp",
      tiers: [
        { nom: "Courte", roll: "1 à 10", effet: "1 tour." },
        { nom: "Moyenne", roll: "11 à 17", effet: "2 tours." },
        { nom: "Longue", roll: "18 à 20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "res-vent", nom: "Potion de résistance au vent", categorie: "Résistances élémentaires",
      glow: "#9b784c", img: "res-vent.webp",
      tiers: [
        { nom: "Courte", roll: "1 à 10", effet: "1 tour." },
        { nom: "Moyenne", roll: "11 à 17", effet: "2 tours." },
        { nom: "Longue", roll: "18 à 20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "res-plantes", nom: "Potion de résistance aux plantes", categorie: "Résistances élémentaires",
      glow: "#4c972e", img: "res-plantes.webp",
      tiers: [
        { nom: "Courte", roll: "1 à 10", effet: "1 tour." },
        { nom: "Moyenne", roll: "11 à 17", effet: "2 tours." },
        { nom: "Longue", roll: "18 à 20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "res-empoisonnement", nom: "Potion de résistance à l'empoisonnement", categorie: "Résistances élémentaires",
      glow: "#5d9a47", img: "res-empoisonnement.webp",
      tiers: [
        { nom: "Courte", roll: "1 à 10", effet: "1 tour." },
        { nom: "Moyenne", roll: "11 à 17", effet: "2 tours." },
        { nom: "Longue", roll: "18 à 20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },

    /* ---------- Poisons & malédictions ---------- */
    {
      slug: "poison", nom: "Potion de poison", categorie: "Poisons & malédictions",
      glow: "#7c8c30", img: "poison.webp",
      tiers: [
        { nom: "Faible", roll: "1 à 11", effet: "5 dégâts de poison par tour, et 50 % de chance de se faire 25 % des dégâts de son attaque, pendant 5 tours." },
        { nom: "Moyenne", roll: "12 à 18", effet: "7 dégâts de poison par tour, et 50 % de chance de se faire 33 % des dégâts de son attaque, pendant 5 tours." },
        { nom: "Forte", roll: "19 à 20", effet: "10 dégâts de poison par tour, et 50 % de chance de se faire 45 % des dégâts de son attaque, pendant 5 tours." }
      ],
      prix: [750, 1913, 3000]
    },
    {
      slug: "saignement", nom: "Potion de saignement", categorie: "Poisons & malédictions",
      glow: "#bc2115", img: "saignement.webp",
      tiers: [
        { nom: "Légère", roll: "1 à 12", effet: "-5 % de PV max par tour." },
        { nom: "Moyenne", roll: "13 à 18", effet: "-7 % de PV max par tour." },
        { nom: "Forte", roll: "19 à 20", effet: "-10 % de PV max par tour." }
      ],
      prix: [850, 2168, 3400]
    },

    /* ---------- Ruse & exploration ---------- */
    {
      slug: "invisibilite", nom: "Potion d'invisibilité", categorie: "Ruse & exploration",
      glow: "#d34240", img: "invisibilite.webp",
      tiers: [
        { nom: "Légère", roll: "1 à 15", effet: "1 tour." },
        { nom: "Moyenne", roll: "16 à 19", effet: "2 tours." },
        { nom: "Forte", roll: "20", effet: "3 tours." }
      ],
      prix: [700, 1785, 2800]
    },
    {
      slug: "vol", nom: "Potion de vol", categorie: "Ruse & exploration",
      glow: "#c5f1f9", img: "vol.webp",
      tiers: [
        { nom: "Légère", roll: "1 à 15", effet: "2 tours." },
        { nom: "Moyenne", roll: "16 à 19", effet: "3 tours." },
        { nom: "Forte", roll: "20", effet: "4 tours." }
      ],
      prix: [550, 1403, 2200]
    },
    {
      slug: "teleportation", nom: "Potion de téléportation", categorie: "Ruse & exploration",
      glow: "#bc98ad", img: "teleportation.webp",
      note: "La téléportation se fait aléatoirement : un D4 détermine 4 zones du plateau à chaque lancer, jusqu'à ne laisser que 12 cases. Un D12 désigne alors la case de destination.",
      tiers: [
        { nom: "Aléatoire", roll: "1 à 8", effet: "Destination entièrement aléatoire." },
        { nom: "Peu précise", roll: "9 à 15", effet: "1 possibilité de relancer un dé." },
        { nom: "Précise", roll: "16 à 19", effet: "2 possibilités de relancer un dé." },
        { nom: "Parfaite", roll: "20", effet: "La case que vous voulez." }
      ],
      prix: [750, 1913, 3000]
    },
    {
      slug: "lecture-pensee", nom: "Potion de lecture de pensée", categorie: "Ruse & exploration",
      glow: "#8c3283", img: "lecture-pensee.webp",
      tiers: [
        { nom: "Embrumée", roll: "1 à 15", effet: "Perception confuse des pensées." },
        { nom: "Claire", roll: "16 à 20", effet: "Perception nette des pensées." }
      ],
      prix: [500, 1275, 2000]
    },
    {
      slug: "langage-animal", nom: "Potion de langage animal", categorie: "Ruse & exploration",
      glow: "#318c23", img: "langage-animal.webp",
      tiers: [
        { nom: "Embrumée", roll: "1 à 15", effet: "Compréhension confuse des animaux." },
        { nom: "Claire", roll: "16 à 20", effet: "Compréhension nette des animaux." }
      ],
      prix: [450, 1148, 1800]
    },
    {
      slug: "inversion", nom: "Potion d'inversion", categorie: "Ruse & exploration",
      glow: "#9b774b", img: "inversion.webp",
      note: "Inverse des paires de statistiques.",
      tiers: [
        { nom: "Aléatoire", roll: "1 à 12", effet: "Inversion imprévisible." },
        { nom: "Inversion", roll: "13 à 19", effet: "Force ↔ Intelligence · Dextérité ↔ Sagesse · Constitution ↔ Charisme." },
        { nom: "Personnelle", roll: "20", effet: "Faites les paires que vous voulez." }
      ],
      prix: [700, 1785, 2800]
    },

    /* ---------- Spéciales ---------- */
    {
      slug: "vierge", nom: "Potion magique vierge", categorie: "Spéciales",
      glow: "#b28190", img: "vierge.webp",
      note: "Cette potion vierge permet à toutes les classes magiques d'y infuser un de leurs sorts pour +25 % de PM ou de PV. Elle devra être cassée pour libérer le sort — sauf sur un 1 naturel, où le sort touchera sa cible. Elle n'est trouvable qu'en petit format. Attention : trop de potions magiques peuvent entrer en résonance et exploser l'une après l'autre jusqu'à retrouver l'équilibre (limite déterminée par le MJ).",
      tiers: null,
      prix: [1200]
    }

  ]
};
