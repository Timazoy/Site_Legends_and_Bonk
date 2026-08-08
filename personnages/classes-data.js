/* ==================================================================
   LES CLASSES DE LEGENDS & BONK
   C'est le SEUL fichier à modifier pour corriger ou ajouter une classe.
   La galerie (cadres, filtres, fiches) vit dans classes.html et n'a pas
   besoin d'être touchée : la mise en page s'adapte au contenu.

   Structure d'une classe :
     {
       slug: "barbare",            // identifiant d'URL, sans accent ni espace
       nom: "Barbare",
       image: "Barbare.webp",      // dans image-db/personnages/classes/
       type: "Capacites",          // Capacites | Mana | Ressource → filtre
       typeAffiche: "Polyvalent",  // facultatif : ce qui est écrit sur la fiche
       specialite: "Corps à corps",
       roles: [ { cat: "Dégâts", detail: "Corps à corps" }, … ],
       description: ["paragraphe", …],
       ressource: {                // facultatif (classes de type Ressource)
         nom: "Partitions",
         texte: ["paragraphe", …],
         // Le stock de départ se calcule, comme les PV et les PM : il dépend
         // d'une statistique et de paliers. « paliers » se lit du plus haut
         // au plus bas, on garde le premier dont « min » est atteint — le
         // dernier fait donc office de plancher. C'est la traduction chiffrée
         // de la prose ci-dessus, pour l'outil de création.
         stat: "Charisme",
         paliers: [ { min: 12, valeur: 2 }, { min: 0, valeur: 1 } ],
         recup: "la moitié du maximum à chaque court repos, +1 tous les 5T en combat"
       },
       passif:   { nom: "Tu es à moi !", texte: ["…"] },
       biclasse: { nom: "Tu es un peu à moi !", texte: ["…"] },
       pouvoirs: {                 // facultatif
         titre: "Actions",
         intro: ["…"],             // facultatif
         liste: [ { nom: "Enragement", cout: "{1} [1 CR]", texte: "…" }, … ],
         notes: ["…"]              // facultatif : règles de gain, de création…
       },
       grimoire: {                 // facultatif (classes qui puisent au Grand Livre)
         intro: "…",
         // Les trois listes acceptent du texte simple, ou un renvoi vers le
         // Grand Livre — même forme que « equipement » ci-dessous. Voir
         // LIVRE_MAGIE plus bas pour les trois formes d'ancre.
         famille: { nom: "Famille de Création", lien: LIVRE_MAGIE + "#famille=creation",
                    apres: "(sauf création élémentaire)" },   // « apres » facultatif
         sousFamilles: [ { nom: "…", lien: LIVRE_MAGIE + "#groupe=…" } ],
         sorts:        [ { nom: "…", lien: LIVRE_MAGIE + "#sort=…" } ],
         // Une restriction écrite dans « apres » se lit à l'œil mais pas à la
         // machine : le filtre par classe du Grand Livre a besoin de la même
         // chose en clair. Les sous-familles listées ici sont retirées de la
         // famille accordée ci-dessus — les sorts nommés un par un dans
         // « sorts » y échappent (c'est ainsi que le bastioniste garde Terre).
         exclutGroupes: ["sous-famille-des-elementaires"],   // facultatif
         notes: ["…"]
       },
       blocs: [ { titre: "…", texte: ["…"] } ],   // facultatif : contenu libre
       elements: { … },            // propre au magicien : voir sa fiche plus bas
       lien: { href: "…", texte: "…" },   // facultatif : renvoi vers une autre page
       important: ["…"],           // facultatif : encadré d'avertissement
       precision: "Force",      // caractéristique dont dépend la précision
       statMana: "Sagesse",     // classes de type Mana : statistique qui règle
                                // les PM. null = la classe manie la magie sans
                                // PM du tout (hématomancien, qui paie en PV).
                                // Absent = la classe n'a pas de mana.
       equipement: [            // texte simple, ou objet pour renvoyer au catalogue :
         "Une moyenne potion de guérison",
         { nom: "Marteau de combat [C]",       // ce qui devient cliquable
           lien: "../equipement/armes.html#marteau-de-combat",  // ancre = nom de l'objet
           apres: "avec 25 flèches dedans" }   // facultatif : suite non cliquable
       ],
       equipementChoix: true,      // facultatif : « au choix entre » les entrées
       variantes: {                // facultatif : deux façons de jouer LA MÊME
                                   // classe, à trancher à la création — le
                                   // pendant des sous-races. Seul le magicien
                                   // en a aujourd'hui.
         titre: "Voie",
         intro: "…",               // facultatif
         liste: [
           { nom: "Magicien spécialisé",
             note: "…",            // facultatif : une ligne sous le nom
             texte: ["…"],         // facultatif : prose de la variante
             plus:  ["…"],         // pastilles vertes
             moins: ["…"],         // pastilles rouges
             mods: { biclasseInterdit: true }   // ce que l'outil de création
           }                                    // en tire (aides_creation.html)
         ]
       }
     }

   ⚠ Ne pas écrire de HTML dans les textes : ils sont échappés
   automatiquement.
   ================================================================== */

/* Adresse du Grand Livre de la Magie, pour les renvois du bloc « grimoire ».
   Trois formes d'ancre, selon le niveau visé — le livre s'ouvre à la page,
   allume la ligne et écrit son nom dans sa barre de recherche :
     #famille=attaque              une famille entière
     #groupe=sous-famille-du-feu   une sous-famille
     #sort=petite-boule-de-feu     un sort
   L'ancre, c'est le nom écrit dans magie/sorts.js, sans accent ni majuscule et
   les espaces en tirets. Pour la retrouver sans se tromper : ouvrir le livre,
   chercher le nom dans sa barre de recherche, copier la barre d'adresse. */
var LIVRE_MAGIE = "../magie/livre_magie.html";

/* Phrases qui reviennent à l'identique d'une classe à l'autre. */
var SATIETE = "Les personnages de type Capacités peuvent récupérer l'équivalent d'un CR d'une capacité en consommant 5 points de satiété.";
var GAIN_ACTIONS = "Il gagnera ensuite de nouvelles actions au fil de ses aventures ou en montant de niveau (voir règle de montée de niveaux).";
var LIBRE_ACTIONS = "Les actions du personnage sont laissées à vos soins : créez-les comme il vous chante, en respectant les catégories de la classe ainsi que sa spécialité.";
var GAIN_SORTS = "Il gagnera ensuite de nouveaux sorts au fil de ses aventures ou en montant de niveau (voir règle de montée de niveaux).";
var SORTS_PROPRES = "Il possède 2 sorts spécifiques à sa classe au début de l'aventure : c'est à vous de les créer comme il vous chante, en respectant les catégories de la classe ainsi que sa spécialité.";
var GAIN_COMPETENCES = "Il gagnera ensuite de nouvelles compétences au fil de ses aventures ou en montant de niveau (voir règle de montée de niveaux).";
var QUATRE_COMPETENCES = "Il possède 4 compétences au début de l'aventure : c'est à vous de les créer comme il vous chante, en respectant les catégories de la classe ainsi que sa spécialité.";

