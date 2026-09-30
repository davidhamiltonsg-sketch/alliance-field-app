import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, UNLOCK_PATH, accessToken, codesMatch, isPublicPath, safeNext } from "@/lib/launch-lock";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function proxy(request: NextRequest) {
  const code = process.env.LAUNCH_ACCESS_CODE?.trim();
  if (!code) return NextResponse.next(); // launched: no lock

  const { pathname, searchParams } = request.nextUrl;
  const token = await accessToken(code);

  // The unlock form posts here.
  if (pathname === UNLOCK_PATH && request.method === "POST") {
    const form = await request.formData();
    const given = String(form.get("code") ?? "");
    const next = safeNext(String(form.get("next") ?? "/"));
    if (!codesMatch(given, code)) {
      const back = new URL(UNLOCK_PATH, request.url);
      back.searchParams.set("error", "1");
      back.searchParams.set("next", next);
      return NextResponse.redirect(back, 303);
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

  const unlocked = request.cookies.get(ACCESS_COOKIE)?.value === token;
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
