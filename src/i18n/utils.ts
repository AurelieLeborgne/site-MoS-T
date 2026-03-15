import fr from './fr.json';
import en from './en.json';

const translations = { fr, en } as const;

export type Lang = keyof typeof translations;

export const defaultLang: Lang = 'fr';
export const languages = { fr: 'Français', en: 'English' } as const;

export function t(lang: Lang, key: string): string | string[] {
  const keys = key.split('.');
  let value: unknown = translations[lang];
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  if (value === undefined) {
    // Fallback to French
    value = translations.fr as unknown;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
  }
  return value as string | string[];
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.replace(/^\/site-MoS-T/, '').split('/');
  if (lang === 'en') return 'en';
  return 'fr';
}

export function getLocalizedPath(lang: Lang, path: string): string {
  const base = '/site-MoS-T';
  return `${base}/${lang}${path}`;
}

/** Route mappings for language switcher */
const routeMap: Record<string, Record<Lang, string>> = {
  '/': { fr: '/', en: '/' },
  '/recherche/': { fr: '/recherche/', en: '/research/' },
  '/research/': { fr: '/recherche/', en: '/research/' },
  '/equipe/': { fr: '/equipe/', en: '/team/' },
  '/team/': { fr: '/equipe/', en: '/team/' },
  '/publications/': { fr: '/publications/', en: '/publications/' },
  '/evenements/': { fr: '/evenements/', en: '/events/' },
  '/events/': { fr: '/evenements/', en: '/events/' },
  '/ressources/': { fr: '/ressources/', en: '/resources/' },
  '/resources/': { fr: '/ressources/', en: '/resources/' },
  '/contact/': { fr: '/contact/', en: '/contact/' },
  '/bd/': { fr: '/bd/', en: '/comic/' },
  '/comic/': { fr: '/bd/', en: '/comic/' },
};

export function getAlternateUrl(currentUrl: URL, targetLang: Lang): string {
  const pathWithoutBase = currentUrl.pathname.replace(/^\/site-MoS-T/, '');
  const pathWithoutLang = pathWithoutBase.replace(/^\/(fr|en)/, '') || '/';
  const mapped = routeMap[pathWithoutLang]?.[targetLang] ?? pathWithoutLang;
  return `/site-MoS-T/${targetLang}${mapped}`;
}
