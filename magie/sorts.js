/* ==================================================================
   LES SORTS DU GRAND LIVRE DE LA MAGIE
   C'est le SEUL fichier à modifier pour ajouter, corriger ou retirer
   un sort. Le moteur du livre (pagination, feuilletage, recherche) vit
   dans livre_magie.html et n'a pas besoin d'être touché : la mise en
   page s'adapte toute seule au contenu.

   Structure d'une famille :
     {
       id: "attaque",              // identifiant court, sans accent ni espace
       nom: "Famille d'Attaque",   // titre affiché sur la page
       court: "Attaque",           // texte du marque-page (garder très court)
       couleur: "#9e2b25",         // couleur du marque-page et du titre
       sections: [ ... ]
     }

   Structure d'une section (un groupe de sorts dans une famille) :
     {
       titre: "Sous-famille du feu",   // facultatif : sans titre, les sorts
                                       // sont juste rattachés à la famille
       intro: "Texte d'introduction",  // facultatif
       sorts: [ ... ]
     }

   Structure d'un sort :
     {
       nom: "Petite boule de feu",
       cout: "PM (40)",                // facultatif ; "" = pas de coût affiché
       desc: ["Dégâts 3D8.", "Zone de 2."]   // une entrée = un paragraphe
     }

   Dans desc, une entrée peut aussi être une grille élémentaire :
     { grid: "foudre", legende: "…" }   ou   { grid: "vent", legende: "…" }
   (les deux seules grilles connues du moteur, voir grilleHTML()).

   ⚠ Ne pas écrire de HTML dans les textes : ils sont échappés
   automatiquement. Les accents et les caractères comme ⅓ passent très bien.
   ================================================================== */
