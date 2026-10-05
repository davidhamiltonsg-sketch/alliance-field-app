/*
 * Testimonials: paraphrased from the pilot feedback first supplied
 * (commits 06ec06e and 20cb5ae, 28 September 2026), rewritten in October 2026
 * into the current tool names (retired names such as the old load audit, the
 * old team mindset and the old name for the profile report are gone) and
 * trimmed to what people did and what it felt like, with no claims about
 * results. PLACEHOLDER WORDING: each person must approve their paraphrase
 * before launch. This file is excluded from the copy scans (see
 * tests/registry.test.ts); tests/testimonials.test.ts pins the text so it
 * can't drift. Shown with TESTIMONIALS_DISCLAIMER
 * (src/components/Testimonials.tsx).
 */
/**
 * Feature flag: testimonials are not rendered anywhere until consent.
 * Set true only after each person approves written wording.
 */
export const SHOW_TESTIMONIALS = false;

export interface Testimonial {
  quote: string;
  names: string;
}

export const coupleTestimonials: Testimonial[] = [
  {
    quote:
      "When we argued, one of us would chase and the other would back off. Now we use a timed Pause + Return: whoever needs the pause says when they’ll be back. Knowing there’s a set time to come back makes taking space feel less like being left.",
    names: "Mateo & Leo",
  },
  {
    quote:
      "One of us is plan first and wants to sort the logistics straight away; the other is mood first and needs warmth before anything else. We did Profile Calibration together, and now we take hard talks through the System Overlay in order.",
    names: "Kai & Sam",
  },
  {
    quote:
      "I was carrying most of the household load without saying so. In the monthly part of our Weekly Reset we go through who carried what, so the invisible work is on the table as a list rather than a complaint.",
    names: "Marcus & Taylor",
  },
  {
    quote:
      "When a disagreement starts, one of us says the 60-Second Reset line: “I want to connect, not fight.” Saying it out loud reminds us we’re on the same side of the problem.",
    names: "Chloe & Ben",
  },
  {
    quote:
      "Hard talks used to start with the complaint. Now we follow the order: warmth and safety first, then the issue. Going through it step by step feels slower, and calmer.",
    names: "Liam & Jess",
  },
  {
    quote:
      "Instead of promising to try harder, we pick one Proof item: a specific change we can both see, with a set time window, and we look at it together at the check-in.",
    names: "David & Mei",
  },
];

export const individualTestimonials: Testimonial[] = [
  {
    quote:
      "When things felt off and I couldn’t say why, the Profile Calibration report showed where our answers were furthest apart. It gave us one specific place to start talking.",
    names: "Devon",
  },
  {
    quote:
      "I do the Consistency Pact on my own each week. It’s a private look at where my words and actions didn’t match under stress, and it doesn’t feel like putting my partner on trial.",
    names: "Julian",
  },
  {
    quote:
      "I tend to over-analyse everything. Calling a Sun Memory gives us a break from system-talk, and it’s a relief to just be together without reviewing anything.",
    names: "Alex",
  },
  {
    quote:
      "Big arguments felt too big to fix in one go. Softening my tone a little first gives me one small, concrete way to own my part of a friction point without feeling I’m swallowing all the blame.",
    names: "Elena",
  },
];
