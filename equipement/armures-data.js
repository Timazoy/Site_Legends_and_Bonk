/* Généré depuis Armures.docx + Armures_illustrations + Prix armures.docx — ne pas éditer à la main de préférence. */
window.EQUIP_ARMURES = {
 "raretes": {
  "C":  { "nom": "Commun",       "couleur": "#000000" },
  "SC": { "nom": "Super Commun", "couleur": "#0000ff" },
  "R":  { "nom": "Rare",         "couleur": "#38761d" },
  "SR": { "nom": "Super Rare",   "couleur": "#00ff00" },
  "E":  { "nom": "Épique",       "couleur": "#9900ff" },
  "SE": { "nom": "Super Épique", "couleur": "#ff00ff" }
 },
 "categoriesOrdre": [
  "Armures légères",
  "Armures moyennes",
  "Armures lourdes"
 ],
 "sousCategoriesOrdre": [
  "Standard",
  "Divers",
  "Ensemble du désert",
  "Ensemble isolant",
  "Ensemble de fourrure",
  "Ensemble du berserker"
 ],
 "objets": [

  {
   "nom": "Casque léger",
   "categorie": "Armures légères",
   "sousCategorie": "Standard",
   "tiers": ["C", "SC", "R", "SR"],
   "paliers": {
    "C": "+15% de PV",
    "SC": "+18% de PV",
    "R": "+22% de PV",
    "SR": "+27% de PV"
   },
   "prix": { "C": 4500, "SC": 9000, "R": 18000, "SR": 27000 },
   "effets": [],
   "images": ["Casque_leger.webp"]
  },
  {
   "nom": "Cuirasse légère",
   "categorie": "Armures légères",
   "sousCategorie": "Standard",
   "tiers": ["C", "SC", "R", "SR"],
   "paliers": {
    "C": "+20% de PV",
    "SC": "+25% de PV",
    "R": "+30% de PV",
    "SR": "+38% de PV"
   },
   "prix": { "C": 6000, "SC": 12000, "R": 24000, "SR": 36000 },
   "effets": [],
   "images": ["Cuirasse_legere.webp"]
  },
  {
   "nom": "Jambières légères",
   "categorie": "Armures légères",
   "sousCategorie": "Standard",
   "tiers": ["C", "SC", "R"],
   "paliers": {
    "C": "+13% de PV",
    "SC": "+17% de PV",
    "R": "+20% de PV"
   },
   "prix": { "C": 3900, "SC": 7800, "R": 15600 },
   "effets": [],
   "images": ["Jambieres_legere.webp"]
  },

  {
   "nom": "Cape magique discrète",
   "categorie": "Armures légères",
   "sousCategorie": "Divers",
   "tiers": ["C", "SC", "R", "SR", "E", "SE"],
   "paliers": {
    "C":  "+5% de PV, +10% de PM, +1 en discrétion",
    "SC": "+6% de PV, +12% de PM, +1 en discrétion",
    "R":  "+7,5% de PV, +15% de PM, +2 en discrétion",
    "SR": "+9% de PV, +19% de PM, +2 en discrétion",
    "E":  "+11% de PV, +23% de PM, +3 en discrétion",
    "SE": "+14% de PV, +28% de PM, +3 en discrétion"
   },
   "prix": { "C": 1800, "SC": 3600, "R": 7200, "SR": 10800, "E": 14400, "SE": 18000 },
   "effets": [],
   "images": ["Cape_magique_discrete.webp"]
  },
  {
   "nom": "Cotte de maille",
   "categorie": "Armures légères",
   "sousCategorie": "Divers",
   "tiers": ["SC", "R", "SR"],
   "paliers": {
    "SC": "+12,5 de PV",
    "R":  "+15 de PV",
    "SR": "+19 de PV"
   },
   "prix": { "SC": 4800, "R": 9600, "SR": 14400 },
   "effets": ["Peut être équipée uniquement sous une cuirasse."],
   "images": ["Cotte_de_maille.webp"]
  },

  {
   "nom": "Le chèche du désert",
   "categorie": "Armures légères",
   "sousCategorie": "Ensemble du désert",
   "tiers": ["C", "SC", "R", "SR"],
   "paliers": {
    "C":  "+10% de PV",
    "SC": "+12% de PV",
    "R":  "+15% de PV",
    "SR": "+19% de PV"
   },
   "prix": { "C": 3450, "SC": 6900, "R": 13800, "SR": 20700 },
   "effets": [],
   "images": ["Le_cheche_du_desert.webp"]
  },
  {
   "nom": "Cape du désert",
   "categorie": "Armures légères",
   "sousCategorie": "Ensemble du désert",
   "tiers": ["C", "SC", "R", "SR"],
   "paliers": {
    "C":  "+15% de PV",
    "SC": "+19% de PV",
    "R":  "+22% de PV",
    "SR": "+28% de PV"
   },
   "prix": { "C": 5200, "SC": 10400, "R": 20800, "SR": 31200 },
   "effets": [],
   "images": ["Cape_du_desert.webp"]
  },
  {
   "nom": "Jupe du désert",
   "categorie": "Armures légères",
   "sousCategorie": "Ensemble du désert",
   "tiers": ["C", "SC", "R"],
   "paliers": {
    "C":  "+10% de PV",
    "SC": "+12% de PV",
    "R":  "+15% de PV"
   },
   "prix": { "C": 3450, "SC": 6900, "R": 13800 },
   "effets": [],
   "images": ["Jupe_du_desert.webp"]
  },

  {
   "nom": "Casque",
   "categorie": "Armures moyennes",
   "sousCategorie": "Standard",
   "tiers": ["SC", "R", "SR", "E"],
   "paliers": {
    "SC": "+22,5% de PV",
    "R":  "+27% de PV",
    "SR": "+34% de PV",
    "E":  "+40,5% de PV"
   },
   "prix": { "SC": 10800, "R": 21600, "SR": 32400, "E": 43200 },
   "effets": [],
   "images": ["Casque.webp"]
  },
  {
   "nom": "Cuirasse",
   "categorie": "Armures moyennes",
   "sousCategorie": "Standard",
   "tiers": ["SC", "R", "SR", "E"],
   "paliers": {
    "SC": "+28% de PV, VTS -1",
    "R":  "+34% de PV, VTS -1",
    "SR": "+42% de PV, VTS -0",
    "E":  "+50% de PV, VTS -0"
   },
   "prix": { "SC": 13600, "R": 27200, "SR": 40800, "E": 54400 },
   "effets": [],
   "images": ["Cuirasse.webp"]
  },
  {
   "nom": "Jambières",
   "categorie": "Armures moyennes",
   "sousCategorie": "Standard",
   "tiers": ["SC", "R", "SR"],
   "paliers": {
    "SC": "+19% de PV, VTS -1",
    "R":  "+23% de PV, VTS -1",
    "SR": "+28% de PV, VTS -0"
   },
   "prix": { "SC": 8600, "R": 17200, "SR": 25800 },
   "effets": [],
   "images": ["Jambieres.webp"]
  },

  {
   "nom": "Casque isolant",
   "categorie": "Armures moyennes",
   "sousCategorie": "Ensemble isolant",
   "tiers": ["C", "SC", "R", "SR", "E"],
   "paliers": {
    "C":  "+15% de PV",
    "SC": "+19% de PV",
    "R":  "+22,5% de PV",
    "SR": "+28% de PV",
    "E":  "+33% de PV"
   },
   "prix": { "C": 5400, "SC": 10800, "R": 21600, "SR": 32400, "E": 43200 },
   "effets": [],
   "images": ["Casque_isolant.webp"]
  },
  {
   "nom": "Cuirasse isolante",
   "categorie": "Armures moyennes",
   "sousCategorie": "Ensemble isolant",
   "tiers": ["C", "SC", "R", "SR", "E"],
   "paliers": {
    "C":  "+18 de PV, précision -1",
    "SC": "+22% de PV, précision -1",
    "R":  "+27% de PV, VTS -0",
    "SR": "+34% de PV, VTS -0",
    "E":  "+40% de PV, VTS -0"
   },
   "prix": { "C": 6800, "SC": 13600, "R": 27200, "SR": 40800, "E": 54400 },
   "effets": [],
   "images": ["Cuirasse_isolante.webp"]
  },
  {
   "nom": "Jambières isolantes",
   "categorie": "Armures moyennes",
   "sousCategorie": "Ensemble isolant",
   "tiers": ["C", "SC", "R", "SR"],
   "paliers": {
    "C":  "+12% de PV, VTS -1",
    "SC": "+15% de PV, VTS -1",
    "R":  "+18% de PV, VTS -0",
    "SR": "+22,5% de PV, VTS -0"
   },
   "prix": { "C": 4300, "SC": 8600, "R": 17200, "SR": 25800 },
   "effets": [],
   "images": ["Jambieres_isolante.webp"]
  },

  {
   "nom": "Casque lourd",
   "categorie": "Armures lourdes",
   "sousCategorie": "Standard",
   "tiers": ["C", "SC", "R", "SR", "E", "SE"],
   "paliers": {
    "C":  "+20% de PV, perception -2",
    "SC": "+25% de PV, perception -1",
    "R":  "+30% de PV, perception -1",
    "SR": "+38% de PV, perception -1",
    "E":  "+45% de PV, perception -0",
    "SE": "+56% de PV, perception -0"
   },
   "prix": { "C": 6000, "SC": 12000, "R": 24000, "SR": 36000, "E": 48000, "SE": 60000 },
   "effets": [],
   "images": ["Casque_lourd.webp"]
  },
  {
   "nom": "Cuirasse lourde",
   "categorie": "Armures lourdes",
   "sousCategorie": "Standard",
   "tiers": ["C", "SC", "R", "SR", "E", "SE"],
   "paliers": {
    "C":  "+25% de PV, VTS -2",
    "SC": "+31% de PV, VTS -2",
    "R":  "+37,5% de PV, VTS -2",
    "SR": "+47% de PV, VTS -1",
    "E":  "+56% de PV, VTS -1",
    "SE": "+70% de PV, VTS -1"
   },
   "prix": { "C": 7500, "SC": 15000, "R": 30000, "SR": 45000, "E": 60000, "SE": 75000 },
   "effets": [],
   "images": ["Cuirasse_lourde.webp"]
  },
  {
   "nom": "Jambières lourdes",
   "categorie": "Armures lourdes",
   "sousCategorie": "Standard",
   "tiers": ["C", "SC", "R", "SR", "E", "SE"],
   "paliers": {
    "C":  "+16% de PV, VTS -2",
    "SC": "+21% de PV, VTS -2",
    "R":  "+25% de PV, VTS -2",
    "SR": "+31% de PV, VTS -1",
    "E":  "+36% de PV, VTS -1",
    "SE": "+45% de PV, VTS -1"
   },
   "prix": { "C": 4800, "SC": 9600, "R": 19200, "SR": 28800, "E": 38400, "SE": 48000 },
   "effets": [],
   "images": ["Jambieres_lourde.webp"]
  },

  {
   "nom": "Casque à cornes de fourrure",
   "categorie": "Armures lourdes",
   "sousCategorie": "Ensemble de fourrure",
   "tiers": ["SC", "R", "SR", "E"],
   "paliers": {
    "SC": "+22% de PV",
    "R":  "+27% de PV",
    "SR": "+34% de PV",
    "E":  "+40% de PV"
   },
   "prix": { "SC": 12400, "R": 24800, "SR": 37200, "E": 49600 },
   "effets": [],
   "images": ["Casque_a_cornes_de_fourrure.webp"]
  },
  {
   "nom": "Plastron de fourrure",
   "categorie": "Armures lourdes",
   "sousCategorie": "Ensemble de fourrure",
   "tiers": ["SC", "R", "SR", "E"],
   "paliers": {
    "SC": "+27% de PV, VTS -2",
    "R":  "+33% de PV, VTS -1",
    "SR": "+41% de PV, VTS -1",
    "E":  "+49% de PV, VTS -0"
   },
   "prix": { "SC": 15200, "R": 30400, "SR": 45600, "E": 60800 },
   "effets": [],
   "images": ["Plastron_de_fourrure.webp"]
  },
  {
   "nom": "Jambières de fourrure",
   "categorie": "Armures lourdes",
   "sousCategorie": "Ensemble de fourrure",
   "tiers": ["SC", "R", "SR", "E"],
   "paliers": {
    "SC": "+19% de PV, VTS -2",
    "R":  "+22% de PV, VTS -1",
    "SR": "+28% de PV, VTS -1",
    "E":  "+34% de PV, VTS -0"
   },
   "prix": { "SC": 10400, "R": 20800, "SR": 31200, "E": 41600 },
   "effets": [],
   "images": ["Jambieres_de_fourrure.webp"]
  },

  {
   "nom": "Casque berserker",
   "categorie": "Armures lourdes",
   "sousCategorie": "Ensemble du berserker",
   "tiers": ["SC", "R", "SR", "E"],
   "paliers": {
    "SC": "+18% de PV",
    "R":  "+22% de PV",
    "SR": "+28% de PV",
    "E":  "+34% de PV"
   },
   "prix": { "SC": 12700, "R": 25400, "SR": 38100, "E": 50800 },
   "effets": [],
   "images": ["Casque_berserker.webp"]
  },
  {
   "nom": "Cuirasse berserker",
   "categorie": "Armures lourdes",
   "sousCategorie": "Ensemble du berserker",
   "tiers": ["SC", "R", "SR", "E"],
   "paliers": {
    "SC": "+22% de PV",
    "R":  "+27% de PV",
    "SR": "+34% de PV",
    "E":  "+40% de PV"
   },
   "prix": { "SC": 17000, "R": 34000, "SR": 51000, "E": 68000 },
   "effets": [],
   "images": ["Cuirasse_berserker.webp"]
  },
  {
   "nom": "Jambières berserker",
   "categorie": "Armures lourdes",
   "sousCategorie": "Ensemble du berserker",
   "tiers": ["SC", "R", "SR", "E"],
   "paliers": {
    "SC": "+15% de PV",
    "R":  "+18% de PV",
    "SR": "+22% de PV",
    "E":  "+27% de PV"
   },
   "prix": { "SC": 10100, "R": 20200, "SR": 30300, "E": 40400 },
   "effets": [],
   "images": ["Jambieres_berserker.webp"]
  }

 ]
};
