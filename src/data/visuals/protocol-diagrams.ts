// Protocol step diagrams: titles, kinds, timings and outcomes per card.
//
// Originally ported by scripts/brand/port-visuals.py from the external
// visuals library, which is not part of this repo. This file is now
// maintained by hand: keep it in step with src/data/cards/*.json and the
// printed Manual/Kit (a diagram is only shown when it has exactly as many
// steps as its card; see ProtocolLayout). Don't regenerate it with
// port-visuals.py, or hand edits (CANON timings, safety wording) are lost.

export type StepKind = "step" | "pause" | "repair" | "safety" | "failure" | "note";

export interface DiagramStep {
  title: string;
  detail: string;
  kind: StepKind;
  badge?: string;
}

export interface ProtocolDiagram {
  when: string;
  steps: DiagramStep[];
  note: { kind: StepKind; text: string } | null;
  outcome: string;
}

export const protocolDiagrams: Record<string, ProtocolDiagram> = {
  "pause-and-return": {
    "when": "When either of you is flooded — racing heart, tunnel vision, can’t think straight, an urge to flee or win. Any time it’s not calm enough to have an honest conversation.",
    "steps": [
      {
        "title": "Say it",
        "detail": "“I need a pause.” No explanation needed.",
        "kind": "pause"
      },
      {
        "title": "Set a time",
        "detail": "Pick a return time (20 minutes minimum, 24 hours max): “I’ll be ready at ___.”",
        "kind": "pause",
        "badge": "20 min – 24 h"
      },
      {
        "title": "Step away",
        "detail": "Get calm (walk, shower, breathe, music). Don’t rehearse the argument in your head.",
        "kind": "pause"
      },
      {
        "title": "Come back",
        "detail": "Reconnect at the time you said, even briefly, to prove it’s a pause, not a disappearance.",
        "kind": "step",
        "badge": "at the agreed time"
      },
      {
        "title": "Restart warm",
        "detail": "Warm up and check it’s safe, before going back to “where you left off.”",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "“Later” isn’t a return time. Always give an exact time."
    },
    "outcome": "Time apart, and a time you both know you’ll be back."
  },
  "60-second-reset": {
    "when": "Use when you’re still in the room together, it’s turned into a fight to win, and you’re both willing to stop for one minute before a longer pause.",
    "steps": [
      {
        "title": "Stop",
        "detail": "Quit trying to win or solve it.",
        "kind": "pause"
      },
      {
        "title": "Say it",
        "detail": "“I want to connect, not fight.”",
        "kind": "step"
      },
      {
        "title": "Touch (only if welcome)",
        "detail": "A brief touch, nothing more.",
        "kind": "step"
      },
      {
        "title": "Breathe",
        "detail": "Three slow breaths together.",
        "kind": "pause",
        "badge": "3 breaths"
      },
      {
        "title": "Return",
        "detail": "Pick an exact time to keep talking.",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "Always pair stopping with a real return time. A reset with no return time is just walking away."
    },
    "outcome": "The winning stops, and the real talk gets a time."
  },
  "green-rule": {
    "when": "Always — but especially when a topic feels risky to bring up, honesty feels like it’ll cost you, or someone starts threatening, shutting down, or getting back at the other.",
    "steps": [
      {
        "title": "Say what feels unsafe",
        "detail": "Say what feels unsafe, in one sentence.",
        "kind": "step"
      },
      {
        "title": "Pause the topic right away",
        "detail": "Don’t try to prove your point first.",
        "kind": "failure"
      },
      {
        "title": "Take a Pause + Return",
        "detail": "With an exact time to come back. If it’s fear, threats, coercion or violence — not just flooding — don’t return at the set time: leave safely and use the Help Lines.",
        "kind": "pause"
      },
      {
        "title": "When you’re back",
        "detail": "Warm up and make sure it’s safe again before you return to the topic.",
        "kind": "repair"
      },
      {
        "title": "Put it right",
        "detail": "Whoever pushed back finishes with the repair line you agreed in advance, so the honest thing is easier to say next time.",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "note",
      "text": "The Green Rule comes before every other tool. If it doesn’t feel safe, pause the topic."
    },
    "outcome": "Honest things stay safe to say."
  },
  "system-overlay": {
    "when": "Any sensitive conversation, request for change, repair, or decision you’re making together. Going in circles? Find the step you skipped and go back to it.",
    "steps": [
      {
        "title": "Warm up",
        "detail": "Say the warmest true thing you can. Remind each other you’re on the same team.",
        "kind": "step"
      },
      {
        "title": "Make it safe",
        "detail": "Say out loud that the relationship isn’t at risk tonight.",
        "kind": "step"
      },
      {
        "title": "Say what happened",
        "detail": "What happened, how it felt, what it meant.",
        "kind": "step"
      },
      {
        "title": "Ask for one thing",
        "detail": "Specific, doable, with a timeframe.",
        "kind": "step"
      },
      {
        "title": "Agree on next steps",
        "detail": "Who does what, by when, and when you’ll check back in.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "note",
      "text": "If a conversation falls apart, go back to the last step that held."
    },
    "outcome": "Hard conversations end somewhere, not in “always” and “never”."
  },
  "weekly-reset": {
    "when": "Same day and time each week; also after travel or a hard stretch. Not for a fight: flooded? Pause + Return first.",
    "steps": [
      {
        "title": "Appreciation",
        "detail": "One specific thing each.",
        "kind": "step",
        "badge": "5 min"
      },
      {
        "title": "Check the load",
        "detail": "Do you feel supported? Alone? Is it fair? Once a month, this part is the Care Check-in.",
        "kind": "step",
        "badge": "15 min"
      },
      {
        "title": "One friction point",
        "detail": "One small thing each; agree a next step, not the whole fix.",
        "kind": "step",
        "badge": "15 min"
      },
      {
        "title": "Requests",
        "detail": "One specific ask each, for next week.",
        "kind": "step",
        "badge": "5 min"
      },
      {
        "title": "Next steps",
        "detail": "One thing to try, and when you’ll check back in. Requests and next steps share the last 5 minutes.",
        "kind": "step",
        "badge": "same 5 min"
      }
    ],
    "note": {
      "kind": "pause",
      "text": "If either of you is flooded: Pause + Return first, then pick another time."
    },
    "outcome": "Forty minutes, then the rest of the week is yours."
  },
  "conflict-protocol": {
    "when": "When a fight has started, or it’s one you keep having, and you can both still be kind to each other (or once a Pause + Return has brought you back to calm).",
    "steps": [
      {
        "title": "Check if you’re calm",
        "detail": "Flooded? Take a Pause + Return first.",
        "kind": "pause"
      },
      {
        "title": "Warm up",
        "detail": "Say one warm, true thing.",
        "kind": "step"
      },
      {
        "title": "Make it safe",
        "detail": "Remind each other you’re not breaking up.",
        "kind": "step"
      },
      {
        "title": "Say what happened",
        "detail": "“When X happened, I felt Y; here’s the impact.”",
        "kind": "step"
      },
      {
        "title": "Ask for one thing",
        "detail": "Be specific.",
        "kind": "step"
      },
      {
        "title": "Listen in the right order",
        "detail": "Impact first, what would help second, their side last.",
        "kind": "repair"
      },
      {
        "title": "Get proof if you need it",
        "detail": "Turn it into a Proof item (Proof Protocol card).",
        "kind": "repair"
      },
      {
        "title": "Line up next steps",
        "detail": "Who does what, and when you’ll check back.",
        "kind": "step"
      }
    ],
    "note": null,
    "outcome": "One clear path through the fight, and nobody ends up on trial."
  },
  "micro-repair": {
    "when": "When your tone’s getting sharp, something small stung, or a full repair feels like too much right now but waiting will only make it worse. Timing: start within minutes if you can; complete within 24 hours.",
    "steps": [
      {
        "title": "Soften your tone",
        "detail": "Soften your tone on purpose.",
        "kind": "repair"
      },
      {
        "title": "Do one small thing",
        "detail": "An action, or own your part out loud.",
        "kind": "repair"
      },
      {
        "title": "Sit side by side",
        "detail": "Sit side by side instead of face to face if that’s easier.",
        "kind": "step"
      },
      {
        "title": "Say you noticed the impact",
        "detail": "One sentence, no “but”.",
        "kind": "repair"
      },
      {
        "title": "Take one tiny next step",
        "detail": "Or take a Pause + Return.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "note",
      "text": "Start within minutes if you can; complete within 24 hours."
    },
    "outcome": "A sharp moment, owned and cleared within a day."
  },
  "proof-protocol": {
    "when": "After any real request for change; whenever “I promise” shows up with no plan behind it; instead of waiting for things to get better.",
    "steps": [
      {
        "title": "Name the change",
        "detail": "Something specific you can both see.",
        "kind": "step"
      },
      {
        "title": "Decide what counts",
        "detail": "Agree what ‘met’, ‘partial’ and ‘missed’ will look like.",
        "kind": "step"
      },
      {
        "title": "Set a time window",
        "detail": "Start date, end date, and when you’ll check in.",
        "kind": "step"
      },
      {
        "title": "Keep the record short",
        "detail": "A count or a table — and look at it together at the check-in, where feelings and questions come first.",
        "kind": "step"
      },
      {
        "title": "Check in",
        "detail": "Extend it, adjust it, or close it out, together.",
        "kind": "repair"
      },
      {
        "title": "Missed twice and nobody’s said so?",
        "detail": "Raise it at the next check-in.",
        "kind": "failure"
      }
    ],
    "note": null,
    "outcome": "Change you can see. Trust moves on evidence, not promises."
  },
  "morning-evening-rhythm": {
    "when": "Every day. It’s also the first thing to bring back when you’re drifting, feeling more like housemates, just back from travel, or connection’s turned purely logistical.",
    "steps": [
      {
        "title": "Morning check-in",
        "detail": "How are you feeling about today? Phones down if you can.",
        "kind": "step",
        "badge": "5 min or less"
      },
      {
        "title": "Evening check-in",
        "detail": "How did today actually go, plus one thing you appreciated.",
        "kind": "step",
        "badge": "about 10 min"
      },
      {
        "title": "Keep the same times",
        "detail": "Keep the same times most days.",
        "kind": "step"
      },
      {
        "title": "Note yes or no",
        "detail": "For each of you for a week; adjust the timing, not how much you’re doing.",
        "kind": "step",
        "badge": "7 days"
      }
    ],
    "note": null,
    "outcome": "A few minutes, twice a day, that are about the two of you."
  },
  "intimacy-pact": {
    "when": "Set it up in advance, when asking or saying no feels tense, when it’s stalled for weeks, or after a breach that touched this part of the relationship.",
    "steps": [
      {
        "title": "Asking?",
        "detail": "Think first about how it will land for the other person tonight. If you’re declining, you owe nothing. No is enough.",
        "kind": "step"
      },
      {
        "title": "Say out loud",
        "detail": "Neither of you will punish, sulk, or guilt-trip the other for declining. A no costs nothing and needs no reason.",
        "kind": "step"
      },
      {
        "title": "If it helps, agree on warm-no wording",
        "detail": "If it helps, agree on warm-no wording and an alternative you’d both genuinely enjoy — holding each other, a kiss goodnight, five minutes of talking. Optional, never owed: a no needs no script, reason, or substitute offer, and the pact never creates an obligation.",
        "kind": "step"
      },
      {
        "title": "Each of you names what you actually enjoy",
        "detail": "Each of you names what you actually enjoy and how you like to be approached: body language can signal interest, but ask, and wait for a clear yes.",
        "kind": "step"
      },
      {
        "title": "Revisit the agreement every 30 days",
        "detail": "Update it as things change — it’s not a one-time contract, and there’s no keeping score in between.",
        "kind": "step",
        "badge": "30 days"
      },
      {
        "title": "If a no has been met with pressure or guilt-tripping, stop here",
        "detail": "If a no has been met with pressure or guilt-tripping, stop here and have a Green Rule or Trust Recovery conversation first — don’t try to patch intimacy on top of that. If it involved force, threats or fear, it isn’t a ‘once’: go straight to the Help Lines. If it happens again, or either of you feels unable to say no, stop and use the Help Lines. Repeated pressure is never handled with these tools.",
        "kind": "failure"
      }
    ],
    "note": null,
    "outcome": "Asking and saying no both stay safe."
  },
  "trust-recovery": {
    "when": "After a betrayal, deception, repeated broken agreements, or any clear before/after change in how safe things feel.",
    "steps": [
      {
        "title": "Name what happened",
        "detail": "Clearly, without deflecting. The partner who broke trust names it and acknowledges the impact; the hurt partner is never asked to confess in return.",
        "kind": "step"
      },
      {
        "title": "Decide on one specific, observable change",
        "detail": "Any transparency is offered voluntarily by the partner who broke trust, for a set time — it never becomes monitoring.",
        "kind": "step"
      },
      {
        "title": "Set a real time window",
        "detail": "With dates to check in.",
        "kind": "step"
      },
      {
        "title": "Keep a simple table",
        "detail": "Just the facts — and look at it together at the check-in.",
        "kind": "step",
        "badge": "weekly"
      },
      {
        "title": "Check in",
        "detail": "The hurt partner’s feelings and questions come first; the record is an aid, never the judge. Extend, adjust, or close it out.",
        "kind": "repair"
      },
      {
        "title": "If it’s not safe",
        "detail": "If it’s not safe, stop and get outside support.",
        "kind": "failure"
      }
    ],
    "note": null,
    "outcome": "Evidence you can both see, looked at together when you agreed."
  },
  "consistency-pact": {
    "when": "A weekly personal check-in on your own follow-through; after a promise that mattered; or alongside a shared Proof item while rebuilding trust.",
    "steps": [
      {
        "title": "What you say",
        "detail": "What do you say you value? Write it down.",
        "kind": "step"
      },
      {
        "title": "What you meant to do",
        "detail": "What did you plan to do this week?",
        "kind": "step"
      },
      {
        "title": "What actually happened",
        "detail": "Where was the gap?",
        "kind": "step"
      },
      {
        "title": "One change",
        "detail": "One thing you’ll do differently next week, that you could point to.",
        "kind": "repair"
      },
      {
        "title": "Keep it private",
        "detail": "Keep it private unless you choose to share it. It’s easier to be honest with yourself when it’s for your eyes only.",
        "kind": "note"
      },
      {
        "title": "Not a substitute for repairing a real breach",
        "detail": "If you broke something you agreed, tell your partner. This pact doesn’t replace that.",
        "kind": "failure"
      }
    ],
    "note": null,
    "outcome": "One honest look a week at what you say and what you do."
  },
  "full-recovery": {
    "when": "Use for a repeated fight, or a dent in trust you can both point to, when a normal Weekly Reset can’t hold the topic. Only when you’ve both agreed to sit down for it — never mid-fight, and not in place of a smaller repair.",
    "steps": [
      {
        "title": "Warm up first",
        "detail": "Soften the mood before anything else. Don’t skip this.",
        "kind": "step"
      },
      {
        "title": "Say what happened",
        "detail": "Both sides, no interrupting.",
        "kind": "step"
      },
      {
        "title": "Acknowledge the impact",
        "detail": "Before either of you explains. If one of you caused the breach (infidelity, lying, a broken agreement), only that partner acknowledges impact; the hurt partner is never asked to confess in return.",
        "kind": "repair"
      },
      {
        "title": "Explain, if asked",
        "detail": "Explain, if asked — only after the other person has actually taken in the impact.",
        "kind": "step"
      },
      {
        "title": "Ask for one change",
        "detail": "Name it, and agree by when.",
        "kind": "repair",
        "badge": "by a set date"
      },
      {
        "title": "Say it out loud, only if it’s true for both of you",
        "detail": "“We made it through this. We’re still here.”",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "Never mid-fight, and never sprung on each other."
    },
    "outcome": "One agreed change, with a date to check it."
  },
  "uninvestment-check": {
    "when": "When dinner is all logistics and the last real question was weeks ago. Or when contempt has taken the place of frustration: then go straight to step 2.",
    "steps": [
      {
        "title": "Each of you marks, on your own",
        "detail": "Which of the eight signs (listed under Practise) you’ve noticed, then share. Describe behaviour you’ve seen — don’t claim to know the other person’s intent.",
        "kind": "step",
        "badge": "8 signs"
      },
      {
        "title": "If contempt is one of your signs, skip the count",
        "detail": "Contempt means stop and get outside support first. The same goes for fear or coercion at any count.",
        "kind": "failure"
      },
      {
        "title": "None of these?",
        "detail": "Good. Keep up the daily floor. One or two signs: you likely need some space and a few small repairs (Micro-Repair, Morning + Evening Rhythm).",
        "kind": "step",
        "badge": "1–2"
      },
      {
        "title": "Three or more signs",
        "detail": "One or both of you may be pulling away. Book a Full Recovery conversation within a week. Drift is nobody’s fault, so you each name your part. A specific breach of trust goes to Trust Recovery.",
        "kind": "repair",
        "badge": "3 or more · within a week"
      },
      {
        "title": "Set a time window",
        "detail": "Set a time window to check whether you’re both leaning back in.",
        "kind": "step"
      }
    ],
    "note": null,
    "outcome": "Space or pulling away: you name which, and book the right next step."
  },
  "unity-anchor": {
    "when": "When disapproval, discrimination, or judgement from outside (family, friends, community, strangers) is putting pressure on you both, and it’s starting to turn into a fight between the two of you. If the pressure comes from your partner, this isn’t a Unity Anchor situation: use the Green Rule (Safety Gate), and the safety line below.",
    "steps": [
      {
        "title": "Pause before reacting",
        "detail": "Don’t act on the comment or the look in the moment.",
        "kind": "step"
      },
      {
        "title": "Trace the source",
        "detail": "About us, or about them? Say it: “That’s coming from them, not from us.” Then ask what’s needed: reassurance, a plan, or just to vent.",
        "kind": "step"
      },
      {
        "title": "Name the unit",
        "detail": "Say it out loud: “We’re on the same side of this.”",
        "kind": "step"
      },
      {
        "title": "Agree your response",
        "detail": "Decide together, as a team, how the two of you will respond next time — never how much contact your partner has with their own family, friends, money, phone or movements.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "Never used to limit a partner’s contact with family, friends, money, phone or movement."
    },
    "outcome": "Outside pressure stays outside; the two of you stay one unit."
  }
};
