/* ==================================================================
   FILTRE PAR CLASSE — Grand Livre de la Magie
   Le bouton « Classes », à droite de la barre de recherche, ouvre un
   panneau de portraits : on coche une ou plusieurs classes et le livre
   se reconstruit avec les seuls sorts auxquelles elles ont accès.

   IL N'Y A AUCUNE LISTE DE SORTS ICI. Ce que chaque classe sait lancer
   est déjà écrit dans personnages/classes-data.js, dans son bloc
   « grimoire », sous forme de renvois vers ce livre :
     famille:      #famille=resistance          → la famille entière
     sousFamilles: #groupe=sous-famille-du-feu  → une sous-famille
     sorts:        #sort=soin-mineur            → un sort isolé
     exclutGroupes: ["sous-famille-des-elementaires"]  → retiré de la famille
   Ce fichier ne fait que relire ces ancres. Corriger l'accès d'une
   classe, c'est donc toucher classes-data.js et rien d'autre — le livre
   suit. Si une ancre ne correspond à rien dans sorts.js, un avertissement
   part dans la console du navigateur (voir verifierAncres).

   Les doublons ne peuvent pas exister : on ne colle pas bout à bout des
   listes de sorts, on garde ou non chaque sort À SA PLACE dans le livre.
   Un sort réclamé par trois classes reste un sort, une fois, dans sa
   famille d'origine.

   Reconstruction : le moteur sait déjà se refaire de zéro — c'est ce
   qu'il fait à chaque bascule PC/mobile. On remplace LIVRE.familles et
   on rappelle construireGrimoire() : pagination, sommaire, marque-pages
   et index de recherche suivent tout seuls.

   Ce fichier doit être chargé APRÈS sorts.js et classes-data.js, mais
   AVANT livre-moteur.js : il pose le contenu filtré avant que le moteur
   ne construise le livre, pour qu'une arrivée par ?classes= n'ait pas à
   tout reconstruire une seconde fois.
   ================================================================== */
