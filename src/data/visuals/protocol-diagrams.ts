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
  "green-rule": {
    "when": "Always, and especially when the honest thing feels as if it will cost you, or when one of you starts threatening, shutting down or getting back at the other.",
    "steps": [
      {
        "title": "Say what feels unsafe",
        "detail": "In one sentence.",
        "kind": "step"
      },
      {
        "title": "Pause the topic right away",
        "detail": "Whoever hears it believes it first; nobody tries to prove a point.",
        "kind": "failure"
      },
      {
        "title": "Take a Pause + Return",
        "detail": "With an exact time to come back. If it’s fear, threats, coercion or violence, not flooding, do not return at the set time: leave safely and use the Help Lines.",
        "kind": "pause"
      },
      {
        "title": "When you’re back",
        "detail": "Warm up and check it feels safe again before you return to the topic.",
        "kind": "repair"
      },
      {
        "title": "Put it right",
        "detail": "Whoever reacted badly uses the repair line you agreed in advance, so the honest thing is easier to say next time.",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "note",
      "text": "The Green Rule comes before every other tool. If it doesn’t feel safe, pause the topic."
    },
    "outcome": "Honest things stay safe to say."
  },
  "pause-and-return": {
    "when": "When either of you is flooded: heart racing, tunnel vision, can’t think straight, wanting to flee or to win. It isn’t calm enough then for an honest conversation.",
    "steps": [
      {
        "title": "Say it",
        "detail": "“I need a pause.” You don’t have to explain.",
        "kind": "pause"
      },
      {
        "title": "Set a time",
        "detail": "At least 20 minutes and at most 24 hours away: “I’ll be ready at ___.”",
        "kind": "pause",
        "badge": "20 min – 24 h"
      },
      {
        "title": "Step away",
        "detail": "And get calm: walk, shower, breathe, music. Don’t rehearse the argument in your head.",
        "kind": "pause"
      },
      {
        "title": "If you’re the one waiting",
        "detail": "Don’t follow, block the way or message during the pause. Not being allowed to leave a room or the house is a Help Lines moment, not a pause.",
        "kind": "safety"
      },
      {
        "title": "Come back",
        "detail": "At the time you said, even briefly. If you are afraid, do not go back: use the Help Lines.",
        "kind": "step",
        "badge": "at the agreed time"
      },
      {
        "title": "Restart warm",
        "detail": "Warm up and check it’s safe before you go back to where you left off.",
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
    "when": "When a fight is starting and you’re both still in the room, willing to stop for one minute. Too hot to stay in the room? Take a Pause + Return instead.",
    "steps": [
      {
        "title": "Stop",
        "detail": "Let go of winning or solving it for now.",
        "kind": "pause"
      },
      {
        "title": "Say one sentence",
        "detail": "“I want to connect, not fight. Can we talk at ___?”",
        "kind": "step"
      },
      {
        "title": "Touch",
        "detail": "Only if it’s welcome. Keep it brief.",
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
        "detail": "At the time you named, and keep it.",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "Always pair stopping with a real return time. A reset with no return time is just walking away."
    },
    "outcome": "The winning stops, and the real talk gets a time."
  },
  "micro-repair": {
    "when": "When a remark came out sharp or something small stung, and a full repair feels like too much but leaving it will make it worse. Start within minutes if you can; finish within 24 hours.",
    "steps": [
      {
        "title": "Soften your tone",
        "detail": "On purpose.",
        "kind": "repair"
      },
      {
        "title": "Do one small thing",
        "detail": "Make one kind move, or own your part out loud.",
        "kind": "repair"
      },
      {
        "title": "Sit side by side",
        "detail": "Instead of face to face if that’s easier.",
        "kind": "step"
      },
      {
        "title": "Say you noticed the impact",
        "detail": "In one sentence, with no “but”.",
        "kind": "repair"
      },
      {
        "title": "Take one tiny next step",
        "detail": "Or a Pause + Return if you need one.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "note",
      "text": "Start within minutes if you can; finish within 24 hours."
    },
    "outcome": "A sharp moment, owned and cleared within a day."
  },
  "weekly-reset": {
    "when": "Same day and time each week; also after travel or a hard stretch. Not for a fight: flooded? Pause + Return first.",
    "steps": [
      {
        "title": "Appreciation",
        "detail": "(5 min): each of you names one specific thing.",
        "kind": "step",
        "badge": "5 min"
      },
      {
        "title": "Check the load",
        "detail": "(15 min): each of you says whether you’ve felt supported or alone, and whether the load feels fair.",
        "kind": "step",
        "badge": "15 min"
      },
      {
        "title": "One friction point",
        "detail": "(15 min): each of you brings one small thing. Agree a next step, not the whole fix.",
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
        "detail": "Agree one thing to try and when you’ll check back. Requests and next steps share the last 5 minutes.",
        "kind": "step",
        "badge": "same 5 min"
      },
      {
        "title": "Monthly part",
        "detail": "Once a month, adds 10 minutes: who carried what, any open Proof items, and one ritual to keep, tweak or drop.",
        "kind": "step",
        "badge": "+10 min"
      }
    ],
    "note": {
      "kind": "pause",
      "text": "If either of you is flooded: Pause + Return first, then pick another time."
    },
    "outcome": "Forty minutes, then the rest of the week is yours."
  },
  "system-overlay": {
    "when": "A fight is starting: say the one sentence from the 60-Second Reset first, then use the quick version (about 90 seconds). Standard: raising something touchy, asking for a change, making a repair or deciding together. Already a fight: it’s started, or it’s the one you keep having, and you can still be kind. Going in circles? Find the step you skipped and go back. A serious hurt needs the slow version, Full Repair.",
    "steps": [
      {
        "title": "Warm up",
        "detail": "Say the warmest true thing you can, and remind each other you’re on the same team. Already a fight? Check you’re both calm first. If either of you is flooded, take a Pause + Return.",
        "kind": "step"
      },
      {
        "title": "Make it safe",
        "detail": "If it’s true, say out loud that the relationship isn’t at risk tonight.",
        "kind": "step"
      },
      {
        "title": "Say what happened",
        "detail": "Describe it, then how it felt and what it meant. The listener hears it in order: how it landed, then what would help, and only then their side.",
        "kind": "step"
      },
      {
        "title": "Ask for one thing",
        "detail": "Specific and doable, with a time to do it by.",
        "kind": "step"
      },
      {
        "title": "Agree next steps",
        "detail": "Who does what, by when, and when you’ll check back.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "note",
      "text": "Quick version: “Restart: same team.” One warm sentence each, name the one problem you’re both stuck in, then one ask or a Pause + Return."
    },
    "outcome": "Hard conversations end somewhere, not in “always” and “never”."
  },
  "full-repair": {
    "when": "When the same fight keeps coming back, or there’s a dent in trust you can both point to, and it’s too big for a normal Weekly Reset. Use it only when you’ve both agreed to sit down; never mid-fight, and not instead of a smaller repair. Lying, infidelity or a broken agreement that needs weeks of proof is Trust Recovery instead.",
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
        "detail": "Before either of you explains. If one of you caused a breach, only that partner acknowledges impact; the hurt partner is never asked to confess in return. If it’s drift, say so. Drift is nobody’s fault, but you can each name your part.",
        "kind": "repair"
      },
      {
        "title": "Explain",
        "detail": "If asked, and only once the other person has taken in the impact.",
        "kind": "step"
      },
      {
        "title": "Ask for one change",
        "detail": "Name it and agree a date for it.",
        "kind": "repair"
      },
      {
        "title": "Say it out loud",
        "detail": "Only if it’s true for both of you: “We made it through this. We’re still here.”",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "Never mid-fight, and never sprung on each other."
    },
    "outcome": "One agreed change, with a date to check it."
  },
  "trust-recovery": {
    "when": "After a betrayal, a lie or a string of broken agreements, or anything that leaves a clear before and after in how safe things feel. A breach is something the partner agrees they did. Seeing friends or family, privacy or a locked phone is never a breach. You cannot be made to accept a breach you do not agree happened. Steps 2 to 5 also suit a smaller breach, but only if you both agree it was one.",
    "steps": [
      {
        "title": "Name what happened",
        "detail": "Clearly, without deflecting. The partner who broke trust names it and acknowledges the impact; the hurt partner is never asked to confess in return.",
        "kind": "step"
      },
      {
        "title": "Decide on one specific change",
        "detail": "You can both see. Any transparency is offered voluntarily by the partner who broke trust, for a set time, and never becomes monitoring.",
        "kind": "repair"
      },
      {
        "title": "Set a time window",
        "detail": "Two to four weeks to start (1 to 2 weeks for a smaller agreed breach). Extending it takes both of you. Put the check-back dates in the calendar. Either of you can end it at a check back.",
        "kind": "step",
        "badge": "2–4 weeks"
      },
      {
        "title": "Keep a simple table",
        "detail": "Of facts only, and look at it together. Anything about someone’s pauses is noted only if the one pausing agrees.",
        "kind": "step"
      },
      {
        "title": "Check back",
        "detail": "The hurt partner’s feelings and questions come first. The record is an aid, never the judge. Then decide together to keep going, change it, or call it done.",
        "kind": "repair"
      },
      {
        "title": "If it’s not safe",
        "detail": "Stop and get outside support.",
        "kind": "safety"
      }
    ],
    "note": null,
    "outcome": "Evidence you can both see, looked at together when you agreed."
  },
  "check-up": {
    "when": "When dinner is all logistics, replies have an edge, one of you is carrying the work, or the last real question was weeks ago. Also sooner if resentment is building or “we’re fine” sits beside loneliness.",
    "steps": [
      {
        "title": "Safety first",
        "detail": "Fear or coercion: stop and get outside support. Steady contempt (sneering, mocking, belittling) is also a serious sign: a Check-Up won’t fix it, so talk to a professional. Never use the signs to question where your partner goes, who they see or what they plan. A partner who has stopped sharing because they are afraid is not pulling away: use the Help Lines.",
        "kind": "safety"
      },
      {
        "title": "Each of you marks",
        "detail": "On your own, what you’ve noticed on the one sheet, using the three lenses under Practise. Describe behaviour you’ve seen; don’t claim to know the other’s intent.",
        "kind": "step"
      },
      {
        "title": "Compare only if you both want to",
        "detail": "Either of you may decline to compare counts.",
        "kind": "step"
      },
      {
        "title": "Read the result",
        "detail": "No signs: keep up the Daily Rhythm. One or two: you likely need some space and a few small repairs (Micro-Repair, Daily Rhythm). Three or more: bring back the Daily Rhythm for two weeks.",
        "kind": "step"
      },
      {
        "title": "Pick one pattern or gap",
        "detail": "And one fix for 14 days, then look again. If nothing has shifted, agree a Full Repair date if you both want to; either of you may say no. A specific breach of trust goes to Trust Recovery.",
        "kind": "repair",
        "badge": "14 days"
      }
    ],
    "note": {
      "kind": "safety",
      "text": "Fear or coercion: stop and use the Help Lines. Steady contempt: talk to a professional. The signs describe behaviour; they are not a verdict."
    },
    "outcome": "Space or pulling away: you name which, and pick the right next step."
  },
  "team-agreement": {
    "when": "When disapproval or discrimination from outside (a relative, a friend, a stranger, a colleague) follows you home and starts turning into a fight between the two of you. If the pressure comes from your partner, this isn’t the tool: if they check, restrict or punish your contact with others, stop and use the Help Lines; otherwise use the Green Rule.",
    "steps": [
      {
        "title": "Believe first",
        "detail": "The partner who is told says: “I believe you, and I’m not going to explain it away.” Then ask whether they need to vent, be comforted or act.",
        "kind": "repair"
      },
      {
        "title": "Pause before reacting",
        "detail": "Don’t act on the comment or the look in the moment.",
        "kind": "pause"
      },
      {
        "title": "Trace the source",
        "detail": "Is this about the two of you, or about them? Say “That’s coming from them, not from us,” then ask what each of you needs.",
        "kind": "step"
      },
      {
        "title": "Name the unit",
        "detail": "Out loud: “We’re on the same side of this.”",
        "kind": "step"
      },
      {
        "title": "Agree your response",
        "detail": "Together, for next time. Decide how the two of you respond, never how much contact your partner has with their own family, friends, money, phone or movements.",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "note",
      "text": "Never use it as a muzzle (“Same team, so stop complaining”)."
    },
    "outcome": "One response you chose together, so neither of you handles it alone."
  },
  "sun-memory": {
    "when": "When talk about the tools is crowding out the ease between you, a heavy stretch of repair has just ended, or the rituals have started to feel like a chore list. Try Quick first.",
    "steps": [
      {
        "title": "Either of you can call it",
        "detail": "And either of you can end it early. No reason is needed.",
        "kind": "step"
      },
      {
        "title": "All system-talk stops",
        "detail": "Straight away: no talk about the tools, the reviews or how you could do this better.",
        "kind": "pause"
      },
      {
        "title": "Pick a length",
        "detail": "Quick: a few minutes inside one ritual. Full: 2 to 24 hours.",
        "kind": "step",
        "badge": "a few minutes to 24 h"
      },
      {
        "title": "Do something easy together",
        "detail": "A walk, a meal, music, a long hug if it’s welcome. No debrief.",
        "kind": "repair"
      },
      {
        "title": "When it ends",
        "detail": "Don’t go back over it. Keep any follow-up practical and kind.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "note",
      "text": "Either of you can end it early, for any reason. Naming a safety concern ends it at once."
    },
    "outcome": "A rest from the system, not from each other."
  },
  "daily-rhythm": {
    "when": "Every day, and the first thing to bring back when you feel like housemates, or every talk is logistics after a trip. Start with the evening catch-up only.",
    "steps": [
      {
        "title": "Morning hello",
        "detail": "(5 minutes or less): ask how each of you feels about today. Phones down if you can.",
        "kind": "step",
        "badge": "5 min or less"
      },
      {
        "title": "Evening catch-up",
        "detail": "(about 10 minutes): talk about how the day actually went, and each name one thing you appreciated.",
        "kind": "step",
        "badge": "about 10 min"
      },
      {
        "title": "Keep the same times",
        "detail": "Most days.",
        "kind": "step"
      },
      {
        "title": "On a busy day",
        "detail": "Keep the minimum: a hello, an “I see you”, an appreciation, and a repair within 24 hours if anything stings.",
        "kind": "step"
      },
      {
        "title": "Note yes or no",
        "detail": "For each of you for a week. If it’s slipping, move the time and keep both moments.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "note",
      "text": "If it starts to feel like a checklist, call a Quick Sun Memory."
    },
    "outcome": "A few minutes, twice a day, that are about the two of you."
  },
  "intimacy-pact": {
    "when": "Set it up in advance, on a calm day. Bring it out when asking or saying no has started to feel tense, or after a breach that touched this part of the relationship.",
    "steps": [
      {
        "title": "Asking? Think first",
        "detail": "About how it will land for the other person tonight. If you’re declining, you owe nothing. No is enough.",
        "kind": "step"
      },
      {
        "title": "Say out loud",
        "detail": "Neither of you will punish, sulk or guilt-trip the other for declining. A no costs nothing and needs no reason.",
        "kind": "step"
      },
      {
        "title": "If it helps",
        "detail": "Agree how you’ll each say a warm no, and an alternative you’d both enjoy, such as holding each other or five minutes of talking. It’s optional and never owed. The other person can say no to the alternative too.",
        "kind": "step"
      },
      {
        "title": "Each of you names",
        "detail": "What you enjoy and how you like to be approached. Body language can signal interest, but ask, and wait for a clear yes.",
        "kind": "step"
      },
      {
        "title": "Review it every 30 days",
        "detail": "The review is about how asking and saying no feel, never about how often. Either of you can skip or postpone it. “Stalled” is never a reason to ask more.",
        "kind": "repair",
        "badge": "every 30 days"
      },
      {
        "title": "If a no was met with pressure",
        "detail": "Or guilt-tripping, stop here and don’t try to patch intimacy on top. Don’t talk it through in the moment. The one who pressured owns it plainly. The one pressured decides whether, when and with whom to talk. Force, threats, fear or a repeat: use the Help Lines.",
        "kind": "safety"
      }
    ],
    "note": null,
    "outcome": "Asking and saying no both stay safe."
  },
  "consistency-pact": {
    "when": "Once a week, on your own. Also after a promise that mattered, or alongside a shared Proof item while you rebuild trust.",
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
        "kind": "step"
      },
      {
        "title": "Keep it private",
        "detail": "Unless you choose to share it. Your own notes, thoughts and answers are never owed.",
        "kind": "step"
      },
      {
        "title": "Broke a shared agreement?",
        "detail": "Tell your partner. Telling them is part of the partnership, and this pact never replaces it.",
        "kind": "step"
      }
    ],
    "note": null,
    "outcome": "One honest look a week at what you say and what you do."
  },
  "profile-calibration": {
    "when": "Early on, or when the old fight comes round again (one of you “cold”, the other “too much”), and before you change how you handle conflict. Nobody has to complete this, and you can stop at any time.",
    "steps": [
      {
        "title": "Each of you scores your own lean",
        "detail": "From 1 to 10, plan first to mood first. It’s a lean, not a life sentence.",
        "kind": "step"
      },
      {
        "title": "If you want to, share one way you show love",
        "detail": "That gets misread.",
        "kind": "step"
      },
      {
        "title": "If you want to, share one thing you need",
        "detail": "To stay calm in a fight.",
        "kind": "step"
      },
      {
        "title": "Each write two lines",
        "detail": "For your plan for settling after a hard moment, and agree one signal for “I’m close to my limit”.",
        "kind": "step"
      },
      {
        "title": "Pick one translation habit",
        "detail": "For 14 days: a small way of checking you heard the feeling, not only the words. At the monthly part of your Weekly Reset, decide whether it stays.",
        "kind": "step"
      },
      {
        "title": "In the Field App",
        "detail": "Take turns answering 44 questions on one phone; answers stay on that phone. The Profile Calibration report then shows where you differ most, area by area.",
        "kind": "step"
      }
    ],
    "note": null,
    "outcome": "One habit to try, and a clearer idea of where you differ."
  }
};
