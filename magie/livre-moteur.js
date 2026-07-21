/* ==================================================================
   MOTEUR DU LIVRE — partagé par le Grand Livre de la Magie et le
   Grimoire sanguinolent (pagination, feuilletage 3D, recherche,
   marque-pages, sommaire, mobile). Toute amélioration faite ici
   profite aux deux livres.

   La page qui l'utilise doit charger AVANT lui un fichier de données
   (sorts.js ou sorts_sanguine.js) définissant un objet global LIVRE :
     {
       familles: FAMILLES,            // les sorts, voir sorts.js
       couvertureTitre: "…",          // HTML du titre de couverture
       gardeAvant: "…",               // HTML du dos de couverture
       sommaireIntro: "…",            // HTML sous le titre « Sommaire »
       gardeFin: "…",                 // HTML de la page de garde finale
       pageFin: "…"                   // HTML de la dernière page
     }
   Pour ajouter ou corriger un sort, c'est là-bas — pas ici.
   ================================================================== */

/* ==================================================================
   GÉOMÉTRIE
   Deux formats de page : grand écran = double page,
   mobile = page unique (le texte garde sa taille, seule la page rétrécit).
   ================================================================== */
const SEUIL_MOBILE = 900;
const GEO_BUREAU = { w: 560, h: 780, mx: 52, mt: 44, innerH: 660, gutter: 70 };
const GEO_MOBILE = { w: 400, h: 620, mx: 26, mt: 28, innerH: 520, gutter: 40 };

/* ==================================================================
   ÉTAT DU GRIMOIRE
   ================================================================== */
let geo = GEO_BUREAU;
let modeMobile = false;
let echelle = 1;
let sheets = [];
let nbFeuilles = 0;
let feuillesTournees = 0;
let cote = "droite";          // mobile : moitié du livre affichée à l'écran
let pagesContenu = [];        // { html, fam } — la page 0 est le sommaire
let indexSorts = [];          // { nom, page, id, fam }
let zTimer = null;
let surbrillanceTimer = null;
let resizeTimer = null;
let rafRescale = null;        // rescale en attente d'une image (resize)
let zVol = 500;               // z-index des feuilles en cours de retournement
let finVol = 0;               // date de fin du dernier retournement en vol

const section = document.querySelector(".grimoire-section");
const scene = document.querySelector(".book-scene");
const book = document.getElementById("book");
const bookScale = document.getElementById("bookScale");
const bookViewport = document.getElementById("bookViewport");
const barreBookmarks = document.getElementById("bookmarksBar");
const barreNav = document.getElementById("navBar");
const aideNav = document.getElementById("aideNav");
const flechePrec = document.getElementById("flechePrec");
const flecheSuiv = document.getElementById("flecheSuiv");
const champ = document.getElementById("rechercheSort");
const datalist = document.getElementById("listeSorts");

