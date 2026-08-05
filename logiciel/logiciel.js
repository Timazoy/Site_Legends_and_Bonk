"use strict";

/* Codes utilisés par les générateurs et par les menus de logiciel.html.
   Ce sont eux qu'on retrouve dans le champ "codes" du catalogue des armes :
   Raretés          c, sc, r, sr, e, se (de la plus commune à la plus rare)
   Grandes cat.     acd/amd/ald (courte/moyenne/longue distance),
                    bou (bouclier), bat (bâton magique), ani (objet animal)
   Petites cat.     cl (classique), pa (petite arme), la (lancer), lo (lourde)
   Cat. spéciales   ta (talisman), ma (magique), mu (musicale), me (médicale)
   Armures          ale/amo/alo (légère/moyenne/lourde)
   Divers           fle (flèches), pot (potion)
   "x" = non renseigné / indifférent */

// Fonction random entre deux entiers compris
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Génération d'enchantements ---
const enchants = ["Vent", "Foudre", "Feu", "Force", /*liste des enchantements dispo*/
  "Agilité", "Temps", "Résistance",
  "Vitesse", "Illusion"];

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
    let n = rand(0, enchants.length - 1);
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

// rang de chaque rareté, de la plus commune à la plus rare
const rangRarete = { c: 1, sc: 2, r: 3, sr: 4, e: 5, se: 6 };

//fonction pour faire un random entre une rareté min et max.
function loot(minrar, maxrar) {
  // min au-dessus de max : les fonctions C/SC/R/SR ne couvriraient aucun cas
  // et renverraient une rareté undefined, on préfère le dire clairement.
  if (!rangRarete[minrar] || !rangRarete[maxrar]) return { error: "Rareté inconnue." };
  if (rangRarete[minrar] > rangRarete[maxrar]) {
    return { error: "La rareté minimum doit être inférieure ou égale à la rareté maximum." };
  }

  if (minrar === maxrar) return [maxrar, ench(maxrar)];

  if (minrar === "c") return C(maxrar);
  if (minrar === "sc") return SC(maxrar);
  if (minrar === "r") return R(maxrar);
  if (minrar === "sr") return SR(maxrar);

  return E();
}

/* ==================================================================
   LES CATALOGUES SONT LA SOURCE UNIQUE

   Les listes d'objets ne sont plus recopiées ici : elles sont lues
   dans equipement/armes-data.js, armures-data.js et potions-data.js,
   que logiciel.html charge juste avant ce fichier. Ajouter un objet
   au catalogue suffit pour qu'il sorte au tirage — il n'y a plus deux
   fichiers à tenir d'accord.

   Ce qui reste ici, ce sont les règles de tirage : les probabilités
   de rareté, les chances d'enchantement, les tailles de potion. Le
   catalogue dit ce qui existe, le logiciel dit ce qui tombe.
   ================================================================== */

// Un catalogue contient aussi ce qui ne se trouve pas : les objets
// marqués "butin": false s'achètent en boutique mais ne tombent jamais
// au tirage. Ils sont écartés d'entrée.
function catalogue(nomGlobal) {
  const db = window[nomGlobal];
  const objets = (db && db.objets) || [];
  return objets.filter(function (o) { return o.butin !== false; });
}

// Le catalogue écrit les raretés en majuscules ("SE"), le générateur en
// minuscules ("se").
function bornesRarete(objet) {
  const tiers = objet.tiers || [];
  if (!tiers.length) return null;
  return [String(tiers[0]).toLowerCase(),
          String(tiers[tiers.length - 1]).toLowerCase()];
}

// Message unique quand un catalogue n'a pas été chargé : sans lui le
// générateur n'a rien à tirer, autant le dire au lieu de renvoyer un vide.
function catalogueAbsent(quoi) {
  return { error: "Le catalogue des " + quoi + " n'a pas pu être chargé." };
}

