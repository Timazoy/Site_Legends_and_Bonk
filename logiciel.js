// --- Raretés ---
const c = "c";
const sc = "sc";
const r = "r";
const sr = "sr";
const e = "e";
const se = "se";

//Grande catégories armes
const acd = "acd" //arme courte distance
const amd = "amd" //arme moyenne distance
const ald = "ald" //arme longue distance
const bou = "bou" //bouclier
const bat = "bat" //bâton magique
const ani = "ani" //Objet animal

//petites catégories armes
const cl = "cl" //arme classique
const pa = "pa" //petite arme
const la = "la" //arme de lancer
const lo = "lo" //arme loudre

//Catégories spéciales
const ta = "ta" //talismans
const ma = "ma" //arme magique
const mu = "mu" //musicals
const me = "me" //medicals

//catégories armures et objets divers
const ale = "ale" //armure légère
const amo = "amo" //armure moyenne
const alo = "alo" //armure lourde
const fle = "fle" //flèches
const pot = "pot" //potion

// Foonction random entre deux entier compris
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Génération d'enchantements ---
function ench(rar) {
  let enchfinal = "";
  let nombreEnch = 0;

  switch (rar) {
    case "c":
      break
    case "sc":
      break
    case "r":
      nombreEnch = rand(1, 100) <= 15 ? 1 : 0; /* 15% de chance d'avoir 1 enchantement */
      break;

    case "sr":
      nombreEnch = rand(1, 100) <= 20 ? 1 : 0; /* 20% de chance d'avoir 1 enchantement */
      break;

    case "e":
      nombreEnch = rand(1, 100) <= 33 ? 1 : 0; /* 33% de chance d'avoir 1 enchantement */
      break;

    case "se":
      for (let i = 0; i < 2; i++) { /* 50% de chance d'avoir 1 enchantements mais fait 2 fois*/
        if (rand(1, 100) <= 50) nombreEnch++;
      }
      break;

    default:
      return "mauvaise entrée";
  }

  for (let i = 0; i < nombreEnch; i++) {
    let n = rand(1, 8);
    let enchants = ["Vent", "Foudre", "Feu", "Force", /*liste des enchantements dispo*/
      "Agilité", "Temps", "Résistance",
      "Vitesse", "Illusion"];
    if (i == 1) {
      enchfinal += " & "
    }
    enchfinal += enchants[n];
  }

  if (enchfinal == "") {
    return "Pas d'enchantements"
  }
  else { return enchfinal; }
}

// --- Génération de rareté et d'enchantement en fonction de min et max ---
// C
function C(rar) {
  let res;
  let n;

  switch (rar) {
    case "sc":
      res = rand(1, 101) <= 66 ? "c" : "sc";
      break;
    case "r":
      n = rand(1, 102);
      res = n <= 45 ? "c" : n <= 79 ? "sc" : "r"; /*Correspond à res = "c" si n<=45, sinon si n<=79 (donc entre 46 et 79) alors res ="sc", et enfin si c'est aucun res = "r"*/
      break;
    case "sr":
      n = rand(1, 103);
      res = n <= 38 ? "c" : n <= 68 ? "sc" : n <= 88 ? "r" : "sr";
      break;
    case "e":
      n = rand(1, 104);
      res = n <= 35 ? "c" : n <= 62 ? "sc" : n <= 81 ? "r" : n <= 95 ? "sr" : "e";
      break;
    case "se":
      n = rand(1, 105);
      res = n <= 33 ? "c" : n <= 59 ? "sc" : n <= 76 ? "r" :
        n <= 89 ? "sr" : n <= 98 ? "e" : "se";
      break;
  }
  return [res, ench(res)];
}

//SC
function SC(rar) {
  let res;
  let n;

  switch (rar) {
    case "r":
      res = rand(1, 101) <= 60 ? "sc" : "r";
      break;
    case "sr":
      n = rand(1, 102);
      res = n <= 47 ? "sc" : n <= 78 ? "r" : "sr";
      break;
    case "e":
      n = rand(1, 103);
      res = n <= 41 ? "sc" : n <= 68 ? "r" : n <= 89 ? "sr" : "e";
      break;
    case "se":
      n = rand(1, 104);
      res = n <= 37 ? "sc" : n <= 62 ? "r" : n <= 81 ? "sr" :
        n <= 94 ? "e" : "se";
      break;
  }
  return [res, ench(res)];
}

