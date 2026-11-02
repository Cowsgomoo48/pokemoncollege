# v0.68.0 — Guided study and HP-aware answer formats

## Guided starts

Generated equation questions with a safely extractable symbolic equation and numeric setup now ask for the equation, then the substitution, then the final answer. All steps use the currently displayed question's bundled solution; no AI or number regeneration is involved. Alternative equations using the same variable set and numerically equivalent setup distractors are excluded. Wrong setup choices offer feedback and allow retry. Help me start provides a step hint. Final answers remain hidden until both setup steps are completed.

Questions without a safely extractable equation/setup keep their normal final-answer interface and provide Help me start / Help with the next step from existing solution hints. They are not assigned invented equation steps. Calculators and existing hints remain available.

In dungeon/Tower questions, completing both guided setup steps grants 2 Tickets when the question resolves, even when the final answer is wrong. This is awarded once per question, contributes to cumulative earned Tickets, and does not turn a wrong final answer into a correct study result or battle result. Existing DIY rewards remain unchanged.

## Smarter answer placement

Uses the acting party member's current HP and actual combat max HP:
- At or below 25% HP (including fainted/revival questions): multiple choice only, with no typed or DIY questions.
- Above 25% through 50%: 15% typed chance on eligible questions; 3% incidental DIY chance on eligible practice problems.
- Above 50%: 40% typed chance on eligible questions; 12% incidental DIY chance on eligible practice problems.

Existing special DIY floor prompts remain, but are postponed while HP is at/below 25%. Typed probabilities apply only to questions that support typed answers; DIY is selected first. Out-of-battle questions retain their usual format weighting. Low HP changes the response format, not the study problem's correctness or battle damage.

## Autopilot check

Submission timing now subtracts mandatory Tap Protection time. The check uses up to six recent responses and a twelve-question cooldown. It looks for repeated fast misses after unlock rather than flagging a streak of fast correct answers. Actual hint use and guided interactions are treated as engagement. Typed submissions use a shorter fast-response threshold. The supportive prompt offers Keep Going, Help Me Start Next Time, or Save & Take a Break without a gameplay penalty.

## Validation

New guided-study checks cover HP boundaries, actual dispatcher selection, multiple-choice override, postponed DIY, one-time effort rewards even on final failure, verified setup extraction, exclusion of equivalent setup choices, guided UI handler progression, final-answer hiding, hints, and post-lock detection versus fast mastery. All 15 pre-existing non-browser suites also pass, including Tap Protection, persistence, sprite and boss regressions, bundle parity and full app syntax. Browser/on-device visual verification remains pending.
