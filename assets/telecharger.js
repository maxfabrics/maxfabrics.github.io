// Boutons Google Play des pages « lien en bio » (Instagram, TikTok, YouTube). Le navigateur intégré d'Instagram et de
// TikTok ouvre mal play.google.com : sur Android, le bouton passe par un lien « intent » qui ouvre directement l'appli
// Google Play, avec repli sur la page web. La source (?source=tiktok, par défaut « bio ») part dans le referrer de
// Google Play pour les statistiques d'acquisition. Français par défaut, anglais pour un téléphone dans une autre langue.
(function () {
  var params = new URLSearchParams(location.search);
  // Source par défaut : « bio », ou celle de la page (data-source="guide" sur les guides).
  var sourceParDefaut = document.documentElement.getAttribute('data-source') || 'bio';
  var source = (params.get('source') || sourceParDefaut).replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'bio';
  var campagne = document.documentElement.getAttribute('data-campagne') || 'telecharger';
  // ?v=film52 (ou o14 pour Ombelle) : la vidéo précise qui a amené le visiteur. Elle s'ajoute à la campagne, seule
  // colonne que Google Play garde avec la source dans ses rapports (utm_content n'y figure pas).
  var video = (params.get('v') || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 40);
  var referrer = encodeURIComponent('utm_source=' + source + '&utm_medium=lien&utm_campaign=' + campagne +
    (video ? '-' + video : ''));
  var android = /android/i.test(navigator.userAgent);

  document.querySelectorAll('[data-paquet]').forEach(function (a) {
    var paquet = a.getAttribute('data-paquet');
    var web = 'https://play.google.com/store/apps/details?id=' + paquet + '&referrer=' + referrer;
    a.href = android && a.hasAttribute('data-bouton')
      ? 'intent://details?id=' + paquet + '&referrer=' + referrer +
        '#Intent;scheme=market;package=com.android.vending;S.browser_fallback_url=' + encodeURIComponent(web) + ';end'
      : web;
  });

  var langue = (navigator.language || 'fr').slice(0, 2).toLowerCase();
  // Les guides existent dans chaque langue à leur propre adresse : on ne traduit pas leur texte (data-langue-fixe).
  if (langue !== 'fr' && !document.documentElement.hasAttribute('data-langue-fixe')) {
    document.documentElement.lang = 'en';
    var titre = document.documentElement.getAttribute('data-titre-en');
    if (titre) document.title = titre;
    document.querySelectorAll('[data-en]').forEach(function (el) { el.textContent = el.getAttribute('data-en'); });
    document.querySelectorAll('img[data-badge]').forEach(function (img) {
      img.src = img.getAttribute('data-badge') + 'google-play-en.png';
      img.alt = 'Get it on Google Play';
    });
  }
})();
