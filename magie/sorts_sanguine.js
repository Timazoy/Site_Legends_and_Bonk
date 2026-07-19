/* ==================================================================
   LES SORTS DU GRIMOIRE SANGUINOLENT (magie du sang)
   C'est le SEUL fichier à modifier pour ajouter, corriger ou retirer
   un sort du grimoire. Le moteur du livre est partagé avec le Grand
   Livre de la Magie (livre-moteur.js) : la mise en page s'adapte
   toute seule au contenu.

   Même structure que sorts.js (familles → sections → sorts).
   Particularité de la magie sanguine : les sorts se paient en PV,
   avec deux prix « PV mono ⁄ bi » — le premier pour les hématomanciens
   Mono, le second pour les Bi (expliqué sur la page de garde).

   ⚠ Ne pas écrire de HTML dans les textes : ils sont échappés
   automatiquement.
   ================================================================== */
const FAMILLES = [
  {
    id: "attaque", nom: "Famille d'Attaque", court: "Attaque", couleur: "#a01313",
    sections: [
      {
        sorts: [
          { nom: "Projection de sang", cout: "PV 6 ⁄ 8", desc: ["Lance des projectiles sanguins simples qui font 3D4 de dégâts."] }
        ]
      },
      {
        titre: "Sous-famille du sang coagulé", sorts: [
          { nom: "Petit caillot sanguin", cout: "PV 19 ⁄ 23", desc: ["Dégâts 4D6."] },
          { nom: "Caillot sanguin", cout: "PV 32 ⁄ 39", desc: ["Dégâts 4D8."] },
          { nom: "Thrombose sanguine", cout: "PV 44 ⁄ 54", desc: ["Dégâts 4D10."] }
        ]
      },
      {
        titre: "Sous-famille d'aspiration du sang", sorts: [
          { nom: "Prise de sang", cout: "PV 32 ⁄ 39", desc: ["Dégâts 3D8 + effet vol de vie."] },
          { nom: "Saignée", cout: "PV 44 ⁄ 54", desc: ["Dégâts 4D8 + effet vol de vie."] },
          { nom: "Exsanguination", cout: "PV 59 ⁄ 69", desc: ["Dégâts 5D8 + effet vol de vie."] }
        ]
      },
      {
        titre: "Sous-famille du saignement", sorts: [
          { nom: "Coupure", cout: "PV 25 ⁄ 31", desc: ["Dégâts 3D6 + effet saignement.", "Zone de 1."] },
          { nom: "Saignement", cout: "PV 38 ⁄ 46", desc: ["Dégâts 3D8 + effet saignement.", "Zone de 2."] },
          { nom: "Hémorragie", cout: "PV 50 ⁄ 62", desc: ["Dégâts 3D10 + effet saignement + effet engourdi pendant 3T.", "Zone de 2."] }
        ]
      },
      {
        titre: "Sous-famille du sang transperçant", sorts: [
          { nom: "Goutte de sang transperçante", cout: "PV 25 ⁄ 31", desc: ["Dégâts 3D8 + effet perce-armure."] },
          { nom: "Jet de sang transperçant", cout: "PV 38 ⁄ 46", desc: ["Dégâts 3D10 + effet perce-armure."] },
          { nom: "Geyser de sang transperçant", cout: "PV 50 ⁄ 62", desc: ["Dégâts 3D12 + effet perce-armure + effet de faiblesse de 20% sur cette attaque."] }
        ]
      },
      {
        titre: "Sous-famille du sang bouillant", sorts: [
          { nom: "Petite boule de sang bouillant", cout: "PV 25 ⁄ 31", desc: ["Dégâts 3D8 + effet brûlé.", "Zone de 1."] },
          { nom: "Grosse boule de sang bouillant", cout: "PV 38 ⁄ 46", desc: ["Dégâts 3D10 + effet brûlé.", "Zone de 2."] },
          { nom: "Arcane de sang bouillant", cout: "PV 50 ⁄ 62", desc: ["Dégâts 3D12 + effet brûlé + effet faiblesse de 20% pendant 1T.", "Zone de 2."] }
        ]
      },
      {
        titre: "Sous-famille du sang liquide", sorts: [
          { nom: "Bain de sang", cout: "PV 25 ⁄ 31", desc: ["Dégâts 3D8 + effet détrempé.", "Zone de 1."] },
          { nom: "Vague de sang", cout: "PV 38 ⁄ 46", desc: ["Dégâts 3D10 + effet détrempé.", "Zone de 2."] },
          { nom: "Mer de sang", cout: "PV 50 ⁄ 62", desc: ["Dégâts 3D12 + effet détrempé + repousse de 8 cases.", "Zone de 2."] }
        ]
      },
      {
        titre: "Sous-famille du sang pourri", sorts: [
          { nom: "Sang empoisonné faiblement", cout: "PV 25 ⁄ 31", desc: ["Dégâts 3D6 + effet empoisonné."] },
          { nom: "Sang empoisonné", cout: "PV 38 ⁄ 46", desc: ["Dégâts 3D6 + effet empoisonné + (50% de chance de se faire 25% des dégâts de son attaque → 50% de chance de se faire 33% des dégâts de son attaque)."] },
          { nom: "Sang empoisonné fortement", cout: "PV 50 ⁄ 62", desc: ["Dégâts 3D6 + effet empoisonné ++ (50% de chance de se faire 25% des dégâts de son attaque → 50% de chance de se faire 45% des dégâts de son attaque)."] }
        ]
      },
      {
        titre: "Sous-famille de projection sanguine", sorts: [
          { nom: "Éjection systolique", cout: "PV 25 ⁄ 31", desc: ["Dégâts 3D8 + effet éjecté.", "Zone de 3x3."] },
          { nom: "Éjection ventriculaire", cout: "PV 38 ⁄ 46", desc: ["Dégâts 3D10 + effet éjecté.", "Zone de 3x4."] },
          { nom: "Sang sous pression", cout: "PV 50 ⁄ 62", desc: ["Dégâts 3D12 + effet éjecté + effet engourdi pendant 3T.", "Zone de 3x4."] }
        ]
      }
    ]
  },
  {
    id: "creation", nom: "Famille de Création", court: "Création", couleur: "#96351a",
    sections: [
      {
        titre: "Sous-famille des objets", sorts: [
          { nom: "Apparition d'objet", cout: "", desc: ["Fait apparaître un objet basique, il faut cependant avoir déjà vu cet objet et savoir les matériaux qui le composent."] },
          { nom: "— Apparition d'un petit objet", cout: "PV 13 ⁄ 14", desc: ["Jusqu'à 10 kg."] },
          { nom: "— Apparition d'un objet moyen", cout: "PV 22 ⁄ 27", desc: ["Jusqu'à 25 kg."] },
          { nom: "— Apparition d'un gros objet", cout: "PV 28 ⁄ 35", desc: ["Jusqu'à 50 kg."] },
          { nom: "Apparition d'arme temporaire", cout: "", desc: ["Fait apparaître une arme dans votre main jusqu'à la fin du combat, vous pouvez choisir la catégorie mais la sous-catégorie et la rareté sont aléatoires."] },
          { nom: "— Arme de courte distance", cout: "PV 50 ⁄ 62", desc: [] },
          { nom: "— Arme de mi-distance", cout: "PV 63 ⁄ 77", desc: [] },
          { nom: "— Arme de longue distance", cout: "PV 57 ⁄ 69", desc: [] },
          { nom: "Flèches", cout: "PV 25 ⁄ 31", desc: ["Fait apparaître des flèches, elles seront aléatoires en quantité et en variété. Utilisable jusqu'à la fin du combat."] }
        ]
      },
      {
        titre: "Sous-famille des golems de sang",
        intro: "Permet de créer un golem qui sera votre allié pendant un combat, vous lui assignez un ordre à la création et il le suivra à la lettre. Cependant il agira seul après sa création, vous n'aurez pas de contrôle sur lui.",
        sorts: [
          { nom: "Changement d'ordre", cout: "Consomme une SA", desc: ["Permet de changer l'ordre donné au golem."] },
          { nom: "Création d'un golem de sang", cout: "PV 32 ⁄ 39 + 2 TDSA", desc: ["PV : 50 — Dégâts : 25 — Vitesse : 5"] },
          { nom: "Création d'un golem de sang guerrier", cout: "PV 50 ⁄ 62 + 3 TDSA", desc: ["PV : 50 — Dégâts : 40 — Vitesse : 5"] },
          { nom: "Création d'un golem de sang général", cout: "PV 69 ⁄ 85 + 4 TDSA", desc: ["PV : 110 — PA : 50 — Dégâts : 60 — Vitesse : 8"] },
          { nom: "Création d'un golem de sang royal", cout: "PV 88 ⁄ 108 + 5 TDSA", desc: ["PV : 150 — PA : 100 — Dégâts : 80 — Vitesse : 10"] }
        ]
      },
      {
        titre: "Sous-famille des barricades sanglantes",
        intro: "Les barricades sont des murs particuliers : ce sont des murs de 2 de haut d'un côté et un escalier pour pouvoir attaquer avec +1 de portée nécessaire pour toucher.",
        sorts: [
          { nom: "Barricade sanglante", cout: "PV 19 ⁄ 21", desc: ["30 PV et une barricade de 3 cases de long."] },
          { nom: "Grande Barricade sanglante", cout: "PV 25 ⁄ 28", desc: ["40 PV et une barricade de 5 cases de long."] },
          { nom: "La sanglante muraille de Barricade", cout: "PV 38 ⁄ 42", desc: ["80 PV et une barricade de 7 cases de long et 3 de haut (+2 au lieu de +1 de portée)."] }
        ]
      },
      {
        titre: "Sous-famille du sang élémentaire",
        intro: "Tous les sorts élémentaires du sang coûtent PV 16 ⁄ 19, chaque forme peut être utilisée une fois par CR. Ils peuvent aussi être lancés en réaction dans une zone de 5 autour de soi pour se défendre d'une attaque élémentaire vous ciblant ; il est aussi possible de le faire quand un allié est ciblé. Le choix du type est important. Ils peuvent aussi être appliqués aux armes magiques pour PV 25 ⁄ 31, puis consomment PV 3 ⁄ 4 par tour.",
        sorts: [
          {
            nom: "Sang liquide", cout: "PV 16 ⁄ 19", desc: [
              "Créer une vague de sang — Zone : 3 cases de large et 10 cases de long devant le lanceur.",
              "Effet : repousse jusqu'au bout de la vague et laisse une traînée de sang sur les cases touchées par le sort ; elles ont ¼ de chance de faire tomber les entités qui passent dessus. Elle reste 4T.",
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet ralenti."
            ]
          },
          {
            nom: "Sang coagulé", cout: "PV 16 ⁄ 19", desc: [
              "Créer une plaque de sang coagulé — Zone : 2 cases de rayon autour de la cible.",
              "Effet : la cible subit l'effet enlisé, les autres entités doivent réussir un check de 13 en force pour pouvoir se déplacer au prochain tour.",
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet incapacité et immobilisé."
            ]
          },
          {
            nom: "Nuage de sang", cout: "PV 16 ⁄ 19", desc: [
              "Créer un nuage de sang — Zone : 3 cases de rayon autour de la cible.",
              "Effet : dans la zone du nuage, les entités subissent une perte de 4 points de précision ainsi qu'une confusion qui leur fait faire des déplacements aléatoires quand elles décident de se mouvoir (D4 à chaque case de déplacement, le résultat donne la direction : 1 = Avant, 2 = Gauche, 3 = Droite, 4 = Arrière).",
              "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet de confusion à leur prochain tour, qui leur fait faire des déplacements aléatoires (D4 à chaque case de déplacement, le résultat donne la direction : 1 = Avant, 2 = Gauche, 3 = Droite, 4 = Arrière)."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "autres", nom: "Autres sous-familles", court: "Autres", couleur: "#5e1638",
    sections: [
      {
        titre: "Sous-famille d'armure de sang", sorts: [
          { nom: "Plaque de croûte", cout: "PV 25 ⁄ 31", desc: ["Confère des PA à hauteur de 25% des PV max."] },
          { nom: "Plaque de thrombus", cout: "PV 38 ⁄ 46", desc: ["Confère des PA à hauteur de 40% des PV max."] },
          { nom: "Armure hématose", cout: "PV 50 ⁄ 62", desc: ["Confère des PA à hauteur de 55% des PV max."] }
        ]
      },
      {
        titre: "Sous-famille d'adrénaline", sorts: [
          { nom: "Pouls rapide", cout: "PV 22 ⁄ 27", desc: ["Une action de plus maintenant mais au tour suivant impossibilité de faire une action."] },
          { nom: "Hypertension artérielle", cout: "PV 35 ⁄ 42", desc: ["Une action de plus pendant 2T mais au tour d'après impossibilité de faire une action."] },
          { nom: "Tachycardie", cout: "PV 47 ⁄ 58", desc: ["Une action de plus pendant 3T mais au tour d'après impossibilité de faire une action."] }
        ]
      },
      {
        sorts: [
          { nom: "Fumée de sang", cout: "PV 16 ⁄ 19", desc: ["Fait apparaître une boule de fumée de 4 de large, rendant impossible la vision à travers et la compliquant à l'intérieur même. La fumée dure 6T à moins qu'elle ne soit dissipée par un vent fort ou une aura de vent."] },
          { nom: "Lévitation légère", cout: "PV 13 ⁄ 15", desc: ["Lévite de 3 cases pendant 3T."] }
        ]
      }
    ]
  }
];

/* ==================================================================
   TEXTES DU LIVRE (couverture, pages de garde, sommaire)
   Le moteur partagé (livre-moteur.js) lit cet objet pour habiller
   le grimoire.
   ================================================================== */
const LIVRE = {
  familles: FAMILLES,
  couvertureTitre: "Grimoire<br>Sanguinolent",
  gardeAvant: '<div class="garde-orne">✦</div>'
    + "Ce grimoire recense les arcanes<br>de la magie sanguine,<br>que l'hématomancien paie<br>de son propre sang."
    + '<div class="garde-orne">❦</div>'
    + '<span class="garde-note">Chaque sort porte deux prix en PV :<br>le premier pour les hématomanciens <b>Mono</b>,<br>le second pour les hématomanciens <b>Bi</b>.</span>',
  sommaireIntro: "Ici sont consignées les voies de l'hématomancie,<br>réservées à ceux qui osent en payer le prix.",
  gardeFin: '<div class="garde-orne">❦</div>'
    + "Ici s'achèvent les pactes de sang.<br>D'autres pages restent à écrire…"
    + '<div class="garde-orne">✦ ✦ ✦</div>',
  pageFin: '<div class="garde-orne">✦ ❦ ✦</div>Fin du Grimoire Sanguinolent'
};
