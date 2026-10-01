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
    "when": "Either partner is flooded or shut down: racing heart, tunnel vision, contempt, urge to flee or win.",
    "steps": [
      {
        "title": "Say it",
        "detail": "“I need a pause.” No justification required.",
        "kind": "pause"
      },
      {
        "title": "Set a time",
        "detail": "Set a return time: “I’ll be ready at ___.”",
        "kind": "pause",
        "badge": "20 min – 24 h"
      },
      {
        "title": "Step away",
        "detail": "Down-regulate: walk, shower, breathe, music. Avoid rehearsing arguments.",
        "kind": "pause"
      },
      {
        "title": "Come back",
        "detail": "Reconnect at the agreed time, even briefly, to prove pause, not disappearance.",
        "kind": "step",
        "badge": "at the agreed time"
      },
      {
        "title": "Restart warm",
        "detail": "Warmth → Safety (not “where we left off”).",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "“Later” is not a return time. Always give a clock time."
    },
    "outcome": "Protection without disappearance."
  },
  "60-second-reset": {
    "when": "Co-present, and the conversation has become about winning. Both willing to stop for one minute.",
    "steps": [
      {
        "title": "Stop",
        "detail": "Disengage from winning or solving.",
        "kind": "pause"
      },
      {
        "title": "Say it",
        "detail": "“I want to connect, not fight.”",
        "kind": "step"
      },
      {
        "title": "Touch (only if welcome)",
        "detail": "A brief touch is enough.",
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
        "detail": "Set a specific time to continue: “Can we talk at ___?”",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "Always pair stop with return. A reset with no return time is withdrawal."
    },
    "outcome": "Damage stops in one minute; real repair is scheduled."
  },
  "green-rule": {
    "when": "Always, especially when honesty feels costly, or ultimatums, stonewalling, or retaliation appear.",
    "steps": [
      {
        "title": "Say what feels unsafe",
        "detail": "One sentence: “This doesn’t feel safe right now.”",
        "kind": "step"
      },
      {
        "title": "Stop the topic",
        "detail": "Immediately. No proving.",
        "kind": "failure"
      },
      {
        "title": "Pause + Return",
        "detail": "Activate it with a specific return time.",
        "kind": "pause"
      },
      {
        "title": "Warm up again",
        "detail": "On return, Warmth → Safety before the original topic.",
        "kind": "repair"
      },
      {
        "title": "Repair the break",
        "detail": "Repair safety faults with an agreed phrase.",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "note",
      "text": "Priority over all content tools. If safety fails, content stops."
    },
    "outcome": "Honesty stays speakable without punishment."
  },
  "system-overlay": {
    "when": "Any sensitive discussion, change request, rupture repair, or joint decision. Also a diagnostic when stuck.",
    "steps": [
      {
        "title": "Warm up",
        "detail": "Warmest true sentence; same team. “I love us, and I’m not trying to fight.”",
        "kind": "step"
      },
      {
        "title": "Make it safe",
        "detail": "Green Rule: the relationship is not threatened in this moment.",
        "kind": "step"
      },
      {
        "title": "Say what happened",
        "detail": "Impact with ownership: “When X happened, I felt Y; the impact was Z.”",
        "kind": "step"
      },
      {
        "title": "Ask for one thing",
        "detail": "One specific, actionable, time-bound ask.",
        "kind": "step"
      },
      {
        "title": "Agree on next steps",
        "detail": "Who does what by when, plus a review.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "note",
      "text": "If a conversation collapses, restart from the last intact step."
    },
    "outcome": "Hard conversations produce outcomes, not always/never fights."
  },
  "weekly-reset": {
    "when": "Same day and time each week; also after travel, stress, or distance. A maintenance meeting, not a trial.",
    "steps": [
      {
        "title": "Appreciation",
        "detail": "One specific appreciation each.",
        "kind": "step",
        "badge": "5 min"
      },
      {
        "title": "Check the load",
        "detail": "Where supported, where alone? Is the load fair? Once a month, this is the monthly Care Check-in (inside the Weekly Reset).",
        "kind": "step",
        "badge": "15 min"
      },
      {
        "title": "One friction point",
        "detail": "One small friction each; apply the 2% Rule.",
        "kind": "step",
        "badge": "15 min"
      },
      {
        "title": "Requests",
        "detail": "One specific ask each for next week.",
        "kind": "step",
        "badge": "5 min"
      },
      {
        "title": "Next steps",
        "detail": "One next step + a review time.",
        "kind": "step",
        "badge": "same 5 min"
      }
    ],
    "note": {
      "kind": "pause",
      "text": "If either partner is flooded: Pause + Return first, then reschedule."
    },
    "outcome": "Friction stays small and predictable. 40-minute timer."
  },
  "conflict-protocol": {
    "when": "Active conflict or recurring loops, when Warmth is still possible, or after a pause returns you to regulation.",
    "steps": [
      {
        "title": "Check if you’re calm",
        "detail": "Flooded or shut down? Pause + Return first.",
        "kind": "pause"
      },
      {
        "title": "Warm up",
        "detail": "One warm true sentence: “I’m on your team, even though I’m frustrated.”",
        "kind": "step"
      },
      {
        "title": "Make it safe",
        "detail": "The Alliance is not threatened this moment.",
        "kind": "step"
      },
      {
        "title": "Say what happened",
        "detail": "When X, I felt Y; impact Z.",
        "kind": "step"
      },
      {
        "title": "Ask for one thing",
        "detail": "One specific ask.",
        "kind": "step"
      },
      {
        "title": "Listen in the right order",
        "detail": "Impact → What would help → Perspective last.",
        "kind": "repair"
      },
      {
        "title": "Get proof if you need it",
        "detail": "Behaviour + evidence + window.",
        "kind": "repair"
      },
      {
        "title": "Line up next steps",
        "detail": "Next step + check-back.",
        "kind": "step"
      }
    ],
    "note": null,
    "outcome": "The loop interrupts without a courtroom."
  },
  "micro-repair": {
    "when": "Tone sharpens, small hurts, residue starting. Full repair feels impossible, but waiting will worsen the Tone Spiral.",
    "steps": [
      {
        "title": "Soften your tone",
        "detail": "Soften tone deliberately (Reciprocal Softness): “Soft reset, my tone.”",
        "kind": "repair"
      },
      {
        "title": "Do one small thing",
        "detail": "2% behavioural and/or 2% ownership: “2%: I can own ___.”",
        "kind": "repair"
      },
      {
        "title": "Side by side",
        "detail": "Shift side-by-side if face-to-face is too hot: “Can we walk and talk?”",
        "kind": "step"
      },
      {
        "title": "Say you noticed the impact",
        "detail": "One sentence, no “but”.",
        "kind": "repair"
      },
      {
        "title": "Take one tiny next step",
        "detail": "Or Pause + Return.",
        "kind": "step"
      }
    ],
    "note": {
      "kind": "note",
      "text": "Start within minutes if you can; complete within 24 hours."
    },
    "outcome": "Residue clears before it hardens."
  },
  "proof-protocol": {
    "when": "After any meaningful change request; when “I promise” appears without a plan; ending Hope Fog.",
    "steps": [
      {
        "title": "Name the change",
        "detail": "Name the change: specific, observable.",
        "kind": "step"
      },
      {
        "title": "Decide what counts",
        "detail": "Define what counts as met / partial / missed.",
        "kind": "step"
      },
      {
        "title": "Set a time window",
        "detail": "Set start, end, and review ritual.",
        "kind": "step"
      },
      {
        "title": "Record it simply",
        "detail": "Tally or table; facts first at review.",
        "kind": "step"
      },
      {
        "title": "Check in",
        "detail": "Extend, adjust, or close; Team Frame on.",
        "kind": "repair"
      },
      {
        "title": "If it keeps getting missed",
        "detail": "If misses dominate without ownership.",
        "kind": "failure"
      }
    ],
    "note": null,
    "outcome": "Change you can see. Trust moves on evidence, not promises."
  },
  "morning-evening-rhythm": {
    "when": "Every day. Reinstate first after travel, illness, or stress.",
    "steps": [
      {
        "title": "Morning check-in",
        "detail": "Devices down → touch (if welcome) or eye contact → “How are you feeling about today?” → one intention.",
        "kind": "step",
        "badge": "≤ 5 min"
      },
      {
        "title": "Evening check-in",
        "detail": "Decompress side-by-side → no logistics → “How did today actually go?” → one specific appreciation.",
        "kind": "step",
        "badge": "first 10 min"
      },
      {
        "title": "Keep the same times",
        "detail": "Phone bowl, or charger elsewhere, during both windows.",
        "kind": "step"
      },
      {
        "title": "Note it",
        "detail": "Yes or no for 7 days, where you both see it; adjust timing, not intensity.",
        "kind": "step",
        "badge": "7 days"
      }
    ],
    "note": null,
    "outcome": "Predictable daily contact. Drift stays small."
  },
  "intimacy-pact": {
    "when": "Initiating or declining feels tense; intimacy stall; after a trust dent; preventive Structure.",
    "steps": [
      {
        "title": "Picture their side",
        "detail": "Invest in your partner’s experience before only your own.",
        "kind": "step"
      },
      {
        "title": "No penalty",
        "detail": "Agree: a decline carries no cost — no punishing, sulking, or guilt-tripping.",
        "kind": "step"
      },
      {
        "title": "Warm no",
        "detail": "Optional warm-no wording. A no needs no script, reason, or substitute.",
        "kind": "step"
      },
      {
        "title": "Say what you enjoy",
        "detail": "Name initiation preferences: verbal / nonverbal; timing.",
        "kind": "step"
      },
      {
        "title": "Revisit every 30 days",
        "detail": "Set a 30-day review, without mid-stream scorekeeping.",
        "kind": "step",
        "badge": "30 days"
      },
      {
        "title": "Pressure? Stop here",
        "detail": "Pressure after a no: Green Rule or Trust Recovery first. Again, or unable to say no: Help Lines.",
        "kind": "failure"
      }
    ],
    "note": null,
    "outcome": "Vulnerability stays safe; the pact holds."
  },
  "trust-recovery": {
    "when": "After betrayal, deception, repeated broken agreements, or any before/after in safety.",
    "steps": [
      {
        "title": "Name what happened",
        "detail": "The partner who broke trust names it, without deflection. The hurt partner never confesses in return.",
        "kind": "step"
      },
      {
        "title": "One specific change",
        "detail": "One specific, observable change. Transparency is offered, time-limited, never monitoring.",
        "kind": "step"
      },
      {
        "title": "Set a time window",
        "detail": "A meaningful window with review dates.",
        "kind": "step"
      },
      {
        "title": "Keep a simple table",
        "detail": "Behaviour Window table: facts, seen and reviewed at the agreed check-in.",
        "kind": "step",
        "badge": "weekly"
      },
      {
        "title": "Check in",
        "detail": "Record first, then feelings; extend, adjust, or close.",
        "kind": "repair"
      },
      {
        "title": "If it’s not safe",
        "detail": "If safety is absent, stop and seek appropriate support.",
        "kind": "failure"
      }
    ],
    "note": null,
    "outcome": "Evidence accumulates; the nervous system quiets."
  },
  "consistency-pact": {
    "when": "Weekly personal integrity practice; after emotional promising; alongside shared Proof during rebuild.",
    "steps": [
      {
        "title": "What you say",
        "detail": "What do I say I value? Write it.",
        "kind": "step"
      },
      {
        "title": "What you meant to do",
        "detail": "What did I intend this week?",
        "kind": "step"
      },
      {
        "title": "What actually happened",
        "detail": "What did I actually do? Where was the gap?",
        "kind": "step"
      },
      {
        "title": "One change",
        "detail": "One observable behaviour next week.",
        "kind": "repair"
      },
      {
        "title": "Keep it private",
        "detail": "Unless invited. Privacy protects honesty.",
        "kind": "note"
      },
      {
        "title": "Not a substitute",
        "detail": "Does not replace shared Proof on live breaches.",
        "kind": "failure"
      }
    ],
    "note": null,
    "outcome": "The integrity gap shrinks."
  },
  "full-recovery": {
    "when": "A repeated fight or a clear before/after dent in trust that a Weekly Reset can’t hold. Calm, agreed, scheduled — never mid-fight.",
    "steps": [
      {
        "title": "Warm up first",
        "detail": "Soften the mood before anything else. Don’t skip it.",
        "kind": "step"
      },
      {
        "title": "Say what happened",
        "detail": "Both sides, no interrupting.",
        "kind": "step"
      },
      {
        "title": "Acknowledge the impact",
        "detail": "Acknowledge the impact before either of you explains. One-sided breach: only the partner who caused it acknowledges.",
        "kind": "repair"
      },
      {
        "title": "Explain, if asked",
        "detail": "Only after the impact has actually landed.",
        "kind": "step"
      },
      {
        "title": "Ask for one change",
        "detail": "Name it and agree by when: “visible by ___.”",
        "kind": "repair",
        "badge": "proof window"
      },
      {
        "title": "Say it out loud",
        "detail": "Only if it’s true for both of you: “We made it through this. We’re still here.”",
        "kind": "repair"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "Not during active conflict. Never sprung on someone."
    },
    "outcome": "A real new agreement and a set time to prove it."
  },
  "uninvestment-check": {
    "when": "Warmth missing in ordinary moments, routine repairs, no future plans, or contempt replacing frustration.",
    "steps": [
      {
        "title": "Mark the signs alone",
        "detail": "Each marks the 8 signs separately, then share. Behaviour, not intent.",
        "kind": "step",
        "badge": "8 signs"
      },
      {
        "title": "Contempt? Skip the count",
        "detail": "Contempt means stop and get outside support first. Fear or coercion too, at any count.",
        "kind": "failure"
      },
      {
        "title": "Likely needs space",
        "detail": "Pause + Return and small repairs.",
        "kind": "pause",
        "badge": "0–2"
      },
      {
        "title": "May be pulling away",
        "detail": "Book a Full Recovery and set proof. Don’t wait it out.",
        "kind": "repair",
        "badge": "3 or more · within a week"
      },
      {
        "title": "Set a time window",
        "detail": "Set a window to check whether things are reinvesting.",
        "kind": "step"
      }
    ],
    "note": null,
    "outcome": "You know which repair to reach for, instead of hoping."
  },
  "unity-anchor": {
    "when": "Family disapproval, discrimination, or outside judgement is landing on the two of you.",
    "steps": [
      {
        "title": "Pause before reacting",
        "detail": "Don’t react to the pressure itself yet. What’s needed: reassurance, a plan, or just to vent?",
        "kind": "step"
      },
      {
        "title": "Trace the source",
        "detail": "Is this about us, or their disapproval landing on us? “That’s coming from them, not from us.”",
        "kind": "step"
      },
      {
        "title": "Name the unit",
        "detail": "“We’re on the same side of this.”",
        "kind": "step"
      },
      {
        "title": "Agree your response",
        "detail": "Decide together how the couple responds; log it at the Weekly Reset.",
        "kind": "step",
        "badge": "Weekly Reset"
      }
    ],
    "note": {
      "kind": "failure",
      "text": "Never used to limit a partner’s contact with family, friends, money, phone or movement."
    },
    "outcome": "Outside pressure stays outside; the two of you stay one unit."
  }
};
