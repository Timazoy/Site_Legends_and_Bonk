// Interface de la page des tarots : pioche dans le paquet, retournement
// de la carte, panneau d'effets et galerie de consultation.
// Les données (TAROTS, TAROTS_IMG_DIR) viennent de tarots.js.

(() => {
  // Durées synchronisées avec tarots.css
  const DUREE_GLISSE = 420; // arrivée de la carte depuis le paquet
  const DUREE_FLIP = 720;   // rotation de la carte

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

  const NUMERAUX = ["I", "II", "III"];

  let pioche = [];           // indices des cartes encore dans le paquet
  const tirees = new Set();  // indices sorties du paquet depuis le dernier mélange
  let animEnCours = false;
  let carteAffichee = null;  // indice de la carte actuellement révélée

  /* ---------- Paquet ---------- */

  function melangerPaquet() {
    pioche = TAROTS.map((_, i) => i);
    for (let i = pioche.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pioche[i], pioche[j]] = [pioche[j], pioche[i]];
    }
    tirees.clear();
    majPaquet();
    majGalerie();
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
    const carte = TAROTS[idx];
    carteAffichee = idx;

    remplirCadre(faceCadre, faceImage, faceBanniere, carte);
    scene.tabIndex = 0;

    carteNom.textContent = carte.nom;
    carteNum.textContent = "Arcane " + carte.num;

    niveauxZone.innerHTML = "";
    carte.niveaux.forEach((texte, i) => {
      const bloc = document.createElement("div");
      bloc.className = "niveau";
      const titre = document.createElement("h3");
      // le Fou n'a qu'un seul effet, pas de niveaux
      titre.textContent = carte.niveaux.length === 1 ? "✦ Effet" : "✦ Niveau " + NUMERAUX[i];
      const p = document.createElement("p");
      p.textContent = texte;
      bloc.append(titre, p);
      niveauxZone.appendChild(bloc);
    });
  }

  // Retourne la carte demandée : glisse depuis le paquet la première fois,
  // sinon repasse par le dos avant de révéler la nouvelle face.
  function reveler(idx) {
    animEnCours = true;
    panneau.classList.remove("visible");

    const terminer = () => {
      setTimeout(() => {
        panneau.classList.add("visible");
        animEnCours = false;
      }, DUREE_FLIP);
    };

    if (!scene.classList.contains("en-place")) {
      setFace(idx);
      scene.classList.add("en-place");
      setTimeout(() => {
        carte3d.classList.add("retournee");
        terminer();
      }, DUREE_GLISSE);
    } else if (carte3d.classList.contains("retournee")) {
      carte3d.classList.remove("retournee");
      setTimeout(() => {
        setFace(idx);
        carte3d.classList.add("retournee");
        terminer();
      }, DUREE_FLIP);
    } else {
      setFace(idx);
      carte3d.classList.add("retournee");
      terminer();
    }
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
      melangerPaquet();
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
    melangerPaquet();
    aide.textContent = "Le paquet a été remélangé — cliquez pour piocher";
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
  melangerPaquet();
  construireGalerie();
})();
