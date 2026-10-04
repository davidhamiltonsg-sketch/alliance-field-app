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
    "when": "When either of you is flooded: your heart is racing, you’ve got tunnel vision, you can’t think straight, and you want to flee or to win. By then it isn’t calm enough for an honest conversation.",
    "steps": [
      {
        "title": "Say it",
        "detail": "“I need a pause.” You don’t have to explain.",
        "kind": "pause"
      },
      {
        "title": "Set a time",
        "detail": "Pick when you’ll be back, at least 20 minutes and at most 24 hours away: “I’ll be ready at ___.”",
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
        "detail": "Warm up and check it’s safe before you go back to “where you left off.”",
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
    "when": "When you’re still in the room together, it has turned into a fight to win, and you’re both willing to stop for one minute before anyone needs a longer pause.",
    "steps": [
      {
        "title": "Stop",
        "detail": "Let go of winning or solving it for now.",
        "kind": "pause"
      },
      {
        "title": "Say it",
        "detail": "“I want to connect, not fight.”",
        "kind": "step"
      },
      {
        "title": "Touch (only if welcome)",
        "detail": "Keep it brief and leave it at that.",
        "kind": "step"
      },
      {
        "title": "Breathe",
        "detail": "Take three slow breaths together.",
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
    "when": "Always, and especially when the honest thing feels as if it will cost you, or when one of you starts threatening, shutting down or getting back at the other.",
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
        "detail": "Whoever reacted badly finishes with the repair line you agreed in advance, so the honest thing is easier to say next time.",
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
    "when": "When you need to raise something touchy, ask for a change, make a repair or decide something together. If you start going in circles, find the step you skipped and go back to it.",
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
        "detail": "Describe it, then say how it felt and what it meant to you.",
        "kind": "step"
      },
      {
        "title": "Ask for one thing",
        "detail": "Make it specific and doable, with a time to do it by.",
        "kind": "step"
      },
      {
        "title": "Agree on next steps",
        "detail": "Decide who does what, by when, and when you’ll check back in.",
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
        "detail": "Each of you names one specific thing.",
        "kind": "step",
        "badge": "5 min"
      },
      {
        "title": "Check the load",
        "detail": "Each of you says whether you’ve felt supported or alone, and whether the load feels fair. Once a month, this part is the Care Check-in.",
        "kind": "step",
        "badge": "15 min"
      },
      {
        "title": "One friction point",
        "detail": "Each of you brings one small thing; agree a next step, not the whole fix.",
        "kind": "step",
        "badge": "15 min"
      },
      {
        "title": "Requests",
        "detail": "Each of you makes one specific ask for next week.",
        "kind": "step",
        "badge": "5 min"
      },
      {
        "title": "Next steps",
        "detail": "Agree one thing to try and when you’ll check back in. Requests and next steps share the last 5 minutes.",
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
    "when": "When a fight has started, or it’s the one you keep having, and you can both still be kind to each other, or a Pause + Return has brought you back to calm.",
    "steps": [
      {
        "title": "Check if you’re calm",
        "detail": "If either of you is flooded, take a Pause + Return first.",
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
        "detail": "One of you puts it this way: “When X happened, I felt Y; here’s the impact.”",
        "kind": "step"
      },
      {
        "title": "Ask for one thing",
        "detail": "Be specific.",
        "kind": "step"
      },
      {
        "title": "Listen in the right order",
        "detail": "First hear how it landed, then what would help, and only then their side.",
        "kind": "repair"
      },
      {
        "title": "Get proof if you need it",
        "detail": "If something needs to change, turn it into a Proof item (Proof Protocol card).",
        "kind": "repair"
      },
      {
        "title": "Line up next steps",
        "detail": "Agree who does what, and when you’ll check back.",
        "kind": "step"
      }
    ],
    "note": null,
    "outcome": "One clear path through the fight, and nobody ends up on trial."
  },
  "micro-repair": {
    "when": "When a remark has come out sharp or something small has stung, and a full repair feels like too much but leaving it will only make it worse. Timing: start within minutes if you can; complete within 24 hours.",
    "steps": [
      {
        "title": "Soften your tone",
        "detail": "Soften your tone on purpose.",
        "kind": "repair"
      },
      {
        "title": "Do one small thing",
        "detail": "Make one kind move, or own your part out loud.",
        "kind": "repair"
      },
      {
        "title": "Sit side by side",
        "detail": "Sit side by side instead of face to face if that’s easier.",
        "kind": "step"
      },
      {
        "title": "Say you noticed the impact",
        "detail": "In one sentence, with no “but”.",
        "kind": "repair"
      },
      {
        "title": "Take one tiny next step",
        "detail": "Or, if you need one, take a Pause + Return.",
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
    "when": "When one of you asks for a real change and all that comes back is “I promise”, with no plan behind it. Use it instead of waiting for things to get better.",
    "steps": [
      {
        "title": "Name the change",
        "detail": "Pick something specific you can both see.",
        "kind": "step"
      },
      {
        "title": "Decide what counts",
        "detail": "Agree what ‘met’, ‘partial’ and ‘missed’ will look like.",
        "kind": "step"
      },
      {
        "title": "Set a time window",
        "detail": "Agree a start date, an end date and when you’ll check in.",
        "kind": "step"
      },
      {
        "title": "Keep the record short",
        "detail": "A count or a table is enough — and look at it together at the check-in, where feelings and questions come first.",
        "kind": "step"
      },
      {
        "title": "Check in",
        "detail": "Decide together whether to keep going, change it, or call it done.",
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
    "when": "Every day, and it’s the first thing to bring back when you start to feel like housemates, or you get home from a trip and every conversation is about logistics.",
    "steps": [
      {
        "title": "Morning check-in",
        "detail": "Ask each other how you’re feeling about today. Put phones down if you can.",
        "kind": "step",
        "badge": "5 min or less"
      },
      {
        "title": "Evening check-in",
        "detail": "Talk about how the day actually went, and each name one thing you appreciated.",
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
        "detail": "For each of you for a week. If it’s slipping, move the time, and keep both check-ins.",
        "kind": "step",
        "badge": "7 days"
      }
    ],
    "note": null,
    "outcome": "A few minutes, twice a day, that are about the two of you."
  },
  "intimacy-pact": {
    "when": "Set it up in advance, on a calm day. Bring it out when asking or saying no has started to feel tense, when things have stalled for weeks, or after a breach that touched this part of the relationship.",
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
        "title": "If it helps, agree how you’ll each say a warm no",
        "detail": "If it helps, agree how you’ll each say a warm no, and on an alternative you’d both genuinely enjoy — such as holding each other, a kiss goodnight or five minutes of talking. It’s optional and never owed: a no needs no script, reason, or substitute offer, and the pact never creates an obligation.",
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
    "when": "After a betrayal, a lie or a string of broken agreements, or anything else that leaves a clear before and after in how safe things feel.",
    "steps": [
      {
        "title": "Name what happened",
        "detail": "Clearly, without deflecting. The partner who broke trust names it and acknowledges the impact; the hurt partner is never asked to confess in return.",
        "kind": "step"
      },
      {
        "title": "Decide on one specific change you can both see",
        "detail": "Any transparency is offered voluntarily by the partner who broke trust, for a set time — it never becomes monitoring.",
        "kind": "step"
      },
      {
        "title": "Set a real time window",
        "detail": "And put the check-in dates in the calendar.",
        "kind": "step"
      },
      {
        "title": "Keep a simple table",
        "detail": "Write down only the facts, and look at it together at the check-in.",
        "kind": "step",
        "badge": "weekly"
      },
      {
        "title": "Check in",
        "detail": "The hurt partner’s feelings and questions come first; the record is an aid, never the judge. Then decide together whether to keep going, change it, or call it done.",
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
    "when": "Once a week, on your own, to see whether you did what you said you would. Also after a promise that mattered, or alongside a shared Proof item while you rebuild trust.",
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
        "detail": "Pick one thing to do differently next week that you could point to.",
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
    "when": "When the same fight keeps coming back, or there’s a dent in trust you can both point to, and it’s too big for a normal Weekly Reset. Use it only when you’ve both agreed to sit down for it: never mid-fight, and not instead of a smaller repair.",
    "steps": [
      {
        "title": "Warm up first",
        "detail": "Soften the mood before anything else. Don’t skip this.",
        "kind": "step"
      },
      {
        "title": "Say what happened",
        "detail": "Each of you gives your side, and nobody interrupts.",
        "kind": "step"
      },
      {
        "title": "Acknowledge the impact",
        "detail": "Do it before either of you explains. If one of you caused the breach (infidelity, lying, a broken agreement), only that partner acknowledges impact; the hurt partner is never asked to confess in return. If it’s drift rather than a breach: Drift is nobody’s fault, but you can each name your part.",
        "kind": "repair"
      },
      {
        "title": "Explain, if asked",
        "detail": "Explain, if asked — and only once the other person has really taken in the impact.",
        "kind": "step"
      },
      {
        "title": "Ask for one change",
        "detail": "Name it, and agree a date for it.",
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
    "when": "When dinner is all logistics and the last real question was weeks ago. If contempt has taken the place of frustration, skip the count: contempt means stop and get outside support first.",
    "steps": [
      {
        "title": "Each of you marks, on your own",
        "detail": "Which of the eight signs (listed under Practise) you’ve noticed, then compare notes. Describe behaviour you’ve seen — don’t claim to know the other person’s intent.",
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
        "detail": "One or both of you may be pulling away. Book a Full Recovery conversation within a week. Drift is nobody’s fault, but you can each name your part. A specific breach of trust goes to Trust Recovery.",
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
    "when": "When disapproval or discrimination from outside (a relative, a friend, a stranger, a colleague) follows you home and starts turning into a fight between the two of you. If the pressure comes from your partner, this isn’t a Unity Anchor situation: use the Green Rule (Safety Gate), and the safety line below.",
    "steps": [
      {
        "title": "Pause before reacting",
        "detail": "Don’t act on the comment or the look in the moment.",
        "kind": "step"
      },
      {
        "title": "Trace the source",
        "detail": "Ask whether this is about the two of you or about them. Say it: “That’s coming from them, not from us.” Then ask what each of you needs: reassurance, a plan, or a chance to vent.",
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