// Dictionnaire des armes construit depuis le catalogue :
// nom -> [grande cat., petite cat., cat. spéciale, rareté min, rareté max]
// Les trois premiers codes viennent du champ "codes" du catalogue, les
// deux derniers de ses paliers de rareté.
const armes = (function () {
  const dico = {};
  catalogue("EQUIP_ARMES").forEach(function (o) {
    const bornes = bornesRarete(o);
    if (!o.codes || !bornes) return;   // les flèches n'ont pas de codes
    dico[o.nom] = o.codes.concat(bornes);
  });
  return dico;
})();

// La catégorie spéciale prime : une arme demandée par sa spécialité se
// moque de sa distance. Sorti de getArmes pour que « ce qui pouvait
// tomber » applique exactement le même filtre.
function armeDeCategorie(a, GrandeCategorie, PetiteCategorie, CatégorieSpéciales) {
  return CatégorieSpéciales == "x"
    ? a[0] == GrandeCategorie && (a[1] == PetiteCategorie || PetiteCategorie == "x")
    : a[2] == CatégorieSpéciales;
}

function getArmes(GrandeCategorie, PetiteCategorie, CatégorieSpéciales, RaretéMin, RaretéMax) {
  const rar = rangRarete;

  if (Object.keys(armes).length === 0) return catalogueAbsent("armes");

  const rarfinal = loot(RaretéMin, RaretéMax);
  if (rarfinal.error) return rarfinal;

  // On garde toutes les armes de la catégorie demandée dont la fourchette de
  // rareté ([3] à [4]) accepte la rareté tirée, puis on en choisit une au hasard.
  const compatibles = Object.keys(armes).filter(function (nom) {
    const a = armes[nom];
    return armeDeCategorie(a, GrandeCategorie, PetiteCategorie, CatégorieSpéciales)
      && rar[a[3]] <= rar[rarfinal[0]] && rar[a[4]] >= rar[rarfinal[0]];
  });

  if (compatibles.length === 0) {
    return { error: "Aucune arme ne correspond à ces critères pour la rareté tirée ("
      + rarfinal[0].toUpperCase() + ")." };
  }

  return [compatibles[rand(0, compatibles.length - 1)], rarfinal];
}

// Les armures se rangent sur leur seule grande catégorie, lisible
// directement dans le catalogue.
const CODES_ARMURES = {
  "Armures légères": "ale",
  "Armures moyennes": "amo",
  "Armures lourdes": "alo"
};

// nom -> [catégorie, rareté min, rareté max]
const armures = (function () {
  const dico = {};
  catalogue("EQUIP_ARMURES").forEach(function (o) {
    const code = CODES_ARMURES[o.categorie];
    const bornes = bornesRarete(o);
    if (!code || !bornes) return;
    dico[o.nom] = [code].concat(bornes);
  });
  return dico;
})();

function getArmures(Categorie, RaretéMin, RaretéMax) {
  const rar = rangRarete;

  if (Object.keys(armures).length === 0) return catalogueAbsent("armures");

  const rarfinal = loot(RaretéMin, RaretéMax);
  if (rarfinal.error) return rarfinal;

  // Même principe que getArmes : on filtre puis on tire au hasard.
  const compatibles = Object.keys(armures).filter(function (nom) {
    const a = armures[nom];
    return a[0] == Categorie
      && rar[a[1]] <= rar[rarfinal[0]] && rar[a[2]] >= rar[rarfinal[0]];
  });

  if (compatibles.length === 0) {
    return { error: "Aucune armure ne correspond à ces critères pour la rareté tirée ("
      + rarfinal[0].toUpperCase() + ")." };
  }

  return [compatibles[rand(0, compatibles.length - 1)], rarfinal];
}

/* ------------------------------------------------------------------
   CE QUI POUVAIT TOMBER

   Les générateurs ne renvoient qu'un objet. L'écran de butin, lui, a
   besoin de savoir ce qui aurait pu sortir avec les mêmes critères
   pour remplir son ruban : ce qui défile devant le joueur est ainsi
   toujours quelque chose qu'il pouvait réellement obtenir.

   Même filtre de catégorie que les getX, mais sur toute la fourchette
   de rareté demandée au lieu de la seule rareté tirée : une arme qui
   n'existe qu'en Épique reste dans le ruban d'un tirage C→SE, même si
   le dé a fini par donner Commun.
   ------------------------------------------------------------------ */

