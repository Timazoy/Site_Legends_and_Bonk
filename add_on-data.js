/* ==================================================================
   LE CATALOGUE DES ADD-ONS — lu par add_on.html
   C'est le seul fichier à toucher pour publier un add-on :
     1. déposer le contenu dans add_on/<fichier>.html (voir
        add_on/mecanique_de_chance.html comme modèle : le fichier ne
        contient QUE l'intérieur de la feuille, pas de <head>) ;
     2. ajouter son entrée dans « liste » ci-dessous.
   L'adresse de la fiche se déduit du dossier et de l'identifiant :
   add_on.html#/regles/mecanique-de-chance — elle est partageable.
   ================================================================== */
window.ADDONS = {

  /* les chemises des archives ; l'ordre est celui de l'affichage */
  dossiers: [
    { id: "regles",  nom: "Règles",  couleur: "#7a0808", desc: "Des mécaniques à greffer sur la partie" },
    { id: "classes", nom: "Classes", couleur: "#4a6b8a", desc: "De nouveaux héros à incarner" },
    { id: "races",   nom: "Races",   couleur: "#3f7d4f", desc: "De nouveaux peuples à jouer" },
    { id: "objets",  nom: "Objets",  couleur: "#a8712f", desc: "Armes, armures, potions et curiosités" },
    { id: "magie",   nom: "Magie",   couleur: "#8a5aa8", desc: "Sorts, rituels et grimoires" }
  ],

  liste: [
    {
      slug: "mecanique-de-chance",
      nom: "La mécanique de chance",
      dossier: "regles",
      auteur: "Charly",
      resume: "Une réserve de Points de Chance que l'on dépense pour forcer le destin — au risque de le voir se retourner.",
      fichier: "add_on/mecanique_de_chance.html",
      mots: "chance points de chance 1d8 2d8 chanceux malchanceux destin fortune repos renouveau"
    }
  ]
};
