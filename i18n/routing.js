// i18n/routing.js
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['ar', 'en'],

    // Arabic is the default: `/` has no prefix; English uses `/en`
    defaultLocale: 'ar',
    localePrefix: 'as-needed',

    // Do not auto-switch via Accept-Language / cookie on unprefixed URLs.
    // English is opt-in via `/en` (or the language switcher).
    localeDetection: false,
});
