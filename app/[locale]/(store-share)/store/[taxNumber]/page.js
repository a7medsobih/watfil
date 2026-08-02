import { getLocale, getTranslations } from "next-intl/server";

import { getPublicStore } from "@/features/companies/api";
import StoreSharePage, {
  StoreShareNotAvailable,
} from "@/features/companies/components/share/StoreSharePage";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { taxNumber } = await params;
  const locale = await getLocale();
  const t = await getTranslations("storeShare");

  try {
    const store = await getPublicStore(taxNumber);

    if (!store) {
      return buildMetadata({
        title: t("unavailable.title"),
        description: t("unavailable.description"),
        path: `/store/${encodeURIComponent(String(taxNumber))}`,
        locale,
      });
    }

    const images = [];
    if (store.hasLogo) images.push({ url: store.logo });
    else if (store.identityImages[0]) {
      images.push({ url: store.identityImages[0] });
    }

    return buildMetadata({
      title: store.name,
      description: store.about || t("metaDescription", { name: store.name }),
      path: `/store/${encodeURIComponent(store.taxNumber || String(taxNumber))}`,
      locale,
      images: images.length ? images : undefined,
    });
  } catch (error) {
    console.error(
      `[store/[taxNumber] generateMetadata] tax=${taxNumber}`,
      error,
    );
    return buildMetadata({
      title: t("unavailable.title"),
      path: `/store/${encodeURIComponent(String(taxNumber))}`,
      locale,
    });
  }
}

export default async function StoreShareRoute({ params }) {
  const { taxNumber } = await params;

  let store;
  try {
    store = await getPublicStore(taxNumber);
  } catch (error) {
    console.error(`[store/[taxNumber] page] getPublicStore failed`, {
      taxNumber,
      status: error?.status,
      code: error?.code,
      message: error?.message,
    });
    throw error;
  }

  if (!store) {
    return <StoreShareNotAvailable />;
  }

  return <StoreSharePage store={store} />;
}
