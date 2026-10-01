/*
 * Testimonials: the original wording exactly as first supplied (commits
 * 06ec06e and 20cb5ae, 28 September 2026), verbatim and never edited
 * (CANON round 6) — including US spelling, straight apostrophes and terms the
 * rest of the app has since renamed. They are real people's words, so this
 * file is excluded from every copy scan and wording test (see
 * tests/registry.test.ts); tests/testimonials.test.ts pins the text so it
 * can't drift. Shown with "Shared with permission. Individual experiences;
 * results vary." (src/components/Testimonials.tsx).
 */
export interface Testimonial {
  quote: string;
  names: string;
}

export const coupleTestimonials: Testimonial[] = [
  {
    quote:
      "My partner and I used to get trapped in this exhausting pursuer-withdrawer loop whenever we argued, but learning to use a timed Pause + Return completely changed our dynamic. Knowing there’s a set time to come back means taking space doesn't trigger abandonment fears anymore.",
    names: "Mateo & Leo",
  },
  {
    quote:
      "We have totally different communication styles — one of us is very strategic and wants to fix logistics immediately, while the other needs emotional warmth first. The Profile calibration and the System Overlay sequence completely stopped us from accidentally talking past each other.",
    names: "Kai & Sam",
  },
  {
    quote:
      "I used to carry all the mental load for our household and just build up silent resentment until I blew up. Doing the Care Audit during our Weekly Reset changed everything because it finally made that invisible work visible without turning into an argument.",
    names: "Marcus & Taylor",
  },
  {
    quote:
      "Switching to the “Team Frame” mindset was a total game-changer for us. Instead of treating each other like the enemy during a disagreement, we actually feel like we're tackling the problem side-by-side now.",
    names: "Chloe & Ben",
  },
  {
    quote:
      "Hard talks used to derail our entire evening because we'd jump straight into complaints. Following the proper sequence — starting with warmth and safety before bringing up an issue — stops defenses from going up immediately.",
    names: "Liam & Jess",
  },
  {
    quote:
      "We stopped relying on vague promises to try harder and started using concrete proof windows with observable behavior, which finally allowed us to rebuild real trust.",
    names: "David & Mei",
  },
];

export const individualTestimonials: Testimonial[] = [
  {
    quote:
      "Running the Layer Scan saved us from barking up the wrong tree when things felt off. Instead of treating a basic fatigue or atmosphere problem like a massive relationship crisis, we knew exactly which layer to stabilize first.",
    names: "Devon",
  },
  {
    quote:
      "Doing the Consistency Pact on my own each week has been an eye-opener for checking my own blind spots. It lets me look at where my words and actions didn't match up under stress without feeling like I'm putting my partner on trial.",
    names: "Julian",
  },
  {
    quote:
      "As someone who tends to over-analyze and optimize everything, the Sun Memory protocol saved me from turning my relationship into a constant performance review. Being able to pull the plug on all system-talk gave our unforced ease back.",
    names: "Alex",
  },
  {
    quote:
      "I used to get overwhelmed trying to fix big arguments all at once, but the 2% Rule gave me a tiny, concrete way to own my part of a friction point without feeling like I was swallowing blame.",
    names: "Elena",
  },
];
