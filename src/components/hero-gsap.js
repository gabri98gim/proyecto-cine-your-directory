import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

console.log('GSAP init loaded');
gsap.registerPlugin(ScrollTrigger);

export default function initHero() {
  console.log('initHero running');
  if (typeof window === 'undefined') return;
  try {
    const hero = document.getElementById('home-hero');
    const diaryInline = hero ? hero.querySelector('.diary-inline') : null;
    console.log('GSAP looking for elements', { hero: !!hero, diaryInline: !!diaryInline });
    if (!hero) return;

    // Entrada suave del título cuando se carga la página
    const title = hero.querySelector('.hero-title');
    const subtitle = hero.querySelector('.hero-sub');
    if (title) gsap.from(title, { y: -20, autoAlpha: 0, duration: 0.8, ease: 'power2.out' });
    if (subtitle) gsap.from(subtitle, { y: -10, autoAlpha: 0, duration: 0.9, delay: 0.15, ease: 'power2.out' });

    // Animar el botón 'Diario' en el hero (entrada después del subtitle)
    if (diaryInline) {
      gsap.from(diaryInline, { y: 10, autoAlpha: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });
    }
  } catch (e) {
    // fail silently but log to console for debugging
    console.error('GSAP initHero error:', e);
  }
}