//R
function R(rar) {
  let res;
  let n;

  switch (rar) {
    case "sr":
      res = rand(1, 101) <= 56 ? "r" : "sr";
      break;
    case "e":
      n = rand(1, 102);
      res = n <= 44 ? "r" : n <= 79 ? "sr" : "e";
      break;
    case "se":
      n = rand(1, 104);
      res = n <= 38 ? "r" : n <= 68 ? "sr" : n <= 88 ? "e" : "se";
      break;
  }
  return [res, ench(res)];
}

//SR
function SR(rar) {
  let res;
  let n;

  switch (rar) {
    case "e":
      res = rand(1, 101) <= 56 ? "sr" : "e";
      break;
    case "se":
      n = rand(1, 102);
      res = n <= 47 ? "sr" : n <= 79 ? "e" : "se";
      break;
  }
  return [res, ench(res)];
}

//E
function E() {
  let res = rand(1, 101) <= 58 ? "e" : "se";
  return [res, ench(res)];
}

//SE n'existe pas car il suffit d'appeler "SE",ench("se").

//fonction pour faire un random entre une rareté min et max.
function loot(minrar, maxrar) {
  if (minrar === maxrar) return [maxrar, ench(maxrar)];

  if (minrar === "c") return C(maxrar);
  if (minrar === "sc") return SC(maxrar);
  if (minrar === "r") return R(maxrar);
  if (minrar === "sr") return SR(maxrar);

  return E();
}

