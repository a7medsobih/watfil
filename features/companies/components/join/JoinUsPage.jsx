import { getTranslations } from "next-intl/server";

import JoinUsForm from "./JoinUsForm";

/**
 * Join Us page body: form + simple FAQ.
 *
 * @param {object} props
 * @param {{ id: number|string, name: string }[]} props.governorates
 */
export default async function JoinUsPage({ governorates }) {
  const t = await getTranslations("joinUs");
  const faqItems = t.raw("faq.items");

  return (
    <div className="container space-y-14 pb-16 pt-2 sm:pt-4 md:space-y-16">
      <div className="mx-auto max-w-2xl">
        <JoinUsForm governorates={governorates} />
      </div>

      {Array.isArray(faqItems) && faqItems.length > 0 ? (
        <section
          className="mx-auto max-w-2xl"
          aria-labelledby="join-us-faq-title"
        >
          <h2
            id="join-us-faq-title"
            className="text-xl font-bold tracking-tight sm:text-2xl"
          >
            {t("faq.title")}
          </h2>
          <dl className="mt-6 space-y-6">
            {faqItems.map((item) => (
              <div key={item.question} className="border-b border-border/60 pb-6 last:border-0 last:pb-0">
                <dt className="text-sm font-semibold sm:text-base">
                  {item.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
