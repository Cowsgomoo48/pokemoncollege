# v1.3.0: Tower study, status and curse rework

Built from v1.2.3.

## Card plays no longer ask questions (Tower only)
- Playing a Tower card now just costs AP. You make any choices and the card resolves. Questions in fights now come only from Status and Curse cards.
- **Unchanged:** the question screen itself (Make-Up, tap protection, Halfsies, logging and Weak Spots) and every study question outside the Tower.
- **Answer-dependent effects adapted:**
  - **Trump Card:** the old right-answer effect is now what every play does: deal 8, Exile. The Safeguard keyword is removed.
  - **Emergency Guard:** likewise, gain 10 Block on every play. The Safeguard keyword is removed.
  - **Haste:** its keyword note no longer says it asks a question.
  - **Help screen:** rewritten to say where questions come from now.
  - **Relics:** none of the 60 Tower relics or 3 boss relics depended on answers, so none changed.
  - **Not affected:** Ultra Burst and the Dark-dodge environment only exist in the old pre-deck (v1) Tower. Treasure Rooms and Alakazam's Double or Nothing still ask their own questions, as before.

## Status cards (from enemies; gone when the fight ends)
| Card | Enemy move | Delivered to |
|---|---|---|
| **Scorch** (asks a question) | Will-O-Wisp (Fire): Scorch ×1 + Burn 2 | discard pile |
| **Daze+** (2 copies) | Confuse Ray (Ghost) | hand |
| **Daze** | Confusion (Psychic), unchanged | discard pile |
| **Shrapnel** (2 copies) | Stealth Rock (Rock), was Scorch ×2 | hand |
| **Static Cling** | Thunder Wave (Electric): Static Cling ×1 + Enfeebled 1 | hand |
| **Snare** | String Shot (Bug): Snare ×1 + Enfeebled 1 | discard pile |
| **Mind Haze** (asks a question) | Hypnosis (Psychic), was Daze ×2 | hand |

- **Intents:** they show the card's name, copies, and ✋ when it goes to your hand, e.g. "🃏 Mind Haze ×1 ✋". The intent's tooltip also holds the card's full text.
- **One question card per move:** each move adds only one question-bearing card.
- **Status cards in hand:** status cards that arrive during the enemy turn stay in your hand into your turn.
- **Scorch damage:** goes straight to HP. It ignores Block, is fixed at 4 (Make-Up) or 8 (Wrong), and can knock you out.

## New curses (permanent until removed at the Merchant)
| Curse | Event and option | Reward |
|---|---|---|
| **Unpaid Favor** | Gholdengo, "🧾 Take a loan" | 25 + floor 🎟️ |
| **Lingering Doubt** | Cinderace, "🗼 The Tower" (stronger optional bargain) | a Relic + upgrade 2 random cards |
| **Dead Weight** | Snorlax, "🛏️ Borrow its pillow" | +15% Max HP, no fight |
| **Frayed Focus** | Unown, "✂️ Tear out the last page" | a Relic, no HP lost |
| **Tunnel Vision** | Shedinja, "👁️ Stare into its shell" | remove up to 2 cards, no Max HP lost |

- **Previews:** every curse option now says "Add 1 × Name (curse)", shows the full curse text and states the reward. The existing Sunstroke, Broken Chord and Sleight of Paw options use the same wording.
- **All five are new optional choices.** No event forces a curse more often than before.
- **Kecleon trades** can no longer trade away statuses or curses. Removal goes through the Merchant (and the existing removal events).
- **Curses look different from statuses:** purple striped background and a CURSE label. Statuses keep the grey stripes and STATUS label.
- **Unchanged:** Gardevoir's Mystery Concoction (Scorch) and Spinda's wheel (Daze) still put those statuses in your deck permanently. The added Scorch now follows its new question rules.

## Trigger order and saving
- **End of turn:** status and curse cards in hand resolve first, in hand order. Each one checks it's still in hand, and questions come one at a time. Then the discard and the enemy turn follow.
  - Mind Haze, Dead Weight and Retained cards stay in hand.
  - Snare and Daze/Daze+ Exile themselves.
  - Sunstroke (2 damage, can't knock you out) now uses the same queue.
- **Start of turn:** Mind Haze questions run before the opening draw. Then AP refreshes, with Lingering Doubt's penalty applied after the refresh, and you draw (minus any Mind Haze penalty). Unpaid Favor questions from cards in the opening hand run after the draw, before you get control.
- **A lethal Scorch:** the fight ends normally and any pending prompts are dropped.
- **Saving:**
  - The pending queue is saved before each question.
  - Each answer is saved before its outcome, and the outcome is applied and saved in one step.
  - If you reopen the app mid-question, it asks the unresolved question again without applying anything. If the answer was already saved, it applies the outcome once without asking again. Nothing is ever applied twice.
- **Card movement:**
  - Discard and Exile move only the triggering copy. Exiled curses come back in the next fight.
  - Locksmith's Kit and Ward (from Cleanse) also catch statuses that go straight to your hand.
  - Clean Slate still Exiles statuses only, not curses.
  - The Tower has no hand-size limit.

## Tests
- **New:** tests/tower-status-browser.cjs (49 checks).
  - All three Scorch outcomes. A Scorch discarded before it triggers. Two Scorches resolving in order.
  - Reload mid-question, and reload after a saved answer.
  - Daze+ Exiling with no question. Static Cling, Shrapnel and Snare.
  - Mind Haze (all three outcomes) and all five curses.
  - Intent text, enemy moves, curses persisting between fights until removed, event previews, and a lethal Scorch stopping the queue.
- **Updated** for the removed question gate: deck-tower (40) and deck-signature (205). tower-events (44) now uses the new option positions.
- **Passing:**
  - tower-map 29, tower-relics 102, tower-update 69, tower-multi 60, eqpractice 37.
  - Non-Tower: guided-study, tap-protection, weak-spots, unix-hints, rescue-drill, oceanic-regression, rocky-regression.
- Service worker cache bumped to 1023.