// dictionnaire des armes
const armes = {
  //Armes courtes distances classiques
  "Épée": ["acd", "cl", "x", "c", "se"],
  "Katana": ["acd", "cl", "x", "r", "se"],
  "Rapière": ["acd", "cl", "x", "sc", "e"],
  "Cimeterre": ["acd", "cl", "x", "sc", "se"],
  "Nunchaku": ["acd", "cl", "x", "c", "sr"],
  "Tomahawk": ["acd", "cl", "x", "c", "sr"],
  "Parapluie": ["acd", "cl", "x", "sc", "e"],
  "Lame de sang": ["acd", "cl", "x", "r", "se"],
  "Épée daab": ["acd", "cl", "x", "sc", "e"],
  "Khépesh": ["acd", "cl", "x", "r", "se"],
  //... Petite armes
  "Couteau de boucher": ["acd", "pa", "x", "c", "r"],
  "Marteau": ["acd", "pa", "x", "c", "r"],
  "Dague": ["acd", "pa", "x", "c", "se"],
  "Griffes": ["acd", "pa", "x", "sc", "e"],
  "Glaive": ["acd", "pa", "x", "c", "se"],
  "Scie à métaux": ["acd", "pa", "x", "r", "e"],
  "Batinette en bois": ["acd", "pa", "x", "c", "sr"],
  "Waki-zashi": ["acd", "pa", "x", "r", "se"],
  "Lame de tungstène": ["acd", "pa", "x", "c", "e"],
  "Katar": ["acd", "pa", "x", "c", "e"],
  //... ... Talismans
  "Corne de barbare": ["acd", "pa", "ta", "r", "se"],
  "Recueil de poésie du barde": ["acd", "pa", "ta", "r", "se"],
  "Bannière du guerrier": ["acd", "pa", "ta", "r", "se"],
  "Longue vue de l'archer": ["acd", "pa", "ta", "r", "se"],
  "Dague sacrificielle de l'occultiste": ["acd", "pa", "ta", "r", "se"],
  "Texte sacré du paladin": ["acd", "pa", "ta", "r", "se"],
  "Sifflet de dressage du roôdeur": ["acd", "pa", "ta", "r", "se"],
  "Gant de velours de roublard": ["acd", "pa", "ta", "r", "se"],
  "Chapelet du moine": ["acd", "pa", "ta", "r", "se"],
  "Le paquet de carte du cartomancien": ["acd", "pa", "ta", "r", "se"],
  "Herbiers de l'apothicaire": ["acd", "pa", "ta", "r", "se"],
  "L'aiguille à coudre du pneuma-chir": ["acd", "pa", "ta", "r", "se"],
  "Couteau d'éviscération du chaman": ["acd", "pa", "ta", "r", "se"],
  //... Lancer
  "Hachette": ["acd", "la", "x", "c", "e"],
  "Paire de faucille": ["acd", "la", "x", "c", "e"],
  "Couteau de lancer": ["acd", "la", "x", "sc", "e"],
  "Couteau de chasse": ["acd", "la", "x", "c", "r"],
  //... Lourdes
  "Fléaux": ["acd", "lo", "x", "c", "sr"],
  "Masse d'armes": ["acd", "lo", "x", "c", "e"],
  "Masse en métal": ["acd", "lo", "x", "c", "sc"],
  "Grande scie à métaux": ["acd", "lo", "x", "sc", "e"],
  "Batte en bois": ["acd", "lo", "x", "c", "e"],
  //Armes moyenne distance classiques
  "Hallebarde": ["amd", "cl", "x", "sc", "e"],
  "Faux": ["amd", "cl", "x", "c", "se"],
  "Bâton de combat": ["amd", "cl", "x", "c", "sr"],
  "Marteau de combat": ["amd", "cl", "x", "c", "sr"],
  "Lance de joute": ["amd", "cl", "x", "r", "se"],
  "Aiguille": ["amd", "cl", "x", "c", "se"],
  "Perche-lance": ["amd", "cl", "x", "sr", "se"],
  "La guisarme": ["amd", "cl", "x", "r", "se"],
  "Fourche-lance": ["amd", "cl", "x", "c", "se"],
  "Sceptre-tintus": ["amd", "cl", "x", "c", "se"],
  //... Lancer
  "Trident": ["amd", "la", "x", "r", "se"],
  "Lance": ["amd", "la", "x", "c", "se"],
  "Chaine blade": ["amd", "la", "x", "r", "se"],
  "Harpon": ["amd", "la", "x", "c", "se"],
  //... Lourdes
  "Claymore large": ["amd", "lo", "x", "c", "e"],
  "Labrys": ["amd", "lo", "x", "r", "se"],
  "Épée à deux mains": ["amd", "lo", "x", "r", "se"],
  "Hache de nain": ["amd", "lo", "x", "c", "e"],
  "Marteau propulseur": ["amd", "lo", "x", "sc", "e"],
  "Sang-battant": ["amd", "lo", "x", "sc", "e"],
  // Longue distance classiques
  "Arc": ["ald", "cl", "x", "c", "se"],
  "Carquoi": ["ald", "cl", "x", "c", "se"],
  "Kunais": ["ald", "cl", "x", "c", "e"],
  "Bolas": ["ald", "cl", "x", "c", "sc"],
  "Boomerang": ["ald", "cl", "x", "c", "sr"],
  "Chakram": ["ald", "cl", "x", "c", "se"],
  "Canne à pêche": ["ald", "cl", "x", "c", "se"],
  "Arbalète": ["ald", "cl", "x", "r", "se"],
  "Shuriken géant": ["ald", "cl", "x", "sc", "se"],
  "Javelot": ["ald", "cl", "x", "sc", "se"],
  "Lance pierre": ["ald", "cl", "x", "c", "se"],
  "Paquet de cartes": ["ald", "cl", "x", "c", "e"],
  //Armes magiques
  "Épée magique": ["acd", "cl", "ma", "c", "se"],
  "Dague magique": ["acd", "pa", "ma", "c", "se"],
  "Épée à dents magique": ["acd", "lo", "ma", "r", "se"],
  "Lance magique": ["amd", "cl", "ma", "c", "se"],
  "Hache magique": ["amd", "lo", "ma", "r", "se"],
  "Bouclier magique": ["bou", "cl", "ma", "c", "se"],
  "Cracheur énergétique": ["ald", "cl", "ma", "c", "sr"],
  "Disperseur luminique": ["ald", "cl", "ma", "c", "se"],
  "Mousquet baïonnette": ["ald", "cl", "ma", "sc", "e"],
  "Lumino-désoudeur": ["ald", "cl", "ma", "r", "se"],
  "Le mini cracheur": ["ald", "pa", "ma", "c", "sr"],
  //Bâtons magiques
  "Bâton de magie": ["bat", "x", "ma", "c", "se"],
  "Bâton de soutien": ["bat", "x", "ma", "r", "se"],
  "Bâton d'action": ["bat", "x", "ma", "r", "se"],
  "Bâton de résistance": ["bat", "x", "ma", "r", "se"],
  "Bâton de déplacement": ["bat", "x", "ma", "r", "se"],
  "Bâton de furtivité": ["bat", "x", "ma", "r", "se"],
  "Bâton de l'esprit": ["bat", "x", "ma", "r", "se"],
  "Bâton flamboyant": ["bat", "x", "ma", "r", "se"],
  "Bâton glacé": ["bat", "x", "ma", "r", "se"],
  "Bâton foudroyant": ["bat", "x", "ma", "r", "se"],
  "Bâton empoisonné": ["bat", "x", "ma", "r", "se"],
  "Bâton explosif": ["bat", "x", "ma", "r", "se"],
  "Bâton aquatique": ["bat", "x", "ma", "r", "se"],
  "Bâton éolien": ["bat", "x", "ma", "r", "se"],
  "Bâton terrestre": ["bat", "x", "ma", "r", "se"],
  "Bâton végétale": ["bat", "x", "ma", "r", "se"],
  "Bâton de création": ["bat", "x", "ma", "r", "se"],
  "Bâton sanguinolent": ["bat", "x", "ma", "r", "se"],
  "Bâton des éléments oubliées": ["bat", "x", "ma", "r", "se"],
  //Armes musicales
  "La luth hache": ["acd", "cl", "mu", "r", "se"],
  "Pelle guitard": ["amd", "cl", "mu", "c", "se"],
  "Maracas piquant": ["ald", "cl", "mu", "c", "r"],
  "Pifano sarbacane": ["ald", "cl", "mu", "c", "sr"],
  "Lyree arbalète": ["ald", "cl", "mu", "sr", "se"],
  "Arc harpe": ["ald", "cl", "mu", "c", "se"],
  "Bouclier tambourin": ["bou", "cl", "mu", "c", "se"],
  //Armes médicales
  "Épée lambique": ["acd", "cl", "me", "c", "se"],
  "Lance'xactrice": ["amd", "la", "me", "r", "se"],
  "Arc fruitier": ["ald", "cl", "me", "c", "se"],
  "Fiole de lancer": ["ald", "cl", "me", "c", "se"],
  "Bouclier cucurbite": ["bou", "cl", "me", "c", "se"],
  //Boucliers
  "Bouclier léger": ["bou", "cl", "x", "sc", "e"],
  "Bouclier": ["bou", "cl", "x", "c", "se"],
  "Bouclier mirroir": ["bou", "cl", "x", "r", "e"],
  "Bouclier lourd": ["bou", "cl", "x", "r", "se"],
  "Bouclier du berserker": ["bou", "cl", "x", "r", "e"],
  "Bouclier vortex": ["bou", "cl", "x", "c", "se"],
  "Bouclier absorbant": ["bou", "cl", "x", "sc", "e"],
  "Bouclier piquant": ["bou", "cl", "x", "c", "se"],
  //Objet animal
  "Griffes métalliques": ["ani", "x", "x", "r", "e"],
  "Carapace en métal": ["ani", "x", "x", "r", "e"],
  "Ailes de fer": ["ani", "x", "x", "r", "e"],
  "Griffes dorées": ["ani", "x", "x", "r", "e"],
  "Carapace en or": ["ani", "x", "x", "r", "e"],
  "Ailes d'or": ["ani", "x", "x", "r", "e"]
}

