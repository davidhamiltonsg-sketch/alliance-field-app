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

export const splashBootScript = `(function(){var d=document.documentElement;try{var seen=localStorage.getItem("${INTRO_SEEN_KEY}");d.dataset.splash=seen?"short":"full";if(!seen&&location.pathname==="/"&&!/${BOT_UA_SOURCE}/i.test(navigator.userAgent)){location.replace("/intro"+location.search+location.hash)}}catch(e){d.dataset.splash="full"}})();`;
