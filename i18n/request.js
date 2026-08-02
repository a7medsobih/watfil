import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const FALLBACK_LOCALE = 'ar';

async function loadMessages(locale) {
    try {
        return (await import(`../messages/${locale}.json`)).default;
    } catch {
        return (await import(`../messages/${FALLBACK_LOCALE}.json`)).default;
    }
}

export default getRequestConfig(async ({ requestLocale }) => {
    // Typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : FALLBACK_LOCALE;

    return {
        locale,
        messages: await loadMessages(locale),
    };
});