function getArmes(GrandeCategorie, PetiteCategorie, CatégorieSpéciales, RaretéMin, RaretéMax) {
  rar = {
    c: 1,
    sc: 2,
    r: 3,
    sr: 4,
    e: 5,
    se: 6
  };

  it = 0

  rarfinal = loot(RaretéMin, RaretéMax)

  if (CatégorieSpéciales == "x") {
    while (it < 100000) {
      n = rand(0, Object.keys(armes).length - 1);
      choix = Object.keys(armes)[n];
      if (armes[choix][0] == GrandeCategorie) {
        if (armes[choix][1] == PetiteCategorie || PetiteCategorie == "x") {

          if
            (rar[armes[choix][3]] <= rar[rarfinal[0]] && rar[armes[choix][4]] >= rar[rarfinal[0]]) {
            //Check si rareté générée est compatible avec l’arme
            return [choix, rarfinal]; //Loot ou trouve une autre arme qui correspond
          }
        }
      }
      it += 1;
    }
  }


  else {
    while (it < 100000) {
      n = rand(0, Object.keys(armes).length - 1);
      choix = Object.keys(armes)[n];
      if (armes[choix][2] == CatégorieSpéciales) {
        if
          (rar[armes[choix][3]] <= rar[rarfinal[0]] && rar[armes[choix][4]] >= rar[rarfinal[0]]) {
          //Check si rareté générée est compatible avec l’arme
          return [choix, rarfinal]; //Loot ou trouve une autre arme qui correspond
        }
      }
      it += 1;
    }
  }
  return { error: "Aucune arme trouvée avec ces critères ou la rareté " + rarfinal[0] };
}

