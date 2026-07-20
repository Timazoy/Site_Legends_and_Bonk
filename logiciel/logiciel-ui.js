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

  function erreur(message) {
    return "<strong>Erreur :</strong> " + message;
  }

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

  // Mise en forme commune aux armes et aux armures : [nom, [rareté, ench]]
  function decrireObjet(etiquette, resultat) {
    return "<strong>" + etiquette + " :</strong> " + resultat[0]
      + "<br><strong>Rareté :</strong> " + resultat[1][0]
      + "<br><strong>Enchantement :</strong> " + resultat[1][1];
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
      alert("Veuillez sélectionner les rarétés minimum et maximum");
      return;
    }
    if (!GC && !CS) {
      alert("Veuillez sélectionner soit une grande catégorie, soit une catégorie spéciale");
      return;
    }

    // la catégorie spéciale prime sur la grande catégorie
    var resultat = CS
      ? getArmes("x", "x", CS, rarMin, rarMax)
      : getArmes(GC, PC || "x", "x", rarMin, rarMax);

    afficherModal("armegenModal", resultat.error
      ? erreur(resultat.error)
      : decrireObjet("Arme", resultat));
  });

  /* ---------- Générateur d'armures ---------- */
  surClic("btnArmure", function () {
    var cat = valeur("CA");
    var rarMin = valeur("rarminarmure");
    var rarMax = valeur("rarmaxarmure");

    if (!cat || !rarMin || !rarMax) {
      alert("Veuillez sélectionner une catégorie et les rarétés min/max");
      return;
    }

    var resultat = getArmures(cat, rarMin, rarMax);
    afficherModal("armuregenModal", resultat.error
      ? erreur(resultat.error)
      : decrireObjet("Armure", resultat));
  });

  /* ---------- Potion ---------- */
  surClic("btnPotion", function () {
    afficherModal("potiongenModal", "<strong>Potion :</strong> " + getPotion());
  });

  /* ---------- Flèches ---------- */
  surClic("btnFleches", function () {
    var tirage = getFlèches();
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
      alert("Veuillez sélectionner les rarétés minimum et maximum");
      return;
    }

    var resultat = loot(rarMin, rarMax);
    afficherModal("lootModal", resultat.error
      ? erreur(resultat.error)
      : "<strong>Rareté :</strong> " + resultat[0]
      + "<br><strong>Enchantement :</strong> " + resultat[1]);
  });

  /* ---------- Enchantement seul ---------- */
  surClic("btnEnch", function () {
    var rar = valeur("rarminench");
    if (!rar) {
      alert("Veuillez sélectionner une rareté");
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
      alert("Veuillez entrer un nombre de dégâts valide");
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
      alert("Veuillez entrer des nombres valides");
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
      alert("Veuillez entrer des nombres valides avec minimum ≤ maximum");
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
