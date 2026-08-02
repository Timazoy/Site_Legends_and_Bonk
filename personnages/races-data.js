/* ==================================================================
   LES RACES DE LEGENDS & BONK
   C'est le SEUL fichier à modifier pour corriger ou ajouter une race.
   L'échelle des peuples (frise, toise, fiches) vit dans races.html et
   n'a pas besoin d'être touchée : elle s'adapte au contenu.

   Structure d'une race :
     {
       slug: "humain",              // identifiant d'URL, sans accent
       nom: "Humain",
       couleur: "#a07b46",          // teinte d'accent de la race
       image: "humain.webp",        // silhouette, dans
                                    // image-db/personnages/races/
                                    // (null tant que le dessin n'existe
                                    //  pas : la page trace alors une
                                    //  silhouette de remplacement, voir
                                    //  « forme »)
       forme: "humanoide",          // silhouette de remplacement :
                                    // humanoide | elance | trapu | massif
                                    // aile | reptile | cornu | bestial
                                    // informe | bloc
       taille: { min: 1.5, max: 2, texte: "1,50 m à 2,00 m" },
                                    // null si le document ne la donne pas :
                                    // la race est alors posée sur la toise
                                    // en pointillé, à hauteur humanoïde
       poids: "60 à 120 kg",        // facultatif
       longevite: "…",              // facultatif
       resume: "…",                 // une ligne, sous le nom
       description: ["…"],
       apparence: ["…"],
       caracteristiques: ["…"],
       important: ["…"],            // facultatif : encadré d'avertissement
       blocs: [ { titre:"…", texte:["…"] } ],        // facultatif
       sousTitre: "Sous-races",     // titre du bloc de variantes
       sousIntro: "…",              // facultatif
       sousRaces: [
         {
           id: "feu",               // facultatif : sert à la roue / aux liens
           nom: "Demi elfe",
           couleur: "#…",           // facultatif
           hybride: ["Humain", "Elfe"],   // facultatif : liseré double
           note: "…",               // facultatif : ligne d'apparence
           texte: ["…"],            // facultatif : prose de la variante
           plus:  ["Précision +1"], // pastilles vertes
           moins: ["Dégâts subis +10 %"],  // pastilles rouges
           capacites: [ { nom:"…", cout:"{1} [1 par CR]", texte:["…"] } ],
           transformation: { effets: ["…"] },   // garous
           stats: { force:17, … }   // onis : hexagone de statistiques
         }
       ],
       roue: { cycles: [ ["feu","vegetaux","eau"], … ] },
                                    // élémentari : chaque tableau est un
                                    // cycle où A est très efficace contre B
       rage: true,                  // garous : jauge de folie
       souffle: {                   // drakéides : le damier de la zone
         grille: ["XXX", ".X.", ".O."],   // X = touchée, O = le drakéide
         note: "…"
       },
       invocation: {                // tieffelins : les cartes de pacte
         regle: "…",                // la règle commune, au-dessus des cartes
         echelle: 150,              // le haut des jauges, en %
         demons: [ {
           nom: "Ravage", couleur: "#…", role: "Le fauve",
           jauges: [ { l:"PV", v:15, bonus:100 } ],  // en % du tieffelin ;
                                    // « bonus » = la valeur atteinte grâce
                                    // à la sous-race, en jauge fantôme
           portee: 2, precision: -2,              // precision facultative
           capacite: { nom:"…", cout:"{2}", texte:["…"] },
           zone: { rayon:6,                        // gabarit de la zone d'effet,
                                                   // mesurée en cercle comme la
                                                   // portée (règles, 16.3)
             paliers: [ { max:2, quoi:"…" } ] },   // du plus proche au plus loin
           d6: { colonne:"Styx", faces:[ { effet:"…", chance:"½", bonus:"⅔" } ] },
           pour: "Tieffelin du Tartar",           // la sous-race qui renforce
           bonus: "…"                             // ce qu'elle change
         } ]
       },
       moteurs: [ { id:"Capacites", texte:"…",        // onis
                    note: { pour:"Classe", texte:"…" } }, … ]  // note = l'exception
                                                    // d'une classe, en pied de carte
     }

   ⚠ Ne pas écrire de HTML dans les textes : ils sont échappés
   automatiquement.
   ================================================================== */

/* Phrases qui reviennent à l'identique d'une variante à l'autre. */
var TRANSFO_DUREE = "2T. Vous pouvez éventuellement rajouter +1T, mais avec ¼ de chance d'entrer dans un état de folie ; vous pouvez ensuite rallonger la transformation d'un tour de plus, cette fois avec ¾ de chance d'entrer en folie.";
var GT_MJ = "Le MJ déterminera ce que vous pouvez manger, combien cela vous rapportera en satiété, et le temps nécessaire pour le consommer.";

