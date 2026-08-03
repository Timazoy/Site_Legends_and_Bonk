/* ==================================================================
   L'OUTIL DE CRÉATION DE PERSONNAGE — « le pantin d'atelier »
   Lit classes-data.js et races-data.js, et rejoue les étapes 1 à 4 du
   guide (regles_creation.html) en les calculant au fur et à mesure.

   La race vient d'abord, la classe ensuite — le guide suit le même ordre
   depuis qu'il a été aligné dessus. Ce n'est pas un caprice de mise en
   page : la race décide du nombre de points à répartir (19, 22 pour
   l'humain, 14 pour le garou), de la liste même des statistiques (le garou
   n'a pas Sagesse ni Intelligence mais Instinct) et des classes accessibles
   (l'oni n'a pas droit au bi-classe, le golemovi alchimique pas à la
   magie). On ne peut donc pas dessiner l'étape des statistiques avant de la
   connaître.

   Ce que l'outil NE fait pas, volontairement : il ne sauvegarde rien,
   n'exporte rien, et s'arrête au récapitulatif. Tout ce qui n'est pas
   chiffrable (immunités, pourcentages, bonus conditionnels) est rappelé
   au joueur sans être calculé — voir « les effets à appliquer ».
   ================================================================== */
(function () {
  "use strict";

  var RACES = (window.RACES && window.RACES.liste) || [];
  var CLASSES = (window.CLASSES && window.CLASSES.liste) || [];
  /* Les trois moteurs — Capacités, Mana, Ressource — avec leur couleur. La
     galerie des classes les présente sous ce nom ; l'outil reprend les mêmes
     mots et les mêmes teintes pour qu'on passe d'une page à l'autre sans
     réapprendre le code. */
  var MOTEURS = (window.CLASSES && window.CLASSES.types) || [];

  var IMG_RACES = "../image-db/personnages/races/";
  var IMG_CLASSES = "../image-db/personnages/classes/";

  /* Les constantes du guide, étapes 3 et 4. */
  var BASE = 8;             /* chaque statistique part de 8 */
  var POINTS = 19;          /* points à répartir, sauf mention de la race */
  var PLAFOND = 15;         /* maximum d'une statistique à la création */
  var PV_BASE = 60;
  var PM_BASE = 75;

  var SIX = [
    { cle: "force", nom: "Force", court: "FOR" },
    { cle: "dexterite", nom: "Dextérité", court: "DEX" },
    { cle: "constitution", nom: "Constitution", court: "CON" },
    { cle: "intelligence", nom: "Intelligence", court: "INT" },
    { cle: "sagesse", nom: "Sagesse", court: "SAG" },
    { cle: "charisme", nom: "Charisme", court: "CHA" }
  ];
  /* Le garou remplace Sagesse et Intelligence par une seule Instinct : il
     répartit donc sur cinq statistiques, pas six. */
  var CINQ = [SIX[0], SIX[1], SIX[2],
    { cle: "instinct", nom: "Instinct", court: "INS" }, SIX[5]];

  /* ============ petits outils ============ */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* « Dextérité » → « dexterite » : les données nomment les statistiques en
     toutes lettres, le moteur les manipule en clés sans accent. */
  function cle(nom) {
    return String(nom || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function signe(n) { return (n > 0 ? "+" : "−") + Math.abs(n); }
  function $(id) { return document.getElementById(id); }

  /* Le modificateur de jet : une tranche de 2 points au-dessus de 10 vaut
     +1 ; en dessous de 10, c'est −1 par point. */
  function modificateur(v) {
    return v >= 10 ? Math.floor((v - 10) / 2) : v - 10;
  }

  function raceParSlug(slug) {
    for (var i = 0; i < RACES.length; i++) if (RACES[i].slug === slug) return RACES[i];
    return null;
  }
  function classeParSlug(slug) {
    for (var i = 0; i < CLASSES.length; i++) if (CLASSES[i].slug === slug) return CLASSES[i];
    return null;
  }
  function sousRaceDe(race, i) {
    if (!race || !race.sousRaces || i == null) return null;
    return race.sousRaces[i] || null;
  }
  function moteurDe(c) {
    for (var i = 0; i < MOTEURS.length; i++) if (MOTEURS[i].id === c.type) return MOTEURS[i];
    return null;
  }

  /* ==================================================================
     LE MOTEUR
     Une seule fonction, sans effet de bord : elle prend l'état et rend
     tout ce que la fiche doit afficher.
     ================================================================== */

  function calculer(e) {
    var race = raceParSlug(e.race);
    var sr = sousRaceDe(race, e.sousRace);
    var regles = (race && race.regles) || {};
    var mods = (sr && sr.mods) || {};
    var liste = regles.instinct ? CINQ : SIX;

    var r = {
      race: race, sousRace: sr, liste: liste,
      instinct: !!regles.instinct,
      statsFixes: !!regles.statsFixes,
      biclasseInterdit: !!regles.biclasseInterdit,
      magieInterdite: !!mods.magieInterdite,
      metierPossible: !!mods.metier,
      stats: {}, comptes: [], aAppliquer: []
    };

    /* Une race à sous-races n'est pas un choix fini : tant que la variante
       n'est pas posée, on ne connaît ni les bonus, ni parfois le nombre de
       points. Les étapes suivantes restent donc fermées. */
    r.sousRaceRequise = !!(race && race.sousRaces && race.sousRaces.length);
    r.pret = !!race && (!r.sousRaceRequise || !!sr);

    /* --- les points à répartir --- */
    r.pointsTotal = (regles.points || POINTS) + (regles.pointsBonus || 0) + (mods.pointsBonus || 0);

    /* --- les six (ou cinq) statistiques --- */
    var depenses = 0;
    liste.forEach(function (s) {
      var modRace = (mods.stat && mods.stat[s.cle]) || 0;
      var depart = BASE + modRace;
      var fixe = (r.statsFixes && sr && sr.stats) ? sr.stats[s.cle] : null;
      var mis = fixe != null ? 0 : Math.max(0, (e.points && e.points[s.cle]) || 0);
      /* le +3 de l'humain de métier s'applique APRÈS la répartition : il
         échappe donc au plafond, et ne consomme aucun point. */
      var metier = (mods.metier && e.metier === s.cle) ? 3 : 0;
      var total = fixe != null ? fixe : depart + mis + metier;
      depenses += mis;
      r.stats[s.cle] = {
        def: s, race: modRace, depart: depart, mis: mis, metier: metier,
        fixe: fixe, total: total, mod: modificateur(total),
        plafond: (mods.plafond && mods.plafond[s.cle]) || PLAFOND
      };
    });
    r.pointsUtilises = depenses;
    r.pointsRestants = r.statsFixes ? 0 : r.pointsTotal - depenses;

    /* Sagesse et Intelligence pointent sur Instinct chez le garou : toutes
       les formules qui suivent restent alors valables telles quelles. */
    function val(nomStat) {
      var k = cle(nomStat);
      if (r.instinct && (k === "sagesse" || k === "intelligence")) k = "instinct";
      return r.stats[k] ? r.stats[k].total : null;
    }
    r.val = val;

    var c1 = classeParSlug(e.classe);
    var c2 = classeParSlug(e.classe2);
    r.classe = c1; r.classe2 = c2;

    /* Certaines classes se jouent de deux façons qu'il faut trancher à la
       création — le pendant des sous-races. Le magicien est le seul pour
       l'instant : spécialisé, il compte déjà comme un bi-classe et ferme donc
       la seconde classe. La voie ne se choisit que sur la classe principale ;
       en seconde classe, la question ne se pose pas. */
    r.varianteRequise = !!(c1 && c1.variantes && c1.variantes.liste.length);
    r.variante = r.varianteRequise ? (c1.variantes.liste[e.variante] || null) : null;
    r.classePrete = !r.varianteRequise || !!r.variante;
    var modsV = (r.variante && r.variante.mods) || {};
    if (modsV.biclasseInterdit) {
      r.biclasseInterdit = true;
      r.biclassePar = r.variante.nom;
      r.biclasseRaison = "la spécialisation compte déjà comme un bi-classe à elle seule.";
    } else if (r.biclasseInterdit) {
      r.biclassePar = race ? race.nom : null;
      r.biclasseRaison = "cette race ne peut pas manier deux classes.";
    }

    function sec(k) { return (mods.second && mods.second[k]) || 0; }

    var F = val("force"), D = val("dexterite"), C = val("constitution");
    var S = val("sagesse"), I = val("intelligence");

    /* --- 4.1 les statistiques secondaires --- */
    var precs = [];
    if (c1) precs.push(val(c1.precision));
    if (c2) precs.push(val(c2.precision));
    var precFormule = c1
      ? (c2 ? "moyenne de " + c1.precision + " et " + c2.precision : c1.precision)
      : null;

    r.second = {
      vitesse: {
        nom: "Vitesse", valeur: Math.floor((F + D) / 2) + sec("vitesse"),
        bonus: sec("vitesse"), formule: "(Force + Dextérité) ÷ 2"
      },
      perception: {
        nom: "Perception", valeur: Math.floor((S + I) / 2) + sec("perception"),
        bonus: sec("perception"),
        formule: r.instinct ? "Instinct (il tient lieu des deux)" : "(Sagesse + Intelligence) ÷ 2"
      },
      discretion: {
        nom: "Discrétion", valeur: Math.floor((S + D) / 2) + sec("discretion"),
        bonus: sec("discretion"),
        formule: (r.instinct ? "(Instinct + Dextérité)" : "(Sagesse + Dextérité)") + " ÷ 2"
      },
      precision: {
        nom: "Précision",
        valeur: precs.length ? Math.floor(precs.reduce(function (a, b) { return a + b; }, 0) / precs.length) + sec("precision") : null,
        bonus: sec("precision"),
        formule: precFormule || "dépend de la classe"
      }
    };

    /* --- 4.2 les caractéristiques --- */
    /* 60 PV de base, +10 par point de Constitution au-dessus de 10,
       −5 par point en dessous. L'écart est volontairement asymétrique. */
    r.pv = PV_BASE + (C >= 10 ? (C - 10) * 10 : (C - 10) * 5);
    r.deplacement = Math.floor(r.second.vitesse.valeur / 2) + sec("deplacement");

    /* Les PM : seules les classes de type Mana en ont, et l'hématomancien
       n'en a pas du tout puisqu'il paie ses sorts en PV. En bi-classe, on
       fait la moyenne des deux statistiques de mana, arrondie à
       l'inférieur — comme pour la précision. */
    var statsMana = [], nomsMana = [];
    r.paieEnPV = false;
    [c1, c2].forEach(function (c) {
      if (!c) return;
      if (typeof c.statMana === "string") { statsMana.push(val(c.statMana)); nomsMana.push(c.statMana); }
      else if (c.statMana === null) { r.paieEnPV = true; }
    });
    if (statsMana.length) {
      var v = Math.floor(statsMana.reduce(function (a, b) { return a + b; }, 0) / statsMana.length);
      r.pmBase = mods.pmBase || PM_BASE;
      r.pm = r.pmBase + (v - 10) * 5;
      r.pmStat = nomsMana.length > 1 ? "moyenne de " + nomsMana.join(" et ") : nomsMana[0];
      r.pmValeur = v;
    } else {
      r.pm = null;
    }

    /* --- les ressources (classes de type Ressource) --- */
    /* Même mécanique que les PV et les PM, mais par seuils au lieu d'une
       pente : on descend les paliers et on garde le premier atteint. Chez le
       garou, val() renvoie l'Instinct pour Sagesse comme pour Intelligence,
       donc rien de particulier à prévoir ici. En bi-classe, chaque classe
       garde la sienne : elles ne se moyennent pas. */
    r.ressources = [];
    [c1, c2].forEach(function (c) {
      if (!c || !c.ressource || !c.ressource.paliers) return;
      var res = c.ressource, v = val(res.stat), n = null;
      for (var i = 0; i < res.paliers.length; i++) {
        if (v >= res.paliers[i].min) { n = res.paliers[i].valeur; break; }
      }
      r.ressources.push({
        nom: res.nom, classe: c.nom, stat: res.stat, statValeur: v,
        valeur: n, recup: res.recup
      });
    });

    /* L'oni règle la récupération selon le TYPE de la classe : on ne montre
       que les moteurs qui concernent vraiment les classes retenues. */
    r.moteurs = [];
    if (race && race.moteurs) {
      var typesPris = {};
      [c1, c2].forEach(function (c) { if (c) typesPris[c.type] = 1; });
      race.moteurs.forEach(function (m) {
        if (!typesPris[m.id]) return;
        var pourNous = m.note &&
          ((c1 && c1.nom === m.note.pour) || (c2 && c2.nom === m.note.pour));
        r.moteurs.push({ texte: m.texte, note: pourNous ? m.note : null });
      });
    }

    /* --- ce que l'outil a compté, et ce qu'il laisse à la table --- */
    /* Chaque chose que « mods » fait vraiment entrer dans les chiffres reçoit
       une clé et une phrase par défaut. Les clés servent juste après : une
       pastille de la fiche de race qui parle de la même chose vient prendre
       la place de la phrase, parce qu'elle est souvent plus précise
       (« Précision +2 SUR N'IMPORTE QUELLE ATTAQUE »). Le point important est
       qu'elle ne part alors PAS dans « à appliquer à la table » : le joueur
       appliquerait le bonus une seconde fois. */
    var compte = [];   /* [{ cle, texte }] dans l'ordre d'affichage */
    function noter(cle_, texte) { compte.push({ cle: cle_, texte: texte }); }

    if (mods.stat) Object.keys(mods.stat).forEach(function (k) {
      var d = r.stats[k];
      noter("stat." + k, (d ? d.def.nom : k) + " " + signe(mods.stat[k]) + " (avant répartition)");
    });
    if (mods.second) Object.keys(mods.second).forEach(function (k) {
      var n = r.second[k] ? r.second[k].nom : (k === "deplacement" ? "Déplacements" : k);
      noter("second." + k, n + " " + signe(mods.second[k]));
    });
    function ptsBonus(n) {
      return signe(n) + " point" + (Math.abs(n) > 1 ? "s" : "") + " de statistique à répartir";
    }
    /* Le garou ne répartit pas sur six statistiques mais sur cinq : la fiche
       le montre déjà, encore faut-il dire pourquoi. C'est bien l'outil qui
       l'applique — la liste des statistiques change à la source. */
    if (regles.instinct) {
      noter("instinct", "Sagesse et Intelligence remplacées par une seule statistique, Instinct : " +
        liste.length + " statistiques à répartir au lieu de " + SIX.length);
    }
    if (mods.pointsBonus) noter("pointsBonus", ptsBonus(mods.pointsBonus));
    if (regles.pointsBonus) noter("pointsBonus", ptsBonus(regles.pointsBonus));
    if (regles.points) noter("points", regles.points + " points à répartir au lieu de " + POINTS);
    /* Le +3 de l'humain de métier est bien appliqué (voir plus haut), mais il
       ne vient ni de mods.stat ni des points : sans cette ligne il ne serait
       annoncé nulle part dans le récapitulatif. */
    if (mods.metier) {
      var sm = e.metier && r.stats[e.metier];
      noter("metier", sm
        ? sm.def.nom + " +3 (métier, appliqué après la répartition : il échappe au plafond de " + PLAFOND + ")"
        : "+3 dans la statistique du métier, une fois choisie (après la répartition : ce +3 échappe au plafond de " + PLAFOND + ")");
    }
    if (mods.plafond) Object.keys(mods.plafond).forEach(function (k) {
      var d = r.stats[k];
      noter("plafond." + k, (d ? d.def.nom : k) + " peut monter jusqu'à " + mods.plafond[k] + " à la création");
    });
    if (mods.pmBase) noter("pmBase", mods.pmBase + " PM de base au lieu de " + PM_BASE);

    /* À quelle clé une pastille correspond-elle, si elle correspond à
       quelque chose ? On ne reconnaît jamais que ce que « mods » déclare
       vraiment : une pastille ne peut donc pas être classée « déjà comptée »
       si rien ne la compte. Dans le doute, elle part à la table — c'est le
       sens le moins coûteux : un rappel en trop plutôt qu'un bonus oublié. */
    function cleDePastille(t) {
      var m = t.match(/^([A-Za-zÀ-ÿ]+) [+−-]\d+/);
      if (m) {
        var k = cle(m[1]);
        if (mods.stat && mods.stat[k] !== undefined) return "stat." + k;
        if (mods.second && mods.second[k] !== undefined) return "second." + k;
      }
      if ((mods.pointsBonus || regles.pointsBonus) && /points? de statistique/i.test(t)) return "pointsBonus";
      if (mods.pmBase && /PM de base/i.test(t)) return "pmBase";
      /* les deux pastilles de l'humain de métier : celle qui nomme le métier,
         et celle qui explique que son +3 passe outre le plafond */
      if (mods.metier && /métier|répartition/i.test(t)) return "metier";
      var trouve = null;
      if (mods.plafond) Object.keys(mods.plafond).forEach(function (k) {
        var nom = r.stats[k] ? r.stats[k].def.nom : k;
        if (t.toLowerCase().indexOf(nom.toLowerCase()) >= 0 && /limit|plafond|jusqu/i.test(t)) {
          trouve = "plafond." + k;
        }
      });
      return trouve;
    }

    /* On range les pastilles : celles que « mods » couvre remplacent la
       phrase par défaut de leur clé, les autres s'en vont à la table.
       « capas » n'est pas de la partie : une capacité dorée est une action
       que le joueur déclenche quand il veut, pas un effet qu'il devrait
       penser à appliquer. Elle se signale par sa pastille, comme le souffle
       du drakéide ou la transformation du garou — qui ne sont pas non plus
       dans cette liste. */
    var repris = {};
    ["plus", "moins"].forEach(function (champ) {
      ((sr && sr[champ]) || []).forEach(function (t) {
        t = t.trim();
        var k = cleDePastille(t);
        if (!k) { r.aAppliquer.push({ texte: t, sens: champ }); return; }
        (repris[k] || (repris[k] = [])).push(t);
      });
      /* Une RACE peut porter un effet qui vaut quelle que soit la variante —
         les écailles du drakéide, par exemple. Il n'a pas de vignette où se
         poser, mais il doit se retrouver sur la fiche comme les autres. */
      ((race && race[champ]) || []).forEach(function (t) {
        r.aAppliquer.push({ texte: t, sens: champ });
      });
      /* la voie de classe entre dans la même liste : aucun de ses effets ne
         se met en chiffres sur une fiche */
      ((r.variante && r.variante[champ]) || []).forEach(function (t) {
        r.aAppliquer.push({ texte: t, sens: champ });
      });
    });

    var vus = {};
    compte.forEach(function (c) {
      if (!repris[c.cle]) { r.comptes.push(c.texte); return; }
      /* plusieurs pastilles peuvent parler d'une même clé (le métier en a
         deux) : on les sort toutes, une seule fois */
      if (vus[c.cle]) return;
      vus[c.cle] = 1;
      repris[c.cle].forEach(function (t) { r.comptes.push(t); });
    });

    return r;
  }

  /* ==================================================================
     L'ÉTAT
     ================================================================== */

  var etat = {
    etape: 1, race: null, sousRace: null,
    classe: null, variante: null, classe2: null,
    points: {}, metier: null
  };

  function reinitPoints() { etat.points = {}; etat.metier = null; }

  /* Changer de race peut rendre illégal un choix déjà fait plus loin : on
     nettoie tout de suite plutôt que de laisser une fiche fausse à
     l'écran. */
  function verifierCoherence() {
    var r = calculer(etat);
    if (r.biclasseInterdit) etat.classe2 = null;
    if (r.magieInterdite) {
      if (etat.classe && classeParSlug(etat.classe).type === "Mana") etat.classe = null;
      if (etat.classe2 && classeParSlug(etat.classe2).type === "Mana") etat.classe2 = null;
    }
    if (etat.classe2 && etat.classe2 === etat.classe) etat.classe2 = null;
    /* une statistique qui n'existe plus (Instinct ↔ Sagesse) perd ses points */
    var connues = {};
    r.liste.forEach(function (s) { connues[s.cle] = 1; });
    Object.keys(etat.points).forEach(function (k) { if (!connues[k]) delete etat.points[k]; });
    if (etat.metier && (!connues[etat.metier] || !r.metierPossible)) etat.metier = null;
    /* une voie de classe n'a de sens que si la classe principale en propose */
    if (!r.varianteRequise) etat.variante = null;
    /* tant qu'un choix bloquant n'est pas fait, on ne reste pas sur une étape
       qu'il conditionne */
    if (!r.pret && etat.etape > 1) etat.etape = 1;
    else if (!r.classePrete && etat.etape > 2) etat.etape = 2;
  }

  /* ==================================================================
     LE PANTIN — le panneau de droite, toujours visible
     ================================================================== */

  function silhouetteHTML(race) {
    if (!race) {
      return '<div class="p-silh p-silh-vide">' + silhouetteSVG("humanoide") + '</div>';
    }
    var url = race.image ? IMG_RACES + encodeURIComponent(race.image) : null;
    var st = 'color:' + (race.couleur || "#6b5a3a") + ';' +
      (url ? '--dessin:url(&quot;' + url + '&quot;)' : "");
    return '<div class="p-silh" style="' + st + '">' +
      (url ? '<img class="p-silh-img" src="' + url + '" alt="Silhouette — ' + esc(race.nom) + '">' : "") +
      silhouetteSVG(race.forme) + '</div>';
  }

  /* dès que le dessin est chargé, il prend la place du pictogramme
     (l'événement load ne remonte pas : on l'écoute à la capture) */
  document.addEventListener("load", function (ev) {
    var t = ev.target;
    if (t && t.classList && t.classList.contains("p-silh-img")) {
      var p = t.parentNode; if (p) p.classList.add("avec-image");
    }
  }, true);

  /* L'hexagone des statistiques, repris de la fiche des oni : il devient
     un pentagone pour le garou, qui n'a que cinq statistiques. */
  function radarHTML(r) {
    var n = r.liste.length;
    if (!n) return "";
    var cx = 108, cy = 100, R = 66;
    function pt(i, f) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f];
    }
    function poly(f) {
      var p = [];
      for (var i = 0; i < n; i++) p.push(pt(i, f).map(function (v) { return v.toFixed(1); }).join(","));
      return p.join(" ");
    }
    var s = '<svg class="p-radar" viewBox="0 0 216 200" role="img" aria-label="Profil des statistiques">';
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      s += '<polygon points="' + poly(f) + '" class="p-grille"/>';
    });
    for (var i = 0; i < n; i++) {
      var p = pt(i, 1);
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" class="p-axe"/>';
    }
    /* l'échelle va de 0 à 20, le maximum absolu du jeu */
    var forme = [];
    for (var j = 0; j < n; j++) {
      var v = Math.max(0, Math.min(20, r.stats[r.liste[j].cle].total)) / 20;
      forme.push(pt(j, v).map(function (x) { return x.toFixed(1); }).join(","));
    }
    s += '<polygon points="' + forme.join(" ") + '" class="p-forme"/>';
    for (var k = 0; k < n; k++) {
      var q = pt(k, 1.2);
      s += '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] + 4).toFixed(1) + '" class="p-etiq">' +
        esc(r.liste[k].court) + '</text>';
    }
    return s + '</svg>';
  }

  function ligne(l, v, detail) {
    return '<div class="p-ligne"><span class="p-l">' + esc(l) + '</span>' +
      '<span class="p-v">' + esc(v) + '</span>' +
      (detail ? '<span class="p-d">' + esc(detail) + '</span>' : "") + '</div>';
  }

  function dessinerPantin() {
    var r = calculer(etat);
    var h = "";

    h += '<div class="p-haut">' + silhouetteHTML(r.race) + '<div class="p-ident">' +
      '<div class="p-nom">' + esc(r.sousRace ? r.sousRace.nom : (r.race ? r.race.nom : "Personnage sans race")) + '</div>' +
      '<div class="p-sous">' +
      (r.race && r.sousRace && r.sousRace.nom !== r.race.nom ? esc(r.race.nom) + " · " : "") +
      (r.classe
        ? esc(r.variante ? r.variante.nom : r.classe.nom) +
          (r.classe2 ? " / " + esc(r.classe2.nom) : "")
        : "classe à choisir") +
      '</div></div></div>';

    if (!r.race) {
      h += '<p class="p-vide">Choisis une race : le pantin prend sa forme, sa couleur, et la fiche commence à se remplir.</p>';
      $("pantin-corps").innerHTML = h;
      majBarre(r);
      return;
    }

    /* les statistiques */
    h += '<div class="p-bloc"><h3>Statistiques</h3>' + radarHTML(r) + '<div class="p-stats">';
    r.liste.forEach(function (s) {
      var d = r.stats[s.cle];
      var det = [];
      if (d.fixe != null) det.push("lignée");
      else {
        det.push("8" + (d.race ? " " + signe(d.race) : ""));
        if (d.mis) det.push("+" + d.mis);
        if (d.metier) det.push("+3 métier");
      }
      h += '<div class="p-stat"><span class="p-sn">' + esc(s.nom) + '</span>' +
        '<span class="p-sv">' + d.total + '</span>' +
        '<span class="p-sm">' + (d.mod === 0 ? "±0" : signe(d.mod)) + '</span>' +
        '<span class="p-sd">' + esc(det.join(" ")) + '</span></div>';
    });
    h += '</div></div>';

    /* les secondaires */
    h += '<div class="p-bloc"><h3>Statistiques secondaires</h3>';
    ["vitesse", "perception", "discretion", "precision"].forEach(function (k) {
      var s = r.second[k];
      h += ligne(s.nom, s.valeur == null ? "—" : s.valeur,
        s.formule + (s.bonus ? " " + signe(s.bonus) + " (race)" : ""));
    });
    h += '</div>';

    /* les caractéristiques */
    h += '<div class="p-bloc"><h3>Caractéristiques</h3>';
    h += ligne("Points de vie", r.pv, "60 de base, réglés par la Constitution");
    h += ligne("Déplacements", r.deplacement, "Vitesse ÷ 2");
    h += '</div>';

    /* Le mana ne concerne pas tout le monde : comme la ressource, son bloc
       n'apparaît que si la classe en a un. Une ligne « — » sur les treize
       classes qui n'en ont pas ne dit rien à personne. */
    if (r.pm != null) {
      h += '<div class="p-bloc"><h3>Mana</h3>' +
        ligne("Points de mana", r.pm, r.pmBase + " de base · " + r.pmStat + " " + r.pmValeur) +
        '</div>';
    } else if (r.paieEnPV) {
      h += '<div class="p-bloc"><h3>Mana</h3>' +
        ligne("Points de mana", "aucun", "l'hématomancien paie ses sorts en PV, pas en mana") +
        '</div>';
    }

    /* la ressource, quand la classe en a une */
    if (r.ressources.length) {
      h += '<div class="p-bloc"><h3>Ressource' + (r.ressources.length > 1 ? "s" : "") + '</h3>';
      r.ressources.forEach(function (x) {
        h += ligne(x.nom, x.valeur == null ? "—" : x.valeur,
          x.classe + " · " + x.stat + " " + x.statValeur +
          (x.recup ? " — récupération : " + x.recup : ""));
      });
      h += '</div>';
    }

    /* ce que la race change au moteur de la classe (les oni) */
    if (r.moteurs.length) {
      h += '<div class="p-bloc"><h3>Le moteur de ta race</h3><ul class="p-liste">';
      r.moteurs.forEach(function (m) {
        /* quand une classe a son exception, elle REMPLACE la règle générale :
           l'hématomancien n'a pas de PM à regagner, le chaman ne regagne rien
           au fil des tours. Afficher les deux se contredirait. */
        h += '<li class="p-plus">' + esc(m.note
          ? m.note.pour + " : " + m.note.texte
          : m.texte) + '</li>';
      });
      h += '</ul></div>';
    }

    /* ce qui est compté, ce qui ne l'est pas */
    if (r.comptes.length) {
      h += '<div class="p-bloc"><h3>Déjà dans les chiffres</h3><ul class="p-liste p-ok">';
      r.comptes.forEach(function (t) { h += '<li>' + esc(t) + '</li>'; });
      h += '</ul></div>';
    }
    if (r.aAppliquer.length) {
      h += '<div class="p-bloc"><h3>À appliquer à la table</h3>' +
        '<p class="p-avert">Ces effets ne se mettent pas en chiffres sur une fiche : garde-les sous les yeux en jeu.</p><ul class="p-liste">';
      r.aAppliquer.forEach(function (t) {
        h += '<li class="p-' + t.sens + '">' + esc(t.texte) + '</li>';
      });
      h += '</ul></div>';
    }
    if (r.sousRace && r.sousRace.transformation) {
      h += '<div class="p-bloc"><h3>En transformation</h3>' +
        '<p class="p-avert">Ces bonus ne valent que pendant la transformation : ils ne sont pas comptés ci-dessus.</p><ul class="p-liste">';
      r.sousRace.transformation.effets.forEach(function (t) { h += '<li class="p-plus">' + esc(t) + '</li>'; });
      h += '</ul></div>';
    }

    $("pantin-corps").innerHTML = h;
    majBarre(r);
  }

  /* En dessous de 1100 px la fiche devient un tiroir ; au-dessus elle est
     toujours dépliée, et le bandeau ne commande donc rien. Le même seuil est
     écrit dans la feuille de style : les deux doivent rester d'accord. */
  var TIROIR = window.matchMedia("(max-width: 1100px)");

  function majBascule() {
    var b = $("pantin-bascule");
    if (!b) return;
    /* Sur PC le bandeau ne commande rien : on le désactive pour de bon plutôt
       que de faire semblant. Un bouton actif qui ne réagit pas serait un
       cul-de-sac au clavier, et Bootstrap lui donnerait un curseur de main
       (sa règle « button:not(:disabled) » l'emporte sur la nôtre). */
    b.disabled = !TIROIR.matches;
    b.setAttribute("aria-expanded",
      !TIROIR.matches || $("pantin").classList.contains("ouvert") ? "true" : "false");
  }

  /* la barre repliée du mobile : l'essentiel en une ligne */
  function majBarre(r) {
    var b = $("pantin-resume");
    if (!b) return;
    var bouts = [r.sousRace ? r.sousRace.nom : (r.race ? r.race.nom : "à créer")];
    if (r.classe) bouts.push(r.classe.nom + (r.classe2 ? "/" + r.classe2.nom : ""));
    if (r.race) bouts.push(r.pv + " PV");
    if (r.pm != null) bouts.push(r.pm + " PM");
    b.textContent = bouts.join(" · ");
  }

  /* ==================================================================
     ÉTAPE 1 — LA RACE
     ================================================================== */

  function dessinerEtape1() {
    var h = '<h2 class="e-titre"><span class="e-num">1</span> La race</h2>' +
      '<p class="e-intro">La race est le corps qui contiendra ton personnage : ' +
      'chacune apporte son lot d\'effets, qui n\'appartiennent qu\'à elle.</p><div class="choix-grille">';

    RACES.forEach(function (race) {
      var actif = etat.race === race.slug;
      h += '<button type="button" class="choix choix-race' + (actif ? " actif" : "") + '" ' +
        'data-race="' + esc(race.slug) + '" style="--teinte:' + esc(race.couleur || "#6b5a3a") + '">' +
        '<span class="choix-silh">' + silhouetteHTML(race) + '</span>' +
        '<span class="choix-nom">' + esc(race.nom) + '</span>' +
        '<span class="choix-note">' + esc(race.resume || "") + '</span></button>';
    });
    h += '</div>';

    var race = raceParSlug(etat.race);
    if (race) {
      if (race.sousRaces && race.sousRaces.length) {
        h += '<h3 class="e-sous">' + esc(race.sousTitre || "Sous-races") + '</h3>';
        if (race.sousIntro) h += '<p class="e-intro">' + esc(race.sousIntro) + '</p>';
        if (etat.sousRace == null) {
          h += '<div class="encadre attente">Choisis une variante pour continuer : ' +
            'c\'est elle qui porte les bonus, et parfois le nombre de points à répartir.</div>';
        }
        h += '<div class="choix-grille choix-petit">';
        race.sousRaces.forEach(function (sr, i) {
          var actif = etat.sousRace === i;
          h += '<button type="button" class="choix choix-sous' + (actif ? " actif" : "") + '" ' +
            'data-sous="' + i + '" style="--teinte:' + esc(sr.couleur || race.couleur || "#6b5a3a") + '">' +
            '<span class="choix-nom">' + esc(sr.nom) + '</span>';
          var p = (sr.plus || []).concat(sr.moins || [], sr.capas || [], sr.capacites || []);
          if (p.length || sr.transformation || race.invocation) {
            h += '<span class="choix-pastilles">';
            (sr.plus || []).forEach(function (t) { h += '<span class="past plus">' + esc(t) + '</span>'; });
            (sr.moins || []).forEach(function (t) { h += '<span class="past moins">' + esc(t) + '</span>'; });
            /* Les pastilles dorées ne sont pas des modificateurs de chiffres
               mais des capacités : le vol des piafs, la transformation des
               garous, le souffle des drakéides. Une seule couleur pour toutes,
               pour qu'on repère « cette variante sait faire quelque chose »
               sans lire. Une entrée de « capacites » a un coût et se déclenche
               par définition : son nom suffit ici, le détail est sur la page
               races. */
            (sr.capas || []).forEach(function (t) { h += '<span class="past capa">' + esc(t) + '</span>'; });
            (sr.capacites || []).forEach(function (c) { h += '<span class="past capa">' + esc(c.nom) + '</span>'; });
            if (sr.transformation) h += '<span class="past capa">Transformation animale</span>';
            /* L'invocation appartient à la race : les trois lignées de
               tieffelins peuvent appeler n'importe lequel des trois
               mini-démons, seul le bonus qui l'accompagne dépend de la
               lignée. La pastille est donc la même sur les trois vignettes. */
            if (race.invocation) h += '<span class="past capa">Invocation d\'un mini-démon</span>';
            h += '</span>';
          }
          if (sr.stats) {
            h += '<span class="choix-note">' + esc(sr.titre || "statistiques déjà réparties") + '</span>';
          }
          h += '</button>';
        });
        h += '</div>';
      } else {
        h += '<p class="e-rien">L\'' + esc(race.nom.toLowerCase()) + ' n\'a pas de sous-race : on passe directement à la classe.</p>';
      }
      if (race.important && race.important.length) {
        h += '<div class="encadre"><strong>À savoir</strong><ul>';
        race.important.forEach(function (t) { h += '<li>' + esc(t) + '</li>'; });
        h += '</ul></div>';
      }
    }
    $("etape1").innerHTML = h;
  }

  /* ==================================================================
     ÉTAPE 2 — LA CLASSE
     ================================================================== */

  function dessinerEtape2() {
    var r = calculer(etat);
    var h = '<h2 class="e-titre"><span class="e-num">2</span> La classe</h2>';

    if (!r.pret) {
      h += '<p class="e-rien">' + (r.race
        ? 'Choisis d\'abord la variante de ta race, à l\'étape 1 : c\'est elle qui dit quelles classes te sont ouvertes.'
        : 'Choisis d\'abord une race : c\'est elle qui dit quelles classes te sont ouvertes.') + '</p>';
      $("etape2").innerHTML = h;
      return;
    }

    h += '<p class="e-intro">La classe fixe la statistique dont dépend ta précision, et, si elle manie la magie, ' +
      'celle qui règle tes points de mana.</p>';

    if (r.magieInterdite) {
      h += '<div class="encadre alerte">Le ' + esc(r.sousRace.nom) + ' est incapable d\'utiliser de la magie : ' +
        'les classes à mana — hématomancien compris — sont fermées.</div>';
    }
    if (r.biclasseInterdit) {
      h += '<div class="encadre alerte"><strong>' + esc(r.biclassePar || "Bi-classe fermé") +
        '</strong>Pas de seconde classe possible : ' + esc(r.biclasseRaison || "") + '</div>';
    }

    h += '<div class="choix-grille choix-classe">';
    CLASSES.forEach(function (c) {
      var bloquee = r.magieInterdite && c.type === "Mana";
      var etats = [];
      if (etat.classe === c.slug) etats.push("actif");
      if (etat.classe2 === c.slug) etats.push("actif2");
      if (bloquee) etats.push("bloquee");
      var mot = moteurDe(c);
      h += '<button type="button" class="choix choix-cls ' + etats.join(" ") + '" ' +
        'data-classe="' + esc(c.slug) + '"' + (bloquee ? ' disabled' : "") + '>' +
        '<img class="choix-img" src="' + IMG_CLASSES + encodeURIComponent(c.image) + '" alt="" loading="lazy">' +
        '<span class="choix-nom">' + esc(c.nom) + '</span>' +
        /* « typeAffiche » l'emporte quand la classe ne rentre pas franchement
           dans sa case : le magicien est « Polyvalent (mana) », l'hématomancien
           « Mana (spécial) ». */
        '<span class="cls-moteur" style="--c:' + esc((mot && mot.couleur) || "#6b5a3a") + '">' +
        esc(c.typeAffiche || (mot && mot.nom) || c.type) + '</span>' +
        '<span class="choix-note">' + esc(c.specialite) + '</span>' +
        '<span class="choix-meta">Précision : ' + esc(c.precision) +
        (typeof c.statMana === "string" ? " · Mana : " + esc(c.statMana) : "") +
        (c.ressource && c.ressource.stat
          ? ' · ' + esc(c.ressource.nom) + ' : ' + esc(c.ressource.stat) : "") + '</span>' +
        (etat.classe === c.slug ? '<span class="choix-rang">1<sup>re</sup></span>' : "") +
        (etat.classe2 === c.slug ? '<span class="choix-rang">2<sup>e</sup></span>' : "") +
        '</button>';
    });
    h += '</div>';

    h += '<p class="e-aide">Un clic pose la classe principale. Un clic sur une seconde classe ouvre le bi-classe' +
      (r.biclasseInterdit ? " — fermé ici" : "") + '. Reclique pour retirer.</p>';

    /* la voie de la classe principale, quand elle en a une */
    if (r.varianteRequise) {
      var v = r.classe.variantes;
      h += '<h3 class="e-sous">' + esc(v.titre || "Voie") + '</h3>';
      if (v.intro) h += '<p class="e-intro">' + esc(v.intro) + '</p>';
      if (!r.variante) {
        h += '<div class="encadre attente">Choisis une voie pour continuer : ' +
          'elle décide si tu peux encore prendre une seconde classe.</div>';
      }
      h += '<div class="choix-grille choix-petit">';
      v.liste.forEach(function (opt, i) {
        h += '<button type="button" class="choix choix-sous' +
          (etat.variante === i ? " actif" : "") + '" data-variante="' + i + '">' +
          '<span class="choix-nom">' + esc(opt.nom) + '</span>' +
          (opt.note ? '<span class="choix-note">' + esc(opt.note) + '</span>' : "") +
          '<span class="choix-pastilles">';
        (opt.plus || []).forEach(function (t) { h += '<span class="past plus">' + esc(t) + '</span>'; });
        (opt.moins || []).forEach(function (t) { h += '<span class="past moins">' + esc(t) + '</span>'; });
        h += '</span></button>';
      });
      h += '</div>';
      if (r.variante && r.variante.texte) {
        h += '<p class="e-intro" style="margin-top:12px">' + esc(r.variante.texte.join(" ")) + '</p>';
      }
    }
    if (r.paieEnPV) {
      h += '<div class="encadre">L\'hématomancien ne dépense pas de mana mais des PV : sa fiche n\'affiche donc aucun PM.</div>';
    }
    $("etape2").innerHTML = h;
  }

  /* ==================================================================
     ÉTAPE 3 — LES STATISTIQUES
     ================================================================== */

  function dessinerEtape3() {
    var r = calculer(etat);
    var h = '<h2 class="e-titre"><span class="e-num">3</span> Les statistiques</h2>';

    if (!r.pret) {
      h += '<p class="e-rien">' + (r.race
        ? 'Choisis d\'abord la variante de ta race, à l\'étape 1 : c\'est elle qui dit combien de points tu répartis.'
        : 'Choisis d\'abord une race : c\'est elle qui dit combien de points tu répartis, et sur quelles statistiques.') + '</p>';
      $("etape3").innerHTML = h;
      return;
    }
    if (!r.classePrete) {
      h += '<p class="e-rien">Choisis d\'abord la voie de ton ' + esc(r.classe.nom.toLowerCase()) +
        ', à l\'étape 2 : elle décide si tu peux encore prendre une seconde classe.</p>';
      $("etape3").innerHTML = h;
      return;
    }

    if (r.statsFixes) {
      h += '<p class="e-intro">Les oni naissent déjà répartis : leur lignée fixe les six statistiques, ' +
        'il n\'y a rien à distribuer.</p>';
      if (!r.sousRace) {
        h += '<p class="e-rien">Choisis une lignée à l\'étape 1 pour voir ses statistiques.</p>';
        $("etape3").innerHTML = h;
        return;
      }
    } else {
      h += '<p class="e-intro">Chaque statistique part de 8. Les bonus de race s\'appliquent d\'abord, ' +
        'tu répartis ensuite, sans dépasser ' + PLAFOND + '.</p>';
      h += '<div class="compteur' + (r.pointsRestants === 0 ? " fini" : "") +
        (r.pointsRestants < 0 ? " trop" : "") + '">' +
        '<span class="c-val">' + r.pointsRestants + '</span>' +
        '<span class="c-lab">point' + (Math.abs(r.pointsRestants) > 1 ? "s" : "") + ' à placer</span>' +
        '<span class="c-tot">sur ' + r.pointsTotal + '</span></div>';
    }

    h += '<div class="stats-table">';
    r.liste.forEach(function (s) {
      var d = r.stats[s.cle];
      var plein = (d.depart + d.mis) >= d.plafond;
      var vide = d.mis <= 0;
      h += '<div class="st-ligne">' +
        '<span class="st-nom">' + esc(s.nom) + '</span>';
      if (r.statsFixes) {
        h += '<span class="st-fixe">imposée par la lignée</span>';
      } else {
        h += '<span class="st-boutons">' +
          '<button type="button" class="st-b" data-moins="' + s.cle + '"' + (vide ? " disabled" : "") + ' aria-label="Retirer un point de ' + esc(s.nom) + '">−</button>' +
          '<button type="button" class="st-b" data-plus="' + s.cle + '"' +
          (plein || r.pointsRestants <= 0 ? " disabled" : "") + ' aria-label="Ajouter un point à ' + esc(s.nom) + '">+</button>' +
          '</span>';
      }
      h += '<span class="st-val">' + d.total + '</span>' +
        '<span class="st-mod">' + (d.mod === 0 ? "±0" : signe(d.mod)) + '</span>' +
        '<span class="st-calc">' + esc(detailCalcul(d, r)) + '</span>' +
        '</div>';
    });
    h += '</div>';

    if (r.metierPossible) {
      h += '<div class="metier"><h3 class="e-sous">La statistique du métier</h3>' +
        '<p class="e-intro">Ton métier te vaut +3 dans la statistique qui lui correspond — à voir avec ton MJ. ' +
        'Ce +3 s\'ajoute <em>après</em> la répartition : il est le seul à pouvoir dépasser le plafond de ' + PLAFOND + '.</p>' +
        '<div class="metier-choix">';
      h += '<button type="button" class="mb' + (!etat.metier ? " actif" : "") + '" data-metier="">aucun</button>';
      r.liste.forEach(function (s) {
        h += '<button type="button" class="mb' + (etat.metier === s.cle ? " actif" : "") +
          '" data-metier="' + s.cle + '">' + esc(s.nom) + '</button>';
      });
      h += '</div></div>';
    }

    if (!r.statsFixes) {
      h += '<p class="e-aide"><button type="button" class="lien-bouton" id="raz">Tout remettre à zéro</button></p>';
    }
    $("etape3").innerHTML = h;
  }

  function detailCalcul(d, r) {
    if (d.fixe != null) return "fixée à " + d.fixe + " par la lignée";
    var t = "8";
    if (d.race) t += " " + signe(d.race) + " race";
    if (d.mis) t += " + " + d.mis;
    if (d.metier) t += " + 3 métier";
    t += " = " + d.total;
    if (d.plafond !== PLAFOND) t += " · plafond " + d.plafond;
    return t;
  }

  /* ==================================================================
     LE FIL DES ÉTAPES
     ================================================================== */

  function dessinerStepper() {
    var r = calculer(etat);
    var noms = ["La race", "La classe", "Les statistiques"];
    var h = "";
    for (var i = 1; i <= 3; i++) {
      var ouvert = i === 1 || (r.pret && (i === 2 || r.classePrete));
      h += '<button type="button" class="pas' + (etat.etape === i ? " actif" : "") +
        (ouvert ? "" : " ferme") + '" data-etape="' + i + '"' + (ouvert ? "" : " disabled") + '>' +
        '<span class="pas-n">' + i + '</span><span class="pas-t">' + noms[i - 1] + '</span></button>';
    }
    $("stepper").innerHTML = h;

    for (var j = 1; j <= 3; j++) {
      $("etape" + j).hidden = (etat.etape !== j);
    }
    $("prec").disabled = etat.etape === 1;
    $("suiv").disabled = etat.etape === 3 || !r.pret ||
      (etat.etape === 2 && !r.classePrete);
  }

  function toutDessiner() {
    verifierCoherence();
    dessinerEtape1();
    dessinerEtape2();
    dessinerEtape3();
    dessinerStepper();
    dessinerPantin();
  }

  /* ==================================================================
     LES ÉVÉNEMENTS
     ================================================================== */

  function surClic(ev) {
    var b = ev.target.closest ? ev.target.closest("button") : null;
    if (!b) return;

    if (b.dataset.race != null) {
      if (etat.race !== b.dataset.race) {
        etat.race = b.dataset.race;
        etat.sousRace = null;
        reinitPoints();
      }
      toutDessiner();
      return;
    }
    if (b.dataset.sous != null) {
      etat.sousRace = parseInt(b.dataset.sous, 10);
      reinitPoints();
      toutDessiner();
      return;
    }
    if (b.dataset.classe != null) {
      var s = b.dataset.classe;
      var r = calculer(etat);
      var avant = etat.classe;
      if (etat.classe === s) {
        /* retirer la principale : la seconde monte d'un cran */
        etat.classe = etat.classe2;
        etat.classe2 = null;
      } else if (etat.classe2 === s) {
        etat.classe2 = null;
      } else if (!etat.classe) {
        etat.classe = s;
      } else if (!r.biclasseInterdit) {
        etat.classe2 = s;
      } else {
        etat.classe = s;
      }
      /* la voie appartient à une classe précise : elle ne survit pas à son
         remplacement */
      if (etat.classe !== avant) etat.variante = null;
      toutDessiner();
      return;
    }
    if (b.dataset.variante != null) {
      etat.variante = parseInt(b.dataset.variante, 10);
      toutDessiner();
      return;
    }
    if (b.dataset.plus != null) { ajouter(b.dataset.plus, +1); return; }
    if (b.dataset.moins != null) { ajouter(b.dataset.moins, -1); return; }
    if (b.dataset.metier != null) {
      etat.metier = b.dataset.metier || null;
      toutDessiner();
      return;
    }
    if (b.dataset.etape != null) {
      etat.etape = parseInt(b.dataset.etape, 10);
      toutDessiner();
      return;
    }
    if (b.id === "raz") { reinitPoints(); toutDessiner(); return; }
    if (b.id === "prec") { etat.etape = Math.max(1, etat.etape - 1); toutDessiner(); return; }
    if (b.id === "suiv") { etat.etape = Math.min(3, etat.etape + 1); toutDessiner(); return; }
    if (b.id === "pantin-bascule") {
      /* sur PC la fiche est toujours dépliée : le bandeau ne bascule rien */
      if (TIROIR.matches) $("pantin").classList.toggle("ouvert");
      majBascule();
      return;
    }
  }

  function ajouter(k, d) {
    var r = calculer(etat);
    var st = r.stats[k];
    if (!st) return;
    var cur = etat.points[k] || 0;
    if (d > 0) {
      if (r.pointsRestants <= 0) return;
      if (st.depart + cur + 1 > st.plafond) return;
    } else if (cur <= 0) return;
    etat.points[k] = cur + d;
    toutDessiner();
  }

  /* Le moteur est exposé pour pouvoir être rejoué sans l'interface : c'est
     ce qui permet de vérifier les formules du guide une par une. */
  window.CREATION = { calculer: calculer, etat: etat, SIX: SIX, CINQ: CINQ };

  /* ============ démarrage ============ */
  document.addEventListener("DOMContentLoaded", function () {
    if (!RACES.length || !CLASSES.length) {
      $("etape1").innerHTML = '<p class="e-rien">Les données des races ou des classes ne se sont pas chargées.</p>';
      return;
    }
    document.getElementById("crea").addEventListener("click", surClic);
    /* passer de PC à mobile change le sens du bandeau : on resynchronise */
    if (TIROIR.addEventListener) TIROIR.addEventListener("change", majBascule);
    majBascule();
    toutDessiner();
  });
})();
