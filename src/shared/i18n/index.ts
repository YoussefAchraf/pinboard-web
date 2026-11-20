/**
 * FILE:   src/shared/i18n/index.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   i18next initialization. Every user-facing string in the app is a key resolved here; the text
 *   itself lives ONLY in locales/<lang>/<namespace>.json (one namespace per feature + `common`).
 *
 * CONTENT
 *   - Resources bundled inline (en + fr): namespaces common, auth, home. Init is synchronous
 *     (initAsync: false) so the first render and tests already have translations.
 *   - Language: navigator, then <html lang>; supported en | fr; fallback env.defaultLocale.
 *     Detection never writes to localStorage/sessionStorage/cookies (caches: []).
 *   - <html lang> follows the resolved language (on init and on 'languageChanged').
 *   - New feature -> new namespace file in BOTH locales + register it in RESOURCES and NAMESPACES.
 *
 * EXPORTS
 *   i18n (also initialized as a side effect), NAMESPACES, SUPPORTED_LANGUAGES
 *
 * USED BY
 *   src/main.tsx (side-effect import), test/renderWithProviders.tsx (real translations in tests),
 *   components via useTranslation('<namespace>').
 *
 * MAY IMPORT
 *   i18next, react-i18next, i18next-browser-languagedetector, ../lib/env, ./locales/**.
 */
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { env } from '../lib/env';
import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import frAuth from './locales/fr/auth.json';
import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;
export const NAMESPACES = ['common', 'auth', 'home'] as const;

const RESOURCES = {
  en: { common: enCommon, auth: enAuth, home: enHome },
  fr: { common: frCommon, auth: frAuth, home: frHome },
};

function syncHtmlLang(language: string | undefined): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = language ?? env.defaultLocale;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: env.defaultLocale,
    defaultNS: 'common',
    ns: [...NAMESPACES],
    initAsync: false,
    interpolation: { escapeValue: false },
    detection: { order: ['navigator', 'htmlTag'], caches: [] },
    returnNull: false,
  });

syncHtmlLang(i18n.resolvedLanguage);
i18n.on('languageChanged', () => syncHtmlLang(i18n.resolvedLanguage));

export { i18n };
