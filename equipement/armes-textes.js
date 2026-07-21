/* ------------------------------------------------------------------
 * Textes éditables À LA MAIN pour la page des armes.
 * Ce fichier n'est PAS généré : tu peux le modifier librement, il ne
 * sera pas écrasé quand armes-data.js est régénéré.
 *
 * - categories      : petit texte affiché sous le titre d'une grande catégorie.
 * - sousCategories  : petit texte affiché sous un titre de sous-catégorie.
 *                     IMBRIQUÉ PAR GRANDE CATÉGORIE : le texte de « Lourdes »
 *                     sous Courte distance est indépendant de celui de « Lourdes »
 *                     sous Mi-distance, etc.
 *
 * (La portée est désormais un champ « portee » à part entière dans
 *  armes-data.js — comme « flavor » —, elle s'édite directement là-bas.)
 *
 * Laisse "" (chaîne vide) pour ne rien afficher.
 * ------------------------------------------------------------------ */
window.EQUIP_ARMES_TEXTES = {

  categories: {
    "Courte distance": "",
    "Mi-distance": "",
    "Longue distance": "Les armes de longue distance qui se lancent possèdent toutes l’effet loyauté, elles reviennent automatiquement dans vos mains après avoir été lancées.",
    "Talismans": "Les talismans sont de puissants objets secondaires. Ils ne permettent pas d'attaquer, mais confèrent divers bonus. Leur effet principal est un “+1 ou 2 actions ou ressources”, propre à la race du porteur. Les autres effets sont généralement universels, mais certains talismans sont trop spécifiques à une classe pour être utiles à d’autres.",
    "Magiques": "Les armes peuvent être infusées de sorts élémentaires.",
    "Bâtons magiques": "Les bâtons sont de puissants artefacts magiques, ils octroient bien des pouvoirs à leurs utilisateurs. Au moment du repos, quand l’utilisateur va venir recharger sa magie il pourra choisir les effets de son bâton.",
    "Musicales": "Elles ajoutent une partition quand équipé.",
    "Médicales": "Elles ajoutent une décoction quand elles sont équipées.",
    "Boucliers": "Quand un bouclier est équipé, les style rapide ne sont pas appliquées.",
    "Objets animal": "Les animaux ont deux emplacements spécifiques d’objets animal. Ces objets peuvent aussi bien servir d’armes, d’armures ou d’objet de soutien pour nos compagnons de tout horizon.",
    "Flèches": "Les flèches sont à mettre dans un carquois."
  },

  sousCategories: {
    "Courte distance": {
      "Classique": "",
      "Petites armes": "Peut-être portée avec une autre armes classique.",
      "De lancer": "Peuvent être lancés à 15 cases de distance.",
      "Lourdes": "Il faut minimum 12 en Force pour les manier."
    },
    "Mi-distance": {
      "Classique": "",
      "De lancer": "Il faut minimum 12 en Force pour les lancer. Peuvent être lancés à 15 cases de distance",
      "Lourdes": "Il faut minimum 14 en Force pour les manier."
    },
    "Longue distance": {
      "Classique": ""
    },
    "Magiques": {
      "Courte distance": "",
      "Mi-distance": "",
      "Longue distance": "",
      "Boucliers": ""
    },
    "Musicales": {
      "Courte distance": "",
      "Mi-distance": "",
      "Longue distance": "",
      "Boucliers": ""
    },
    "Médicales": {
      "Courte distance": "",
      "Mi-distance": "",
      "Longue distance": "",
      "Boucliers": ""
    }
  }

};