window.CLASSES = {

  /* ---------- renvois vers le codex des règles ----------
     Certaines tournures reviennent au fil des textes (« voir règle de montée
     de niveaux », « voir la moisson d'offrandes », « voir les catégories
     d'animaux ») : la mention devient un lien vers l'adresse correspondante.
     Adresse vide : la mention reste affichée mais n'est pas cliquable.
     Pour un renvoi propre à une seule classe, utiliser plutôt son champ
     « lien », qui s'affiche en bas de fiche. */
  lienNiveau: "../regles.html#level-up",
  lienMoisson: "../regles.html#moisson-offrandes",
  lienAnimaux: "../regles.html#animaux",

  /* ---------- les catégories de rôle, dans l'ordre des filtres ---------- */
  roles: [
    { id: "Dégâts", nom: "Dégâts", desc: "Infliger les dégâts, sous toutes leurs formes." },
    { id: "Tank", nom: "Tank", desc: "Encaisser et tenir la ligne de front." },
    { id: "Soins", nom: "Soins", desc: "Soigner, protéger, remettre debout." },
    { id: "Bonus/Malus", nom: "Bonus / Malus", desc: "Renforcer les siens, affaiblir les autres." },
    { id: "Invocateur", nom: "Invocateur", desc: "Combattre accompagné." },
    { id: "Soutien", nom: "Soutien", desc: "Faire pencher la balance hors des dégâts." },
    { id: "Création", nom: "Création", desc: "Façonner ce qui n'existait pas sur le champ de bataille." },
    { id: "Polyvalent", nom: "Polyvalent", desc: "Ne se laisse enfermer dans aucun rôle." }
  ],

  /* ---------- les trois moteurs de capacités ---------- */
  types: [
    {
      id: "Capacites", nom: "Capacités", couleur: "#8c6239",
      desc: "Des actions martiales rechargées par le repos. Chaque action indique son nombre maximal d'utilisations et combien elle en récupère par CR."
    },
    {
      id: "Mana", nom: "Mana", couleur: "#3f6ea8",
      desc: "Des sorts payés en PM, puisés dans le Grand Livre de la Magie et complétés par des sorts propres à la classe."
    },
    {
      id: "Ressource", nom: "Ressource", couleur: "#a8862f",
      desc: "Une réserve personnelle — partitions, pactes, vœux, pioches, décoctions, offrandes — assise sur une caractéristique et regagnée au repos."
    }
  ],

  /* ---------- les 19 classes ---------- */
  liste: [

    /* ============================ BARBARE ============================ */
    {
      slug: "barbare", nom: "Barbare", image: "Barbare.webp",
      type: "Capacites", specialite: "Corps à corps",
      roles: [
        { cat: "Dégâts", detail: "Corps à corps" },
        { cat: "Tank", detail: "Attire l'attention" }
      ],
      description: [
        "Le barbare est un guerrier sauvage, puisant sa force dans la rage. Issu de terres tribales ou de régions éloignées, il combat avec une puissance brute, capable de subir d'énormes dégâts tout en infligeant des coups dévastateurs. Sa rage lui confère une endurance surhumaine et une résistance aux blessures, faisant de lui un adversaire redoutable en mêlée. Le barbare préfère la force et l'instinct à la stratégie, se jetant dans la bataille avec fureur et détermination."
      ],
      passif: {
        nom: "Tu es à moi !",
        texte: ["Si un ennemi cherche à s'enfuir de la portée d'attaque du barbare, celui-ci peut effectuer une attaque en réaction sur le fuyard."]
      },
      biclasse: {
        nom: "Tu es un peu à moi !",
        texte: ["Si un ennemi cherche à s'enfuir de la portée d'attaque du barbare, celui-ci peut effectuer une attaque en réaction sur le fuyard, mais infligeant 50 % de dégâts en moins."]
      },
      pouvoirs: {
        titre: "Actions",
        liste: [
          { nom: "Enragement", cout: "{1} [1 CR]", texte: "Permet au joueur d'attaquer deux fois par tour pendant 10T, au prix de tous ses avantages en précision. Mais si le joueur n'inflige aucun dégât pendant son tour, il sera incapacité et immobilisé pendant 3T." },
          { nom: "Phéromones de guerrier", cout: "{2} [1 CR]", texte: "Une zone de 4 autour du joueur fait que tout ennemi s'y trouvant l'attaquera en priorité. Dure 3T." }
        ],
        notes: [SATIETE, GAIN_ACTIONS, LIBRE_ACTIONS]
      },
      precision: "Force",
      equipement: [
        { nom: "Marteau de combat [C]", lien: "../equipement/armes.html#marteau-de-combat" }
      ]
    },

    /* ============================= BARDE ============================= */
    {
      slug: "barde", nom: "Barde", image: "Barde.webp",
      type: "Ressource", specialite: "Bonus de groupe",
      roles: [
        { cat: "Bonus/Malus", detail: "Bonus de groupe" },
        { cat: "Soutien", detail: "Aide situationnelle" }
      ],
      description: [
        "Le barde est un artiste-magicien qui canalise la magie à travers la musique et les mots. Maître des récits et des performances, il inspire ses alliés et perturbe ses ennemis. Charismatique et polyvalent, il excelle dans la magie, les compétences sociales et le soutien en combat, faisant de lui un touche-à-tout capable d'influencer le cours des événements par l'art et la créativité."
      ],
      ressource: {
        nom: "Partitions",
        stat: "Charisme",
        paliers: [{ min: 12, valeur: 2 }, { min: 0, valeur: 1 }],
        recup: "la moitié du maximum à chaque court repos, +1 tous les 5T en combat",
        texte: [
          "Il utilise des partitions pour lancer ses compétences : elles reposent sur son charisme. Si le charisme est supérieur ou égal à 12, il aura 2 partitions ; s'il est inférieur, ce sera 1 partition.",
          "Les partitions sont ensuite gagnées tout au long de l'aventure, par la montée de niveau (voir règle de montée de niveaux, section « type ressource »).",
          "Le barde étant un musicien légendaire et un compagnon de choix, il récupère la moitié de son maximum de partitions à chaque court repos. En combat, grâce à sa détermination, il récupère une partition tous les 5T."
        ]
      },
      passif: {
        nom: "Accord parfait",
        texte: ["Quand le barde lance une compétence de bonus utilisant des partitions sur un allié, il lance un D6. Il pourra ensuite donner ce bonus à un nombre d'alliés selon le résultat du dé : 1 et 2 = 1 allié, 3 et 4 = 2 alliés, 5 et 6 = 3 alliés."]
      },
      biclasse: {
        nom: "Accord qui passe",
        texte: ["Quand le barde lance une compétence de bonus sur un allié, il lance un D4. Il pourra ensuite donner ce bonus à un nombre d'alliés selon le résultat du dé : 1 = 1 allié, 2 = 1 allié, 3 = 2 alliés, 4 = 2 alliés."]
      },
      pouvoirs: {
        titre: "Compétences",
        notes: [
          "Il possède 4 compétences au début de l'aventure : c'est à vous de les créer comme il vous chante, en respectant les catégories de la classe ainsi que sa spécialité.",
          GAIN_COMPETENCES,
          "Les compétences coûtent toutes 1 partition à l'usage en général, mais elles peuvent coûter davantage si elles sont trop fortes."
        ]
      },
      precision: "Charisme",
      equipement: [
        { nom: "Pelle guitare [C]", lien: "../equipement/armes.html#pelle-guitare" }
      ]
    },

    /* ============================= CLERC ============================= */
    {
      slug: "clerc", nom: "Clerc", image: "Clerc.webp",
      type: "Mana", specialite: "Malus de groupe",
      roles: [
        { cat: "Bonus/Malus", detail: "Malus de groupe" },
        { cat: "Soins", detail: "Protection" }
      ],
      description: [
        "Le clerc est un serviteur dévoué d'une divinité, canalisant le pouvoir divin pour protéger et soutenir son groupe. Il est souvent en première ligne pour protéger les combattants et repousser les créatures surnaturelles. Gardien spirituel et combattant, il incarne la volonté de sa divinité sur le champ de bataille."
      ],
      passif: {
        nom: "Prix de groupe",
        texte: ["Chaque malus appliqué à un ennemi touche aussi ses alliés dans un rayon de 2 autour de la cible."]
      },
      biclasse: {
        nom: "Prix de famille nombreuse",
        texte: ["Chaque malus appliqué à un ennemi touche aussi ses alliés dans un rayon de 1 autour de la cible."]
      },
      grimoire: {
        intro: "Le clerc a accès à un panel de sorts du « Grand Livre de Magie » :",
        famille: { nom: "Famille de Résistance", lien: LIVRE_MAGIE + "#famille=resistance" },
        sousFamilles: [
          { nom: "Sous-famille de lumière", lien: LIVRE_MAGIE + "#groupe=sous-famille-de-lumiere" },
          { nom: "Sous-famille de fumigène", lien: LIVRE_MAGIE + "#groupe=sous-famille-de-fumigene" },
          { nom: "Sous-famille de l'amour", lien: LIVRE_MAGIE + "#groupe=sous-famille-de-l-amour" }
        ],
        sorts: [
          { nom: "Soin mineur", lien: LIVRE_MAGIE + "#sort=soin-mineur" },
          { nom: "Transfert de dégâts", lien: LIVRE_MAGIE + "#sort=transfert-de-degats" },
          { nom: "Trompe la mort", lien: LIVRE_MAGIE + "#sort=trompe-la-mort" },
          { nom: "Plume", lien: LIVRE_MAGIE + "#sort=plume" },
          { nom: "Chloroforme", lien: LIVRE_MAGIE + "#sort=chloroforme" },
          { nom: "Lévitation légère", lien: LIVRE_MAGIE + "#sort=levitation-legere" },
          { nom: "Mad men", lien: LIVRE_MAGIE + "#sort=mad-men" }
        ],
        notes: [SORTS_PROPRES, GAIN_SORTS]
      },
      precision: "Sagesse",
      statMana: "Sagesse",
      equipement: [
        { nom: "Sceptre-Tintus [C]", lien: "../equipement/armes.html#sceptre-tintus" }
      ]
    },

    /* ============================= DRUIDE ============================ */
    {
      slug: "druide", nom: "Druide", image: "Druide.webp",
      type: "Mana", specialite: "Soin",
      roles: [
        { cat: "Soins", detail: "Soin" },
        { cat: "Invocateur", detail: "Transformation animale" }
      ],
      description: [
        "Le druide est un protecteur mystique de la nature, en symbiose avec les forces sauvages et les cycles du monde. Maître des éléments et de la magie naturelle, il peut invoquer des sorts de soins, de protection ou de contrôle du terrain. Le druide peut aussi se métamorphoser en animaux, utilisant les capacités de chaque forme pour s'adapter à diverses situations. Gardien des équilibres naturels, il veille à préserver la terre et combat ceux qui menacent les forces de la vie."
      ],
      passif: {
        nom: "Foufou de popopopo",
        texte: ["Quand une potion est utilisée, il a 40 % de chances qu'elle ne se vide pas, et les sorts de soin sont augmentés de 10 %."]
      },
      biclasse: {
        nom: "Fou de popo",
        texte: ["Quand une potion est utilisée, il a 20 % de chances qu'elle ne se vide pas, et les sorts de soin sont augmentés de 5 %."]
      },
      grimoire: {
        intro: "Le druide a accès à un panel de sorts du « Grand Livre de Magie » :",
        famille: { nom: "Famille de Soutien", lien: LIVRE_MAGIE + "#famille=soutien" },
        sousFamilles: [
          { nom: "Sous-famille du lecteur", lien: LIVRE_MAGIE + "#groupe=sous-famille-du-lecteur" },
          { nom: "Sous-famille des végétaux", lien: LIVRE_MAGIE + "#groupe=sous-famille-des-vegetaux" },
          { nom: "Sous-famille de terre", lien: LIVRE_MAGIE + "#groupe=sous-famille-de-terre" },
          // le livre écrit « du vent », pas « de vent »
          { nom: "Sous-famille du vent", lien: LIVRE_MAGIE + "#groupe=sous-famille-du-vent" }
        ],
        sorts: [
          { nom: "Plaque de fer", lien: LIVRE_MAGIE + "#sort=plaque-de-fer" },
          { nom: "Crush", lien: LIVRE_MAGIE + "#sort=crush" }
        ],
        notes: [SORTS_PROPRES, GAIN_SORTS]
      },
      lien: { href: "../regles.html#transformations", texte: "Voir la règle des transformations" },
      precision: "Sagesse",
      statMana: "Sagesse",
      equipement: [
        { nom: "Hachette [C]", lien: "../equipement/armes.html#hachette" }
      ]
    },

    /* ============================ GUERRIER =========================== */
    {
      slug: "guerrier", nom: "Guerrier", image: "Guerrier.webp",
      type: "Capacites", specialite: "Résistance",
      roles: [
        { cat: "Dégâts", detail: "Corps à corps" },
        { cat: "Tank", detail: "Résistance" }
      ],
      description: [
        "Solide comme une forteresse, le guerrier est l'incarnation de la discipline et de la maîtrise martiale. Spécialisé dans l'art de protéger ses alliés, il encaisse les coups que d'autres ne pourraient supporter et se tient toujours en première ligne. Armure lourde, bouclier ou arme à deux mains : il s'adapte à toutes les situations de combat rapproché.",
        "Le guerrier avance avec méthode et sang-froid. Ses techniques de défense lui permettent de résister longtemps face à plusieurs ennemis, et sa maîtrise du corps-à-corps lui assure une présence constante sur le champ de bataille.",
        "Véritable rempart vivant, le guerrier protège son groupe par sa ténacité et sa rigueur, transformant chaque assaut ennemi en une occasion de tenir encore plus fermement sa position."
      ],
      passif: {
        nom: "Toujours vivant, rassurez-vous",
        texte: ["Pour chaque 10 % de PV en moins, le guerrier gagne 5 % de résistance aux dégâts. Il possède aussi 5 % de résistance de base."]
      },
      biclasse: {
        nom: "Peut-être vivant, inquiétez-vous",
        texte: ["Pour chaque 10 % de PV en moins, le guerrier gagne 2,5 % de résistance aux dégâts. Il possède aussi 2,5 % de résistance de base."]
      },
      pouvoirs: {
        titre: "Actions",
        liste: [
          { nom: "Ta vie c'est ma vie", cout: "{4} [2 CR]", texte: "Transfère les dégâts d'un allié vers lui. Technique qui peut être utilisée en réaction quand un allié se fait attaquer." },
          { nom: "Tornade tactique", cout: "{2} [1 CR]", texte: "Le joueur effectue une attaque circulaire avec son arme équipée sur toute sa portée, et l'attaque sera en plus augmentée de 100 %." }
        ],
        notes: [SATIETE, GAIN_ACTIONS, LIBRE_ACTIONS]
      },
      precision: "Constitution",
      equipement: [
        { nom: "Épée [C]", lien: "../equipement/armes.html#epee" },
        { nom: "Bouclier léger [C]", lien: "../equipement/armes.html#bouclier-leger" }
      ]
    },

    /* ========================= NÉCROMANCIEN ========================== */
    {
      slug: "necromancien", nom: "Nécromancien", image: "Necromancien.webp",
      type: "Mana", specialite: "Invocations multiples",
      roles: [
        { cat: "Dégâts", detail: "Dégâts sur la durée" },
        { cat: "Invocateur", detail: "Invocations multiples" }
      ],
      description: [
        "Le nécromancien est un mage spécialisé dans la manipulation de la mort et des énergies sombres. Il utilise sa magie pour relever des morts-vivants, drainant la vie de ses ennemis et contrôlant des squelettes ou des zombies comme serviteurs. Bien que souvent redouté pour ses pratiques sinistres, le nécromancien maîtrise les secrets de la vie et de la mort, cherchant à percer les mystères de l'au-delà et à utiliser les forces occultes à son avantage."
      ],
      passif: {
        nom: "Amoureux de la mort",
        texte: ["Pour chaque invocation du nécromancien sur le plateau, le nécromancien gagne 5 % de dégâts."]
      },
      biclasse: {
        nom: "Kiffeur de cadavre",
        texte: ["Pour chaque invocation du nécromancien sur le plateau, le nécromancien gagne 2,5 % de dégâts."]
      },
      grimoire: {
        intro: "Le nécromancien a accès à un panel de sorts du « Grand Livre de Magie » :",
        // le livre écrit « Famille d'Esprit », pas « Famille de l'Esprit »
        famille: { nom: "Famille d'Esprit", lien: LIVRE_MAGIE + "#famille=esprit" },
        sousFamilles: [
          { nom: "Sous-famille de projection", lien: LIVRE_MAGIE + "#groupe=sous-famille-de-projection" },
          // le livre écrit « du poison », pas « de poison »
          { nom: "Sous-famille du poison", lien: LIVRE_MAGIE + "#groupe=sous-famille-du-poison" }
        ],
        sorts: [
          { nom: "Trompe la mort", lien: LIVRE_MAGIE + "#sort=trompe-la-mort" },
          { nom: "Mad men", lien: LIVRE_MAGIE + "#sort=mad-men" },
          { nom: "Empressement", lien: LIVRE_MAGIE + "#sort=empressement" },
          { nom: "Fumigène empoisonné", lien: LIVRE_MAGIE + "#sort=fumigene-empoisonne" }
        ],
        notes: [SORTS_PROPRES, GAIN_SORTS]
      },
      lien: { href: "../regles.html#invocations", texte: "Voir la règle des invocations" },
      precision: "Intelligence",
      statMana: "Intelligence",
      equipement: [
        { nom: "Faux [C]", lien: "../equipement/armes.html#faux" }
      ]
    },

    /* ============================ MAGICIEN =========================== */
    {
      slug: "magicien", nom: "Magicien", image: "Magicien.webp",
      type: "Mana", typeAffiche: "Polyvalent (mana)", specialite: "Polyvalent",
      roles: [{ cat: "Polyvalent", detail: "" }],
      description: [
        "Le magicien est un érudit de la magie, maîtrisant les arcanes à travers des études intensives et des grimoires anciens. Doté d'une vaste connaissance des sorts, il peut manipuler les éléments, créer des illusions et altérer la réalité à sa guise. Sa magie est incroyablement puissante mais nécessite préparation et finesse. En combat, le magicien utilise son intelligence pour lancer des sorts stratégiques, contrôlant le champ de bataille et infligeant des dégâts massifs, tout en restant à distance pour éviter les confrontations directes."
      ],
      passif: {
        nom: "Le mana c'est moi",
        texte: ["Il est capable de consommer sa sous-action pour lancer un D20 et ainsi récupérer le montant indiqué en PM."]
      },
      biclasse: {
        nom: "Le mana c'est un peu moi",
        texte: ["Il est capable de consommer sa sous-action pour lancer un D10 et ainsi récupérer le montant indiqué en PM."]
      },
      blocs: [
        {
          titre: "Sorts",
          texte: [
            "Le magicien est une classe unique : il ne peut pas créer de sort, mais il a accès à un large panel de sorts déjà écrits dans le Grand Livre de la Magie.",
            "Cependant, s'il le veut, le joueur peut choisir de se spécialiser dans un élément. S'il se spécialise, il perdra l'accès à tous les sorts des autres éléments du Grand Livre de la Magie, mais pourra en créer en rapport avec le sien. Se spécialiser vous donnera le statut de bi-classe, étant donné la singularité du magicien par rapport aux autres classes. Il vous sera donc impossible de choisir une seconde classe, et tous les malus s'appliqueront (à part le gain de mana réduit)."
          ]
        }
      ],
      elements: {
        titre: "Éléments",
        liste: [
          { nom: "Pyromancien", quoi: "feu" },
          { nom: "Sylvemancien", quoi: "végétaux" },
          { nom: "Hydromancien", quoi: "eau" },
          { nom: "Cryomancien", quoi: "glace" },
          { nom: "Explomancien", quoi: "explosion" },
          { nom: "Géomancien", quoi: "terre" },
          { nom: "Aéromancien", quoi: "vent" },
          { nom: "Électromancien", quoi: "foudre" }
        ],
        oublie: "Il peut aussi choisir de se spécialiser dans un élément oublié — c'est à vous de créer votre propre élément. Il suivra alors les mêmes règles que ses compères spécialisés, à l'exception qu'il devra créer, tout au début et en plus du reste, un sort d'attaque et un sort de création élémentaires, en respectant ces règles :",
        attaque: {
          titre: "Sort d'attaque élémentaire",
          paliers: [
            { palier: "Base", pm: "PM (40)", degats: "3D8 + un effet", zone: "Zone de 2" },
            { palier: "Niveau 1", pm: "PM (60)", degats: "3D10 + le même effet", zone: "Zone de 3" },
            { palier: "Niveau 2", pm: "PM (80)", degats: "3D12 + le même effet ainsi qu'un autre effet", zone: "Zone de 3" }
          ]
        },
        creation: {
          titre: "Sort de création élémentaire",
          texte: ["Nom : libre.", "Zone : libre.", "Effet : libre."]
        },
        apres: [
          "Effet sur les armes magiques : ⅓ de chance d'appliquer l'effet de l'attaque élémentaire.",
          "La création de sorts pour les magiciens spécialisés est basée sur le système des types mana : deux sorts au début, puis gain en montant de niveau (voir règle de montée de niveaux)."
        ]
      },
      important: ["Du fait de sa grande connexion avec la magie, le magicien peut uniquement manier des armes magiques."],
      variantes: {
        titre: "Voie",
        intro: "Le magicien tranche à la création : garder tout le Grand Livre, ou n'en garder qu'un élément mais pouvoir y écrire.",
        liste: [
          {
            nom: "Magicien polyvalent",
            note: "tout le Grand Livre, mais rien à soi",
            texte: ["Il puise dans l'intégralité du Grand Livre de la Magie, sans distinction d'élément. En contrepartie, il ne crée jamais aucun sort."],
            plus: ["Accès à tous les éléments du Grand Livre de la Magie", "Reste libre de prendre une seconde classe"],
            moins: ["Ne peut créer aucun sort"]
          },
          {
            nom: "Magicien spécialisé",
            note: "un seul élément, mais le sien",
            texte: ["Il choisit un élément — pyromancien, hydromancien, géomancien… ou un élément oublié qu'il invente — et n'en sort plus. En échange, il devient le seul magicien capable d'écrire ses propres sorts."],
            plus: ["Peut créer ses propres sorts, dans son élément", "Garde le gain de mana plein, malgré le statut de bi-classe"],
            moins: [
              "Perd l'accès à tous les autres éléments du Grand Livre",
              "Compte déjà comme un bi-classe : impossible de prendre une seconde classe",
              "Utilise le passif de bi-classe (D10) au lieu du passif classique (D20)"
            ],
            mods: { biclasseInterdit: true }
          }
        ]
      },
      /* Pas de bloc « grimoire » : le magicien n'a pas un panel de sorts mais
         le livre entier. Il n'a donc rien à relier ligne par ligne, d'où ce
         renvoi vers la couverture — le pendant de celui de l'hématomancien
         vers le Grand Livre Sanguin. */
      lien: { href: LIVRE_MAGIE, texte: "Ouvrir le Grand Livre de la Magie" },
      precision: "Intelligence",
      statMana: "Intelligence",
      equipement: [
        { nom: "Bâton de magie [C]", lien: "../equipement/armes.html#baton-de-magie" },
        { nom: "Épée magique [C]", lien: "../equipement/armes.html#epee-magique" }
      ],
      equipementChoix: true
    },

    /* ============================= ARCHER ============================ */
    {
      slug: "archer", nom: "Archer", image: "Archer.webp",
      type: "Capacites", specialite: "Longue distance",
      roles: [
        { cat: "Dégâts", detail: "Longue distance" },
        { cat: "Bonus/Malus", detail: "Zones d'effets" }
      ],
      description: [
        "L'archer est un expert du combat à distance, maîtrisant l'arc avec une précision mortelle. Grâce à sa rapidité et son agilité, il peut tirer des flèches à une cadence élevée tout en gardant ses ennemis à distance. L'archer utilise la portée à son avantage, frappant les cibles avant qu'elles ne puissent l'atteindre. Roi dans l'art du positionnement stratégique pour maximiser son efficacité, doté d'une excellente vision et de réflexes aiguisés, il excelle à frapper les points faibles, ce qui fait de lui un tireur redoutable dans n'importe quelle bataille."
      ],
      passif: {
        nom: "Arc à poulie",
        texte: ["+5 % de dégâts toutes les 3 cases, à partir de 8 cases de distance."]
      },
      biclasse: {
        nom: "Arc de chasse",
        texte: ["+5 % de dégâts toutes les 6 cases, à partir de 8 cases de distance."]
      },
      pouvoirs: {
        titre: "Actions",
        liste: [
          { nom: "Pluie de flèches", cout: "{2} [1 CR]", texte: "Envoie 12 flèches pour le prix d'une sur une zone de 4 de large. Si la flèche choisie a un effet de zone, celui-ci ne sera pas cumulé." },
          { nom: "Projectile transperçant", cout: "{2} [1 CR]", texte: "Le projectile transperce tous les ennemis sur son trajet ; pour chaque personne traversée, vous ajouterez 100 % de dégâts au suivant." }
        ],
        notes: [SATIETE, GAIN_ACTIONS, LIBRE_ACTIONS]
      },
      precision: "Dextérité",
      equipement: [
        { nom: "Arc [C]", lien: "../equipement/armes.html#arc" },
        { nom: "Carquois [C]", lien: "../equipement/armes.html#carquois", apres: "avec 25 flèches aléatoires dedans (vous pouvez utiliser le logiciel pour les générer, si pas assez de flèches sont données complétées avec des flèches basique supplémentaires)" }
      ]
    },

    /* =========================== OCCULTISTE ========================== */
    {
      slug: "occultiste", nom: "Occultiste", image: "Occultiste.webp",
      type: "Ressource", specialite: "Invocation unique",
      roles: [
        { cat: "Bonus/Malus", detail: "Malus monocible" },
        { cat: "Invocateur", detail: "Invocation unique" }
      ],
      description: [
        "L'occultiste est un adepte des forces obscures et interdites, capable d'invoquer des entités d'autres dimensions et de manipuler des énergies sombres. Maître des rituels occultes, il puise sa puissance dans des artefacts anciens et des grimoires interdits. Ses pouvoirs incluent l'invocation de créatures ténébreuses et la malédiction de ses ennemis. Cependant, son pacte avec des entités mystérieuses vient à un prix : il risque de perdre son âme s'il se laisse trop séduire par les démons, ou s'il ne remplit pas sa part du contrat."
      ],
      ressource: {
        nom: "Pactes",
        stat: "Charisme",
        paliers: [{ min: 12, valeur: 2 }, { min: 0, valeur: 1 }],
        recup: "la moitié du maximum à chaque court repos, +1 tous les 5T en combat",
        texte: [
          "Il utilise des pactes pour lancer ses compétences : ils reposent sur son charisme. Si le charisme est supérieur ou égal à 12, il aura 2 pactes ; s'il est inférieur, ce sera 1 pacte.",
          "Les pactes sont ensuite gagnés tout au long de l'aventure, par la montée de niveau (voir règle de montée de niveaux, section « type ressource »).",
          "L'occultiste étant un guerrier perfide et animé d'une soif de pouvoir infatigable, il récupère la moitié de son maximum de pactes à chaque court repos. En combat, grâce à sa malice, il récupère un pacte tous les 5T."
        ]
      },
      passif: {
        nom: "Vision des bas-fonds",
        texte: ["Si l'occultiste a son invocation dans une zone de 5 cases autour de lui, son invocation reçoit la faculté de descendre les PV max des ennemis. À chaque attaque, l'invocation fera baisser les PV max de la cible de 10 % (si les PV max sont plus bas que les PV, alors les PV seront juste en surplus)."]
      },
      biclasse: {
        nom: "Aperçu du fond",
        texte: ["Si l'occultiste a son invocation dans une zone de 5 cases autour de lui, son invocation reçoit la faculté de descendre les PV max des ennemis. À chaque attaque, l'invocation fera baisser les PV max de la cible de 5 % (si les PV max sont plus bas que les PV, alors les PV seront juste en surplus)."]
      },
      pouvoirs: {
        titre: "Compétences",
        notes: [
          QUATRE_COMPETENCES,
          GAIN_COMPETENCES,
          "Les compétences coûtent toutes 1 pacte à l'usage en général, mais elles peuvent coûter davantage si elles sont trop fortes."
        ]
      },
      important: [
        "! Contrat ! Attention, l'occultiste a passé un contrat avec un démon ou une entité (à vous de choisir) : en aucun cas il ne doit le briser, car sinon il perdra totalement sa capacité à utiliser des pactes. Il y perdra aussi quelque chose de précieux.",
        "Exemple — Contrat de vengeance : un contrat passé avec un démon vengeur, offrant de puissants pouvoirs à l'occultiste, mais en retour il doit tuer le plus haut prêtre de l'Église."
      ],
      lien: { href: "../regles.html#invocations", texte: "Voir la règle des invocations" },
      precision: "Charisme",
      equipement: [
        { nom: "Glaive [C]", lien: "../equipement/armes.html#glaive" }
      ]
    },

    /* ============================ PALADIN ============================ */
    {
      slug: "paladin", nom: "Paladin", image: "Paladin.webp",
      type: "Ressource", specialite: "Bonus monocible",
      roles: [
        { cat: "Dégâts", detail: "Polyvalent" },
        { cat: "Bonus/Malus", detail: "Bonus monocible" }
      ],
      description: [
        "Le paladin est un fier chevalier ayant prêté un serment qu'il honore de tout son être. Le serment pouvant porter sur beaucoup de sujets différents, il existe donc beaucoup de codes moraux différents chez cet être en armure. Il utilise la force que lui donne son serment pour faire des vœux, afin d'attaquer et de donner des avantages."
      ],
      ressource: {
        nom: "Vœux",
        stat: "Charisme",
        paliers: [{ min: 12, valeur: 2 }, { min: 0, valeur: 1 }],
        recup: "la moitié du maximum à chaque court repos, +1 tous les 5T en combat",
        texte: [
          "Il utilise des vœux pour lancer ses compétences : ils reposent sur son charisme. Si le charisme est supérieur ou égal à 12, il aura 2 vœux ; s'il est inférieur, ce sera 1 vœu.",
          "Les vœux sont ensuite gagnés tout au long de l'aventure, par la montée de niveau (voir règle de montée de niveaux, section « type ressource »).",
          "Le paladin étant un guerrier fier et un aventurier aguerri, il récupère la moitié de son maximum de vœux à chaque court repos. En combat, grâce à sa rigueur, il récupère un vœu tous les 5T."
        ]
      },
      passif: {
        nom: "Vœux vainqueurs",
        texte: ["À chaque vœu accordé pour donner un avantage, il applique aussi 10 % de dégâts en plus à la cible jusqu'à la fin du combat."]
      },
      biclasse: {
        nom: "Vœux gagnants",
        texte: ["À chaque vœu accordé pour donner un avantage, il applique aussi 5 % de dégâts en plus à la cible jusqu'à la fin du combat."]
      },
      pouvoirs: {
        titre: "Compétences",
        notes: [
          QUATRE_COMPETENCES,
          GAIN_COMPETENCES,
          "Les compétences coûtent toutes 1 vœu à l'usage en général, mais elles peuvent coûter davantage si elles sont trop fortes."
        ]
      },
      important: [
        "! Serment ! Attention, le paladin a prêté un serment (à vous de choisir) : en aucun cas il ne doit le briser, car sinon il perdra totalement sa capacité à utiliser des vœux. Il sera aussi fortement dénigré par les gens concernés par le serment.",
        "Exemple — Serment de sang : un serment fait envers la divinité Sanguinius afin de la servir et d'être son fidèle chevalier sur terre. En cas de blasphème envers Sanguinius, le serment est brisé, et il sera donc jugé par tous ceux qui la vénèrent."
      ],
      precision: "Charisme",
      equipement: [
        { nom: "Lance [C]", lien: "../equipement/armes.html#lance" }
      ]
    },

    /* ============================= RÔDEUR ============================ */
    {
      slug: "rodeur", nom: "Rôdeur", image: "Rodeur.webp",
      type: "Capacites", specialite: "Dompteur",
      roles: [
        { cat: "Invocateur", detail: "Dompteur" },
        { cat: "Soutien", detail: "Chasse" }
      ],
      description: [
        "Le rôdeur est un protecteur des créatures sauvages, spécialisé dans le lien avec les animaux. Grâce à sa compréhension profonde de la faune, il peut apprivoiser des bêtes puissantes qui deviennent ses alliées fidèles en combat. Ensemble, ils forment un duo redoutable : le rôdeur utilise son savoir et sa stratégie pour combattre aux côtés de son allié animal et protéger la nature qui les entoure."
      ],
      passif: {
        nom: "Dompteur sauvage",
        texte: ["Le rôdeur est accompagné de son fidèle animal ; selon l'animal, il aura des spécificités différentes (voir les catégories d'animaux)."]
      },
      biclasse: {
        nom: "Dompteur du dimanche",
        texte: ["Le rôdeur est accompagné de son fidèle animal ; selon l'animal, il aura des spécificités différentes (voir les catégories d'animaux), mais l'animal aura des statistiques réduites."]
      },
      pouvoirs: {
        titre: "Actions",
        liste: [
          { nom: "Échange animal", cout: "{4} [2 CR]", texte: "Il inverse sa place avec son animal." },
          { nom: "Piège à loup", cout: "{2} [1 CR]", texte: "Crée un piège caché sur 5 cases. Si un ennemi marche dedans, il sera immobilisé pendant 3T ; applique aussi l'effet saignement." }
        ],
        notes: [SATIETE, GAIN_ACTIONS, LIBRE_ACTIONS]
      },
      lien: { href: "../regles.html#animaux", texte: "Voir la règle des animaux" },
      precision: "Dextérité",
      equipement: [
        { nom: "Boomerang [C]", lien: "../equipement/armes.html#boomerang" }
      ]
    },

    /* ============================ ROUBLARD =========================== */
    {
      slug: "roublard", nom: "Roublard", image: "Roublard.webp",
      type: "Capacites", specialite: "Dégâts instantanés",
      roles: [
        { cat: "Dégâts", detail: "Instantané" },
        { cat: "Soutien", detail: "Discrétion" }
      ],
      description: [
        "Le roublard est un maître de la furtivité, de la ruse et de la précision. Expert en infiltration et en déguisement, il sait se fondre dans l'ombre pour surprendre ses ennemis avec des attaques sournoises dévastatrices. Agile et rapide, le roublard évite les confrontations directes, préférant frapper là où ça fait mal avant de disparaître. Ses compétences en désamorçage de pièges, en crochetage et en manipulation font de lui un spécialiste des opérations discrètes et un atout précieux pour son groupe dans les situations délicates."
      ],
      passif: {
        nom: "Attaque de l'ombre",
        texte: ["Il est la seule classe véritablement maîtresse des arts des voleurs, ce qui lui confère des jets avec avantage dans ceux-ci. Si le roublard attaque sans qu'aucun ennemi ne sache où il est précisément, il lance un D12 qu'il ajoute en tranches de 5 % de dégâts."]
      },
      biclasse: {
        nom: "Coup de l'ombre",
        texte: ["Il est la seule classe maîtresse des arts des voleurs, ce qui lui confère des jets sans malus dans ceux-ci. Si le roublard attaque sans qu'aucun ennemi ne sache où il est précisément, il lance un D6 qu'il ajoute en tranches de 5 % de dégâts."]
      },
      pouvoirs: {
        titre: "Actions",
        liste: [
          { nom: "Danse de la nuit", cout: "{1} [1 CR]", texte: "Prend 2T TTS à charger, mais permet d'avoir 3 attaques le tour d'après." },
          { nom: "Disparition de l'ombre", cout: "{2} [1 CR]", texte: "Se rend invisible jusqu'à ce qu'il inflige des dégâts ou que 2T soient passés ; il ne peut être touché par personne." }
        ],
        notes: [SATIETE, GAIN_ACTIONS, LIBRE_ACTIONS]
      },
      lien: { href: "../regles.html#arts-des-voleurs", texte: "Voir la règle des arts des voleurs" },
      precision: "Dextérité",
      equipement: [
        { nom: "Dague [C]", lien: "../equipement/armes.html#dague" }
      ]
    },

    /* ============================= MOINE ============================= */
    {
      slug: "moine", nom: "Moine", image: "Moine.webp",
      type: "Capacites", specialite: "Combat à mains nues",
      roles: [
        { cat: "Dégâts", detail: "Combat à mains nues" },
        { cat: "Bonus/Malus", detail: "Bonus sur soi" }
      ],
      description: [
        "Les moines sont des guerriers disciplinés qui sculptent leur corps et leur esprit à travers une maîtrise absolue des arts martiaux et de l'énergie intérieure. Contrairement aux combattants conventionnels qui comptent sur les armes, le moine puise sa puissance dans sa discipline, sa force et sa connexion avec le Ki, une énergie vitale qui circule en lui. Grâce à un entraînement rigoureux et à une méditation profonde, il est capable d'exploiter cette force pour décupler ses capacités physiques et spirituelles."
      ],
      passif: {
        nom: "Poings du dragon",
        texte: ["Il se bat uniquement à mains nues, mais inflige des dégâts à mains nues équivalant à sa force ; ensuite il prendra +7,5 % de dégâts à chaque montée de niveau."]
      },
      biclasse: {
        nom: "Poings du tigre",
        texte: ["Il se bat uniquement à mains nues, mais inflige des dégâts à mains nues équivalant à 75 % de sa force (si ce n'est pas un nombre rond, on arrondit au plus proche) ; ensuite il prendra +7,5 % de dégâts à chaque montée de niveau."]
      },
      pouvoirs: {
        titre: "Actions",
        liste: [
          { nom: "L'eau qui dort", cout: "{2} [1 CR]", texte: "En concentrant son Ki, le moine possède 2 actions par tour, et ce pendant 3T." },
          { nom: "Forte-paume", cout: "{3} [1 CR]", texte: "Il effectue un mouvement spécial avec sa paume, repoussant sa cible sur une distance de 2D4 tout en infligeant des dégâts ; ils seront au maximum de sa capacité. Si la cible est projetée contre un mur, cela ajoutera 50 % de dégâts en plus." }
        ],
        notes: [SATIETE, GAIN_ACTIONS, LIBRE_ACTIONS]
      },
      precision: "Force",
      equipement: [
        { nom: "Une moyenne potion de guérison", lien: "../equipement/potions.html#guerison" }
      ]
    },

    /* ========================== CARTOMANCIEN ========================= */
    {
      slug: "cartomancien", nom: "Cartomancien", image: "Cartomancien.webp",
      type: "Ressource", specialite: "Aléatoire",
      roles: [{ cat: "Polyvalent", detail: "" }],
      description: [
        "Dans l'ombre des tavernes enfumées comme sous les lustres des palais dorés, certains murmurent le nom des cartomanciens avec crainte et fascination. Ces mystiques du hasard ne manipulent ni l'acier des guerriers ni les arcanes rigides des mages érudits, mais un pouvoir plus insaisissable encore : celui du destin lui-même. Grâce à leurs cartes imprégnées de magie, ils tirent les fils du futur, influencent la chance et réécrivent le sort des batailles en un instant."
      ],
      ressource: {
        nom: "Pioches",
        stat: "Sagesse",
        paliers: [{ min: 14, valeur: 4 }, { min: 13, valeur: 3 }, { min: 12, valeur: 2 }, { min: 0, valeur: 1 }],
        recup: "la moitié du maximum à chaque court repos, +1 tous les 5T en combat",
        texte: [
          "Il utilise des pioches pour récupérer des cartes de tarot, qui servent ensuite à lancer ses compétences : les pioches reposent sur sa sagesse.",
          "Si la sagesse est inférieure à 12, ce sera 1 pioche. Si elle est égale à 12, il aura 2 pioches. Si elle est égale à 13, il aura 3 pioches. Si elle est supérieure ou égale à 14, il aura 4 pioches.",
          "Les pioches sont ensuite gagnées tout au long de l'aventure, par la montée de niveau (voir règle de montée de niveaux, section « type ressource »).",
          "Le cartomancien manipulant le destin au-delà de notre compréhension, il récupère la moitié de son maximum de pioches à chaque court repos. En combat, grâce à sa divination, il récupère une pioche tous les 5T."
        ]
      },
      passif: {
        nom: "La main du temps",
        texte: [
          "Les cartomanciens jouent leurs capacités grâce à un paquet de cartes. Il tire des cartes en consommant une pioche au début de son tour, puis il pourra utiliser la carte choisie pendant le tour. Si la carte n'est pas utilisée, elle disparaîtra à la fin du tour.",
          "Pour son premier tirage du combat, il tire 4 cartes puis il en choisit une, en remettant les autres dans le paquet et en mélangeant. Ensuite, pour chaque tirage, il tire 2 cartes au lieu de 4. Chaque carte a des effets définis différents, et le cartomancien ne connaît pas l'effet des cartes avant de les avoir utilisées au moins une fois."
        ]
      },
      biclasse: {
        nom: "Les doigts de la minute",
        texte: [
          "Les cartomanciens jouent leurs capacités grâce à un paquet de cartes. Il tire des cartes en consommant une pioche au début de son tour, puis il pourra utiliser la carte choisie pendant le tour. Si la carte n'est pas utilisée, elle disparaîtra à la fin du tour.",
          "Pour son premier tirage du combat, il tire 2 cartes puis il en choisit une, en remettant les autres dans le paquet et en mélangeant. Ensuite, pour chaque tirage, il tire 1 carte au lieu de 2. Chaque carte a des effets définis différents, et le cartomancien ne connaît pas l'effet des cartes avant de les avoir utilisées au moins une fois."
        ]
      },
      blocs: [
        {
          titre: "Amélioration de carte",
          texte: [
            "Le cartomancien ne crée pas de nouvelles cartes, mais il peut améliorer les siennes pour qu'elles deviennent plus puissantes. Chaque carte peut être améliorée deux fois ; les améliorations ne changeront pas l'effet, mais le rendront soit plus fort, soit le modifieront pour une meilleure variante.",
            "Il possède 4 améliorations de carte au début de l'aventure. Il peut choisir de les utiliser dès le début en prenant des cartes aléatoires et en les montant au niveau 1 au maximum, ou bien de les garder et de les utiliser une par une sur la carte de son choix à chaque repos.",
            "Il gagnera ensuite de nouvelles améliorations au fil de ses aventures ou en montant de niveau (voir règle de montée de niveaux : les améliorations de cartes remplacent les nouvelles compétences)."
          ]
        }
      ],
      lien: { href: "../magie/tarots.html", texte: "Voir les cartes de tarot" },
      precision: "Sagesse",
      equipement: [
        { nom: "Paquet de cartes [C]", lien: "../equipement/armes.html#paquet-de-cartes" }
      ]
    },

    /* ========================= HÉMATOMANCIEN ========================= */
    {
      slug: "hematomancien", nom: "Hématomancien", image: "Hematomancien.webp",
      type: "Mana", typeAffiche: "Mana (spécial)", specialite: "Dégâts polyvalents",
      roles: [
        { cat: "Dégâts", detail: "Polyvalent" },
        { cat: "Création", detail: "Sanguine" }
      ],
      description: [
        "L'hématomancien est un mage marginal, né sans accès au mana traditionnel. Refusant son sort, il a puisé dans sa propre chair pour y déterrer un autre pouvoir : le sang.",
        "Il puise son énergie vitale ou celle des autres pour nourrir sa magie. Son corps devient son grimoire, ses veines des canaux arcaniques. Chaque sort est un sacrifice, un échange de vie contre le pouvoir. L'hématomancie permet de blesser, de contrôler ou de façonner la chair. D'une simple hémorragie à l'animation de créatures sanglantes, ses applications sont aussi variées que terrifiantes.",
        "Mais ce pouvoir a un prix : épuisement, mutilations… ou soif de sang. Certains y perdent leur humanité, devenant des prédateurs masqués sous le manteau du mage."
      ],
      passif: {
        nom: "Sang de la veine",
        texte: [
          "Il peut stocker le sang prélevé sur les cadavres ou les ennemis saignants dans un espace occulte lié à lui. Cette réserve, équivalente à 75 % de ses PV max (augmentée de 5 % par niveau), lui permet de lancer ses sorts sans puiser dans sa propre vie. L'ouverture de cette réserve coûte 2 % de ses PV max par tour où elle est active.",
          "Il peut absorber du sang à chaque tour depuis une zone de 5 cases autour de lui, en lançant 1D8 : le résultat indique combien de tranches de 3 % des PV max de la cible sont ajoutées à la réserve. Seules les entités mortes ou affectées par le saignement peuvent être ciblées.",
          "N'utilisant pas le mana classique, il dépense des PV pour lancer ses sorts. Le coût est précisé dans son livre de sorts (les PV dépensés correspondent à 63 % du coût normal en PM). Il est le seul à manier la magie du sang."
        ]
      },
      biclasse: {
        nom: "Globule rouge du capillaire",
        texte: [
          "Il peut stocker le sang prélevé sur les cadavres ou les ennemis saignants dans un espace occulte lié à lui. Cette réserve, équivalente à 75 % de ses PV max (augmentée de 2,5 % par niveau), lui permet de lancer ses sorts sans puiser dans sa propre vie. L'ouverture de cette réserve coûte 2 % de ses PV max par tour où elle est active.",
          "Il peut absorber du sang à chaque tour depuis une zone de 5 cases autour de lui, en lançant 1D4 : le résultat indique combien de tranches de 3 % des PV max de la cible sont ajoutées à la réserve. Seules les entités mortes ou affectées par le saignement peuvent être ciblées.",
          "N'utilisant pas le mana classique, il dépense des PV pour lancer ses sorts. Le coût est précisé dans son livre de sorts (les PV dépensés correspondent à 77 % du coût normal en PM). Il est le seul à manier la magie du sang."
        ]
      },
      grimoire: {
        intro: "L'hématomancien a accès à tous les sorts du « Grand Livre Sanguin ».",
        notes: [
          "Il possède aussi 2 sorts spécifiques à sa classe au début de l'aventure : c'est à vous de les créer comme il vous chante, en respectant les catégories de la classe ainsi que sa spécialité.",
          GAIN_SORTS
        ]
      },
      lien: { href: "../magie/grimoire_sanguinolent.html", texte: "Ouvrir le Grand Livre Sanguin" },
      precision: "Constitution",
      statMana: null,          /* paie ses sorts en PV, pas en PM */
      equipement: [
        { nom: "Couteau de chasse [C]", lien: "../equipement/armes.html#couteau-de-chasse" }
      ]
    },

    /* =========================== APOTHICAIRE ========================= */
    {
      slug: "apothicaire", nom: "Apothicaire", image: "Apothicaire.webp",
      type: "Ressource", specialite: "Soin",
      roles: [
        { cat: "Soins", detail: "Soin" },
        { cat: "Soutien", detail: "Suppression et résistance aux effets" }
      ],
      description: [
        "L'apothicaire est un érudit des remèdes et un maître des décoctions. Là où les autres prient ou incantent, lui soigne par la science, les plantes et l'expérience. Grâce à ses connaissances en herboristerie, chimie et distillation, il concocte potions, baumes et extraits capables de soulager les douleurs, dissiper les afflictions ou fortifier ses alliés.",
        "Il n'est pas un combattant de front, mais un soutien indispensable sur le champ de bataille. Son habileté à contrer poisons, maladies ou altérations d'état fait de lui un atout vital lors des affrontements prolongés."
      ],
      ressource: {
        nom: "Décoctions",
        stat: "Intelligence",
        paliers: [{ min: 13, valeur: 3 }, { min: 0, valeur: 2 }],
        recup: "la moitié du maximum à chaque court repos, +1 tous les 5T en combat",
        texte: [
          "Il utilise des décoctions pour lancer ses compétences : elles reposent sur son intelligence. Si l'intelligence est supérieure ou égale à 13, il aura 3 décoctions ; si elle est inférieure, ce sera 2 décoctions.",
          "Les décoctions sont ensuite gagnées tout au long de l'aventure, par la montée de niveau (voir règle de montée de niveaux, section « type ressource »).",
          "L'apothicaire étant un pharmacien et un chimiste très efficace, il récupère la moitié de son maximum de décoctions à chaque court repos. En combat, grâce à sa fabrication rapide, il récupère une décoction tous les 5T."
        ]
      },
      passif: {
        nom: "Herboriste expérimenté",
        texte: [
          "La première utilisation d'une décoction sur un patient bénéficie d'une efficacité accrue de 50 %.",
          "L'apothicaire, grâce à sa connaissance des ingrédients rares, peut en acheter ou en récolter pour prévenir toute accoutumance à ses décoctions, ce qui permet de faire à nouveau bénéficier un allié du boost de la première fois.",
          "Combiner une plante spéciale à une décoction demande une action."
        ]
      },
      biclasse: {
        nom: "Herboriste du dimanche",
        texte: [
          "La première utilisation d'une décoction sur un patient bénéficie d'une efficacité accrue de 25 %.",
          "L'apothicaire, grâce à sa connaissance des ingrédients rares, peut en acheter ou en récolter pour prévenir toute accoutumance à ses décoctions, ce qui permet de faire à nouveau bénéficier un allié du boost de la première fois.",
          "Combiner une plante spéciale à une décoction demande une action."
        ]
      },
      pouvoirs: {
        titre: "Compétences",
        notes: [
          QUATRE_COMPETENCES,
          GAIN_COMPETENCES,
          "Les compétences coûtent toutes 1 décoction à l'usage en général, mais elles peuvent coûter davantage si elles sont trop fortes."
        ]
      },
      precision: "Intelligence",
      equipement: [
        { nom: "Paire de faucilles [C]", lien: "../equipement/armes.html#paire-de-faucilles" }
      ]
    },

    /* =========================== PNEUMA-CHIR ========================= */
    {
      slug: "pneuma-chir", nom: "Pneuma-chir", image: "Pneuma-chir.webp",
      type: "Capacites", specialite: "Lien",
      roles: [
        { cat: "Soutien", detail: "Lien" },
        { cat: "Soins", detail: "Soin" }
      ],
      description: [
        "Le Pneuma-chir est un chirurgien de l'invisible, un sculpteur d'âmes, un artisan du lien vital. Capable de manipuler les flux psychiques, les lignes de force intérieures ou les connexions d'essence, il agit directement sur la conscience, la vie et l'identité des êtres vivants.",
        "Ni mage ni médecin, il lit dans les êtres comme dans un livre ouvert, recoud les pensées brisées, transfère des points de force entre alliés ou relie temporairement les sorts, les blessures ou les émotions.",
        "Ses interventions sont souvent intangibles mais puissantes, agissant sur l'invisible avec une précision presque chirurgicale."
      ],
      passif: {
        nom: "Les lésions dangereuses !",
        texte: [
          "Le Pneuma-chir possède la faculté de lier son âme jusqu'à deux fois par CR. Pour créer un lien, il doit se trouver à une case de sa cible, et celle-ci ne doit pas lui être hostile. S'il choisit un personnage, il bénéficie alors de la moitié de ses passifs ; s'il s'agit d'un objet, il en retire un effet en rapport direct avec celui-ci. Chaque lien persiste pendant cinq tours.",
          "De plus, la première fois qu'il soigne un allié au cours d'un CR, un lien particulier se forme automatiquement : pendant trois tours, la moitié des dégâts subis par cet allié est transférée vers le Pneuma-chir, sans que l'effet ne s'applique dans l'autre sens."
        ]
      },
      biclasse: {
        nom: "Les lésions mortelles !",
        texte: [
          "Le Pneuma-chir possède la faculté de lier son âme une fois par CR. Pour créer un lien, il doit se trouver à une case de sa cible, et celle-ci ne doit pas lui être hostile. S'il choisit un personnage, il bénéficie alors de la moitié de ses passifs ; s'il s'agit d'un objet, il en retire un effet en rapport direct avec celui-ci. Chaque lien persiste pendant cinq tours.",
          "De plus, la première fois qu'il soigne un allié au cours d'un CR, un lien particulier se forme automatiquement : pendant trois tours, le quart des dégâts subis par cet allié est transféré vers le Pneuma-chir, sans que l'effet ne s'applique dans l'autre sens."
        ]
      },
      pouvoirs: {
        titre: "Actions",
        intro: ["Les actions du Pneuma-chir ont une portée de 20 cases au déploiement."],
        liste: [
          { nom: "Le fil rouge", cout: "{2} [1 CR]", texte: "Peut lier deux personnes entre elles pour une durée de cinq tours. Leurs points de vie sont alors additionnés et mis en commun, mais diminués de 25 %. Tant que ce lien est actif, si les points de vie communs tombent à 0, les deux personnages s'effondrent simultanément. Si, au contraire, le lien prend fin avant d'atteindre 0, chacun retrouve ses propres points de vie, ajustés en fonction du pourcentage restant de la vie commune." },
          { nom: "Les liaisons mortelles", cout: "{3} [1 CR]", texte: "Le Pneuma-chir peut relier deux de ses alliés situés à une distance maximale de quinze cases. Tant que le lien est actif, ils peuvent s'échanger des points de vie en utilisant une sous-action. Chaque transfert est limité à 16 % des points de vie de l'allié donneur. À chaque échange, la portée du lien se réduit de trois cases, jusqu'à un minimum d'une case. Cet effet dure cinq tours." },
          { nom: "Opération du corps et de l'âme", cout: "{2} [1 CR]", texte: "Pendant 3T en TDSA, chaque tour le Pneuma-chir lance 4D6 de soins et soigne les PV du même allié." }
        ],
        notes: [SATIETE, GAIN_ACTIONS, LIBRE_ACTIONS]
      },
      precision: "Constitution",
      equipement: [
        { nom: "Kunais [C]", lien: "../equipement/armes.html#kunais" }
      ]
    },

    /* ============================= CHAMAN ============================ */
    {
      slug: "chaman", nom: "Chaman", image: "Chaman.webp",
      type: "Ressource", specialite: "Invocation",
      roles: [
        { cat: "Invocateur", detail: "Invocations éphémères" },
        { cat: "Bonus/Malus", detail: "Malus groupé" }
      ],
      description: [
        "Le chaman est un maître des esprits, capable d'invoquer des créatures éphémères et de manipuler le champ de bataille grâce à ses malus. Il puise sa force dans sa sagesse et dans sa capacité à dialoguer avec le monde éthéré, utilisant des offrandes pour canaliser ses pouvoirs."
      ],
      ressource: {
        nom: "Offrandes",
        stat: "Sagesse",
        paliers: [{ min: 14, valeur: 4 }, { min: 13, valeur: 3 }, { min: 0, valeur: 2 }],
        /* le chaman est le seul à ne rien récupérer tous les 5T */
        recup: "par la moisson d'offrandes sur un cadavre, à chaque court repos — et rien tous les 5T, contrairement aux autres classes ressource",
        texte: [
          "Il utilise des offrandes pour lancer ses compétences : elles reposent sur sa sagesse. Si la sagesse est supérieure ou égale à 14, il aura 4 offrandes ; à 13, il aura 3 offrandes ; si elle est inférieure, ce sera 2 offrandes.",
          "Les offrandes sont ensuite gagnées tout au long de l'aventure, par la montée de niveau (voir règle de montée de niveaux, section « type ressource »).",
          "Le chaman dialoguant avec les esprits et utilisant les cadavres pour récolter des offrandes, il en récupère à chaque court repos en effectuant une moisson d'offrandes sur un cadavre (voir la moisson d'offrandes). En revanche, comparé aux autres classes ressource, il ne récupère pas d'offrande tous les 5T."
        ]
      },
      passif: {
        nom: "Portail des esprits",
        texte: ["Le chaman, grâce à ses fortes relations avec les esprits du monde éthéré, peut en invoquer. C'est avec ses différentes offrandes qu'il utilise ses pouvoirs : elles octroient des bénédictions en fonction de leur qualité. Pour acquérir ces offrandes, le chaman doit effectuer une moisson d'offrandes en utilisant une sous-action (voir la moisson d'offrandes)."]
      },
      biclasse: {
        nom: "Porte des esprits",
        texte: ["Le chaman, grâce à ses fortes relations avec les esprits du monde éthéré, peut en invoquer. C'est avec ses différentes offrandes qu'il utilise ses pouvoirs : elles octroient aussi des bénédictions en fonction de leur qualité. Pour acquérir ces offrandes, le chaman doit effectuer une moisson d'offrandes en utilisant une sous-action (voir la moisson d'offrandes)."]
      },
      pouvoirs: {
        titre: "Compétences",
        notes: [
          QUATRE_COMPETENCES,
          GAIN_COMPETENCES,
          "Les compétences coûtent toutes 1 offrande à l'usage en général, mais elles peuvent coûter davantage si elles sont trop fortes."
        ]
      },
      lien: [
        { href: "../regles.html#invocations", texte: "Voir la règle des invocations" },
        { href: "../regles.html#moisson-offrandes", texte: "Voir la règle de la moisson d'offrandes" }
      ],
      precision: "Sagesse",
      equipement: [
        { nom: "Katar [C]", lien: "../equipement/armes.html#katar" }
      ]
    },

    /* =========================== BASTIONISTE ========================= */
    {
      slug: "bastioniste", nom: "Bastioniste", image: "Bastioniste.webp",
      type: "Mana", specialite: "Protection",
      roles: [
        { cat: "Tank", detail: "Protection" },
        { cat: "Soutien", detail: "Création" }
      ],
      description: [
        "Le bastioniste est un maître de la construction magique, sculptant l'énergie brute pour ériger des remparts.",
        "Contrairement aux mages destructeurs, il façonne la magie pour protéger, isoler, absorber et dévier les assauts ennemis. Chaque bataille devient, pour lui, un chantier mouvant où murs, dômes et barrières apparaissent comme autant de forteresses instantanées.",
        "Puissant tank à distance et soutien défensif, il stabilise la ligne de front en contrôlant l'espace et en protégeant ses alliés grâce à ses créations. Ses structures peuvent bloquer des projectiles, renforcer des armures, détourner des attaques ou même servir de plateformes tactiques.",
        "Véritable architecte du chaos, il transforme le terrain pour que le combat tourne à l'avantage de son groupe. Là où il passe, un bastion se dresse."
      ],
      passif: {
        nom: "Cœur du bastion",
        texte: ["Quand il est à 3 cases d'une de ses créations, le bastioniste réduit de 20 % tous les dégâts pris par ses alliés dans un rayon de 3, et donne +30 % de PV à ses créations tant qu'il est à 3 cases."]
      },
      biclasse: {
        nom: "Cœur de la forteresse",
        texte: ["Quand il est à 3 cases d'une de ses créations, le bastioniste réduit de 10 % tous les dégâts pris par ses alliés dans un rayon de 3, et donne +15 % de PV à ses créations tant qu'il est à 3 cases."]
      },
      grimoire: {
        intro: "Le bastioniste a accès à un panel de sorts du « Grand Livre de Magie » :",
        // la restriction passe dans « apres » : elle n'appartient pas au nom visé
        famille: {
          nom: "Famille de Création", lien: LIVRE_MAGIE + "#famille=creation",
          apres: "(sauf création élémentaire)"
        },
        // la même restriction, en clair pour le filtre par classe du livre
        exclutGroupes: ["sous-famille-des-elementaires"],
        sousFamilles: [
          { nom: "Sous-famille de protection", lien: LIVRE_MAGIE + "#groupe=sous-famille-de-protection" },
          { nom: "Sous-famille d'armure", lien: LIVRE_MAGIE + "#groupe=sous-famille-d-armure" },
          { nom: "Sous-famille de projection", lien: LIVRE_MAGIE + "#groupe=sous-famille-de-projection" }
        ],
        sorts: [
          { nom: "Trompe la mort", lien: LIVRE_MAGIE + "#sort=trompe-la-mort" },
          { nom: "Transfert de dégâts", lien: LIVRE_MAGIE + "#sort=transfert-de-degats" },
          { nom: "Fumigène", lien: LIVRE_MAGIE + "#sort=fumigene" },
          // l'exception à la restriction ci-dessus : dans le livre, ce sort de
          // la sous-famille des élémentaires s'appelle simplement « Terre »
          { nom: "Création élémentaire de terre", lien: LIVRE_MAGIE + "#sort=terre" }
        ],
        notes: [SORTS_PROPRES, GAIN_SORTS]
      },
      precision: "Force",
      statMana: "Constitution",
      equipement: [
        { nom: "Le Mini Cracheur [C]", lien: "../equipement/armes.html#le-mini-cracheur" }
      ]
    }
  ]
};