const FAMILLES = [
  {
    id: "soutien", nom: "Famille de Soutien", court: "Soutien", couleur: "#9c7c1e",
    sections: [
      {
        titre: "Sous-famille de lumière", sorts: [
          { nom: "Bénédiction de moine", cout: "PM (10)", desc: ["Suppression des effets."] },
          { nom: "Bénédiction d'évêque", cout: "PM (20)", desc: ["Suppression des effets + 15 PV."] },
          { nom: "Bénédiction d'archevêque", cout: "PM (30)", desc: ["Suppression des effets + 30 PV."] }
        ]
      },
      {
        titre: "Sous-famille de guérison", sorts: [
          { nom: "Soin mineur", cout: "PM (20)", desc: ["Restore 15% des PV max."] },
          { nom: "Soin moyen", cout: "PM (30)", desc: ["Restore 25% des PV max."] },
          { nom: "Soin grand", cout: "PM (60)", desc: ["Restore 50% des PV max."] },
          { nom: "Soin majeur", cout: "PM (90)", desc: ["Restore 75% des PV max."] }
        ]
      },
      {
        sorts: [
          { nom: "Transfert de dégâts", cout: "PM = dégâts transférés", desc: ["Ce sort peut être lancé en réaction quand un allié est sur le point de prendre un coup, il sert à transférer les dégâts qu'il allait prendre au lanceur. Le sort coûtera autant de PM que de points de dégâts transférés."] },
          { nom: "Trompe la mort", cout: "PM (20)", desc: ["Invincible pendant 2T mais incapacité et immobilisé pendant cela."] },
          { nom: "Plume", cout: "PM (10)", desc: ["Supprime totalement les dégâts de chute une fois."] }
        ]
      }
    ]
  },
  {
    id: "action", nom: "Famille d'Action", court: "Action", couleur: "#b35f1d",
    sections: [
      {
        titre: "Sous-famille d'adrénaline", sorts: [
          { nom: "Petite dose d'adrénaline", cout: "PM (35)", desc: ["Une action de plus maintenant mais au tour suivant impossibilité de faire une action."] },
          { nom: "Dose d'adrénaline", cout: "PM (55)", desc: ["Une action de plus pendant 2T mais au tour d'après impossibilité de faire une action."] },
          { nom: "Piqûre d'adrénaline", cout: "PM (75)", desc: ["Une action de plus pendant 3T mais au tour d'après impossibilité de faire une action."] }
        ]
      },
      {
        sorts: [
          { nom: "Empressement", cout: "PM (15)", desc: ["Une action de plus au tour d'après mais consomme l'action de ce tour."] },
          { nom: "Chloroforme", cout: "PM (50)", desc: ["L'adversaire est incapacité et immobilisé pendant 3T ou à la première prise de dégâts."] }
        ]
      }
    ]
  },
  {
    id: "resistance", nom: "Famille de Résistance", court: "Résist.", couleur: "#5a6b7d",
    sections: [
      {
        titre: "Sous-famille de protection", sorts: [
          { nom: "Protection mineure", cout: "PM (25)", desc: ["Reçoit -20% de dégâts pendant 3T."] },
          { nom: "Protection moyenne", cout: "PM (45)", desc: ["Reçoit -35% de dégâts pendant 3T."] },
          { nom: "Protection majeure", cout: "PM (100)", desc: ["Reçoit -50% de dégâts pendant 3T."] },
          { nom: "Protection exceptionnelle", cout: "PM (120)", desc: ["Reçoit -40% de dégâts pendant 5T."] }
        ]
      },
      {
        titre: "Sous-famille d'armure", sorts: [
          { nom: "Plaque de fer", cout: "PM (40)", desc: ["Confère des PA à hauteur de 25% des PV max."] },
          { nom: "Plaque de titane", cout: "PM (60)", desc: ["Confère des PA à hauteur de 40% des PV max."] },
          { nom: "Plaque d'adamantine", cout: "PM (80)", desc: ["Confère des PA à hauteur de 55% des PV max."] }
        ]
      },
      {
        titre: "Sous-famille de perceur", sorts: [
          { nom: "Perce armure légère", cout: "PM (75)", desc: ["Attaque en ignorant les PA pendant 1T."] },
          { nom: "Perce armure forte", cout: "PM (95)", desc: ["Attaque en ignorant les PA pendant 2T."] }
        ]
      }
    ]
  },
  {
    id: "deplacement", nom: "Famille de Déplacement", court: "Déplac.", couleur: "#2f7a6e",
    sections: [
      {
        titre: "Sous-famille de lévitation", sorts: [
          { nom: "Lévitation légère", cout: "PM (20)", desc: ["Lévite de 3 cases pendant 3T."] },
          { nom: "Lévitation moyenne", cout: "PM (30)", desc: ["Lévite de 3 cases pendant 4T."] },
          { nom: "Lévitation forte", cout: "PM (40)", desc: ["Lévite de 3 cases pendant 5T."] }
        ]
      },
      {
        titre: "Sous-famille de téléportation", sorts: [
          { nom: "Téléportation petite", cout: "PM (20)", desc: ["Vous téléporte ou téléporte un allié à portée de toucher sur une distance max de 10 cases."] },
          { nom: "Téléportation moyenne", cout: "PM (30)", desc: ["Vous téléporte ou téléporte un allié à portée de toucher sur une distance max de 15 cases."] },
          { nom: "Téléportation longue", cout: "PM (40)", desc: ["Vous téléporte ou téléporte un allié à portée de toucher sur une distance max de 20 cases."] }
        ]
      },
      {
        titre: "Sous-famille de projection",
        intro: "Prend un objet d'un certain poids et le projette rapidement en ligne droite.",
        sorts: [
          { nom: "Projection de 30 kg", cout: "PM (30)", desc: ["Envoie l'objet à une distance de 30 cases."] },
          { nom: "Projection de 70 kg", cout: "PM (40)", desc: ["Envoie l'objet à une distance de 20 cases."] },
          { nom: "Projection de 150 kg", cout: "PM (50)", desc: ["Envoie l'objet à une distance de 10 cases."] }
        ]
      }
    ]
  },
  {
    id: "furtivite", nom: "Famille de Furtivité", court: "Furtiv.", couleur: "#46386e",
    sections: [
      {
        titre: "Sous-famille de l'invisibilité", sorts: [
          { nom: "Invisibilité légère", cout: "PM (20)", desc: ["Durée de 1T."] },
          { nom: "Invisibilité moyenne", cout: "PM (30)", desc: ["Durée de 2T."] },
          { nom: "Invisibilité forte", cout: "PM (40)", desc: ["Durée de 3T."] }
        ]
      },
      {
        titre: "Sous-famille de fumigène", sorts: [
          { nom: "Fumigène", cout: "PM (25)", desc: ["Fait apparaître une boule de fumée de 4 de large, rendant impossible la vision à travers et la compliquant à l'intérieur même. La fumée dure 6T à moins qu'elle ne soit dissipée par un vent fort ou une aura de vent."] },
          { nom: "Fumigène empoisonné", cout: "PM (40)", desc: ["Fait apparaître une boule de fumée empoisonnée de 3 de large, rendant impossible la vision à travers et la compliquant à l'intérieur même. Toute personne à l'intérieur a l'effet empoisonné. La fumée dure 6T à moins qu'elle ne soit dissipée par un vent fort ou une aura de vent."] }
        ]
      }
    ]
  },
  {
    id: "esprit", nom: "Famille d'Esprit", court: "Esprit", couleur: "#8a4a7d",
    sections: [
      {
        titre: "Sous-famille du lecteur", sorts: [
          { nom: "Lecture de pensées embrumées", cout: "PM (30)", desc: ["Permet de lire les pensées de la cible mais les pensées ne seront pas perçues clairement."] },
          { nom: "Lecture de pensées précise", cout: "PM (50)", desc: ["Permet de lire les pensées de la cible."] }
        ]
      },
      {
        titre: "Sous-famille de l'amour", sorts: [
          { nom: "Crush", cout: "PM (40)", desc: ["Rend la cible amoureuse du lanceur, ¼ chance de s'appliquer."] },
          { nom: "Sentiments", cout: "PM (60)", desc: ["Rend la cible amoureuse du lanceur, ½ chance de s'appliquer."] },
          { nom: "Amoureux", cout: "PM (80)", desc: ["Rend la cible amoureuse du lanceur, ¾ chances de s'appliquer."] },
          { nom: "Coup de foudre", cout: "PM (120)", desc: ["Rend la cible amoureuse du lanceur."] }
        ]
      },
      {
        sorts: [
          { nom: "Tranquillité d'esprit", cout: "PM (30)", desc: ["Augmente beaucoup la perception, +5 au dés."] }
        ]
      }
    ]
  },
  {
    id: "attaque", nom: "Famille d'Attaque", court: "Attaque", couleur: "#9e2b25",
    sections: [
      {
        sorts: [
          { nom: "Projection magique", cout: "PM (10)", desc: ["Lance des projectiles magiques simples qui font 3D4 de dégâts."] }
        ]
      },
      {
        titre: "Sous-famille du feu", sorts: [
          { nom: "Petite boule de feu", cout: "PM (40)", desc: ["Dégâts 3D8 + effet brûlé.", "Zone de 2."] },
          { nom: "Grosse boule de feu", cout: "PM (60)", desc: ["Dégâts 3D10 + effet brûlé.", "Zone de 3."] },
          { nom: "Arcane de feux", cout: "PM (80)", desc: ["Dégâts 3D12 + effet brûlé + effet faiblesse de 20% pendant 1T.", "Zone de 3."] }
        ]
      },
      {
        titre: "Sous-famille de l'eau", sorts: [
          { nom: "Écume", cout: "PM (40)", desc: ["Dégâts 3D8 + effet de détrempé.", "Zone de 2."] },
          { nom: "Vague", cout: "PM (60)", desc: ["Dégâts 3D10 + effet de détrempé.", "Zone de 3."] },
          { nom: "Tsunami", cout: "PM (80)", desc: ["Dégâts 3D12 + effet de détrempé + repousse de 8 cases.", "Zone de 3."] }
        ]
      },
      {
        titre: "Sous-famille du poison", sorts: [
          { nom: "Poison faible", cout: "PM (40)", desc: ["Dégâts 3D6 + effet empoisonné."] },
          { nom: "Poison", cout: "PM (60)", desc: ["Dégâts 3D6 + effet empoisonné + (50% de chance de se faire 25% des dégâts de son attaque → 50% de chance de se faire 33% des dégâts de son attaque)."] },
          { nom: "Poison fort", cout: "PM (80)", desc: ["Dégâts 3D6 + effet empoisonné ++ (50% de chance de se faire ¼ des dégâts de son attaque → 50% de chance de se faire 45% des dégâts de son attaque)."] }
        ]
      },
      {
        titre: "Sous-famille de glace", sorts: [
          { nom: "Chute de neige", cout: "PM (40)", desc: ["Dégâts 3D8 + effet congelé.", "Zone de 2."] },
          { nom: "Tempête de neige", cout: "PM (60)", desc: ["Dégâts 3D10 + effet congelé.", "Zone de 3."] },
          { nom: "Blizzard", cout: "PM (80)", desc: ["Dégâts 3D12 + effet congelé + effet engourdi pendant 3T.", "Zone de 3."] }
        ]
      },
      {
        titre: "Sous-famille de foudre", sorts: [
          { nom: "Eclair", cout: "PM (40)", desc: ["Dégâts 3D8 + effet foudroyé.", "Zone de 2."] },
          { nom: "Foudre", cout: "PM (60)", desc: ["Dégâts 3D10 + effet foudroyé.", "Zone de 3."] },
          { nom: "Tonnerre", cout: "PM (80)", desc: ["Dégâts 3D12 + effet foudroyé + effet désarmer.", "Zone de 3."] }
        ]
      },
      {
        titre: "Sous-famille d'explosion", sorts: [
          { nom: "Grenade", cout: "PM (50)", desc: ["Dégâts 2D10 + ⅓ de chance d'appliquer l'effet brûlé.", "Zone de 2."] },
          { nom: "Lance grenade", cout: "PM (50) × nb d'explosions", desc: [] },
          { nom: "FGM-148 Javelin", cout: "PM (80)", desc: ["Dégâts 4D10 + ⅓ de chance d'appliquer l'effet brûlé.", "Zone de 3."] },
          { nom: "Pluie de missiles", cout: "PM (80) × nb d'explosions", desc: [] },
          { nom: "Fat Man", cout: "PM (110) + 2 TDSA", desc: ["Dégâts 6D10 + ⅓ de chance d'appliquer l'effet brûlé.", "Zone de 4."] }
        ]
      },
      {
        titre: "Sous-famille des végétaux", sorts: [
          { nom: "Attaque de l'ortie", cout: "PM (40)", desc: ["Dégâts 3D8 + effet lacéré.", "Zone de 2."] },
          { nom: "Attaque des ronces", cout: "PM (60)", desc: ["Dégâts 3D10 + effet lacéré.", "Zone de 3."] },
          { nom: "Attaque des pyracanthas", cout: "PM (80)", desc: ["Dégâts 3D12 + effet lacéré + effet engourdi pendant 3T.", "Zone de 3."] }
        ]
      },
      {
        titre: "Sous-famille de terre", sorts: [
          { nom: "Secousse", cout: "PM (40)", desc: ["Dégâts 3D8 + effet enlisé.", "Zone de 2."] },
          { nom: "Séisme", cout: "PM (60)", desc: ["Dégâts 3D10 + effet enlisé.", "Zone de 3."] },
          { nom: "Epicentre", cout: "PM (80)", desc: ["Dégâts 4D12 + effet enlisé + effet incapacité.", "Zone de 3."] }
        ]
      },
      {
        titre: "Sous-famille du vent", sorts: [
          { nom: "Sirocco", cout: "PM (40)", desc: ["Dégâts 3D8 + effet éjecté.", "Zone de 3x4."] },
          { nom: "Tornade", cout: "PM (60)", desc: ["Dégâts 3D10 + effet éjecté.", "Zone de 3x5."] },
          { nom: "Typhon", cout: "PM (80)", desc: ["Dégâts 3D12 + effet éjecté + effet engourdi pendant 3T.", "Zone de 3x5."] }
        ]
      },
      {
        sorts: [
          { nom: "Mad men", cout: "PM (30)", desc: ["Dégâts 3D6 + effet fou."] }
        ]
      }
    ]
  },
  {
    id: "creation", nom: "Famille de Création", court: "Création", couleur: "#47702f",
    sections: [
      {
        titre: "Sous-famille des objets", sorts: [
          { nom: "Création de nourriture", cout: "PM (60) [1 par CR]", desc: ["Permet de créer 1 à 4 rations de survie magiques selon le résultat d'un D4, étant magiques elles doivent être consommées immédiatement."] },
          { nom: "Apparition d'objet", cout: "", desc: ["Fait apparaître un objet basique, il faut cependant avoir déjà vu cet objet et savoir les matériaux qui le composent."] },
          { nom: "— Apparition d'un petit objet", cout: "PM (20)", desc: ["Jusqu'à 10 kg."] },
          { nom: "— Apparition d'un objet moyen", cout: "PM (35)", desc: ["Jusqu'à 25 kg."] },
          { nom: "— Apparition d'un gros objet", cout: "PM (45)", desc: ["Jusqu'à 50 kg."] },
          { nom: "Apparition d'arme temporaire", cout: "", desc: ["Fait apparaître une arme dans votre main jusqu'à la fin du combat, vous pouvez choisir la catégorie mais la sous-catégorie et la rareté sont aléatoires."] },
          { nom: "— Arme de courte distance", cout: "PM (80)", desc: [] },
          { nom: "— Arme de mi-distance", cout: "PM (100)", desc: [] },
          { nom: "— Arme de longue distance", cout: "PM (90)", desc: [] },
          { nom: "Flèches", cout: "PM (40)", desc: ["Fait apparaître des flèches, elles seront aléatoires en quantité et en variété. Utilisable jusqu'à la fin du combat."] }
        ]
      },
      {
        titre: "Sous-famille des golems",
        intro: "Permet de créer un golem qui sera votre allié pendant un combat, vous lui assignez un ordre à la création et il le suivra à la lettre. Cependant il agira seul après sa création, vous n'aurez pas de contrôle sur lui.",
        sorts: [
          { nom: "Changement d'ordre", cout: "Consomme une SA", desc: ["Permet de changer l'ordre donné au golem."] },
          { nom: "Création d'un golem", cout: "PM (50) + 2 TDSA", desc: ["PV : 50 — Dégâts : 25 — Vitesse : 5"] },
          { nom: "Création d'un golem guerrier", cout: "PM (80) + 3 TDSA", desc: ["PV : 50 — Dégâts : 40 — Vitesse : 5"] },
          { nom: "Création d'un golem général", cout: "PM (110) + 4 TDSA", desc: ["PV : 110 — PA : 50 — Dégâts : 60 — Vitesse : 8"] },
          { nom: "Création d'un golem royal", cout: "PM (140) + 5 TDSA", desc: ["PV : 150 — PA : 100 — Dégâts : 80 — Vitesse : 10"] }
        ]
      },
      {
        titre: "Sous-famille des barricades",
        intro: "Les barricades sont des murs particuliers : ce sont des murs de 2 de haut d'un côté et un escalier pour pouvoir attaquer avec +1 de portée nécessaire pour toucher.",
        sorts: [
          { nom: "Barricade", cout: "PM (30)", desc: ["30 PV et une barricade de 3 cases de long."] },
          { nom: "Grande Barricade", cout: "PM (40)", desc: ["40 PV et une barricade de 5 cases de long."] },
          { nom: "La muraille de Barricade", cout: "PM (60)", desc: ["80 PV et une barricade de 7 cases de long et 3 de haut (+2 au lieu de +1 de portée)."] }
        ]
      },
      {
        titre: "Sous-famille des élémentaires",
        intro: "Tous les sorts élémentaires coûtent PM (25), chaque élément peut être utilisé une fois par CR. Les sorts de création élémentaires peuvent aussi être lancés en réaction dans une zone de 5 autour de soi pour se défendre d'une attaque élémentaire vous ciblant. Il est aussi possible de le faire quand un allié est ciblé. Le choix de l'élément est important. Ils peuvent aussi être appliqués aux armes magiques pour PM (40), puis consomment PM (5) par tour.",
        sorts: [
          {
            nom: "Eaux", cout: "PM (25)", desc: [
              "Créer une boule d'eau — Zone : 2 cases de rayon autour de la cible.",
              "Effet : si une entité reste dans la boule d'eau pendant 2T elle commencera à suffoquer, ce qui causera la perte de 33% (arrondi au supérieur) de ses PV par T. La boule d'eau disparaîtra quand plus personne ne sera dedans.",
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet détrempé."
            ]
          },
          {
            nom: "Glace", cout: "PM (25)", desc: [
              "Créer un bloc de glace — Zone : 1 case de rayon autour de la cible.",
              "Effet : applique l'effet congelé à la cible et a 75% de chance de s'appliquer au reste de la zone.",
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet congelé."
            ]
          },
          {
            nom: "Feu", cout: "PM (25)", desc: [
              "Créer une flamme à l'impact — Zone : 1 case de rayon autour de la cible.",
              "Effet : applique l'effet brûlé à la cible et a 75% de chance de s'appliquer au reste de la zone.",
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet brûlé."
            ]
          },
          {
            nom: "Foudre", cout: "PM (25)", desc: [
              "Créer un orage — Zone : 3 cases de rayon autour de la cible.",
              "Effet : applique l'effet foudroyé pour la cible et a des chances de l'appliquer qui varient en fonction de la case où se trouvent les autres entités.",
              { grid: "foudre", legende: "Chance d'appliquer l'effet électrifié selon la case" },
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet foudroyé."
            ]
          },
          {
            nom: "Végétaux", cout: "PM (25)", desc: [
              "Créer des végétaux — Zone : 4 cases de rayon autour de la cible.",
              "Effet : la personne ciblée voit ses déplacements passer à 1 tant qu'elle est dans les végétaux, chaque entité dedans perd 5% de PV (basé sur les PV max) à chaque tour.",
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet lacéré."
            ]
          },
          {
            nom: "Terre", cout: "PM (25)", desc: [
              "Créer un mur de roche — Dimensions : 5 cases de large, 3 de haut et 1 de long.",
              "Effet : à la création le mur va avancer de 5 cases. Il possède 100 PV et reste jusqu'à la fin du combat. Ensuite il peut, contre une sous-action du lanceur, être avancé ou reculé de 5 cases.",
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet enlisé."
            ]
          },
          {
            nom: "Vent", cout: "PM (25)", desc: [
              "Créer une rafale de vent — Zone : 5 cases de long et 3 de large.",
              "Effet : applique l'effet éjecté pour la cible et a des chances de l'appliquer qui varient en fonction de la case où se trouvent les autres entités.",
              "80% de chance d'appliquer l'effet déstabilisé 1 case derrière, 60% à 2 cases, 40% à 3 cases, 20% à 4 cases.",
              { grid: "vent", legende: "Puissance de la rafale selon la distance" },
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet éjecté."
            ]
          },
          {
            nom: "Explosion", cout: "PM (25)", desc: [
              "Créer une explosion — Zone : 1 case de rayon autour de la cible.",
              "Effet : fait 2D8 de dégâts à la cible et les entités autour prennent 50% des dégâts.",
              "Effet sur les armes magiques : ⅓ de chance de faire une explosion qui fait 2D8 dans une zone de 1 autour de la cible."
            ]
          }
        ]
      }
    ]
  }
];
