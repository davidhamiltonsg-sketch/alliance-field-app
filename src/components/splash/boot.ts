/**
 * Runs inline in <head> before first paint: picks the splash variant so a
 * returning visitor never sees a flash of the full opening sequence.
 * Kept out of the client component so the server layout can inline it.
 */
export const INTRO_SEEN_KEY = "alliance.introSeen";

export const splashBootScript = `(function(){var d=document.documentElement;try{d.dataset.splash=localStorage.getItem("${INTRO_SEEN_KEY}")?"short":"full"}catch(e){d.dataset.splash="full"}})();`;
