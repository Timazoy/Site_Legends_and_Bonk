/* ==================================================================
   LES SILHOUETTES DE REMPLACEMENT
   Tant qu'une image n'est pas posée dans image-db/personnages/races/,
   on dessine un pictogramme à la place. Chaque forme a sa propre largeur
   de viewBox : c'est elle qui dit la corpulence, puisque la hauteur est
   imposée par la taille de la race.

   Partagé par races.html (l'échelle des peuples) et aides_creation.html
   (le pantin de l'outil de création) : c'est le SEUL endroit où ces
   pictogrammes sont dessinés.

   Formes disponibles :
     humanoide | elance | trapu | massif | aile
     reptile   | cornu  | bestial | informe | bloc
   ================================================================== */

var TRAIT = ' fill="none" stroke="currentColor" stroke-linecap="round"';
var FORMES = {
  humanoide: [120,
    '<ellipse cx="60" cy="30" rx="19" ry="24"/><rect x="53" y="48" width="14" height="12" rx="4"/>' +
    '<path d="M34 66q26-11 52 0l-4 86q-22 8-44 0z"/>' +
    '<path d="M36 72 26 154M84 72 94 154" stroke-width="14"' + TRAIT + '/>' +
    '<path d="M50 156 46 288M70 156 74 288" stroke-width="17"' + TRAIT + '/>'],

  elance: [110,
    '<ellipse cx="55" cy="30" rx="16" ry="23"/><path d="M42 22 30 8 44 32zM68 22 80 8 66 32z"/>' +
    '<rect x="49" y="48" width="12" height="12" rx="4"/>' +
    '<path d="M35 66q20-10 40 0l-3 84q-17 7-34 0z"/>' +
    '<path d="M37 72 29 152M73 72 81 152" stroke-width="11"' + TRAIT + '/>' +
    '<path d="M47 154 44 288M63 154 66 288" stroke-width="14"' + TRAIT + '/>'],

  trapu: [150,
    '<ellipse cx="75" cy="34" rx="24" ry="26"/>' +
    '<path d="M55 44q20 44 40 0 4 34-20 40-24-6-20-40z"/>' +
    '<path d="M36 76q39-14 78 0l-6 82q-33 10-66 0z"/>' +
    '<path d="M40 84 28 162M110 84 122 162" stroke-width="20"' + TRAIT + '/>' +
    '<path d="M60 162 56 286M90 162 94 286" stroke-width="24"' + TRAIT + '/>'],

  massif: [142,
    '<ellipse cx="71" cy="34" rx="20" ry="23"/>' +
    '<path d="M34 66q37-16 74 0l-8 84q-29 10-58 0z"/>' +
    '<path d="M41 74 25 164M101 74 117 164" stroke-width="19"' + TRAIT + '/>' +
    '<path d="M57 154 51 286M85 154 91 286" stroke-width="22"' + TRAIT + '/>'],

  aile: [176,
    '<path d="M70 74Q22 54 6 130Q36 118 70 134z"/><path d="M106 74Q154 54 170 130Q140 118 106 134z"/>' +
    '<ellipse cx="88" cy="32" rx="17" ry="21"/><path d="M101 28 124 34 101 42z"/>' +
    '<path d="M68 62q20-10 40 0l-4 88q-16 7-32 0z"/>' +
    '<path d="M73 70 63 152M103 70 113 152" stroke-width="12"' + TRAIT + '/>' +
    '<path d="M80 154 76 286M96 154 100 286" stroke-width="15"' + TRAIT + '/>'],

  reptile: [144,
    '<path d="M50 14 44 2 57 10zM62 10 58 0 71 6z"/>' +
    '<ellipse cx="66" cy="30" rx="19" ry="21"/><path d="M80 24 108 32 80 41z"/>' +
    '<rect x="58" y="48" width="15" height="12" rx="4"/>' +
    '<path d="M38 66q28-12 56 0l-5 86q-23 8-46 0z"/>' +
    '<path d="M41 74 31 154M91 74 101 154" stroke-width="15"' + TRAIT + '/>' +
    '<path d="M55 156 51 288M79 156 83 288" stroke-width="18"' + TRAIT + '/>'],

  cornu: [132,
    '<path d="M45 18 31 0 50 13zM79 18 93 0 74 13z"/>' +
    '<ellipse cx="62" cy="34" rx="18" ry="22"/><rect x="55" y="52" width="14" height="10" rx="4"/>' +
    '<path d="M36 68q26-11 52 0l-4 84q-22 8-44 0z"/>' +
    '<path d="M38 74 28 154M86 74 96 154" stroke-width="13"' + TRAIT + '/>' +
    '<path d="M52 156 48 288M72 156 76 288" stroke-width="16"' + TRAIT + '/>' +
    '<path d="M84 150q28 26 20 62" stroke-width="7"' + TRAIT + '/>'],

  bestial: [126,
    '<path d="M46 16 39 0 54 12zM76 16 83 0 68 12z"/>' +
    '<ellipse cx="61" cy="32" rx="18" ry="22"/><rect x="54" y="50" width="14" height="10" rx="4"/>' +
    '<path d="M35 66q26-11 52 0l-4 86q-22 8-44 0z"/>' +
    '<path d="M37 72 27 154M85 72 95 154" stroke-width="14"' + TRAIT + '/>' +
    '<path d="M51 156 47 288M71 156 75 288" stroke-width="17"' + TRAIT + '/>' +
    '<path d="M85 148q26 22 22 54" stroke-width="8"' + TRAIT + '/>'],

  informe: [132,
    '<path d="M66 4c18 0 28 14 26 32-2 14-10 20-4 30 14 22 24 50 24 94 0 58-14 92-18 132H38C34 254 20 220 20 160c0-44 10-72 24-94 6-10-2-16-4-30C38 18 48 4 66 4z"/>' +
    '<circle cx="66" cy="152" r="16" stroke-width="6" opacity=".45"' + TRAIT + '/>'],

  bloc: [152,
    '<rect x="49" y="6" width="54" height="46" rx="7"/><rect x="34" y="58" width="84" height="78" rx="9"/>' +
    '<rect x="8" y="62" width="22" height="76" rx="10"/><rect x="122" y="62" width="22" height="76" rx="10"/>' +
    '<rect x="42" y="142" width="29" height="148" rx="11"/><rect x="81" y="142" width="29" height="148" rx="11"/>']
};

function silhouetteSVG(forme) {
  var f = FORMES[forme] || FORMES.humanoide;
  return '<svg viewBox="0 0 ' + f[0] + ' 300" role="img" aria-hidden="true" focusable="false" fill="currentColor">' +
    f[1] + '</svg>';
}