armures = {
  //Armures légères
  "Casque léger": ["ale", "c", "sr"],
  "Cuirasse légère": ["ale", "c", "sr"],
  "Jambière légère": ["ale", "c", "r"],
  "Le chèche du désert": ["ale", "c", "sr"],
  "Cape du désert": ["ale", "c", "sr"],
  "Jupe du désert": ["ale", "c", "sr"],
  "Cape magique discrète": ["ale", "c", "se"],
  //Armures moyennes
  "Casque": ["amo", "sc", "e"],
  "Cuirasse": ["amo", "sc", "e"],
  "Jambière": ["amo", "sc", "sr"],
  "Casque isolant": ["amo", "c", "e"],
  "Cuirasse isolante": ["amo", "c", "e"],
  "Jambière isolante": ["amo", "c", "sr"],
  //Armures lourdes
  "Casque lourd": ["alo", "c", "se"],
  "Cuirasse lourde": ["alo", "c", "se"],
  "Jambière lourde": ["alo", "c", "se"],
  "Casque à cornes de fourrure": ["alo", "sc", "e"],
  "Plastron de fourrure": ["alo", "sc", "e"],
  "Jambière de fourrure": ["alo", "sc", "e"],
  "Casque berserker": ["alo", "sc", "e"],
  "Plastron berserker": ["alo", "sc", "e"],
  "Jambière berserker": ["alo", "sc", "e"]
}

getArmures = function (Categorie, RaretéMin, RaretéMax) {
  rar = {
    c: 1,
    sc: 2,
    r: 3,
    sr: 4,
    e: 5,
    se: 6
  };

  it = 0

  rarfinal = loot(RaretéMin, RaretéMax)

  while (it < 100000) {
    n = rand(0, Object.keys(armures).length - 1);
    choix = Object.keys(armures)[n];
    if (armures[choix][0] == Categorie) {


      if
        (rar[armures[choix][1]] <= rar[rarfinal[0]] && rar[armures[choix][2]] >= rar[rarfinal[0]]) {
        //Check si rareté générée est compatible avec l’arme
        return [choix, rarfinal]; //Loot ou trouve une autre arme qui correspond
      }
    }
    it += 1
  }
  return "Aucune armures trouvée avec ces critères ou la rareté " + rarfinal[0];
}

