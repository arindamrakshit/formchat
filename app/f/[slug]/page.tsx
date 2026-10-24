import PublicChat from "@/components/PublicChat";
export default function Page({ params }: { params: { slug: string } }) { return <PublicChat slug={params.slug} />; }