/* ==================================================================
   CONSTRUCTION DU LIVRE
   (lancée une fois les polices chargées, car la pagination
    dépend de la hauteur réelle du texte)
   ================================================================== */
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slug(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function grilleHTML(spec) {
  if (spec.grid === "foudre") {
    const rows = [
      [null, null, "1/3", null, null],
      [null, "2/3", "2/3", "2/3", null],
      ["1/3", "2/3", "3/3", "2/3", "1/3"],
      [null, "2/3", "2/3", "2/3", null],
      [null, null, "1/3", null, null]
    ];
    const cases = rows.flat().map(v =>
      v === null ? '<div class="case vide"></div>'
        : '<div class="case' + (v === "3/3" ? " centre" : "") + '">' + v + "</div>"
    ).join("");
    return '<div class="grille grille-foudre">' + cases + '</div><div class="grille-legende">' + esc(spec.legende) + "</div>";
  }
  if (spec.grid === "vent") {
    const cases = ["1/5", "2/5", "3/5", "4/5", "5/5"].map((v, i) =>
      '<div class="case' + (i === 4 ? " centre" : "") + '">' + v + "</div>"
    ).join("");
    return '<div class="grille grille-vent">' + cases + '</div><div class="grille-legende">' + esc(spec.legende) + "</div>";
  }
  return "";
}

function sortHTML(sort, fam) {
  const lignes = sort.desc.map(d =>
    typeof d === "string" ? "<p>" + esc(d) + "</p>" : grilleHTML(d)
  ).join("");
  return '<div class="blk sort" id="sort-' + slug(fam.id + "-" + sort.nom) + '">'
    + '<div class="sort-entete"><span class="sort-nom">' + esc(sort.nom) + "</span>"
    + (sort.cout ? '<span class="sort-cout">' + esc(sort.cout) + "</span>" : "")
    + "</div>"
    + (lignes ? '<div class="sort-desc">' + lignes + "</div>" : "")
    + "</div>";
}

// Découpe une famille en blocs mesurables
function blocsFamille(fam) {
  const blocs = [];
  blocs.push({
    html: '<div class="blk"><div class="fam-titre" style="color:' + fam.couleur + '">' + esc(fam.nom)
      + '</div><div class="fam-orne" style="color:' + fam.couleur + '">✦ ❦ ✦</div></div>',
    garderAvecSuivant: true, estTitreFamille: true
  });
  fam.sections.forEach(sec => {
    if (sec.titre) {
      blocs.push({
        html: '<div class="blk"><div class="sec-titre" style="color:' + fam.couleur + '">' + esc(sec.titre) + " :</div>"
          + (sec.intro ? '<div class="sec-intro">' + esc(sec.intro) + "</div>" : "")
          + "</div>",
        garderAvecSuivant: true
      });
    }
    sec.sorts.forEach(sort => {
      blocs.push({ html: sortHTML(sort, fam), sort: sort, fam: fam });
    });
  });
  return blocs;
}

// Mesure la hauteur réelle d'un bloc dans un gabarit caché
// (les classes .blk, .sort-nom, etc. sont globales et s'y appliquent)
const mesureur = document.createElement("div");

function mesurer(html) {
  mesureur.innerHTML = html;
  return mesureur.offsetHeight;
}

// Bandeau « (suite) » des pages qui prolongent une famille.
// Une seule définition : elle sert à la fois à mesurer la place à
// réserver et à rendre le bandeau, les deux ne peuvent plus diverger.
function suiteHTML(fam) {
  return '<div class="fam-suite">' + esc(fam.nom) + " (suite) ✦</div>";
}

// Répartit les blocs d'une famille sur autant de pages que nécessaire
function paginerFamille(fam) {
  const blocs = blocsFamille(fam);
  blocs.forEach(b => { b.h = mesurer(b.html); });
  // Les pages 2, 3… de la famille portent le bandeau « (suite) » :
  // sans réserver sa hauteur, le contenu déborde et se fait couper.
  const hSuite = mesurer(suiteHTML(fam));
  const pages = [];
  let cur = [], curH = 0;
  for (let i = 0; i < blocs.length; i++) {
    const b = blocs[i];
    // hauteur utile de la page en cours de remplissage
    const dispo = geo.innerH - (pages.length === 0 ? 0 : hSuite);
    let besoin = b.h;
    // un titre de section ne doit pas rester orphelin en bas de page
    if (b.garderAvecSuivant && blocs[i + 1]) besoin += blocs[i + 1].h;
    if (cur.length && curH + besoin > dispo) {
      pages.push(cur); cur = []; curH = 0;
    }
    cur.push(b); curH += b.h;
  }
  if (cur.length) pages.push(cur);
  return pages;
}

/* ---------- Assemblage des pages ---------- */
function paginerLivre() {
  mesureur.style.cssText = "position:absolute;visibility:hidden;left:-9999px;top:0;display:flow-root;"
    + "font-family:'Cormorant Garamond',serif;width:" + (geo.w - geo.mx * 2) + "px;";
  document.body.appendChild(mesureur);

  pagesContenu = [null];   // la page 0 est réservée au sommaire
  indexSorts = [];

  LIVRE.familles.forEach(fam => {
    const pagesFam = paginerFamille(fam);
    fam.premierePage = pagesContenu.length; // index 0-based ; n° affiché = index + 1
    pagesFam.forEach((blocs, pi) => {
      const suite = pi > 0 ? suiteHTML(fam) : "";
      pagesContenu.push({ html: suite + blocs.map(b => b.html).join(""), fam: fam });
      blocs.forEach(b => {
        if (b.sort) {
          indexSorts.push({
            nom: b.sort.nom.replace(/^— /, ""),
            page: pagesContenu.length - 1,
            id: "sort-" + slug(fam.id + "-" + b.sort.nom),
            fam: fam
          });
        }
      });
    });
  });

  document.body.removeChild(mesureur);

  // Sommaire (page 0)
  pagesContenu[0] = {
    html: '<div class="sommaire-titre">Sommaire</div>'
      + '<div class="sommaire-intro">' + LIVRE.sommaireIntro + '</div>'
      + LIVRE.familles.map(fam =>
        '<a class="sommaire-ligne" data-page="' + fam.premierePage + '">'
        + '<span class="sommaire-pastille" style="background:' + fam.couleur + '"></span>'
        + '<span class="sommaire-nom">' + esc(fam.nom) + "</span>"
        + '<span class="sommaire-points"></span>'
        + '<span class="sommaire-page">' + (fam.premierePage + 1) + "</span>"
        + "</a>").join(""),
    fam: null
  };

  // Nombre pair de pages pour remplir les feuilles
  if (pagesContenu.length % 2 === 1) {
    pagesContenu.push({
      html: '<div class="garde-contenu">' + LIVRE.gardeFin + '</div>',
      fam: null, garde: true
    });
  }
}

/* ---------- Création des feuilles (recto / verso) ---------- */
function pageFace(classe, contenu) {
  const d = document.createElement("div");
  d.className = "page " + classe;
  d.innerHTML = contenu;
  return d;
}

function contenuPage(idx) {
  const p = pagesContenu[idx];
  if (p.garde) return '<div class="parchemin" style="position:absolute;inset:0">' + p.html + "</div>";
  return '<div class="parchemin" style="position:absolute;inset:0">'
    + '<div class="page-inner">' + p.html + "</div>"
    + '<div class="page-num">— ' + (idx + 1) + " —</div>"
    + '<div class="coin-corne"></div>'
    + "</div>";
}

function construireFeuilles() {
sheets = [];

// Feuille 0 : couverture
const couverture = document.createElement("div");
couverture.className = "sheet";
couverture.appendChild(pageFace("front cuir",
  '<span class="couverture-coin coin-hg">✦</span><span class="couverture-coin coin-hd">✦</span>'
  + '<span class="couverture-coin coin-bg">✦</span><span class="couverture-coin coin-bd">✦</span>'
  + '<div class="couverture-cadre">'
  + '<div class="couverture-orne">☽ ✦ ☾</div>'
  + '<div class="couverture-titre">' + LIVRE.couvertureTitre + '</div>'
  + '<div class="couverture-orne">❦</div>'
  + '<div class="couverture-marque">Legends & Bonk</div>'
  + "</div>"
  + '<div class="couverture-hint">— ' + (modeMobile ? "Touchez" : "Cliquez") + ' pour ouvrir —</div>'));
couverture.appendChild(pageFace("back parchemin",
  '<div class="garde-contenu">' + LIVRE.gardeAvant + '</div>'));
sheets.push(couverture);

// Feuilles de contenu
for (let i = 0; i < pagesContenu.length; i += 2) {
  const s = document.createElement("div");
  s.className = "sheet";
  s.appendChild(pageFace("front", contenuPage(i)));
  s.appendChild(pageFace("back", contenuPage(i + 1)));
  sheets.push(s);
}

// Feuille finale : quatrième de couverture
const dos = document.createElement("div");
dos.className = "sheet";
dos.appendChild(pageFace("front parchemin",
  '<div class="garde-contenu">' + LIVRE.pageFin + '</div>'));
dos.appendChild(pageFace("back cuir",
  '<div class="couverture-cadre"><div class="couverture-orne">❦</div>'
  + '<div class="couverture-marque">Legends & Bonk</div></div>'));
sheets.push(dos);

sheets.forEach(s => book.appendChild(s));
nbFeuilles = sheets.length;
} // fin construireFeuilles

/* ==================================================================
   MÉCANIQUE DU LIVRE
   ================================================================== */
// Rend aux feuilles leur empilement de repos. N'est appelée qu'à l'arrêt
// complet : on peut donc y remettre zVol à zéro sans risque.
function majZ() {
  sheets.forEach((s, i) => {
    s.style.zIndex = s.classList.contains("flipped") ? i + 1 : nbFeuilles - i + 1;
  });
  zVol = 500;
  finVol = 0;
}

/* Toutes les feuilles sont empilées au même endroit : à l'arrêt, seules
   celles qui bordent la reliure se voient, les autres sont entièrement
   recouvertes. On les masque pour que le navigateur cesse de peindre
   leur parchemin (bruit SVG, dégradés, ombres) : invisible à l'œil,
   mais c'est autant de travail en moins à chaque image.
   On garde une marge de sécurité de chaque côté, car pendant un
   feuilletage on aperçoit la feuille suivante sous celle qui tourne. */
function majVisibilite() {
  sheets.forEach((s, i) => {
    const proche = i >= feuillesTournees - 2 && i <= feuillesTournees + 1;
    s.style.visibility = proche ? "" : "hidden";
  });
}

// Au départ d'un feuilletage, on révèle seulement les feuilles qui vont
// réellement bouger ou apparaître : la plage parcourue (de la position
// courante à la cible), plus une marge de deux feuilles de chaque côté.
// Tout révéler d'un coup — comme on le faisait — provoquait, sur un livre
// à beaucoup de pages, un pic de peinture PILE au moment où l'on tourne la
// page : petite saccade au retournement, alors que le glissement restait
// fluide. majVisibilite() reprend la main à l'arrêt et remasque le reste.
function afficherPlage(a, b) {
  const lo = Math.min(a, b) - 2;
  const hi = Math.max(a, b) + 1;
  sheets.forEach((s, i) => {
    if (i >= lo && i <= hi) s.style.visibility = "";
  });
}

function majEtat() {
  book.classList.toggle("ferme-avant", feuillesTournees === 0);
  book.classList.toggle("ferme-arriere", feuillesTournees === nbFeuilles);
  flechePrec.disabled = feuillesTournees === 0;
  flecheSuiv.disabled = feuillesTournees === nbFeuilles;
  aideNav.textContent = feuillesTournees === 0
    ? (modeMobile
      ? "Touchez la couverture pour ouvrir le grimoire"
      : "Cliquez sur la couverture pour ouvrir le grimoire")
    : (modeMobile
      ? "Touchez la droite de la page pour avancer, la gauche pour revenir — ou utilisez les flèches, les marque-pages et le sommaire"
      : "Tournez les pages : clic sur la page, flèches ← →, marque-pages ou sommaire");
  majPan();
}

/* Mobile : le livre ne montre qu'une page à la fois, on fait glisser
   la double page pour amener la bonne moitié devant l'écran. */
function majPan() {
  let tx = 0;
  if (modeMobile) {
    if (feuillesTournees === 0 || feuillesTournees === nbFeuilles) tx = -geo.w / 2;
    else tx = cote === "droite" ? -geo.w : 0;
  }
  bookScale.style.transform = "translateX(" + (tx * echelle) + "px) scale(" + echelle + ")";
}

function avancer() {
  if (!modeMobile) { allerAFeuille(feuillesTournees + 1); return; }
  if (feuillesTournees === nbFeuilles) return;
  if (feuillesTournees === 0) { cote = "gauche"; allerAFeuille(1); return; }
  if (cote === "gauche") { cote = "droite"; majPan(); return; }
  cote = "gauche";
  allerAFeuille(feuillesTournees + 1);
}

function reculer() {
  if (!modeMobile) { allerAFeuille(feuillesTournees - 1); return; }
  if (feuillesTournees === 0) return;
  if (feuillesTournees === nbFeuilles || cote === "gauche") {
    cote = "droite";
    allerAFeuille(feuillesTournees - 1);
    return;
  }
  cote = "gauche";
  majPan();
}

function allerAFeuille(cible) {
  cible = Math.max(0, Math.min(nbFeuilles, cible));
  if (cible === feuillesTournees) return;
  const dir = cible > feuillesTournees ? 1 : -1;
  afficherPlage(feuillesTournees, cible);
  let ordre = 0;
  while (feuillesTournees !== cible) {
    const idx = dir > 0 ? feuillesTournees : feuillesTournees - 1;
    const s = sheets[idx];
    const o = ordre++;
    setTimeout(() => {
      // zVol ne redescend jamais : une feuille lancée plus tard passe
      // toujours au-dessus des précédentes. Un compteur repartant de zéro
      // à chaque appel donnerait le même z-index à deux feuilles lors de
      // clics rapprochés, et c'est l'ordre du DOM qui trancherait —
      // faux quand on recule.
      s.style.zIndex = ++zVol;
      // prévient le compositeur juste avant le mouvement : il garde la
      // feuille sur sa propre couche au lieu de la repeindre à chaque image
      s.style.willChange = "transform";
      // On relit la position au moment où le retournement part, au lieu de
      // figer la direction du clic. Sur des clics rapides, une navigation
      // plus récente a pu changer la cible : c'est elle qui fait foi, et
      // chaque feuille converge vers le bon état au lieu de se contredire.
      s.classList.toggle("flipped", idx < feuillesTournees);
    }, o * 110);
    feuillesTournees += dir;
  }

  // Le repos, c'est quand le DERNIER retournement en vol est terminé —
  // y compris ceux lancés par une navigation précédente encore en cours.
  finVol = Math.max(finVol, Date.now() + ordre * 110 + 1050);
  clearTimeout(zTimer);
  zTimer = setTimeout(() => {
    // will-change coûte de la mémoire : on le retire dès l'arrêt
    sheets.forEach(s => { s.style.willChange = ""; });
    majZ();
    majVisibilite();
  }, finVol - Date.now());
  majEtat();
}

// index de page (0-based) -> nombre de feuilles à tourner pour la voir :
// pages paires = recto (côté droit), pages impaires = verso (côté gauche)
function allerAPage(i) {
  if (i % 2 === 0) { cote = "droite"; allerAFeuille(i / 2 + 1); }
  else { cote = "gauche"; allerAFeuille((i + 3) / 2); }
  majPan();
}

// Page de contenu actuellement sous les yeux (pour la retrouver après reconstruction)
function pageCourante() {
  if (feuillesTournees <= 0 || feuillesTournees >= nbFeuilles) return null;
  const i = (modeMobile && cote === "gauche") ? 2 * feuillesTournees - 3 : 2 * (feuillesTournees - 1);
  return Math.max(0, Math.min(pagesContenu.length - 1, i));
}

/* ---------- Clics sur les pages ---------- */
book.addEventListener("click", e => {
  const lien = e.target.closest("[data-page]");
  if (lien) {
    allerAPage(parseInt(lien.dataset.page, 10));
    return;
  }
  const page = e.target.closest(".page");
  if (!page) return;
  // Mobile : une seule page est affichée, on ne peut donc pas se fier au
  // côté du livre touché comme sur grand écran. On découpe la page :
  // le tiers gauche recule, le reste avance — même logique (« on touche
  // du côté où l'on veut aller »), et les flèches restent disponibles.
  if (modeMobile) {
    // Livre fermé : pas de zones, n'importe quel toucher l'ouvre — sinon
    // toucher la couverture à gauche ne ferait rien et semblerait cassé.
    if (feuillesTournees === 0) { avancer(); return; }
    if (feuillesTournees === nbFeuilles) { reculer(); return; }
    const r = page.getBoundingClientRect();
    if (e.clientX - r.left < r.width / 3) reculer(); else avancer();
    return;
  }
  const sheet = page.parentElement;
  const idx = sheets.indexOf(sheet);
  if (page.classList.contains("front") && idx === feuillesTournees) {
    avancer();
  } else if (page.classList.contains("back") && idx === feuillesTournees - 1) {
    reculer();
  }
});

flechePrec.addEventListener("click", reculer);
flecheSuiv.addEventListener("click", avancer);

/* ---------- Clavier ---------- */
document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); avancer(); }
  if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); reculer(); }
});

