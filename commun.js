/* ==================================================================
   STRUCTURE COMMUNE DU SITE — navbar + footer
   Le HTML vit dans partials/navbar.html et partials/footer.html :
   c'est là qu'on modifie la structure, jamais dans les pages.

   Chaque page inclut ce fichier juste après <body> :
     <script src="./commun.js"></script>   (pages à la racine)
     <script src="../commun.js"></script>  (pages dans un sous-dossier)
   La navbar est insérée à la place du <script>, le footer en fin de page.

   Les chemins des partials sont écrits depuis la racine du site
   (href="index.html", src="image/logo.png") : ce script leur ajoute le
   bon préfixe, puis marque le lien actif d'après l'URL de la page.

   ⚠ fetch() exige un serveur : tester avec Live Server (« Go Live »
   dans VS Code) ou « python -m http.server », pas en double-cliquant.
   ================================================================== */
(function () {
  // préfixe des chemins ("./" ou "../"), déduit du src de ce script
  var p = document.currentScript.getAttribute("src").replace(/commun\.js$/, "");

  // réserve l'emplacement de la navbar : là où se trouve ce <script>
  var reserve = document.createElement("div");
  document.currentScript.insertAdjacentElement("beforebegin", reserve);

  var domPret = new Promise(function (resoudre) {
    if (document.readyState !== "loading") resoudre();
    else document.addEventListener("DOMContentLoaded", resoudre);
  });

  function charger(nom) {
    return fetch(p + "partials/" + nom).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status + " sur " + nom);
      return r.text();
    });
  }

  // transforme le HTML d'un partial en fragment, en préfixant les chemins relatifs
  function fragment(html) {
    var gabarit = document.createElement("template");
    gabarit.innerHTML = html;
    gabarit.content.querySelectorAll("[href], [src]").forEach(function (el) {
      var attr = el.hasAttribute("href") ? "href" : "src";
      var val = el.getAttribute(attr);
      if (/^(https?:|mailto:|#)/.test(val)) return;
      el.setAttribute(attr, p + val);
    });
    return gabarit.content;
  }

  function echec(err) {
    console.error("commun.js : structure commune non chargée (" + err.message + ").");
    if (location.protocol === "file:") {
      reserve.innerHTML = '<div class="alert alert-danger m-2">La navbar ne peut pas se charger en ouvrant le'
        + ' fichier directement (file://). Lancez un serveur local : « Go Live » dans VS Code'
        + ' ou <code>python -m http.server</code> dans le dossier du site.</div>';
    }
  }

  /* ---------- Navbar ---------- */
  charger("navbar.html").then(function (html) {
    reserve.replaceWith(fragment(html));

    // lien actif : on compare chaque lien du menu à l'URL de la page courante
    var ici = location.pathname.replace(/\/$/, "/index.html");
    document.querySelectorAll(".navbar .nav-link[href], .navbar .dropdown-item[href]").forEach(function (a) {
      if (new URL(a.href).pathname !== ici) return;
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
      var dropdown = a.closest(".dropdown");
      if (dropdown) dropdown.querySelector(".dropdown-toggle").classList.add("active");
    });

    // sur mobile, ouvrir un dropdown ne doit pas laisser le menu replié
    document.querySelectorAll(".navbar .dropdown-toggle").forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var navbarCollapse = document.getElementById("navbarSupportedContent");
        if (window.getComputedStyle(navbarCollapse).display === "none") {
          new bootstrap.Collapse(navbarCollapse, { show: true });
        }
      });
    });
  }).catch(echec);

  /* ---------- Footer ---------- */
  Promise.all([charger("footer.html"), domPret]).then(function (resultats) {
    document.body.appendChild(fragment(resultats[0]));
  }).catch(echec);
})();