potions = ["Potion de guérison",
  "Potion d'annulation de statut",
  "Potion de saignement",
  "Potion d'invisibilité",
  "Potion de lecture de pensée",
  "Potion de respiration aquatique",
  "Potion de résistance",
  "Philtre d'amour",
  "Potion de vol",
  "Potion de perce armure",
  "Potion de sommeil angélique",
  "Potion de langage animal",
  "Potion de mana",
  "Potion de force",
  "Potion de vitesse",
  "Potion de téléportation",
  "Potion d'inversion",
  "Potion d'action",
  "Potion de sous action",
  "Potion de résistance élémentaire",
  "Potion de résistance au feu",
  "Potion de résistance à la glace",
  "Potion de résistance à la foudre",
  "Potion de résistance à l'empoisonnement",
  "Potion de résistance à la terre",
  "Potion de résistance aux plantes",
  "Potion de résistance à l'eau",
  "Potion de résistance au vent",
  "Potion de poison",
  "Potion magique vierge"]

function getPotion() {
  n = rand(0, potions.length - 1);
  if (potions[n] == "Potion magique vierge") {
    return potions[n];
  }
  else {
    taille = rand(1, 100);
    if (taille <= 80) {
      return "Petite " + potions[n];
    }
    else if (taille <= 95) {
      return "Moyenne " + potions[n];
    }
    else {
      return "Grande " + potions[n];
    }
  }
}

flèches = {
  "Flèche": [70, 3, 8],
  "Tête large": [30, 1, 5],
  "Grosse flèche": [15, 1, 2],
  "Flèche de lumière": [8, 1, 1],
  "Flèche de feu": [20, 1, 3],
  "Flèche fumigène": [30, 1, 5],
  "Flèche empoisonnée": [25, 1, 4],
  "Flèche de glace": [20, 1, 3],
  "Flèche de foudre": [20, 1, 3],
  "Flèche de vent": [20, 1, 3],
  "Flèche d'eau": [20, 1, 3],
  "Flèche végétale": [20, 1, 3],
  "Flèche de terre": [20, 1, 3],
  "Flèche de folie": [25, 1, 4],
  "Flèche explosive": [20, 1, 3],
  "Flèche perçante": [20, 1, 3],
  "Flèche saignante": [15, 1, 2],
  "Flèche d'amour": [10, 1, 1],
  "Flèche de lenteur": [25, 1, 4]
}

function getFlèches() {
  result = {};



  for (let i = 0; i < Object.keys(flèches).length; i++) {
    let choix = Object.keys(flèches)[i];
    let n = rand(1, 100);

    if (n <= flèches[choix][0]) {
      nombre = rand(flèches[choix][1], flèches[choix][2]);
      result[choix] = nombre;
    }
  }
  return result;
}

// Calcul de dégâts
function calcDmg(type, dmx, pct = 0, eta = 0) {
  let r;
  if (type == "fle") {
    const dmi = Math.floor((dmx / 3) * 2);
    r = dmi + Math.floor(Math.random() * (dmx - dmi + 1)); // random entre 0 et (dmx - dmi) inclus
  }
  else {
    const dmi = Math.floor(dmx / 2);
    r = dmi + Math.floor(Math.random() * (dmi + 1)); // random entre 0 et dmi inclus
    if (dmx % 2 === 1) {
      r += Math.floor(Math.random() * 2); // 0 ou 1
    }
  }

  const f = r + (pct / 100) * r; // Application du pourcentage bonus

  // Test de l'effet de statut
  let rep = "";
  if (eta !== 0) {
    const e = rand(1, 100); // 0 à 100
    rep = e <= eta ? "Statut réussi" : "Statut échoué";
  }

  return [Math.floor(f), rep];
}

// Calculateur pourcentage
function calculPourcent(nb, pour) {
  return Math.floor(pour * nb / 100)
}

// ============================================================
// ========== ROUE DE LA FORTUNE ==========
// ============================================================