(function () {
  "use strict";

  if (typeof LIVRE === "undefined" || !window.CLASSES) return;

  /* Les portraits de la galerie des héros, vus depuis magie/ */
  var IMG_CLASSES = "../image-db/personnages/classes/";

  var TOUTES = LIVRE.familles;              // le livre entier, jamais modifié
  var INTRO_ORIGINE = LIVRE.sommaireIntro;  // l'intro du sommaire, hors filtre
  var TOTAL_SORTS = compter(TOUTES);
  var nbAffiches = TOTAL_SORTS;

  /* ---------- Petits outils ---------- */

  // Même règle que le moteur (livre-moteur.js) : c'est ce qui garantit
  // qu'une ancre écrite dans classes-data.js retombe sur le bon bloc.
  function slug(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function compter(familles) {
    var n = 0;
    familles.forEach(function (fam) {
      fam.sections.forEach(function (sec) { n += sec.sorts.length; });
    });
    return n;
  }

  // « du clerc », mais « de l'occultiste » si le nom commence par une voyelle
  function du(nom) {
    return /^[aeiouyàâäéèêëîïôöùûü]/i.test(nom) ? "de l'" + nom : "du " + nom;
  }

  /* ---------- Lecture des accès dans classes-data.js ---------- */

  // Extrait l'ancre d'un renvoi vers le livre, si c'est bien le niveau voulu.
  // Une entrée en texte simple (sans lien) ne donne rien : elle est ignorée.
  function ancre(entree, mot) {
    var m = /#(sort|famille|groupe)=(.+)$/.exec((entree && entree.lien) || "");
    return (m && m[1] === mot) ? slug(decodeURIComponent(m[2])) : null;
  }

  function ajouter(ensemble, a) { if (a) ensemble.add(a); }

  /* Les classes proposées au filtre : celles qui puisent dans CE livre.
     Le magicien n'a pas de bloc « grimoire » (il a le livre entier, ou un
     seul élément s'il est spécialisé) et l'hématomancien en a un qui ne
     renvoie nulle part (il puise dans le Grand Livre Sanguin) : ni l'un ni
     l'autre n'apparaît, le panneau le dit en toutes lettres. */
  function listeClasses() {
    return (CLASSES.liste || []).filter(function (c) {
      var g = c.grimoire;
      return c.type === "Mana" && g && (g.famille || g.sousFamilles || g.sorts);
    }).map(function (c) {
      var g = c.grimoire;
      var acces = {
        slug: c.slug, nom: c.nom, image: c.image,
        familles: new Set(), groupes: new Set(), sorts: new Set(),
        exclut: new Set((g.exclutGroupes || []).map(slug))
      };
      // « famille » est un objet unique aujourd'hui ; concat couvre le jour
      // où une classe en recevrait plusieurs.
      [].concat(g.famille || []).forEach(function (f) { ajouter(acces.familles, ancre(f, "famille")); });
      (g.sousFamilles || []).forEach(function (f) { ajouter(acces.groupes, ancre(f, "groupe")); });
      (g.sorts || []).forEach(function (f) { ajouter(acces.sorts, ancre(f, "sort")); });
      return acces;
    });
  }

  /* Un sort est-il accessible à cette classe ?
     Les sorts nommés un par un l'emportent sur l'exclusion : c'est ainsi que
     le bastioniste, privé de la création élémentaire, garde quand même Terre. */
  function autorise(acces, fam, sec, sort) {
    if (acces.sorts.has(slug(sort.nom)) || acces.sorts.has(slug(fam.id + "-" + sort.nom))) return true;
    var court = sec.titre ? slug(sec.titre) : null;
    if (court && (acces.groupes.has(court) || acces.groupes.has(slug(fam.id + "-" + sec.titre)))) return true;
    if (acces.familles.has(slug(fam.id))) return !(court && acces.exclut.has(court));
    return false;
  }

  // Le livre réduit aux classes choisies : les sous-familles vidées de leurs
  // sorts disparaissent, puis les familles vidées de leurs sous-familles.
  function livreFiltre(choisies) {
    var out = [];
    TOUTES.forEach(function (fam) {
      var sections = [];
      fam.sections.forEach(function (sec) {
        var sorts = sec.sorts.filter(function (sort) {
          return choisies.some(function (a) { return autorise(a, fam, sec, sort); });
        });
        if (sorts.length) sections.push(Object.assign({}, sec, { sorts: sorts }));
      });
      if (sections.length) out.push(Object.assign({}, fam, { sections: sections }));
    });
    return out;
  }

  /* Filet de sécurité pour l'atelier : une ancre de classes-data.js qui ne
     correspond à rien dans sorts.js (sort renommé, faute de frappe) ferait
     perdre des sorts à une classe SANS RIEN CASSER À L'ÉCRAN. On la signale
     dans la console plutôt que de la laisser passer sous silence. */
  function verifierAncres(classes) {
    var connus = { famille: new Set(), groupe: new Set(), sort: new Set() };
    TOUTES.forEach(function (fam) {
      connus.famille.add(slug(fam.id));
      fam.sections.forEach(function (sec) {
        if (sec.titre) {
          connus.groupe.add(slug(sec.titre));
          connus.groupe.add(slug(fam.id + "-" + sec.titre));
        }
        sec.sorts.forEach(function (sort) {
          connus.sort.add(slug(sort.nom));
          connus.sort.add(slug(fam.id + "-" + sort.nom));
        });
      });
    });
    classes.forEach(function (c) {
      [["famille", c.familles], ["groupe", c.groupes], ["sort", c.sorts], ["groupe", c.exclut]]
        .forEach(function (paire) {
          paire[1].forEach(function (a) {
            if (!connus[paire[0]].has(a)) {
              console.warn("Filtre par classe — " + c.nom + " : l'ancre #"
                + paire[0] + "=" + a + " ne correspond à aucune entrée de sorts.js.");
            }
          });
        });
    });
  }

  /* ---------- État et adresse de la page ----------
     Le filtre s'écrit dans l'adresse (?classes=clerc,druide) : il devient
     partageable, et la galerie des classes pourra y renvoyer directement.
     replaceState, et non un vrai changement d'adresse : le bouton Retour
     reste réservé à la navigation dans le livre (#sort=…). */
  var classes = listeClasses();
  var selection = new Set();

  function estConnue(s) {
    return classes.some(function (c) { return c.slug === s; });
  }

  function choisies() {
    return classes.filter(function (c) { return selection.has(c.slug); });
  }

  function lireURL() {
    var m = /[?&]classes=([^&#]*)/.exec(location.search);
    if (!m) return [];
    return decodeURIComponent(m[1]).split(",").map(slug).filter(estConnue);
  }

  function ecrireURL() {
    var p = new URLSearchParams(location.search);
    if (selection.size) p.set("classes", choisies().map(function (c) { return c.slug; }).join(","));
    else p.delete("classes");
    // La virgule est un caractère légal dans une valeur de requête, mais
    // URLSearchParams l'encode en %2C : on la rend lisible, puisque toute
    // l'idée est de pouvoir copier l'adresse et la partager telle quelle.
    var q = p.toString().replace(/%2C/g, ",");
    history.replaceState(null, "", location.pathname + (q ? "?" + q : "") + location.hash);
  }

  /* Un lien vers un sort a le dernier mot sur le filtre : ouvrir
     ?classes=clerc#sort=petite-boule-de-feu doit montrer la boule de feu,
     pas une page blanche. Si la cible du lien ne survit pas au filtre, on
     lève le filtre — au chargement comme à la volée (voir hashchange). */
  function hashSurvit() {
    var m = location.hash.match(/^#(sort|famille|groupe)=(.+)$/);
    if (!m) return true;
    var visee = slug(decodeURIComponent(m[2]));
    var fams = selection.size ? livreFiltre(choisies()) : TOUTES;
    return fams.some(function (fam) {
      if (m[1] === "famille" && slug(fam.id) === visee) return true;
      return fam.sections.some(function (sec) {
        if (m[1] === "groupe" && sec.titre) {
          if (slug(sec.titre) === visee || slug(fam.id + "-" + sec.titre) === visee) return true;
        }
        return m[1] === "sort" && sec.sorts.some(function (s) {
          return slug(s.nom) === visee || slug(fam.id + "-" + s.nom) === visee;
        });
      });
    });
  }

  /* ---------- Application ---------- */

  // Pose le contenu du livre. Séparé de la reconstruction : au chargement,
  // le moteur n'a pas encore construit quoi que ce soit.
  function poserContenu() {
    var choix = choisies();
    LIVRE.familles = choix.length ? livreFiltre(choix) : TOUTES;
    nbAffiches = compter(LIVRE.familles);
    LIVRE.sommaireIntro = choix.length ? introFiltre(choix) : INTRO_ORIGINE;
  }

  function introFiltre(choix) {
    var noms = choix.map(function (c) { return du(c.nom.toLowerCase()); });
    var liste = noms.length > 1
      ? noms.slice(0, -1).join(", ") + " et " + noms[noms.length - 1]
      : noms[0];
    return "Ce livre ne montre que les sorts " + liste + ".<br>"
      + nbAffiches + " sortilège" + (nbAffiches > 1 ? "s" : "") + " sur " + TOTAL_SORTS + ".";
  }

  // sommaire : après un clic de l'utilisateur, on ouvre le livre au sommaire
  // pour qu'il voie tout de suite ce qu'il reste. Sans animation : les pages
  // d'avant n'existent plus, les faire défiler n'aurait aucun sens.
  function appliquer(sommaire) {
    poserContenu();
    majPanneau();
    ecrireURL();
    if (typeof construireGrimoire !== "function") return;
    construireGrimoire();
    if (sommaire) sauterAPage(0);
  }

  /* ---------- Le bouton et son panneau ---------- */
  var bouton = document.getElementById("filtreBouton");
  var panneau = document.getElementById("filtrePanneau");
  var badge, effacer, cases = {};

  function construirePanneau() {
    var titre = document.createElement("p");
    titre.className = "filtre-titre";
    titre.textContent = "N'afficher que les sorts accessibles à…";
    panneau.appendChild(titre);

    var grille = document.createElement("div");
    grille.className = "filtre-grille";
    classes.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filtre-classe";
      b.setAttribute("aria-pressed", "false");

      var img = document.createElement("img");
      img.src = IMG_CLASSES + encodeURIComponent(c.image);
      img.alt = "";
      img.loading = "lazy";
      img.width = 1000;
      img.height = 1000;

      var cadre = document.createElement("span");
      cadre.className = "filtre-portrait";
      cadre.appendChild(img);

      var nom = document.createElement("span");
      nom.className = "filtre-nom";
      nom.textContent = c.nom;

      b.appendChild(cadre);
      b.appendChild(nom);
      b.addEventListener("click", function () {
        if (selection.has(c.slug)) selection.delete(c.slug); else selection.add(c.slug);
        appliquer(true);
      });
      cases[c.slug] = b;
      grille.appendChild(b);
    });
    panneau.appendChild(grille);

    /* Le seul texte sous les portraits, et il ne paraît que lorsqu'il sert
       à quelque chose : tout éteindre d'un coup quand plusieurs classes sont
       allumées. Le reste — magicien, hématomancien, sorts propres à la
       classe — se comprend de soi-même et n'encombre plus le panneau. */
    effacer = document.createElement("button");
    effacer.type = "button";
    effacer.className = "filtre-effacer";
    effacer.textContent = "Rendre le livre entier";
    effacer.addEventListener("click", function () {
      if (!selection.size) return;
      selection.clear();
      appliquer(true);
    });
    panneau.appendChild(effacer);

    badge = document.createElement("span");
    badge.className = "filtre-badge";
    bouton.appendChild(badge);
  }

  function majPanneau() {
    classes.forEach(function (c) {
      var actif = selection.has(c.slug);
      cases[c.slug].classList.toggle("actif", actif);
      cases[c.slug].setAttribute("aria-pressed", actif ? "true" : "false");
    });
    bouton.classList.toggle("actif", selection.size > 0);
    badge.textContent = selection.size ? String(selection.size) : "";
    effacer.hidden = selection.size === 0;
  }

  function ouvrir(oui) {
    panneau.hidden = !oui;
    bouton.setAttribute("aria-expanded", oui ? "true" : "false");
  }

  bouton.addEventListener("click", function (e) {
    e.stopPropagation();
    ouvrir(panneau.hidden);
  });
  panneau.addEventListener("click", function (e) { e.stopPropagation(); });
  document.addEventListener("click", function () { ouvrir(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panneau.hidden) { ouvrir(false); bouton.focus(); }
  });

  /* Lien vers un sort masqué, sur une page déjà ouverte : on lève le filtre
     et on reconstruit AVANT que le moteur ne cherche sa cible. Notre écouteur
     est posé en premier (ce fichier est chargé avant livre-moteur.js), il
     passe donc avant le sien. */
  window.addEventListener("hashchange", function () {
    if (!selection.size || hashSurvit()) return;
    selection.clear();
    appliquer(false);
  });

  /* ---------- Démarrage ---------- */
  verifierAncres(classes);
  lireURL().forEach(function (s) { selection.add(s); });
  // Filtre levé par un lien vers un sort masqué : l'adresse doit le dire
  // aussi, sinon elle promet un filtre que la page n'applique pas.
  if (selection.size && !hashSurvit()) { selection.clear(); ecrireURL(); }
  poserContenu();        // avant que livre-moteur.js ne construise le livre
  construirePanneau();
  majPanneau();
})();
