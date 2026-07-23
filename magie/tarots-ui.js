// Interface de la page des tarots : pioche dans le paquet, retournement
// de la carte, panneau d'effets et galerie de consultation.
// Les données (TAROTS, TAROTS_IMG_DIR) viennent de tarots.js.

(() => {
  // Durées synchronisées avec tarots.css
  const DUREE_GLISSE = 420;  // arrivée de la carte depuis le paquet
  const DUREE_FLIP = 720;    // rotation de la carte
  const DUREE_MELANGE = 600; // battage du paquet au remélange
  const DUREE_SCEAU = 380;   // bris du sceau de cire d'un niveau

  const paquetBtn = document.getElementById("paquet");
  const compteur = document.getElementById("compteur");
  const remelangerBtn = document.getElementById("remelanger");
  const scene = document.getElementById("carteScene");
  const carte3d = document.getElementById("carte3d");
  const faceCadre = document.getElementById("faceCadre");
  const faceImage = document.getElementById("faceImage");
  const faceBanniere = document.getElementById("faceBanniere");
  const panneau = document.getElementById("panneauTexte");
  const carteNom = document.getElementById("carteNom");
  const carteNum = document.getElementById("carteNum");
  const niveauxZone = document.getElementById("niveauxZone");
  const aide = document.getElementById("tableAide");
  const galerie = document.getElementById("galerie");
  const zoomOverlay = document.getElementById("zoomOverlay");
  const zoomCadre = document.getElementById("zoomCadre");
  const zoomImage = document.getElementById("zoomImage");
  const zoomBanniere = document.getElementById("zoomBanniere");
  const zoomFermer = document.getElementById("zoomFermer");
  const rescellerCarteBtn = document.getElementById("rescellerCarte");
  const rescellerToutBtn = document.getElementById("rescellerTout");
  const sceauxCompteur = document.getElementById("sceauxCompteur");

  const NUMERAUX = ["I", "II", "III"];

  let pioche = [];           // indices des cartes encore dans le paquet
  const tirees = new Set();  // indices sorties du paquet depuis le dernier mélange
  let animEnCours = false;
  let carteAffichee = null;  // indice de la carte actuellement révélée

  /* ---------- Sceaux : mémoire des niveaux révélés ----------
     Les effets arrivent tous scellés ; chaque sceau brisé est retenu d'une
     visite à l'autre. La clé d'un niveau est « numéro d'arcane#rang », pour
     rester valable même si l'ordre du tableau TAROTS change. */

  const CLE_SCEAUX = "lb-tarots-sceaux";
  const TOTAL_EFFETS = TAROTS.reduce((n, carte) => n + carte.niveaux.length, 0);

  let brises = new Set(); // clés des niveaux déjà révélés

  function cleNiveau(idx, i) {
    return TAROTS[idx].num + "#" + i;
  }

  // Le stockage peut être indisponible (navigation privée, cookies bloqués) :
  // dans ce cas la page fonctionne, mais sans mémoire d'une visite à l'autre.
  function chargerSceaux() {
    try {
      const brut = localStorage.getItem(CLE_SCEAUX);
      if (brut) brises = new Set(JSON.parse(brut));
    } catch (e) {
      brises = new Set();
    }
  }

  function enregistrerSceaux() {
    try {
      localStorage.setItem(CLE_SCEAUX, JSON.stringify([...brises]));
    } catch (e) {
      /* rien à faire : la révélation vaut alors pour la session seulement */
    }
  }

  // Compteur global + lien « resceller » de la carte affichée.
  function majSceaux() {
    sceauxCompteur.textContent = brises.size + " / " + TOTAL_EFFETS + " effets révélés";
    rescellerToutBtn.disabled = brises.size === 0;
    if (brises.size === 0) annulerConfirmation();

    const carteOuverte = carteAffichee !== null
      && TAROTS[carteAffichee].niveaux.some((_, i) => brises.has(cleNiveau(carteAffichee, i)));
    rescellerCarteBtn.classList.toggle("visible", carteOuverte);
  }

  /* ---------- Paquet ---------- */

  // anime = true pour jouer le battage et renvoyer la carte affichée au
  // paquet (remélange déclenché par l'utilisateur) ; false au démarrage.
  function melangerPaquet(anime) {
    pioche = TAROTS.map((_, i) => i);
    for (let i = pioche.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pioche[i], pioche[j]] = [pioche[j], pioche[i]];
    }
    tirees.clear();
    majPaquet();
    majGalerie();
    if (anime) {
      nettoyerCarte();
      lancerBattage();
    }
  }

  // Renvoie la carte affichée vers le paquet et efface le panneau d'effets.
  function nettoyerCarte() {
    panneau.classList.remove("visible");
    scene.classList.remove("en-place"); // glisse/fond vers le paquet
    scene.tabIndex = -1;
    carteAffichee = null;
    // une fois invisible, on remet le dos pour la prochaine pioche et on
    // retire le lien « resceller » (pendant le fondu, il bougerait à l'écran)
    setTimeout(() => {
      carte3d.classList.remove("retournee");
      majSceaux();
    }, DUREE_GLISSE);
  }

  // Joue l'animation de battage sur le paquet.
  function lancerBattage() {
    animEnCours = true;
    paquetBtn.classList.remove("melange");
    void paquetBtn.offsetWidth; // permet de rejouer l'animation
    paquetBtn.classList.add("melange");
    setTimeout(() => {
      paquetBtn.classList.remove("melange");
      animEnCours = false;
    }, DUREE_MELANGE);
  }

  function majPaquet() {
    compteur.textContent = pioche.length + (pioche.length > 1 ? " cartes" : " carte");
    paquetBtn.classList.toggle("vide", pioche.length === 0);
  }

  /* ---------- Affichage d'une carte ---------- */

  // Habille un cadre de carte (face avant ou zoom) avec une carte donnée.
  function remplirCadre(cadre, img, banniere, carte) {
    cadre.classList.toggle("sans-image", !carte.image);
    if (carte.image) {
      img.src = TAROTS_IMG_DIR + carte.image;
      img.alt = "Arcane " + carte.num + " — " + carte.nom;
    } else {
      img.removeAttribute("src");
      img.alt = "";
    }
    banniere.textContent = carte.num + " · " + carte.nom;
  }

  function setFace(idx) {
    carteAffichee = idx;
    remplirCadre(faceCadre, faceImage, faceBanniere, TAROTS[idx]);
    scene.tabIndex = 0;
  }

  // Écrit le panneau d'effets. Appelé seulement quand le panneau est
  // invisible (sinon on lirait la nouvelle carte à travers le fondu).
  function remplirPanneau(idx) {
    const carte = TAROTS[idx];

    carteNom.textContent = carte.nom;
    carteNum.textContent = "Arcane " + carte.num;

    niveauxZone.innerHTML = "";
    carte.niveaux.forEach((_, i) => {
      const bloc = document.createElement("div");
      bloc.className = "niveau";
      if (brises.has(cleNiveau(idx, i))) {
        ouvrirNiveau(bloc, idx, i, false);
      } else {
        sceller(bloc, idx, i);
      }
      niveauxZone.appendChild(bloc);
    });
    majSceaux();
  }

  // le Fou n'a qu'un seul effet, pas de niveaux
  function nomNiveau(carte, i) {
    return carte.niveaux.length === 1 ? "Effet" : "Niveau " + NUMERAUX[i];
  }

  // Niveau encore scellé : une ligne avec un cachet de cire, à briser.
  function sceller(bloc, idx, i) {
    const carte = TAROTS[idx];
    bloc.innerHTML = "";

    const btn = document.createElement("button");
    btn.className = "sceau";
    btn.type = "button";
    btn.setAttribute("aria-label", "Briser le sceau — " + nomNiveau(carte, i) + " de " + carte.nom);

    const cire = document.createElement("span");
    cire.className = "sceau-cire";
    cire.setAttribute("aria-hidden", "true");
    cire.textContent = "✦";
    const nom = document.createElement("span");
    nom.className = "sceau-nom";
    nom.textContent = nomNiveau(carte, i);
    const etat = document.createElement("span");
    etat.className = "sceau-etat";
    etat.setAttribute("aria-hidden", "true");

    btn.append(cire, nom, etat);
    btn.addEventListener("click", () => briser(btn, bloc, idx, i));
    bloc.appendChild(btn);
  }

  // Niveau révélé : le titre et son effet. anime = déroulé du parchemin.
  function ouvrirNiveau(bloc, idx, i, anime) {
    const carte = TAROTS[idx];
    bloc.innerHTML = "";
    const titre = document.createElement("h3");
    titre.textContent = "✦ " + nomNiveau(carte, i);
    const p = document.createElement("p");
    p.textContent = carte.niveaux[i];
    bloc.append(titre, p);
    bloc.classList.toggle("eclot", !!anime);
  }

  // Le cachet se fendille, puis l'effet se déroule à sa place.
  function briser(btn, bloc, idx, i) {
    if (btn.classList.contains("brise")) return;
    btn.classList.add("brise");
    brises.add(cleNiveau(idx, i));
    enregistrerSceaux();
    setTimeout(() => {
      // la carte a pu changer entre-temps : on ne réécrit que si le bloc est resté en place
      if (bloc.isConnected) ouvrirNiveau(bloc, idx, i, true);
      majSceaux();
    }, DUREE_SCEAU);
  }

  // Rejoue à chaque pioche l'animation complète : la carte repart au paquet
  // (dos visible, sans transition), puis glisse jusqu'à sa place et se
  // retourne pour révéler la nouvelle face.
  function reveler(idx) {
    animEnCours = true;
    panneau.classList.remove("visible");

    // remise à zéro instantanée : dos visible, carte au niveau du paquet
    scene.style.transition = "none";
    carte3d.style.transition = "none";
    scene.classList.remove("en-place");
    carte3d.classList.remove("retournee");

    setFace(idx);

    // on fige cet état initial avant de réactiver les transitions
    void scene.offsetWidth;
    scene.style.transition = "";
    carte3d.style.transition = "";

    // glisse, puis retournement, puis apparition des effets
    scene.classList.add("en-place");
    setTimeout(() => {
      carte3d.classList.add("retournee");
      setTimeout(() => {
        remplirPanneau(idx); // le panneau est éteint : on peut écrire dedans
        panneau.classList.add("visible");
        animEnCours = false;
      }, DUREE_FLIP);
    }, DUREE_GLISSE);
  }

  /* ---------- Galerie ---------- */

  function construireGalerie() {
    TAROTS.forEach((carte, idx) => {
      const mini = document.createElement("button");
      mini.className = "mini";
      mini.type = "button";
      mini.dataset.idx = idx;
      mini.setAttribute("aria-label", "Consulter l'arcane " + carte.num + " — " + carte.nom);

      // même cadre parchemin que la grande carte, en petit
      const cadre = document.createElement("span");
      cadre.className = "carte-cadre" + (carte.image ? "" : " sans-image");
      const fenetre = document.createElement("span");
      fenetre.className = "carte-fenetre";
      if (carte.image) {
        const img = document.createElement("img");
        img.src = TAROTS_IMG_DIR + carte.image;
        img.alt = "";
        img.loading = "lazy";
        fenetre.appendChild(img);
      } else {
        const vide = document.createElement("span");
        vide.className = "carte-vide";
        vide.innerHTML = '<span class="vide-orne">✦</span>';
        fenetre.appendChild(vide);
      }
      const banniere = document.createElement("span");
      banniere.className = "carte-banniere";
      banniere.textContent = carte.num + " · " + carte.nom;
      cadre.append(fenetre, banniere);
      mini.appendChild(cadre);

      mini.addEventListener("click", () => {
        if (animEnCours) return;
        reveler(idx);
        aide.textContent = "Consultation — l'arcane n'est pas retiré du paquet";
      });

      galerie.appendChild(mini);
    });
  }

  function majGalerie() {
    galerie.querySelectorAll(".mini").forEach((mini) => {
      mini.classList.toggle("tiree", tirees.has(Number(mini.dataset.idx)));
    });
  }

  /* ---------- Événements ---------- */

  paquetBtn.addEventListener("click", () => {
    if (animEnCours) return;

    if (pioche.length === 0) {
      melangerPaquet(true);
      aide.textContent = "Le paquet a été remélangé — cliquez pour piocher";
      return;
    }

    const idx = pioche.pop();
    tirees.add(idx);
    majPaquet();
    majGalerie();
    reveler(idx);
    aide.textContent = pioche.length === 0
      ? "Dernière carte ! Cliquez sur le paquet pour le remélanger"
      : "Cliquez sur le paquet pour piocher une autre carte";
  });

  remelangerBtn.addEventListener("click", () => {
    if (animEnCours) return;
    melangerPaquet(true);
    aide.textContent = "Le paquet a été remélangé — cliquez pour piocher";
  });

  /* ---------- Resceller ---------- */

  // Remet les sceaux de la carte affichée seulement.
  rescellerCarteBtn.addEventListener("click", () => {
    if (carteAffichee === null) return;
    TAROTS[carteAffichee].niveaux.forEach((_, i) => brises.delete(cleNiveau(carteAffichee, i)));
    enregistrerSceaux();
    remplirPanneau(carteAffichee);
  });

  // Le bouton global efface toute la mémoire : on demande confirmation,
  // le bouton revient de lui-même à son état normal si on l'ignore.
  const TEXTE_RESCELLER = "✦ Resceller tous les arcanes";
  let minuteurConfirmation = null;

  function annulerConfirmation() {
    clearTimeout(minuteurConfirmation);
    minuteurConfirmation = null;
    rescellerToutBtn.classList.remove("confirme");
    rescellerToutBtn.textContent = TEXTE_RESCELLER;
  }

  rescellerToutBtn.addEventListener("click", () => {
    if (!minuteurConfirmation) {
      rescellerToutBtn.classList.add("confirme");
      rescellerToutBtn.textContent = "Tout resceller ? cliquez pour confirmer";
      minuteurConfirmation = setTimeout(annulerConfirmation, 5000);
      return;
    }
    annulerConfirmation();
    brises.clear();
    enregistrerSceaux();
    if (carteAffichee !== null) remplirPanneau(carteAffichee);
    majSceaux();
  });

  /* ---------- Zoom plein écran ---------- */

  function ouvrirZoom() {
    if (animEnCours || carteAffichee === null) return;
    remplirCadre(zoomCadre, zoomImage, zoomBanniere, TAROTS[carteAffichee]);
    zoomOverlay.classList.add("ouvert");
    document.body.style.overflow = "hidden";
  }

  function fermerZoom() {
    zoomOverlay.classList.remove("ouvert");
    document.body.style.overflow = "";
  }

  scene.addEventListener("click", ouvrirZoom);
  scene.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ouvrirZoom();
    }
  });

  // clic n'importe où (carte comprise), croix ou Échap : on ferme
  zoomOverlay.addEventListener("click", fermerZoom);
  zoomFermer.addEventListener("click", fermerZoom);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && zoomOverlay.classList.contains("ouvert")) fermerZoom();
  });

  /* ---------- Départ ---------- */
  chargerSceaux();
  melangerPaquet();
  construireGalerie();
  majSceaux();
})();
