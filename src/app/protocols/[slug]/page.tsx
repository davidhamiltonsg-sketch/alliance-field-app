import { notFound } from "next/navigation";
import { ProtocolLayout } from "@/components/ProtocolLayout";
import { getProtocol, protocolSlugs } from "@/data/protocols";

export function generateStaticParams() {
  return protocolSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProtocol(slug);
  return { title: p?.title ?? "Protocol" };
}

export default async function ProtocolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProtocol(slug);
  if (!p) notFound();
  return <ProtocolLayout protocol={p} />;
}
