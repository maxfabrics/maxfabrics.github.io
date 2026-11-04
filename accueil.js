// Extraits de jeu de l'accueil : un gros bouton de lecture à la marque remplace les contrôles natifs. La zone de toucher
// couvre toute la vidéo, et le geste de défilement de la vitrine reste libre. Sans script, les contrôles natifs restent.
// Aucune donnée n'est collectée ni envoyée : la vidéo ne se charge qu'au toucher (preload="none").
const anglais = document.documentElement.lang === 'en';
const lancer = anglais ? 'Play: ' : 'Lancer : ';
const suspendre = anglais ? 'Pause: ' : 'Mettre en pause : ';

document.querySelectorAll('.extrait').forEach((cadre) => {
  const video = cadre.querySelector('video');
  const description = video.getAttribute('aria-label');
  const bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.className = 'lecture-extrait';
  bouton.setAttribute('aria-label', `${lancer}${description}`);
  cadre.append(bouton);
  video.removeAttribute('controls');
  video.muted = true;

  bouton.addEventListener('click', () => {
    if (!video.paused) {
      video.pause();
      return;
    }
    // Un seul extrait à la fois, et un retour immédiat pendant le chargement.
    document.querySelectorAll('.extrait video').forEach((v) => { if (v !== video) v.pause(); });
    cadre.classList.add('attente');
    video.play().catch(() => {
      // Lecture impossible : on rend la main aux contrôles du navigateur.
      cadre.classList.remove('attente');
      bouton.remove();
      video.setAttribute('controls', '');
    });
  });

  video.addEventListener('playing', () => {
    cadre.classList.remove('attente');
    cadre.classList.add('en-lecture');
    bouton.setAttribute('aria-label', `${suspendre}${description}`);
  });
  ['pause', 'ended'].forEach((evenement) => video.addEventListener(evenement, () => {
    cadre.classList.remove('attente', 'en-lecture');
    bouton.setAttribute('aria-label', `${lancer}${description}`);
  }));
});
