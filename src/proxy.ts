import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  UNLOCK_PATH,
  WRONG_CODE_DELAY_MS,
  accessToken,
  codesMatch,
  isPublicPath,
  safeNext,
  tokenMatches,
} from "@/lib/launch-lock";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function backToUnlock(request: NextRequest, next: string) {
  const back = new URL(UNLOCK_PATH, request.url);
  back.searchParams.set("error", "1");
  back.searchParams.set("next", next);
  const res = NextResponse.redirect(back, 303);
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const code = process.env.LAUNCH_ACCESS_CODE?.trim();
  if (!code) {
    // Launched: no lock. The unlock page itself 404s (see src/app/unlock/page.tsx).
    if (pathname === UNLOCK_PATH && request.method === "POST") return new NextResponse(null, { status: 404 });
    return NextResponse.next();
  }

  const token = await accessToken(code, process.env.LAUNCH_COOKIE_SECRET);

  // The unlock form posts here.
  if (pathname === UNLOCK_PATH && request.method === "POST") {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      // JSON, empty or otherwise malformed body.
      return backToUnlock(request, "/");
    }
    const given = form.get("code");
    const next = safeNext(typeof form.get("next") === "string" ? (form.get("next") as string) : "/");
    if (typeof given !== "string" || !(await codesMatch(given, code))) {
      await wait(WRONG_CODE_DELAY_MS);
      return backToUnlock(request, next);
    }
    const res = NextResponse.redirect(new URL(next, request.url), 303);
    res.cookies.set(ACCESS_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: THIRTY_DAYS,
    });
    return res;
  }

  const unlocked = tokenMatches(request.cookies.get(ACCESS_COOKIE)?.value, token);
  if (unlocked || isPublicPath(pathname)) {
    const res = NextResponse.next();
    if (!unlocked) res.headers.set("X-Robots-Tag", "noindex");
    return res;
  }

  // Locked visitors never install the service worker, so it can't cache the lock screen.
  if (pathname === "/sw.js") return new NextResponse(null, { status: 404 });

  const unlock = new URL(UNLOCK_PATH, request.url);
  unlock.searchParams.set("next", safeNext(pathname + (searchParams.size ? `?${searchParams}` : "")));
  const res = NextResponse.redirect(unlock, 307);
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}

export const config = {
  // Everything except build assets and static brand files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-touch-icon|manifest.json|splash/|alliance-mark.svg).*)",
  ],
};
