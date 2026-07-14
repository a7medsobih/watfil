import { BlogPostPage } from "@/features/blog";

export default async function Page({ params }) {
  const { slug } = await params;
  return <BlogPostPage slug={slug} />;
}
