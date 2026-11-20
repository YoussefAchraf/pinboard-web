/**
 * FILE:   src/shared/i18n/index.ts
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   i18next initialization. Every user-facing string in the app is a key resolved here; the text
 *   itself lives ONLY in locales/<lang>/<namespace>.json (one namespace per feature + `common`).
 *
 * WHAT TO WRITE
 *   import enCommon from './locales/en/common.json'; import frCommon from './locales/fr/common.json';
 *   import enAuth from './locales/en/auth.json';     import frAuth from './locales/fr/auth.json';
 *   void i18n.use(LanguageDetector).use(initReactI18next).init({
 *     resources: { en: { common: enCommon, auth: enAuth, home: enHome }, fr: { common: frCommon, auth: frAuth, home: frHome } },
 *     supportedLngs: ['en', 'fr'],
 *     fallbackLng: env.defaultLocale,
 *     defaultNS: 'common',
 *     ns: ['common', 'auth', 'home'],
 *     interpolation: { escapeValue: false },       // React already escapes
 *     detection: { order: ['navigator', 'htmlTag'], caches: [] },   // no localStorage writes
 *     returnNull: false,
 *   });
 *   document.documentElement.lang = i18n.resolvedLanguage ?? env.defaultLocale; (and on 'languageChanged')
 *   export { i18n };
 *   - New feature -> new namespace file in BOTH locales + register it here.
 *   - Typed keys (optional, recommended): declare module 'i18next' { interface CustomTypeOptions {
 *       defaultNS: 'common'; resources: { common: typeof enCommon; auth: typeof enAuth } } }
 *
 * EXPORTS
 *   i18n (also initialized as a side effect)
 *
 * USED BY
 *   src/main.tsx (side-effect import), src/test/setup.ts (real translations in tests),
 *   components via useTranslation('<namespace>').
 *
 * MAY IMPORT
 *   i18next, react-i18next, i18next-browser-languagedetector, ../lib/env, ./locales/**.
 */
export {};