function armesPossibles(GrandeCategorie, PetiteCategorie, CatégorieSpéciales, RaretéMin, RaretéMax) {
  const rar = rangRarete;
  if (!rar[RaretéMin] || !rar[RaretéMax]) return [];

  return Object.keys(armes).filter(function (nom) {
    const a = armes[nom];
    return armeDeCategorie(a, GrandeCategorie, PetiteCategorie, CatégorieSpéciales)
      && rar[a[3]] <= rar[RaretéMax] && rar[a[4]] >= rar[RaretéMin];
  });
}

function armuresPossibles(Categorie, RaretéMin, RaretéMax) {
  const rar = rangRarete;
  if (!rar[RaretéMin] || !rar[RaretéMax]) return [];

  return Object.keys(armures).filter(function (nom) {
    const a = armures[nom];
    return a[0] == Categorie
      && rar[a[1]] <= rar[RaretéMax] && rar[a[2]] >= rar[RaretéMin];
  });
}

const potions = catalogue("EQUIP_POTIONS").map(function (o) { return o.nom; });

// Le générateur de potions n'a pas de critères : tout le rayon peut tomber.
function potionsPossibles() {
  return potions.slice();
}

// Les tailles vendues sont celles du catalogue ; leurs chances de sortie,
// elles, sont une règle de tirage et restent ici.
const taillesPotion = (function () {
  const q = (window.EQUIP_POTIONS && window.EQUIP_POTIONS.quantites) || [];
  return q.length === 3
    ? q.map(function (t) { return t.nom; })
    : ["Petite", "Moyenne", "Grande"];
})();

// Le tirage brut, en deux morceaux : l'écran de butin a besoin du nom
// seul pour retrouver l'illustration au catalogue, la taille ne se
// collant devant qu'à l'affichage.
function tirerPotion() {
  if (potions.length === 0) return { error: catalogueAbsent("potions").error };

  const n = rand(0, potions.length - 1);
  // la potion vierge ne se trouve qu'en petit format : elle n'a pas de taille
  if (potions[n] == "Potion magique vierge") {
    return { nom: potions[n], taille: "" };
  }

  const taille = rand(1, 100);
  return {
    nom: potions[n],
    taille: taille <= 80 ? taillesPotion[0]
      : taille <= 95 ? taillesPotion[1]
        : taillesPotion[2]
  };
}

function getPotion() {
  const p = tirerPotion();
  if (p.error) return p.error;
  return p.taille ? p.taille + " " + p.nom : p.nom;
}

// nom -> [chance sur 100 d'en trouver, quantité min, quantité max]
const flèches = (function () {
  const dico = {};
  catalogue("EQUIP_ARMES").forEach(function (o) {
    if (typeof o.drop !== "number" || !o.quantite) return;
    dico[o.nom] = [o.drop, o.quantite[0], o.quantite[1]];
  });
  return dico;
})();

function getFlèches() {
  const result = {};

  if (Object.keys(flèches).length === 0) return catalogueAbsent("flèches");

  for (let i = 0; i < Object.keys(flèches).length; i++) {
    let choix = Object.keys(flèches)[i];
    let n = rand(1, 100);

    if (n <= flèches[choix][0]) {
      const nombre = rand(flèches[choix][1], flèches[choix][2]);
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

    // Position de départ aléatoire
    const randomStartPosition = Math.random() * 360;
    this.currentRotation = randomStartPosition;
    this.drawWheel();

    // Nombre de tours (6 à 9)
    const numTurns = Math.floor(Math.random() * 4) + 6; // 6-9
    const randomOffset = Math.random() * 360;
    const targetRotation = randomStartPosition + numTurns * 360 + randomOffset;

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