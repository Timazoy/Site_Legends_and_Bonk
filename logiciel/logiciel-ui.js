/* ==================================================================
   INTERFACE DE LA PAGE LOGICIEL
   Fait le lien entre les champs de la page et les fonctions de jeu
   de logiciel.js (getArmes, getArmures, loot, calcDmg…).

   Règle de séparation :
     logiciel.js     = les règles du jeu (tirages, calculs). Ne touche
                       jamais au DOM et ne connaît pas la page.
     logiciel-ui.js  = lit les champs, valide, affiche. Ne contient
                       aucune règle de jeu.

   Ce fichier est chargé en fin de <body> : le DOM est donc déjà prêt,
   pas besoin d'attendre DOMContentLoaded.
   ================================================================== */
(function () {
  "use strict";

  /* ---------- Petits utilitaires ---------- */

  // Ouvre un modal avec le contenu donné. Le modal ne s'ouvre que d'ici :
  // les boutons n'ont plus de data-bs-toggle, sinon il s'ouvrirait même
  // quand la saisie est invalide.
  function afficherModal(idModal, html) {
    var modal = document.getElementById(idModal);
    if (!modal) return;
    modal.querySelector(".modal-body").innerHTML = html;
    bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  /* Quel outil a parlé. Le bandeau de la banderole prend ce titre quand
     elle sert à annoncer une erreur : sans lui, on ne saurait pas de quel
     générateur vient le message, surtout depuis l'onglet « Divers ». */
  var TITRES = {
    arme: "Le générateur d'armes",
    armure: "Le générateur d'armures",
    potion: "Le générateur de potions",
    fleches: "Le générateur de flèches",
    loot: "Rareté et enchantements",
    ench: "L'enchantement",
    degats: "Le calculateur de dégâts",
    pourcent: "Le calculateur de pourcentage",
    random: "L'aléatoire borné"
  };

  // Branche un clic sur un bouton, s'il existe.
  function surClic(idBouton, action) {
    var btn = document.getElementById(idBouton);
    if (btn) btn.addEventListener("click", action);
  }

  function valeur(ariaLabel) {
    var el = document.querySelector('[aria-label="' + ariaLabel + '"]');
    return el ? el.value : "";
  }

  function nombre(ariaLabel) {
    return parseFloat(valeur(ariaLabel));
  }

  function echapper(texte) {
    var d = document.createElement("div");
    d.textContent = texte == null ? "" : texte;
    return d.innerHTML;
  }

  /* ==================================================================
     L'ÉCRAN DE BUTIN

     Une ouverture de caisse : un ruban de cartes défile puis ralentit
     devant un curseur, et s'arrête sur l'objet tiré.

     Le tirage est fait AVANT l'animation, par logiciel.js — comme dans
     les jeux dont c'est emprunté. L'animation ne décide de rien, elle
     ne fait que montrer un résultat déjà écrit. C'est aussi ce qui
     permet de la passer d'un clic sans rien fausser.

     Le remplissage du ruban est tiré parmi les objets qui pouvaient
     réellement sortir avec les critères choisis (armesPossibles /
     armuresPossibles / potionsPossibles) : ce qui défile n'est jamais
     un mensonge.
     ================================================================== */

  var CARTES_RUBAN = 40;   // longueur du ruban
  var INDEX_GAGNANT = 33;  // là où on place l'objet tiré : assez loin pour
                           // que ça défile, assez tôt pour qu'il reste des
                           // cartes derrière lui à l'arrêt
  var DUREE_MIN = 3400;
  var DUREE_MAX = 4200;

  // Mêmes couleurs de rareté que les cartes du catalogue (equipement/armes.html) :
  // celles des catalogues sont pensées pour du texte sur fond clair, celles-ci
  // pour des cadres sur fond sombre.
  var CADRES = {
    C:  { line: "#9a9484", gem: "#c4bda9", glow: "rgba(196,189,169,.4)" },
    SC: { line: "#5b93ff", gem: "#7db0ff", glow: "rgba(91,147,255,.6)" },
    R:  { line: "#57c23a", gem: "#7ee05a", glow: "rgba(87,194,58,.6)" },
    SR: { line: "#28e070", gem: "#57ff97", glow: "rgba(40,224,112,.65)" },
    E:  { line: "#b45cff", gem: "#cd8bff", glow: "rgba(180,92,255,.65)" },
    SE: { line: "#ff53d6", gem: "#ff86e4", glow: "rgba(255,83,214,.65)" }
  };
  var CADRE_NEUTRE = { line: "#6f6552", gem: "#b8b0a0", glow: "rgba(0,0,0,.35)" };
  var ORDRE_RARETES = ["C", "SC", "R", "SR", "E", "SE"];

  // Illustrations et raretés, lues dans les catalogues : logiciel.js donne
  // les noms qui tombent, la présentation se sert ici.
  function indexerCatalogue(db, dossier) {
    var index = {};
    ((db && db.objets) || []).forEach(function (o) {
      var fichier = (o.images && o.images[0]) || o.img;
      index[o.nom] = {
        img: fichier ? dossier + encodeURIComponent(fichier) : "",
        // les potions ont bien un champ "tiers", mais ce sont des paliers de
        // puissance (des objets), pas des raretés : on ne garde que les codes
        tiers: (o.tiers && typeof o.tiers[0] === "string") ? o.tiers : null,
        glow: o.glow || null
      };
    });
    return index;
  }

  var CATALOGUES = {
    arme: indexerCatalogue(window.EQUIP_ARMES, "../image-db/equipement/armes/"),
    armure: indexerCatalogue(window.EQUIP_ARMURES, "../image-db/equipement/armures/"),
    potion: indexerCatalogue(window.EQUIP_POTIONS, "../image-db/equipement/potions/")
  };

  var NOMS_RARETES = (window.EQUIP_ARMES && window.EQUIP_ARMES.raretes) || {};

  function alea(n) { return Math.floor(Math.random() * n); }

  /* De combien le ruban s'arrête à côté du centre de la carte gagnante.

     Un tirage uniforme laisserait presque toujours le curseur bien au
     milieu de la carte : pas de tension. La courbe ci-dessous pousse le
     résultat vers les bords — environ une fois sur deux, le ruban
     s'immobilise à un cheveu de la carte voisine. Le faux espoir fait
     partie du plaisir, et il ne coûte rien : le gagnant était déjà tiré.

     Plafonné à 44 % de la largeur : le curseur mord toujours la bonne
     carte, jamais l'espace entre deux. Baisser BORD vers 0 recentre,
     le monter vers 1 rendrait l'arrêt ambigu. */
  var AMPLITUDE_ARRET = 0.44;
  var BORD = 0.55;   // < 1 : plus c'est bas, plus ça colle aux bords

  function decalageArret(largeurCarte) {
    var u = Math.random() * 2 - 1;                       // [-1, 1[
    var tire = (u < 0 ? -1 : 1) * Math.pow(Math.abs(u), BORD);
    return tire * largeurCarte * AMPLITUDE_ARRET;
  }

  // Rareté d'affichage d'une carte de remplissage : une de celles que
  // l'objet peut réellement porter, dans la fourchette demandée.
  function rareteDecor(fiche, fourchette) {
    if (!fiche || !fiche.tiers) return null;
    var possibles = fourchette
      ? fiche.tiers.filter(function (t) { return fourchette.indexOf(t) !== -1; })
      : fiche.tiers;
    if (!possibles.length) possibles = fiche.tiers;
    return possibles[alea(possibles.length)];
  }

  // Une carte du ruban, dessinée comme celles du catalogue.
  function carteButin(type, nom, rarete) {
    var fiche = CATALOGUES[type][nom] || {};
    // les potions n'ont pas de rareté : leur cadre prend la couleur du
    // flacon, éclaircie en halo (le "55" final = à peine un tiers d'opacité)
    var cadre = (rarete && CADRES[rarete]) ? CADRES[rarete]
      : /^#[0-9a-f]{6}$/i.test(fiche.glow || "")
        ? { line: fiche.glow, gem: fiche.glow, glow: fiche.glow + "55" }
        : CADRE_NEUTRE;

    // pas de loading="lazy" ici : le ruban défile trop vite, une image
    // chargée en retard apparaîtrait après le passage de sa carte
    var art = fiche.img
      ? '<img src="' + fiche.img + '" alt="">'
      : '<span>' + echapper(nom.charAt(0)) + '</span>';

    return '<div class="butin-carte" style="--rl:' + cadre.line
      + ';--rg:' + cadre.gem + ';--rgl:' + cadre.glow + '">'
      + '<div class="butin-art">' + art + '</div>'
      + '<div class="butin-nom">' + echapper(nom) + '</div>'
      + '</div>';
  }

  var butin = document.getElementById("butin");
  var butinTitre = document.getElementById("butinTitre");
  var butinPiste = document.getElementById("butinPiste");
  var butinRuban = document.getElementById("butinRuban");
  var butinResultat = document.getElementById("butinResultat");
  var boutonsButin = ["btnArme", "btnArmure", "btnPotion"];

  var enCours = false;      // un ruban est en train de défiler
  var distanceFinale = 0;   // où il doit s'arrêter, pour pouvoir y sauter
  var minuterie = null;
  var terminer = null;      // ce qu'il reste à faire une fois arrêté

  function animationsCoupees() {
    return window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function verrouiller(verrou) {
    boutonsButin.forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.disabled = verrou;
    });
  }

  function afficherButin(titre) {
    butinTitre.textContent = titre;
    butin.hidden = false;
  }

  // Amener la bande sous les yeux — à appeler une fois le ruban rempli,
  // sinon on vise une bande encore vide et donc trop courte.
  // Volontairement vertical seulement : scrollIntoView déplacerait aussi
  // la page latéralement sur les écrans étroits.
  function amenerEnVue() {
    var cadre = butin.getBoundingClientRect();
    var marge = 16;
    var haut = window.pageYOffset + cadre.top - marge;
    var deborde = cadre.bottom + marge > window.innerHeight;

    if (cadre.top >= 0 && !deborde) return;

    window.scrollTo({
      top: haut,
      behavior: animationsCoupees() ? "auto" : "smooth"
    });
  }

  // Coupe net une ouverture en cours : une erreur peut venir d'un autre
  // outil pendant qu'un ruban défile encore.
  function interrompre() {
    if (!enCours) return;
    clearTimeout(minuterie);
    enCours = false;
    verrouiller(false);
  }

  /* TOUS les messages d'erreur de la page passent par ici : plus aucun
     alert() bloquant. La banderole s'ouvre, la piste reste vide, et le
     message s'affiche à la place du résultat. */
  function butinEnErreur(titre, message) {
    interrompre();
    afficherButin(titre);
    butin.classList.add("erreur");   // masque la piste : rien à faire défiler
    butinRuban.classList.remove("arrete");
    butinRuban.style.transition = "none";
    butinRuban.style.transform = "translateX(0)";
    butinRuban.innerHTML = "";
    butinResultat.innerHTML = '<span class="butin-erreur"><strong>Erreur :</strong> '
      + echapper(message) + "</span>";
    amenerEnVue();
  }

  // On change d'onglet : ce qu'affichait la banderole concernait l'outil
  // qu'on vient de quitter.
  function fermerButin() {
    interrompre();
    butin.hidden = true;
    butinRuban.innerHTML = "";
    butinResultat.innerHTML = "";
  }

  /* Ouvre la caisse.
       type       arme | armure | potion (pour les images)
       titre      le bandeau au-dessus de la piste
       possibles  ce qui pouvait tomber, pour le remplissage
       gagnant    l'objet tiré, tel qu'il s'affiche sur sa carte
       rarete     code majuscule de la rareté tirée, ou null
       fourchette codes majuscules autorisés au tirage, ou null
       resume     le HTML de la ligne de résultat */
  function ouvrirCaisse(o) {
    if (enCours) return;
    enCours = true;
    verrouiller(true);
    afficherButin(o.titre);
    butinResultat.innerHTML = "";

    var pioche = o.possibles && o.possibles.length ? o.possibles : [o.gagnant];
    var cartes = [];
    for (var i = 0; i < CARTES_RUBAN; i++) {
      if (i === INDEX_GAGNANT) {
        cartes.push(carteButin(o.type, o.gagnant, o.rarete));
      } else {
        var nom = pioche[alea(pioche.length)];
        cartes.push(carteButin(o.type, nom, rareteDecor(CATALOGUES[o.type][nom], o.fourchette)));
      }
    }
    butinRuban.innerHTML = cartes.join("");
    butin.classList.remove("erreur");
    butinRuban.classList.remove("arrete");
    amenerEnVue();

    // Retour à zéro sans animation avant de lancer le défilement.
    butinRuban.style.transition = "none";
    butinRuban.style.transform = "translateX(0)";

    // Distance mesurée sur la carte elle-même : aucune largeur n'est
    // recopiée depuis le CSS.
    var cible = butinRuban.children[INDEX_GAGNANT];
    distanceFinale = cible.offsetLeft + cible.offsetWidth / 2
      - butinPiste.clientWidth / 2 + decalageArret(cible.offsetWidth);

    terminer = function () {
      butinRuban.classList.add("arrete");   // éteint les cartes perdantes
      cible.classList.add("gagnant");
      butinResultat.innerHTML = o.resume;
      enCours = false;
      verrouiller(false);
    };

    if (animationsCoupees()) {
      butinRuban.style.transform = "translateX(" + (-distanceFinale) + "px)";
      terminer();
      return;
    }

    // On force la prise en compte du retour à zéro, sinon le navigateur
    // regroupe les deux transform et il ne se passe rien.
    void butinRuban.offsetWidth;

    var duree = DUREE_MIN + alea(DUREE_MAX - DUREE_MIN);
    butinRuban.style.transition = "transform " + duree + "ms cubic-bezier(.08,.62,.1,1)";
    butinRuban.style.transform = "translateX(" + (-distanceFinale) + "px)";
    minuterie = setTimeout(terminer, duree);
  }

  // Cliquer la piste abrège l'attente : le résultat était déjà décidé,
  // on ne fait que raccourcir le trajet.
  if (butinPiste) butinPiste.addEventListener("click", function () {
    if (!enCours) return;
    clearTimeout(minuterie);

    // On repart de la position atteinte, sinon changer la durée d'une
    // transition en cours fait sauter le ruban.
    var position = window.getComputedStyle(butinRuban).transform;
    butinRuban.style.transition = "none";
    butinRuban.style.transform = position;
    void butinRuban.offsetWidth;

    butinRuban.style.transition = "transform 260ms ease-out";
    butinRuban.style.transform = "translateX(" + (-distanceFinale) + "px)";
    minuterie = setTimeout(terminer, 260);
  });

  // Ligne de résultat commune aux armes et aux armures : [nom, [rareté, ench]]
  function resumeObjet(resultat) {
    var code = String(resultat[1][0]).toUpperCase();
    var cadre = CADRES[code] || CADRE_NEUTRE;
    var rarete = NOMS_RARETES[code] ? NOMS_RARETES[code].nom : code;

    return '<span class="butin-objet">' + echapper(resultat[0]) + "</span><br>"
      + '<span class="butin-rarete" style="color:' + cadre.gem + '">' + echapper(rarete) + "</span>"
      + ' · <span class="butin-ench">' + echapper(resultat[1][1]) + "</span>";
  }

  // Les codes de rareté entre deux bornes, en majuscules (pour le décor
  // des cartes de remplissage).
  function fourchetteRaretes(min, max) {
    var i = ORDRE_RARETES.indexOf(String(min).toUpperCase());
    var j = ORDRE_RARETES.indexOf(String(max).toUpperCase());
    if (i < 0 || j < 0 || i > j) return null;
    return ORDRE_RARETES.slice(i, j + 1);
  }

  /* ---------- Onglets : une card par bouton radio ---------- */
  var radios = document.querySelectorAll('input[name="btnradio"]');

  radios.forEach(function (radio, index) {
    radio.addEventListener("change", function () {
      if (!radio.checked) return;
      radios.forEach(function (_, i) {
        var card = document.getElementById("card" + (i + 1));
        if (card) card.style.display = i === index ? "block" : "none";
      });
      fermerButin();
    });
  });

  // La première card est visible par défaut
  var premiere = document.getElementById("card1");
  if (premiere) premiere.style.display = "block";

  /* ---------- Générateur d'armes ---------- */
  surClic("btnArme", function () {
    var GC = valeur("GC");
    var PC = valeur("PC");
    var CS = valeur("CS");
    var rarMin = valeur("rarminarme");
    var rarMax = valeur("rarmaxarme");

    if (!rarMin || !rarMax) {
      butinEnErreur(TITRES.arme, "Veuillez sélectionner les raretés minimum et maximum.");
      return;
    }
    if (!GC && !CS) {
      butinEnErreur(TITRES.arme,
        "Veuillez sélectionner soit une grande catégorie, soit une catégorie spéciale.");
      return;
    }

    // la catégorie spéciale prime sur la grande catégorie
    var criteres = CS ? ["x", "x", CS] : [GC, PC || "x", "x"];
    var resultat = getArmes(criteres[0], criteres[1], criteres[2], rarMin, rarMax);

    if (resultat.error) {
      butinEnErreur(TITRES.arme, resultat.error);
      return;
    }

    ouvrirCaisse({
      type: "arme",
      titre: "L'arme générée",
      possibles: armesPossibles(criteres[0], criteres[1], criteres[2], rarMin, rarMax),
      gagnant: resultat[0],
      rarete: String(resultat[1][0]).toUpperCase(),
      fourchette: fourchetteRaretes(rarMin, rarMax),
      resume: resumeObjet(resultat)
    });
  });

  /* ---------- Générateur d'armures ---------- */
  surClic("btnArmure", function () {
    var cat = valeur("CA");
    var rarMin = valeur("rarminarmure");
    var rarMax = valeur("rarmaxarmure");

    if (!cat || !rarMin || !rarMax) {
      butinEnErreur(TITRES.armure,
        "Veuillez sélectionner une catégorie et les raretés minimum et maximum.");
      return;
    }

    var resultat = getArmures(cat, rarMin, rarMax);

    if (resultat.error) {
      butinEnErreur(TITRES.armure, resultat.error);
      return;
    }

    ouvrirCaisse({
      type: "armure",
      titre: "L'armure générée",
      possibles: armuresPossibles(cat, rarMin, rarMax),
      gagnant: resultat[0],
      rarete: String(resultat[1][0]).toUpperCase(),
      fourchette: fourchetteRaretes(rarMin, rarMax),
      resume: resumeObjet(resultat)
    });
  });

  /* ---------- Potion ----------
     Pas de rareté ici : les potions se distinguent par leur taille, et
     leur couleur de carte vient du "glow" du catalogue. */
  surClic("btnPotion", function () {
    var tirage = tirerPotion();

    if (tirage.error) {
      butinEnErreur(TITRES.potion, tirage.error);
      return;
    }

    ouvrirCaisse({
      type: "potion",
      titre: "La potion générée",
      possibles: potionsPossibles(),
      gagnant: tirage.nom,
      rarete: null,
      fourchette: null,
      resume: '<span class="butin-objet">' + echapper(tirage.nom) + "</span>"
        + (tirage.taille ? '<br><span class="butin-ench">Format : '
          + echapper(tirage.taille) + "</span>" : "")
    });
  });

  /* ---------- Flèches ---------- */
  surClic("btnFleches", function () {
    var tirage = getFlèches();
    if (tirage.error) {
      butinEnErreur(TITRES.fleches, tirage.error);
      return;
    }

    var noms = Object.keys(tirage);
    var contenu = "<strong>Flèches générées :</strong><br>";

    contenu += noms.length === 0
      ? "Aucune flèche générée"
      : noms.map(function (nom) { return nom + " : " + tirage[nom]; }).join("<br>");

    afficherModal("flechesgenModal", contenu);
  });

  /* ---------- Loot (rareté seule) ---------- */
  surClic("btnLoot", function () {
    var rarMin = valeur("rarminloot");
    var rarMax = valeur("rarmaxloot");

    if (!rarMin || !rarMax) {
      butinEnErreur(TITRES.loot, "Veuillez sélectionner les raretés minimum et maximum.");
      return;
    }

    var resultat = loot(rarMin, rarMax);

    if (resultat.error) {
      butinEnErreur(TITRES.loot, resultat.error);
      return;
    }

    afficherModal("lootModal", "<strong>Rareté :</strong> " + resultat[0]
      + "<br><strong>Enchantement :</strong> " + resultat[1]);
  });

  /* ---------- Enchantement seul ---------- */
  surClic("btnEnch", function () {
    var rar = valeur("rarminench");
    if (!rar) {
      butinEnErreur(TITRES.ench, "Veuillez sélectionner une rareté.");
      return;
    }
    afficherModal("enchModal", "<strong>Enchantement :</strong> " + ench(rar));
  });

  /* ---------- Calculateur de dégâts ---------- */
  function calculerDegats(type, idModal) {
    var dmgMax = nombre("dgmax");
    var pourcentPlus = nombre("pourcentplus") || 0;
    var chanceEffet = nombre("dgeffet") || 0;

    if (isNaN(dmgMax) || dmgMax <= 0) {
      butinEnErreur(TITRES.degats, "Veuillez entrer un nombre de dégâts valide.");
      return;
    }

    var resultat = calcDmg(type, dmgMax, pourcentPlus, chanceEffet);
    var effet = resultat[1] ? "<br><strong>Effet :</strong> " + resultat[1] : "";
    afficherModal(idModal, "<strong>Dégâts infligés :</strong> " + resultat[0] + effet);
  }

  surClic("btnDmgFleche", function () { calculerDegats("fle", "dgflecheModal"); });
  surClic("btnDmgClassique", function () { calculerDegats("normal", "declaModal"); });

  /* ---------- Calculateur de pourcentage ---------- */
  surClic("btnPourcent", function () {
    var nb = nombre("nombrepourcent");
    var pct = nombre("pourcent");

    if (isNaN(nb) || isNaN(pct)) {
      butinEnErreur(TITRES.pourcent, "Veuillez entrer des nombres valides.");
      return;
    }

    afficherModal("pourcentModal",
      "<strong>Résultat :</strong> " + pct + "% de " + nb + " = " + calculPourcent(nb, pct));
  });

  /* ---------- Aléatoire borné ---------- */
  surClic("btnRandomBorne", function () {
    var min = parseInt(valeur("minrandom"), 10);
    var max = parseInt(valeur("maxrandom"), 10);

    if (isNaN(min) || isNaN(max) || min > max) {
      butinEnErreur(TITRES.random,
        "Veuillez entrer des nombres valides, avec un minimum inférieur ou égal au maximum.");
      return;
    }

    afficherModal("randomModal", "<strong>Résultat :</strong> " + rand(min, max));
  });

  /* ---------- Dés ----------
     Le nombre de faces vient de l'attribut data-de : le libellé du
     bouton reste libre. */
  document.querySelectorAll("button[data-de]").forEach(function (btn) {
    var faces = parseInt(btn.dataset.de, 10);
    btn.addEventListener("click", function () {
      // le D10 est numéroté de 0 à 9, les autres de 1 à N
      var resultat = faces === 10 ? rand(0, 9) : rand(1, faces);
      afficherModal("randomModal", "<strong>Résultat du D" + faces + " :</strong> " + resultat);
    });
  });
})();