class WheelOfFortune {
  constructor() {
    // Configuration des 10 options (à éditer ici)
    this.options = [
      { name: "Paradis", weight: 1, color: "#f5f1dd" },
      { name: "Enfer", weight: 1, color: "#5b0f0f" },
      { name: "Rareté +1", weight: 3, color: "#4a6f8c" },
      { name: "Statistique +1", weight: 5, color: "#b89a3e" },
      { name: "Malediction", weight: 5, color: "#3f2a4f" },
      { name: "Dés de chance", weight: 7, color: "#2f5a3a" },
      { name: "Arme aléatoire", weight: 15, color: "#4a5258" },
      { name: "Armure aléatoire", weight: 15, color: "#5a3b27" },
      { name: "Long repos", weight: 18, color: "#a07a86" },
      { name: "1200 MC", weight: 30, color: "#c36f2c" }
    ];

    this.isSpinning = false;
    this.currentRotation = 0;
    this.canvas = document.getElementById('wheelCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.spinButton = document.getElementById('spinButton');
    this.resultContainer = document.getElementById('resultContainer');
    this.resultName = document.getElementById('resultName');

    this.init();
  }

  init() {
    this.drawWheel();
    this.updateLegend();
    this.spinButton.addEventListener('click', () => this.spin());
  }

  updateLegend() {
    const legendList = document.getElementById('legendList');
    legendList.innerHTML = '';

    this.options.forEach(option => {
      const item = document.createElement('div');
      item.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px; font-size: 0.9em;';

      const colorBox = document.createElement('div');
      colorBox.style.cssText = `width: 20px; height: 20px; background-color: ${option.color}; border: 1px solid #ccc; border-radius: 3px; margin-right: 10px; flex-shrink: 0;`;

      const label = document.createElement('span');
      label.textContent = `${option.name} (${option.weight}%)`;
      label.style.cssText = 'color: #333;';

      item.appendChild(colorBox);
      item.appendChild(label);
      legendList.appendChild(item);
    });
  }

  drawWheel() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const radius = Math.min(width, height) / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    // Effacer le canvas
    this.ctx.clearRect(0, 0, width, height);

    // Sauvegarder l'état du contexte
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate((this.currentRotation * Math.PI) / 180);

    // Calculer le total des poids
    const totalWeight = this.options.reduce((sum, opt) => sum + opt.weight, 0);
    const validTotal = totalWeight > 0 ? totalWeight : 100;

    let currentAngle = 0;

    // Dessiner chaque section
    this.options.forEach((option, index) => {
      const sliceAngle = (option.weight / validTotal) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      // Dessiner la section
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, radius, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
      this.ctx.closePath();
      this.ctx.fillStyle = option.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      currentAngle = endAngle;
    });

    // Restaurer l'état du contexte
    this.ctx.restore();

    // Dessiner le cercle du centre
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#7a0808';
    this.ctx.fill();
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('', centerX, centerY);
  }

  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.spinButton.disabled = true;
    this.resultContainer.style.display = 'none';

    // Nombre de tours (6 à 9)
    const numTurns = Math.floor(Math.random() * 4) + 6; // 6-9
    const randomOffset = Math.random() * 360;
    const targetRotation = numTurns * 360 + randomOffset;

    // Durée de l'animation (3 à 4 secondes pour faire fluide)
    const duration = 3000 + Math.random() * 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out effect (ralentissement en fin)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      this.currentRotation = targetRotation * easeProgress;
      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.currentRotation = targetRotation;
        this.drawWheel();
        this.showWinner();
        this.isSpinning = false;
        this.spinButton.disabled = false;
      }
    };

    animate();
  }

  showWinner() {
    // Normaliser la rotation entre 0 et 360
    const normalizedRotation = ((360 - (this.currentRotation % 360)) + 360) % 360;

    // Calculer le total des poids
    const totalWeight = this.options.reduce((sum, opt) => sum + opt.weight, 0);
    const validTotal = totalWeight > 0 ? totalWeight : 100;

    let currentAngle = 0;
    let winner = null;

    for (let option of this.options) {
      const sliceAngle = (option.weight / validTotal) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      // Vérifier si l'angle du gagnant est dans cette tranche
      // La flèche est à droite (0 degré), donc on regarde l'angle normalisé
      if (normalizedRotation >= startAngle && normalizedRotation < endAngle) {
        winner = option;
        break;
      }

      currentAngle = endAngle;
    }

    if (winner) {
      this.resultName.textContent = winner.name;
      this.resultContainer.style.display = 'block';
    }
  }
}

// Initialiser la roue quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function () {
  const wheelContainer = document.getElementById('card3');
  if (wheelContainer) {
    // Vérifier que le canvas existe
    if (document.getElementById('wheelCanvas')) {
      new WheelOfFortune();
    }
  }
});