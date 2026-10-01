import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageHeader } from "@/components/PageHeader";
import { safeNext } from "@/lib/launch-lock";

export const metadata = { title: "Coming soon", robots: { index: false, follow: false } };

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  // Read the lock at request time, never at build time.
  await connection();
  // Launched (no access code configured): there is nothing to unlock.
  if (!process.env.LAUNCH_ACCESS_CODE?.trim()) notFound();
  const { next, error } = await searchParams;
  const wrong = error === "1";

  return (
    <div className="space-y-6">
      <PageHeader title="Coming soon">
        Alliance Protocols is getting ready to launch. If you have an early-access code, enter it below.
      </PageHeader>

      <form method="post" action="/unlock" className="card space-y-4 px-4 py-5">
        <input type="hidden" name="next" value={safeNext(next)} />
        <div className="space-y-1.5">
          <label htmlFor="code" className="block text-[14px] font-medium text-ink">
            Access code
          </label>
          <input
            id="code"
            name="code"
            type="password"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-invalid={wrong || undefined}
            aria-describedby={wrong ? "code-error" : undefined}
            className="min-h-12 w-full rounded-xl border border-rule/20 bg-white px-3.5 text-[16px] text-ink"
          />
          {wrong && (
            <p id="code-error" role="alert" className="text-[14px] font-medium text-failure">
              That code didn&apos;t work. Check it and try again.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="min-h-12 w-full rounded-2xl bg-accent px-4 text-[15px] font-medium text-paper"
        >
          Unlock
        </button>
      </form>

      <p className="text-[14px] leading-normal text-ink-muted">
        Need help now? The <Link href="/help" className="underline underline-offset-4">help lines</Link> and{" "}
        <Link href="/privacy" className="underline underline-offset-4">privacy notice</Link> are always open.
      </p>
    </div>
  );
}
