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
 * Un \n dans le texte est affiché comme un retour à la ligne.
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
      "Ensemble du berserker":
        "Chaque pièce a le même effet, mais plus vous en portez, plus l'ensemble est puissant.\n" +
        "À chaque attaque subie, vous gagnez un bonus qui se cumule :\n" +
        "• 1 élément — +10% de dégâts infligés, +5% de dégâts subis\n" +
        "• 2 éléments — +22% infligés, +8% subis\n" +
        "• 3 éléments — +36% infligés, +12% subis\n" +
        "Ces bonus durent jusqu'à la fin du combat, mais peuvent être retirés d'un coup contre une sous-action."
    }
  }

};