/* La molette ne tourne plus les pages : elle bloquait le défilement
   normal de la page dès que le curseur passait sur le livre. */

/* ---------- Placement des flèches ----------
   Grand écran : de part et d'autre du livre (dans .book-scene).
   Mobile : dans la barre sous le livre, sinon elles recouvrent le texte. */
function placerFleches() {
  const cible = modeMobile ? barreNav : scene;
  cible.appendChild(flechePrec);
  cible.appendChild(flecheSuiv);
}

/* ---------- Marque-pages ----------
   Grand écran : onglets sur la tranche du livre.
   Mobile : barre horizontale sous le livre (la tranche serait hors écran). */
function construireBookmarks() {
  const conteneur = document.createElement("div");
  conteneur.className = "bookmarks";
  LIVRE.familles.forEach(fam => {
    const b = document.createElement("button");
    b.className = "bookmark";
    b.style.background = "linear-gradient(90deg, " + fam.couleur + ", " + fam.couleur + "cc)";
    b.textContent = fam.court;
    b.title = fam.nom + " — page " + (fam.premierePage + 1);
    b.addEventListener("click", e => {
      e.stopPropagation();
      allerAPage(fam.premierePage);
    });
    conteneur.appendChild(b);
  });
  if (modeMobile) barreBookmarks.appendChild(conteneur);
  else book.appendChild(conteneur);
}

