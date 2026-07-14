import { CompanyDetailsPage } from "@/features/companies";

export default async function Page({ params }) {
  const { slug } = await params;
  return <CompanyDetailsPage slug={slug} />;
}
