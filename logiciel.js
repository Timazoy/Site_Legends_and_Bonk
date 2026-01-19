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
const mu = "mu"   //musicals
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
    }
    it += 1
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
      it += 1
    }
  }
  return "Aucune arme trouvée avec ces critères ou la rareté " + rarfinal[0];
}