window.RACES = {

  liste: [

    /* ======================================================= HUMAIN */
    {
      slug: "humain",
      nom: "Humain",
      couleur: "#a07b46",
      image: "humain.webp",
      forme: "humanoide",
      taille: { min: 1.5, max: 2, texte: "1,50 m à 2,00 m" },
      poids: "60 à 120 kg",
      resume: "Aucune force, aucune faiblesse — et c’est justement sa force.",
      description: [
        "Les humains sont une race jeune et ambitieuse qui se distingue par sa résilience et sa capacité d’adaptation. Contrairement aux autres races, ils n’ont pas de caractéristiques physiques ou culturelles très marquées, mais cela même est leur plus grande force.",
        "Les humains sont souvent plus inventifs et curieux, prêts à prendre des risques pour explorer de nouveaux horizons."
      ],
      apparence: [
        "Les humains sont très diversifiés en termes d’apparence, de la couleur de leur peau à leur taille et corpulence. Ils mesurent en général entre 1,50 m et 2,00 m de haut et pèsent entre 60 et 120 kg.",
        "Leurs yeux peuvent être de n’importe quelle couleur, de l’ambre profond au gris clair, et leurs cheveux varient aussi bien en couleur qu’en texture. Ils peuvent avoir des cicatrices de batailles ou des tatouages rituels selon leurs origines culturelles ou leur vécu."
      ],
      caracteristiques: [
        "Les humains sont des généralistes, sans faiblesses ou forces notables spécifiques à leur race. Ils commencent avec un avantage de 3 points de statistique à attribuer en plus, ce qui en fait des personnages flexibles et bien équilibrés, capables de s’adapter à presque n’importe quel rôle."
      ],
      blocs: [
        {
          titre: "Métier",
          texte: ["Les humains peuvent avoir un métier, ce qui leur donnera un +3 (après l’attribution des points, cette fois) dans une statistique en rapport avec le métier."]
        }
      ]
    },

    /* ======================================================== ELFE */
    {
      slug: "elfe",
      nom: "Elfe",
      couleur: "#5b8a63",
      image: "elfe.webp",
      forme: "elance",
      taille: { min: 1.6, max: 2, texte: "1,60 m à 2,00 m" },
      longevite: "700 ans ou plus",
      resume: "La précision payée en fragilité.",
      description: [
        "Les elfes vivent bien plus longtemps que les autres races, pouvant atteindre 700 ans ou plus, ce qui leur confère une perspective unique sur le monde.",
        "Ils préfèrent la beauté, l’harmonie et l’art, et beaucoup d’entre eux choisissent de vivre dans des forêts ou des communautés isolées où la nature est préservée."
      ],
      apparence: [
        "Les elfes sont minces, élégants et souvent légèrement plus grands que les humains, mesurant entre 1,60 m et 2,00 m. Leur peau varie, allant de tons pâles et argentés à des tons cuivrés ou dorés.",
        "Leurs yeux, aux couleurs intenses, brillent légèrement, et leurs oreilles pointues sont leur trait le plus distinctif. Les elfes ont souvent des cheveux de couleur claire, bien qu’ils puissent avoir des traits plus sombres."
      ],
      caracteristiques: [
        "Les elfes sont gracieux et dotés d’une intelligence vive et de réflexes aiguisés. Ils possèdent un bonus de précision, avec une affinité pour les compétences en mêlée et en archerie.",
        "Leur longévité leur permet d’acquérir de vastes connaissances et compétences."
      ],
      sousTitre: "Sous-races",
      sousRaces: [
        {
          nom: "Elfe",
          plus: ["Précision +2 sur n’importe quelle attaque"],
          moins: ["Dégâts subis +20 %"]
        },
        {
          nom: "Haut elfe",
          plus: ["Précision +3 sur les attaques de longue distance"],
          moins: ["Dégâts subis +30 % au corps à corps"]
        },
        {
          nom: "Elfe noir",
          plus: ["Précision +3 sur les attaques de corps à corps"],
          moins: ["Dégâts subis +30 % à longue distance"]
        },
        {
          nom: "Demi elfe",
          hybride: ["Humain", "Elfe"],
          note: "Étant un mélange entre un humain et un elfe, il a des oreilles un peu moins grandes que ses confrères.",
          plus: ["Précision +1 sur n’importe quelle attaque", "+1 point de statistique à attribuer"],
          moins: ["Dégâts subis +10 %"]
        }
      ]
    },

    /* ======================================================== NAIN */
    {
      slug: "nain",
      nom: "Nain",
      couleur: "#a2703a",
      image: "nain.webp",
      forme: "trapu",
      taille: { min: 1.2, max: 1.2, texte: "environ 1,20 m" },
      poids: "75 à 100 kg",
      longevite: "plus de 350 ans",
      resume: "Lent, têtu, et capable de clouer un ennemi sur place.",
      description: [
        "Les nains sont une race ancienne, vivant plus de 350 ans, ce qui leur permet d’accumuler une grande expérience et expertise.",
        "Ils sont particulièrement loyaux à leur famille et leur clan, et ils chérissent des valeurs comme l’honneur, la persévérance et la maîtrise de soi. Leur culture est souvent centrée sur la forge, les pierres précieuses et la construction de citadelles indestructibles."
      ],
      apparence: [
        "Les nains sont petits, trapus et musclés, avec une taille moyenne d’environ 1,20 m et un poids de 75 à 100 kg. Leur visage est souvent encadré par une barbe épaisse, symbole de fierté et de statut.",
        "Leur peau peut être bronzée, foncée ou parfois grisâtre, et leurs cheveux vont du brun foncé au gris, souvent tressés ou décorés de bijoux de métal ou de pierres."
      ],
      caracteristiques: [
        "Les nains sont incroyablement têtus et sont doués pour les métiers manuels et physiques. Ils commencent avec une chance d’immobiliser leurs ennemis, ce qui les rend plus forts et difficiles à vaincre au combat.",
        "Leur affinité naturelle avec la pierre et le métal leur donne aussi une expertise dans les travaux de mine."
      ],
      sousTitre: "Sous-races",
      sousRaces: [
        {
          nom: "Nain",
          plus: ["15 % de chance d’appliquer l’effet incapacité en attaquant"],
          moins: ["Vitesse −1"]
        },
        {
          nom: "Nain des collines",
          plus: ["15 % de chance d’appliquer l’effet incapacité en attaquant", "Force +1"],
          moins: ["Vitesse −1", "Charisme −1"]
        },
        {
          nom: "Nain des montagnes",
          plus: ["15 % de chance d’appliquer l’effet incapacité en attaquant", "Force +2"],
          moins: ["Vitesse −1", "Intelligence −2"]
        },
        {
          nom: "Halfelin",
          hybride: ["Elfe", "Nain"],
          note: "Étant un mélange entre un elfe et un nain, il a des oreilles un peu en pointe et il est un peu plus grand que ses confrères.",
          plus: ["7,5 % de chance d’appliquer l’effet incapacité en attaquant", "Précision +1 sur n’importe quelle attaque"],
          moins: ["Déplacement −1", "Dégâts subis +10 %"]
        }
      ]
    },

    /* ========================================================= ORC */
    {
      slug: "orc",
      nom: "Orc",
      couleur: "#6d8a3f",
      image: "orc.webp",
      forme: "massif",
      taille: { min: 1.8, max: 2.1, texte: "1,80 m à 2,10 m" },
      resume: "Frappe fort — parfois sur lui-même.",
      description: [
        "Les orcs sont originaires de régions sauvages et inhospitalières, souvent caractérisées par des montagnes abruptes, des jungles profondes ou des plaines arides.",
        "Leur culture met en avant la survie par la force et la camaraderie, et ils sont réputés pour leur endurance exceptionnelle. Bien que certains voient les orcs comme des sauvages, ils suivent des codes d’honneur stricts et vénèrent leurs ancêtres."
      ],
      apparence: [
        "Les orcs sont imposants, mesurant en général entre 1,80 m et 2,10 m de haut, avec une musculature massive. Leur peau varie du gris pâle au vert foncé, leurs yeux sont souvent rougeâtres ou jaunes, et leurs canines inférieures sont proéminentes, ressemblant parfois à des défenses.",
        "Ils ont des traits de visage marqués et une posture qui traduit une force brute. Leur chevelure est généralement noire ou brune, souvent portée courte ou tressée pour éviter qu’elle ne gêne au combat."
      ],
      caracteristiques: [
        "Les orcs sont naturellement robustes et physiquement puissants, bénéficiant d’un bonus de dégâts ; mais par leur brutalité, ils peuvent faire des erreurs et ne peuvent utiliser que certains types d’armes.",
        "Leur culture les rend particulièrement habiles au combat et à la survie dans la nature."
      ],
      sousTitre: "Sous-races",
      sousIntro: "La brutalité se paie : à chaque attaque, lancez un D6 ; si vous tombez sur 1 ou 2, vous encaissez vous-même une part des dégâts que vous venez d’infliger. Cette part dépend de la sous-race.",
      sousRaces: [
        {
          nom: "Orc",
          plus: ["Dégâts +20 %"],
          moins: ["D6 : sur 1 ou 2, vous subissez 30 % des dégâts infligés", "Accées uniqument aux armes de corps à corps"]
        },
        {
          nom: "Demi orc",
          hybride: ["Humain", "Orc"],
          note: "Étant un mélange entre un humain et un orc, il a une teinte de peau plus claire et il est un peu plus petit que ses confrères.",
          plus: ["Dégâts +10 %", "+1 point de statistique à attribuer"],
          moins: ["D6 : sur 1 ou 2, vous subissez 15 % des dégâts infligés", "Accées uniqument aux armes de corps à corps et de lancer"]
        }
      ]
    },

    /* ==================================================== DRAKÉIDE */
    {
      slug: "drakeide",
      nom: "Drakéide",
      couleur: "#a83228",
      image: "drakeide.webp",
      forme: "reptile",
      taille: { min: 1.8, max: 2.1, texte: "1,80 m à 2,10 m" },
      resume: "Un souffle par lignée, et des écailles qui repoussent aussi les bienfaits.",
      description: [
        "Les drakéides sont des humanoïdes descendants des dragons, mais ils n’ont ni queue ni ailes. Leur héritage draconique se manifeste dans leur apparence, leurs capacités naturelles et leur affinité pour les éléments.",
        "Ils voient leur vie comme un parcours pour prouver leur valeur et honorer leur lignage."
      ],
      apparence: [
        "Les drakéides sont grands, généralement entre 1,80 m et 2,10 m, avec une silhouette puissante et une peau recouverte d’écailles colorées qui varient en fonction de leur lignée draconique (rouge, blanc, vert, noir, etc.).",
        "Leur tête est semblable à celle d’un dragon, avec un museau proéminent, des crocs acérés et des yeux perçants. Ils n’ont pas de cheveux, mais certains arborent des crêtes ou des cornes sur leur tête."
      ],
      caracteristiques: [
        "Les drakéides possèdent une attaque de souffle unique en fonction de leur lignée (feu, glace, foudre, explosion, folie ou poison), qui leur permet d’exhaler un souffle élémentaire pour blesser leurs ennemis.",
        "Leur lignée leur confère aussi une résistance à un type d’effet correspondant à leur souffle."
      ],
      important: [
        "Leurs épaisses écailles les rendent aussi moins sensibles à tous types de buff : ils ont une chance sur deux qu’ils échouent."
      ],
      /* le damier du docx, lu de haut en bas : X = case soufflée,
         O = le drakéide, . = case épargnée */
      souffle: {
        grille: [
          "XXX",
          "XXX",
          ".X.",
          ".X.",
          ".O."
        ],
        note: "Le souffle part droit devant sur deux cases, puis s’évase sur trois de large pour les deux dernières : huit cases touchées en tout."
      },
      sousTitre: "Lignées draconiques",
      sousRaces: [
        {
          nom: "Lignée blanche",
          couleur: "#a9c7d8",
          capacites: [{ nom: "Souffle de glace", cout: "{1} [1 par CR]", texte: ["Le souffle inflige 2D8 et applique l’effet congelé à chaque entité dans sa zone."] }],
          plus: ["N’est pas affecté par l’effet congelé"]
        },
        {
          nom: "Lignée verte",
          couleur: "#5f8f4a",
          capacites: [{ nom: "Souffle de poison", cout: "{1} [1 par CR]", texte: ["Le souffle inflige 2D8 et applique l’effet empoisonné à chaque entité dans sa zone."] }],
          plus: ["N’est pas affecté par l’effet empoisonné"]
        },
        {
          nom: "Lignée rouge",
          couleur: "#b03024",
          capacites: [{ nom: "Souffle de feu", cout: "{1} [1 par CR]", texte: ["Le souffle inflige 2D8 et applique l’effet brûlé à chaque entité dans sa zone."] }],
          plus: ["N’est pas affecté par l’effet brûlé"]
        },
        {
          nom: "Lignée jaune",
          couleur: "#c69f35",
          capacites: [{ nom: "Souffle de foudre", cout: "{1} [1 par CR]", texte: ["Le souffle inflige 2D8 et applique l’effet foudroyé à chaque entité dans sa zone."] }],
          plus: ["N’est pas affecté par l’effet foudroyé"]
        },
        {
          nom: "Lignée noire",
          couleur: "#3a332b",
          capacites: [{ nom: "Souffle d’explosion", cout: "{1} [1 par CR]", texte: ["Le souffle inflige 3D12 dégâts à chaque entité dans sa zone."] }],
          plus: ["N’est affecté qu’à 50 % par les dégâts dus aux explosions"]
        },
        {
          nom: "Lignée violette",
          couleur: "#7a4a9e",
          capacites: [{ nom: "Souffle de folie", cout: "{1} [1 par CR]", texte: ["Le souffle inflige 2D8 et applique l’effet folie à chaque entité dans sa zone."] }],
          plus: ["N’est pas affecté par l’effet folie"]
        }
      ]
    },

    /* =================================================== TIEFFELIN */
    {
      slug: "tieffelin",
      nom: "Tieffelin",
      couleur: "#8a3f7a",
      image: "tieffelin.webp",
      forme: "cornu",
      taille: { min: 1.5, max: 2, texte: "1,50 m à 2,00 m" },
      resume: "Trois héritages infernaux, trois profils opposés.",
      description: [
        "Les tieffelins sont les descendants de pactes passés avec des entités infernales, ou d’un ancêtre qui a eu des liens avec des diables ou des démons.",
        "Ce passé infernal leur confère un aspect physique qui les rend différents des autres races, marqués par leur connexion aux Royaumes inférieurs."
      ],
      apparence: [
        "Les tieffelins sont humanoïdes mais portent des traits démoniaques visibles : une peau aux teintes rouges, violettes ou bleu foncé, des cornes qui poussent en divers styles (droites, recourbées, torsadées), une queue longue et fine, et des yeux sans pupilles d’une couleur intense (rouge, blanc ou or).",
        "Leur présence charismatique peut être intimidante, et certains tieffelins dissimulent leurs traits pour éviter les regards hostiles."
      ],
      caracteristiques: [
        "Les tieffelins sont naturellement forts et charismatiques. Mais ayant grandi dans des milieux très différents, ils se sont adaptés : entre les tieffelins sophistiqués et intelligents venant du Styx, et les tieffelins puissants et craints du Tartar."
      ],
      sousTitre: "Sous-races",
      sousRaces: [
        {
          nom: "Tieffelin",
          plus: ["Force +1", "Charisme +1"],
          moins: ["Constitution −1", "Intelligence −1"]
        },
        {
          nom: "Tieffelin du Styx",
          plus: ["Intelligence +1", "Sagesse +1", "Charisme +1"],
          moins: ["Force −1", "Dextérité −1", "Constitution −1"]
        },
        {
          nom: "Tieffelin du Tartar",
          plus: ["Force +1", "Dextérité +1", "Constitution +1"],
          moins: ["Intelligence −1", "Sagesse −1", "Charisme −1"]
        }
      ],
      /* Les trois mini-démons. Leurs trois premières lignes sont des
         pourcentages de la statistique correspondante du tieffelin : elles
         partagent donc l'échelle des jauges, et chaque démon reçoit son
         bonus d'une sous-race différente. */
      invocation: {
        regle: "Les tieffelins peuvent invoquer un mini-démon. Il en existe trois, et vous choisissez lequel au moment de l’invocation. Une fois par CR : quand l’invocation apparaît, vous payez — et donc perdez — en PV actuels le nombre de PV max de l’invocation.",
        echelle: 150,
        demons: [
          {
            nom: "Ravage",
            couleur: "#9e3b2f",
            role: "Le fauve",
            jauges: [
              { l: "PV", v: 15 },
              { l: "Vitesse", v: 150 },
              { l: "Dégâts", v: 80, bonus: 100 }
            ],
            portee: 2,
            capacite: {
              nom: "Coups en cascade",
              cout: "{2}",
              texte: [
                "Vous foncez sur un ennemi situé à une portée de 2 de vous et vous l’attaquez. S’il y a ensuite un autre ennemi que vous n’avez pas déjà attaqué ce tour, vous pouvez lui foncer dessus et l’attaquer lui aussi, et ainsi de suite.",
                "Si, quand vous foncez sur votre premier adversaire, il n’y a pas la possibilité de foncer sur un autre, vous gagnez un style rapide sur l’attaque ainsi que ½ chance d’infliger un effet de faiblesse de 20 %."
              ]
            },
            pour: "Tieffelin du Tartar",
            bonus: "les dégâts de Ravage passent de 80 % à 100 %."
          },
          {
            nom: "Abri",
            couleur: "#3f6b8a",
            role: "Le rempart",
            jauges: [
              { l: "PV", v: 30 },
              { l: "Vitesse", v: 80 },
              { l: "Dégâts", v: 40 }
            ],
            portee: 3,
            precision: -2,
            capacite: {
              nom: "Dôme Abaddon",
              cout: "{1}",
              texte: [
                "Abri crée autour de lui une zone de 6 pendant 3T : les ennemis y dépensent davantage de déplacement, et d’autant plus qu’ils s’approchent d’Abri.",
                "La zone accorde aussi un effet de résistance de 5 % par case plus proche d’Abri (à 3 cases d’Abri, l’effet de résistance est donc de 15 %)."
              ]
            },
            /* Le surcoût de déplacement se lit sur le gabarit, comme la portée
               au chapitre 16.3 des règles : la zone est un cercle, pas un
               carré, donc les couronnes s'y dessinent arrondies. */
            zone: {
              rayon: 6,
              paliers: [
                { max: 3, quoi: "Déplacements triplés" },
                { max: 6, quoi: "Déplacements doublés" }
              ]
            },
            /* « tieffelin classique » est le mot du document : sans lui, on
               lirait « renforcé par le tieffelin », donc par n'importe lequel */
            pour: "Tieffelin classique",
            bonus: "la résistance du dôme passe de 5 % à 7 % par case."
          },
          {
            nom: "Déchéance",
            couleur: "#6b4a8a",
            role: "L’archer",
            jauges: [
              { l: "PV", v: 10 },
              { l: "Vitesse", v: 100 },
              { l: "Dégâts", v: 50 }
            ],
            portee: 10,
            precision: 2,
            capacite: {
              nom: "Flèches de disgrâce",
              cout: "{2}",
              texte: [
                "Crée et tire un projectile qui a un effet aléatoire selon le résultat d’un D6. La capacité n’est pas comptée comme utilisée si l’effet n’arrive pas à s’appliquer."
              ]
            },
            d6: {
              colonne: "Styx",
              faces: [
                { effet: "Empoisonné", chance: "½", bonus: "⅔" },
                { effet: "Incapacité", chance: "½", bonus: "⅔" },
                { effet: "Faiblesse de 25 %", chance: "½", bonus: "⅔" },
                { effet: "Saignement", chance: "½", bonus: "⅔" },
                { effet: "Amoureux", chance: "⅓", bonus: "½" },
                { effet: "Vol de vie de 10 PV", chance: "½", bonus: "⅔" }
              ]
            },
            pour: "Tieffelin du Styx",
            bonus: "chaque effet s’applique avec la probabilité de la colonne de droite."
          }
        ]
      }
    },

    /* ======================================================== PIAF */
    {
      slug: "piaf",
      nom: "Piaf",
      couleur: "#4a8a9e",
      image: "piaf.webp",
      forme: "aile",
      taille: { min: 1.5, max: 1.8, texte: "1,50 m à 1,80 m" },
      resume: "La seule race qui quitte le sol.",
      description: [
        "Les piafs sont des créatures ailées, à la fois majestueuses et exotiques, souvent fascinées par les hauteurs et par la notion de liberté.",
        "Bien qu’ils soient pacifiques et respectueux de l’équilibre naturel, ils sont farouchement protecteurs de leur territoire et peuvent devenir des guerriers féroces si nécessaire."
      ],
      apparence: [
        "Les piafs ressemblent à des oiseaux humanoïdes, mesurant en moyenne entre 1,50 m et 1,80 m de haut. Leur corps est couvert de plumes colorées variant selon leur origine et leur environnement, avec des teintes de brun, gris, blanc ou parfois des couleurs vives comme le rouge ou le bleu.",
        "Ils ont une tête d’oiseau. Leur dos comporte de larges ailes, et ils possèdent des pieds à griffes comme les oiseaux de proie."
      ],
      caracteristiques: [
        "La capacité la plus notable des piafs est leur aptitude à voler, leur permettant d’éviter des malandrins et d’attaquer depuis les airs."
      ],
      sousTitre: "Sous-races",
      sousRaces: [
        {
          nom: "Piaf",
          plus: ["Vol pendant 3T à chaque CR"],
          moins: ["Sagesse −1"]
        },
        {
          nom: "Albatros",
          plus: ["Vol pendant 5T à chaque CR", "Constitution +1"],
          moins: ["Sagesse −2", "Vitesse −1"]
        },
        {
          nom: "Hibou",
          plus: ["Vol pendant 3T à chaque CR", "Sagesse +1", "Discrétion +2", "Nyctalope : voit dans le noir sur 15 cases"],
          moins: ["Force −1", "Constitution −1"]
        },
        {
          nom: "Faucon",
          plus: ["Vol pendant 2T à chaque CR", "Perception +2", "Vitesse +1", "Déplacement +2"],
          moins: ["Sagesse −2", "Intelligence −2"]
        }
      ]
    },

    /* ================================================= ÉLÉMENTARI */
    {
      slug: "elementari",
      nom: "Élémentari",
      couleur: "#5a7a9e",
      image: null,                 /* dessin à faire */
      forme: "informe",
      taille: null,
      resume: "Huit origines qui se dominent en cercle.",
      description: [
        "Les élémentari sont des êtres mystérieux. Nous ignorons d’où ils viennent et comment ils apparaissent ; les rumeurs semblent dire que ce sont des êtres envoyés d’anciennes divinités maintenant oubliées.",
        "Mais une chose est sûre : ce sont des êtres complexes dotés d’une conscience semblable à celle d’un humain. Ils préfèrent explorer le monde et découvrir tous ses secrets à n’importe quoi d’autre. Leur curiosité débordante fait d’eux de parfaits aventuriers."
      ],
      apparence: [
        "Les élémentari sont des amas d’éléments prenant la forme d’une ombre humanoïde. Les éléments les composant varient selon leur origine, allant d’un être liquide à un être brumeux.",
        "En leur sein se trouve une sphère d’éléments purs : c’est leur cœur. C’est lui qui fait d’eux ce qu’ils sont."
      ],
      caracteristiques: [
        "Étant des amas d’éléments, ils sont particulièrement doués avec celui de leur origine, mais ils sont aussi plus vulnérables aux attaques de l’élément contraire."
      ],
      roue: {
        cycles: [
          ["feu", "vegetaux", "eau"],
          ["glace", "explosion", "terre", "vent", "foudre"]
        ]
      },
      sousTitre: "Origines",
      sousIntro: "Chaque origine allège ses propres sorts de 20 % de PM, gagne une particularité, et paie le tout par une faiblesse de caractéristique et un élément qui la domine.",
      sousRaces: [
        {
          id: "feu", nom: "Feu", couleur: "#c85a28",
          plus: ["Sorts de feu : −20 % de PM", "D4 : +2,5 % de dégâts par point à chaque attaque"],
          moins: ["Discrétion −4", "L’eau lui inflige +40 % de dégâts"]
        },
        {
          id: "eau", nom: "Eau", couleur: "#3f7d9e",
          plus: ["Sorts d’eau : −20 % de PM", "Quand un ennemi attaque, lancez une pièce : face, il a −2 en précision ; pile, −1"],
          moins: ["Force −2", "Les végétaux lui infligent +40 % de dégâts"]
        },
        {
          id: "vegetaux", nom: "Végétaux", couleur: "#5f8f4a",
          plus: ["Sorts de végétaux : −20 % de PM", "D6 : régénère ce pourcentage de PV chaque tour"],
          moins: ["Constitution −2", "Le feu lui inflige +40 % de dégâts"]
        },
        {
          id: "glace", nom: "Glace", couleur: "#8fc4dd",
          plus: ["Sorts de glace : −20 % de PM", "Au moment de se déplacer, lancez une pièce : face, +2 aux déplacements ; pile, +1"],
          moins: ["Dextérité −2", "La foudre lui inflige +40 % de dégâts"]
        },
        {
          id: "foudre", nom: "Foudre", couleur: "#c69f35",
          plus: ["Sorts de foudre : −20 % de PM", "Champ électromagnétique de 2 autour de lui : applique immobilisé à l’ennemi qui y entre"],
          moins: ["Discrétion −2", "Le vent lui inflige +40 % de dégâts"]
        },
        {
          id: "vent", nom: "Vent", couleur: "#8fae9c",
          plus: ["Sorts de vent : −20 % de PM", "À la fin de votre tour, lancez une pièce : face, vous volez d’une case de haut jusqu’à votre prochain tour"],
          moins: ["Force −2", "La terre lui inflige +40 % de dégâts"]
        },
        {
          id: "terre", nom: "Terre", couleur: "#8a6b3f",
          plus: ["Sorts de terre : −20 % de PM", "D4 : +2,5 % de résistance par point quand vous êtes attaqué"],
          moins: ["Dextérité −2", "L’explosion lui inflige +40 % de dégâts"]
        },
        {
          id: "explosion", nom: "Explosion", couleur: "#b0562a",
          plus: ["Sorts d’explosion : −20 % de PM", "Quand touché au corps à corps, D4 : renvoie 2,5 % de son attaque par point"],
          moins: ["Discrétion −4", "La glace lui inflige +40 % de dégâts"]
        }
      ]
    },

    /* ==================================================== GOLEMOVI */
    {
      slug: "golemovi",
      nom: "Golemovi",
      couleur: "#7a7266",
      image: null,                 /* dessin à faire */
      forme: "bloc",
      taille: null,
      resume: "Deux techniques de création, deux êtres opposés.",
      description: [
        "Les golemovi sont des golems dotés de conscience. Ils sont rares car la technique pour les créer a pratiquement été oubliée de tous.",
        "Certains sont âgés de milliers d’années et leurs ambitions sont assez énigmatiques, chacun ayant un but propre à lui-même qu’il a choisi ou qui lui a été attribué à sa création."
      ],
      apparence: [
        "Les golemovi ressemblent à leurs confrères les golems mais sont plus imposants et plus travaillés, arborant souvent de belles gravures ou pierres précieuses.",
        "Selon la méthode de création (par l’alchimie ou la magie), les connexions reliant les différentes parties peuvent être différentes, comme mécaniques ou juste flottantes."
      ],
      caracteristiques: [
        "Les deux types de golemovi sont bien différents malgré qu’ils se ressemblent : l’un est incapable de magie alors que l’autre a une grande affinité avec elle."
      ],
      sousTitre: "Création",
      sousRaces: [
        {
          nom: "Golemovi alchimique",
          plus: ["Constitution +2", "La constitution n’est pas limitée à 15 à la création : vous pouvez monter jusqu’à 20"],
          moins: ["Incapable d’utiliser de la magie", "Intelligence −1"]
        },
        {
          nom: "Golemovi magique",
          plus: ["90 PM de base au lieu de 75", "Sagesse +1"],
          moins: ["Constitution −2"]
        }
      ]
    },

    /* ===================================================== GOLIATH */
    {
      slug: "goliath",
      nom: "Goliath",
      couleur: "#6b7a8a",
      image: "goliath.webp",
      forme: "massif",
      taille: { min: 2.1, max: 2.4, texte: "2,10 m à 2,40 m" },
      poids: "130 à 180 kg",
      resume: "Encaisse en réaction, au jugé d’un D6.",
      description: [
        "Les goliaths sont des créatures impressionnantes aux origines mystérieuses, souvent associées aux géants et aux esprits des montagnes.",
        "Ils vivent en tribus nomades dans des endroits reculés, comme les sommets enneigés et les vallées rocheuses, où seules les races les plus résistantes peuvent survivre. La culture des goliaths valorise la force, le courage et l’autosuffisance, et ils respectent profondément la nature et les éléments."
      ],
      apparence: [
        "Les goliaths sont très grands et puissamment bâtis, mesurant entre 2,10 m et 2,40 m et pesant autour de 130 à 180 kg. Leur peau est de couleur pâle, marquée de taches et de bandes naturelles de différentes couleurs (noir, bleu, vert). Ces marques sont uniques à chaque goliath, semblables à des empreintes digitales.",
        "Ils sont généralement chauves, bien que certains portent des tatouages symboliques. Leurs yeux sont pâles, souvent bleu clair ou gris, leur donnant un regard perçant."
      ],
      caracteristiques: [
        "Les goliaths sont naturellement forts et endurants, avec la possibilité de réduire les dégâts, ce qui les rend redoutables en combat et bien adaptés aux tâches physiques.",
        "Leur culture leur a aussi appris à supporter la douleur et les privations, ce qui leur confère une endurance exceptionnelle."
      ],
      sousTitre: "Sous-races",
      sousIntro: "La réduction se lit sur un D6, par tranche de 10 % : si le dé donne 4, les dégâts sont réduits de 40 % pendant ce tour.",
      sousRaces: [
        {
          nom: "Goliath",
          plus: ["Réaction à 1 attaque par CR : D6, −10 % de dégâts par point"],
          moins: ["Dextérité −1"]
        },
        {
          nom: "Goliath des collines",
          plus: ["Réaction à 2 attaques par CR : D6, −10 % de dégâts par point"],
          moins: ["Dextérité −1", "Intelligence −1"]
        },
        {
          nom: "Goliath des montagnes",
          plus: ["Réaction à 2 attaques par CR : D6, −10 % de dégâts par point", "Constitution +2"],
          moins: ["Dextérité −2", "Sagesse −2"]
        }
      ]
    },

    /* ======================================================= GAROU */
    {
      slug: "garou",
      nom: "Garou",
      couleur: "#8a6b3a",
      image: null,                 /* dessin à faire */
      forme: "bestial",
      taille: null,
      resume: "L’instinct à la place de la tête, et la folie au bout.",
      description: [
        "Les garous sont une race mi-humanoïde mi-animale se caractérisant par l’instinct animal. La rage animale leur permet de passer outre les limitations de leur corps humain et de se rapprocher de leur partie animale.",
        "Ils vivent souvent en marge de la société moderne, conservant leur tribu et leur meute pour les garous les plus sociaux."
      ],
      apparence: [
        "L’apparence des garous change selon leur espèce mais la base est toujours humanoïde, avec parfois des caractéristiques animales comme des oreilles, des cornes, des bois, une queue, des plumes.",
        "Ces caractéristiques ne sont pas toujours visibles : elles peuvent être cachées par les garous. Par contre, lors de leur transformation transcendantale, ils reviennent quasiment à un état bestial et dépassent leur esprit humanoïde."
      ],
      caracteristiques: [
        "Leur transformation transcendantale leur permet de passer outre les limitations de leur corps humanoïde et de se rapprocher de leur partie animale ; cependant, s’ils usent trop de cet état, ils pourraient entrer dans un état de folie."
      ],
      important: [
        "Les garous n’ont pas de sagesse ni d’intelligence comme les autres races : ils possèdent l’instinct animal, qui rassemble les deux.",
        "Les garous ont 14 points de compétence au lieu de 19 pour les autres classes."
      ],
      rage: true,
      sousTitre: "Sous-races",
      sousIntro: "Toutes les sous-races partagent la même transformation : {1} [1 par CR]. " + TRANSFO_DUREE,
      sousRaces: [
        {
          nom: "Canidé",
          plus: ["Perception +2", "Force +1"],
          moins: ["Précision −1", "Charisme −2"],
          transformation: {
            effets: [
              "Perception +50 %", "Dégâts +30 %",
              "Vous pouvez analyser précisément un ennemi, deux fois",
              "Les attaques ont ⅓ de chance d’appliquer un saignement, passivement"
            ]
          }
        },
        {
          nom: "Ursidae",
          plus: ["Force +2", "Constitution +1"],
          moins: ["Discrétion −1", "Précision −2"],
          transformation: {
            effets: [
              "Dégâts +50 %", "Résistance +30 %",
              "Vous pouvez attaquer sur une ligne horizontale de 3, deux fois",
              "⅓ de chance de renvoyer 50 % des dégâts pris en réaction à chaque attaque reçue, passivement"
            ]
          }
        },
        {
          nom: "Pachyderme",
          plus: ["Constitution +2", "Instinct +1"],
          moins: ["Perception −1", "Discrétion −2"],
          transformation: {
            effets: [
              "Résistance +50 %", "Mana +30 %",
              "Vous pouvez renvoyer 50 % des dégâts pris en réaction quand vous êtes attaqué, deux fois",
              "Quand vous lancez un sort, ⅓ de chance que sa zone d’effet soit plus grande de 2, passivement (à appliquer après avoir choisi où lancer le sort)"
            ]
          }
        },
        {
          nom: "Cervidé",
          plus: ["Instinct +2", "Vitesse +1"],
          moins: ["Constitution −1", "Perception −2"],
          transformation: {
            effets: [
              "Mana +50 %", "Vitesse +30 %",
              "Quand vous lancez un sort, vous pouvez agrandir sa zone d’effet de 2, deux fois",
              "Vos sauts ont 2 cases de base qui s’ajoutent au résultat du dé"
            ]
          }
        },
        {
          nom: "Ornithurae",
          plus: ["Vitesse +2", "Perception +1"],
          moins: ["Charisme −1", "Constitution −2"],
          transformation: {
            effets: [
              "Vitesse +50 %", "Perception +30 %",
              "Vous pouvez vous donner la possibilité de vous déplacer 2 fois ce tour, deux fois",
              "En consommant votre sous-action, vous pouvez essayer d’analyser un ennemi avec ⅓ de chance de réussite"
            ]
          }
        }
      ]
    },

    /* ================================================ GRAILLE-TOUT */
    {
      slug: "graille-tout",
      nom: "Graille-Tout",
      couleur: "#b07c2f",
      image: null,                 /* dessin à faire */
      forme: "humanoide",
      taille: null,
      resume: "Aussi vieux que le monde, et toujours affamé.",
      description: [
        "Les graille-tout forment une race pratiquement aussi ancienne que le monde lui-même. Ils ont vu le monde changer maintes et maintes fois, mais sont toujours restés fidèles à eux-mêmes et à leur but simple : manger."
      ],
      apparence: [
        "Les graille-tout sont des êtres bien particuliers. Profondément pacifistes depuis la nuit des temps, ils ont évolué pour éviter les conflits avec les espèces plus récentes.",
        "À l’origine, les graille-tout ressemblaient à de petits « monstres » faits de leur nourriture favorite, dotés d’une immense bouche prenant presque toute la place sur leur visage, capable de s’ouvrir à plus de 90°.",
        "Aujourd’hui, les graille-tout ont adopté l’apparence des autres espèces qui peuplent le monde, afin de se fondre dans la masse et éviter les ennuis. Seule leur bouche demeure inchangée : anormalement large, elle peut toujours s’ouvrir entièrement."
      ],
      caracteristiques: [
        "Comme leur nom l’indique, les graille-tout sont capables de consommer une grande variété de choses inhabituelles. Il existe deux types principaux : les minéraux, qui se nourrissent exclusivement de matières d’origine minérale (fer, pierre, diamant…), et les végétaux, qui consomment tout ce qui est d’origine végétale ou animale non carnée (plantes, bois, cuir…)."
      ],
      important: [
        "Aucune variante n’est capable de manger la nourriture destinée aux autres races, ni les plats de l’autre sous-type de graille-tout."
      ],
      sousTitre: "Sous-races",
      sousRaces: [
        {
          nom: "Graille-Tout Végétal",
          texte: ["Ils peuvent manger tout ce qui est d’origine végétale ou faunique non carnée.", GT_MJ],
          plus: ["Satiété de 30", "Dextérité +1"],
          moins: ["Charisme −2"]
        },
        {
          nom: "Graille-Tout Minéral",
          texte: ["Ils peuvent manger tout ce qui est d’origine minérale et naturelle.", GT_MJ],
          plus: ["Satiété maximale de 25", "Force +1"],
          moins: ["Sagesse −2"]
        }
      ]
    },

    /* ===================================================== KROAKOA */
    {
      slug: "kroakoa",
      nom: "Kroakoa",
      couleur: "#4a8a5a",
      image: "kroakoa.webp",
      forme: "reptile",
      taille: { min: 1.8, max: 2.2, texte: "1,80 m à 2,20 m" },
      resume: "Une morsure et des écailles par sous-race.",
      description: [
        "Les kroakoa sont des créatures écailleuses, à la fois grandioses et tropicales, souvent fascinées par les profondeurs aqueuses et la perception des autres.",
        "Ils sont très territorialistes et protecteurs : ce sont de très farouches guerriers, aussi bons en repérage qu’en combat."
      ],
      apparence: [
        "Les kroakoa ressemblent à des reptiles humanoïdes, mesurant en moyenne entre 1,80 m et 2,20 m de haut. Leur corps est couvert d’écailles colorées variant selon leur origine et leur environnement, avec des teintes de vert tirant souvent vers l’orangé et le marron, des couleurs pour se camoufler dans leur environnement.",
        "Ils ont une tête de reptile, leurs mains sont larges et palmées avec de larges griffes."
      ],
      caracteristiques: [
        "Chaque sous-race a ses spécialités, mais ils ont tous une morsure et des écailles bien spécifiques à eux."
      ],
      sousTitre: "Sous-races",
      sousRaces: [
        {
          nom: "Kameleon",
          capacites: [
            { nom: "Invisibilité", cout: "{1} [1 par CR]", texte: ["Pour rester invisible, il faut réussir un check à la fin de son tour. Le premier tour, le check est de 5, puis chaque nouveau tour il augmente de 3."] },
            { nom: "Coup de langue", cout: "{1} [1 par CR]", texte: ["Avec une portée de 10, ce coup applique l’effet désarmé à la cible."] }
          ],
          plus: ["Ses écailles l’immunisent à l’effet incapacité", "Discrétion +2"],
          moins: ["Constitution −3", "Force −2"]
        },
        {
          nom: "Varan komodo",
          capacites: [
            { nom: "Toxine", cout: "{1} [1 par CR]", texte: ["Transmise par sa morsure, elle inflige 1 % des PV max en dégâts à la cible. Cette toxine double à chaque tour jusqu’à se stabiliser au 5ᵉ tour (16 %) et elle dure jusqu’à la fin du combat."] }
          ],
          plus: ["Les écailles du varan le rendent insensible au poison", "Perception +2"],
          moins: ["Vitesse −2", "Dextérité −2"]
        },
        {
          nom: "Krokodile",
          capacites: [
            {
              nom: "Morsure puissante", cout: "{2} [2 par LR]",
              texte: [
                "Elle applique un effet de saignement à la cible et lui endommage un membre. Pour savoir lequel, il faut lancer un D4 :",
                "1 — sa main droite, ce qui rend impossible d’utiliser la main 1.",
                "2 — sa main gauche, ce qui rend impossible d’utiliser la main 2.",
                "3 ou 4 — la jambe respective est endommagée : la vitesse est divisée par deux et il devient compliqué de rester debout après une attaque, donnant ⅛ de chance de tomber au sol quand la cible attaque."
              ]
            }
          ],
          plus: ["Les écailles du krokodile lui octroient une insensibilité au saignement", "Force +2", "Constitution +2"],
          moins: ["Vitesse −2", "Intelligence −2", "Précision −2"]
        }
      ]
    },

    /* ========================================================= ONI */
    {
      slug: "oni",
      nom: "Oni",
      couleur: "#8a3a4a",
      image: "oni.webp",
      forme: "cornu",
      taille: { min: 2, max: 3, texte: "2,00 m à 3,00 m" },
      resume: "Six lignées, six profils déjà écrits.",
      description: [
        "Les oni sont une race ancienne issue des forces primordiales. Leur peuple, au fil des âges, s’est scindé en différentes lignées spécialisées, afin d’optimiser la survie et l’efficacité de leur société.",
        "Ils vivent dans de vastes cités appelées Arc-en-Ville, des lieux où chaque oni se voit attribuer un rôle précis selon sa lignée. La cohésion du groupe et la spécialisation de chacun sont au cœur de leur culture."
      ],
      apparence: [
        "Les oni sont des humanoïdes imposants, mesurant généralement entre 2 et 3 mètres de haut. Leur morphologie peut être aussi bien massive et musclée que fine et agile. Leurs traits, souvent androgynes, confèrent à leur visage une beauté étrange, à la fois troublante et inquiétante.",
        "Sur leur front poussent deux cornes lisses, longues de trente à cinquante centimètres, qui constituent l’un de leurs signes distinctifs les plus reconnaissables. Leur regard se distingue également : leurs yeux sombres possèdent des pupilles noires, tandis que le blanc prend la teinte propre à leur lignée. Leurs cheveux, le plus souvent longs et texturés, s’accordent souvent à cette coloration singulière.",
        "À ces traits viennent s’ajouter des caractéristiques plus discrètes mais tout aussi marquantes : de longues oreilles pointues et de petites dents acérées, dont certaines dépassent parfois légèrement la lèvre. L’ensemble confère aux oni une allure à la fois majestueuse, intimidante et résolument hors du commun."
      ],
      caracteristiques: [
        "Les oni sont des êtres profondément spécialisés : dès leur naissance, leur lignée définit déjà leur futur rôle et leurs aptitudes. Contrairement à d’autres peuples, ils n’ont pas le choix de leur orientation, car leur essence même est prédestinée.",
        "Ainsi, les caractéristiques de chaque oni sont naturellement orientées et adaptées à sa lignée, comme si leur destinée avait été écrite avant même leur premier souffle."
      ],
      important: [
        "Leurs points de statistique sont déjà pré-remplis en fonction de leur lignée.",
        "Ils ne peuvent pas avoir de bi-classe."
      ],
      moteurs: [
        { id: "Capacites", nom: "Capacités", texte: "Récupère l’équivalent d’un CR d’une capacité en consommant 4 points de satiété au lieu de 5." },
        { id: "Ressource", nom: "Ressource", texte: "Récupère une ressource tous les 4T en combat au lieu de 5T." },
        {
          id: "Mana", nom: "Mana", texte: "Récupère 6 PM par tour en combat au lieu de 5 PM.",
          note: { pour: "Hématomancien", texte: "chaque tranche absorbée sur le 1D8 vaut 4 % des PV max de la cible au lieu de 3 %." }
        }
      ],
      sousTitre: "Lignées",
      sousIntro: "Chaque lignée arrive avec ses six statistiques déjà réparties : 17 dans sa spécialité, 7 dans son point faible.",
      sousRaces: [
        { nom: "Kijin", titre: "l’Oni rouge de la force", couleur: "#b03024", stats: { force: 17, intelligence: 7, dexterite: 9, sagesse: 9, constitution: 12, charisme: 12 } },
        { nom: "Shuryō", titre: "l’Oni jaune de la dextérité", couleur: "#c69f35", stats: { force: 9, intelligence: 12, dexterite: 17, sagesse: 9, constitution: 12, charisme: 7 } },
        { nom: "Jōkon", titre: "l’Oni marron de la constitution", couleur: "#7a4326", stats: { force: 12, intelligence: 9, dexterite: 12, sagesse: 7, constitution: 17, charisme: 9 } },
        { nom: "Gakuen", titre: "l’Oni bleu de l’intelligence", couleur: "#3f6b9e", stats: { force: 7, intelligence: 17, dexterite: 12, sagesse: 12, constitution: 9, charisme: 9 } },
        { nom: "Shūgen", titre: "l’Oni vert de la sagesse", couleur: "#4a8a5a", stats: { force: 9, intelligence: 12, dexterite: 9, sagesse: 17, constitution: 7, charisme: 12 } },
        { nom: "Enenra", titre: "l’Oni violette du charisme", couleur: "#7a4a9e", stats: { force: 12, intelligence: 9, dexterite: 7, sagesse: 12, constitution: 9, charisme: 17 } }
      ]
    }

  ]
};