/* ---------- Recherche de sort ---------- */
function construireDatalist() {
  indexSorts.forEach(s => {
    const o = document.createElement("option");
    o.value = s.nom;
    datalist.appendChild(o);
  });
}

function normaliser(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function chercherSort() {
  const q = normaliser(champ.value);
  if (!q) return;
  const hit = indexSorts.find(s => normaliser(s.nom) === q)
    || indexSorts.find(s => normaliser(s.nom).includes(q));
  if (!hit) return;
  allerAPage(hit.page);
  document.querySelectorAll(".sort-hit").forEach(el => el.classList.remove("sort-hit"));
  const el = document.getElementById(hit.id);
  if (el) {
    clearTimeout(surbrillanceTimer);
    // attendre la fin du feuilletage avant d'allumer la surbrillance
    surbrillanceTimer = setTimeout(() => {
      el.classList.add("sort-hit");
      setTimeout(() => el.classList.remove("sort-hit"), 3500);
    }, 600);
  }
}

champ.addEventListener("change", chercherSort);
champ.addEventListener("keydown", e => { if (e.key === "Enter") chercherSort(); });

/* ---------- Mise à l'échelle ----------
   .book-scale a une transition de .45s : elle sert à faire glisser la
   double page sur mobile (majPan). Mais le transform porte AUSSI le
   scale() : sans précaution, chaque redimensionnement l'anime et le
   livre suit la fenêtre avec .45s de retard. On applique donc les
   changements d'échelle sans animation. */
function sansAnimation(action) {
  bookScale.style.transition = "none";
  action();
  void bookScale.offsetWidth;   // force la prise en compte immédiate
  bookScale.style.transition = "";
}

function rescale() {
  const dispo = section.clientWidth;
  if (modeMobile) {
    // une seule page doit tenir dans la largeur, sans dépasser en hauteur.
    // 296px réservés à ce qui entoure le livre : recherche, barre des
    // flèches, marque-pages et ligne d'aide.
    const parLargeur = (dispo - 12) / geo.w;
    const parHauteur = (window.innerHeight - 296) / geo.h;
    echelle = Math.max(.45, Math.min(1, parLargeur, parHauteur));
    bookViewport.style.width = Math.ceil(geo.w * echelle) + "px";
    // les flèches sont dans la barre sous le livre : rien à positionner
    flechePrec.style.left = "";
    flecheSuiv.style.right = "";
  } else {
    echelle = Math.min(1, (dispo - 180) / (geo.w * 2));
    bookViewport.style.width = Math.ceil(geo.w * 2 * echelle) + "px";
    // les flèches restent collées au livre quelle que soit l'échelle
    const ecart = Math.round(geo.w * echelle) + 76;
    flechePrec.style.left = "calc(50% - " + ecart + "px)";
    flecheSuiv.style.right = "calc(50% - " + ecart + "px)";
  }
  bookViewport.style.height = Math.ceil(geo.h * echelle + 40) + "px";
  sansAnimation(majPan);
}

/* ---------- (Re)construction complète ---------- */
function construireGrimoire(idFamille) {
  modeMobile = window.innerWidth < SEUIL_MOBILE;
  geo = modeMobile ? GEO_MOBILE : GEO_BUREAU;
  section.style.setProperty("--page-w", geo.w + "px");
  section.style.setProperty("--page-h", geo.h + "px");
  section.style.setProperty("--page-mx", geo.mx + "px");
  section.style.setProperty("--page-mt", geo.mt + "px");
  section.style.setProperty("--page-inner-h", geo.innerH + "px");
  section.style.setProperty("--gutter", geo.gutter + "px");

  clearTimeout(zTimer);
  book.innerHTML = "";
  book.className = "book ferme-avant";
  barreBookmarks.innerHTML = "";
  datalist.innerHTML = "";
  feuillesTournees = 0;
  cote = "droite";

  paginerLivre();
  construireFeuilles();
  construireBookmarks();
  construireDatalist();
  placerFleches();
  majZ();
  majVisibilite();
  majEtat();
  rescale();

  // la pagination change avec le format : on retrouve la famille, pas le n° de page
  const fam = idFamille && LIVRE.familles.find(f => f.id === idFamille);
  if (fam) allerAPage(fam.premierePage);
}

/* ---------- Redimensionnement ----------
   resize part en rafale (des dizaines de fois par seconde pendant un
   glissement de fenêtre) : on ne recalcule qu'une fois par image. */
window.addEventListener("resize", () => {
  if ((window.innerWidth < SEUIL_MOBILE) === modeMobile) {
    if (rafRescale) return;
    rafRescale = requestAnimationFrame(() => { rafRescale = null; rescale(); });
    return;
  }
  // on passe d'un format à l'autre : il faut repaginer
  const i = pageCourante();
  const fam = i == null ? null : pagesContenu[i].fam;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => construireGrimoire(fam && fam.id), 150);
});

function demarrer() {
  // Ouverture directe via l'URL : livre_magie.html#p=5 ouvre à la page 5
  const m = location.hash.match(/^#p=(\d+)/);
  construireGrimoire();
  if (m) allerAPage(Math.min(pagesContenu.length - 1, Math.max(0, parseInt(m[1], 10) - 1)));
}

// La pagination mesure du texte : il faut que les polices soient prêtes
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(demarrer);
} else {
  demarrer();
}