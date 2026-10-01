/**
 * Runs inline in <head> before first paint: picks the splash variant so a
 * returning visitor never sees a flash of the full opening sequence, and
 * sends a first-time visitor on "/" straight to /intro before anything is
 * downloaded or rendered (rather than after the home page has hydrated,
 * which on a slow phone was ~3 s). Crawlers and previews stay on "/".
 * Kept out of the client component so the server layout can inline it.
 */
export const INTRO_SEEN_KEY = "alliance.introSeen";

/** Same list as the splash's BOT check. */
export const BOT_UA_SOURCE = "bot|crawler|spider|crawling|slurp|lighthouse|preview";

/**
 * Pages that never show the opening splash: someone opening Help, the pause
 * timer or the lock screen needs it straight away, not after an animation.
 */
export const NO_SPLASH_PATHS = ["/help", "/pause", "/unlock"] as const;

export function isNoSplashPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (NO_SPLASH_PATHS as readonly string[]).includes(path);
}

const NO_SPLASH_SOURCE = `^(${NO_SPLASH_PATHS.map((p) => p.replace(/\//g, "\\/")).join("|")})\\/*$`;

export const splashBootScript = `(function(){var d=document.documentElement;var off=/${NO_SPLASH_SOURCE}/.test(location.pathname);try{var seen=localStorage.getItem("${INTRO_SEEN_KEY}");d.dataset.splash=off?"off":seen?"short":"full";if(!seen&&location.pathname==="/"&&!/${BOT_UA_SOURCE}/i.test(navigator.userAgent)){location.replace("/intro"+location.search+location.hash)}}catch(e){d.dataset.splash=off?"off":"full"}})();`;
