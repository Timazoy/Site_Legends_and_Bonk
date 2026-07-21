/* ------------------------------------------------------------------
 * Textes éditables À LA MAIN pour la page des armures.
 * Ce fichier n'est PAS généré : tu peux le modifier librement, il ne
 * sera pas écrasé quand armures-data.js est régénéré.
 *
 * - categories      : petit texte affiché sous le titre d'une grande catégorie.
 * - sousCategories  : petit texte affiché sous un titre de sous-catégorie.
 *                     IMBRIQUÉ PAR GRANDE CATÉGORIE.
 *
 * Laisse "" (chaîne vide) pour ne rien afficher.
 * ------------------------------------------------------------------ */
window.EQUIP_ARMURES_TEXTES = {

  categories: {
    "Armures légères": "",
    "Armures moyennes": "",
    "Armures lourdes": "Il faut minimum 14 en Constitution pour les porter."
  },

  sousCategories: {
    "Armures légères": {
      "Standard": "",
      "Divers": "",
      "Ensemble du désert": "Si les trois éléments du désert sont équipés, le porteur est immunisé au feu."
    },
    "Armures moyennes": {
      "Standard": "",
      "Ensemble isolant": "Si les trois éléments isolants sont équipés, le porteur est immunisé à la foudre."
    },
    "Armures lourdes": {
      "Standard": "",
      "Ensemble de fourrure": "Si les trois éléments de fourrure sont équipés, le porteur est immunisé à la glace.",
      "Ensemble du berserker": "Chaque pièce a le même effet, mais plus vous portez d'éléments de l'ensemble, plus il est puissant. Pour chaque attaque subie : avec 1 élément, +10% de dégâts infligés / +5% de dégâts subis ; avec 2 éléments, +22% / +8% ; avec 3 éléments, +36% / +12%. Ces effets durent jusqu'à la fin du combat, mais peuvent aussi être retirés d'un coup contre une sous-action."
    }
  }

};
