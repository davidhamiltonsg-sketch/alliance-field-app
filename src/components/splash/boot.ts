/**
 * Runs inline in <head> before first paint: picks the splash variant so a
 * returning visitor never sees a flash of the full opening sequence. It no
 * longer forces a first-time visitor into /intro: the home page offers "Take
 * the 60-second tour" instead.
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

export const splashBootScript = `(function(){var d=document.documentElement;var off=/${NO_SPLASH_SOURCE}/.test(location.pathname);try{var seen=localStorage.getItem("${INTRO_SEEN_KEY}");d.dataset.splash=off?"off":seen?"short":"full"}catch(e){d.dataset.splash=off?"off":"full"}})();`;
