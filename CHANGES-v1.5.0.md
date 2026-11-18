# v1.5.0: synergy pack

## New mechanics
- **Token:** a card made by another card, for this fight only. It's never added to your deck. When played, discarded, or left in hand at end of turn, it goes to the Void, so tokens count toward Threshold.
  - Tokens: Wisp (Ghost, 0 AP: deal 3), Ember (Fire, 0 AP: apply 1 Burn), Ripple (Water, 0 AP: draw 1).
- **Threshold N:** a bonus that applies while you have N or more cards in your Void.

## 17 new cards (plus the 3 tokens)

### Void / Exile
| Card | Cost | Effect |
|---|---|---|
| Wisp Lantern | 1, Ghost Ability | A Wisp each turn |
| Hollow Choir | 1, Ghost | 5 damage; Threshold 6 hits all enemies |
| Soul Harvest | 1, Ghost/Dark | 2 Block per Void card; Threshold 10 also gives 1 AP; Exile |
| Mass Grave | 1, Dark | 2 Wisps; Threshold 8 gives 4 |
| Void Pact | 1, Dark Ability | First Exile each turn draws 1 |
| Echo of the Lost | 0, Ghost | A Wisp; Threshold 4 instead returns a random Void card at 0 AP; Exile |
| Kindle the Dead | 2, Fire/Ghost Ability | Every Exile burns a random enemy |

### Draw / Discard / Scry
| Card | Cost | Effect |
|---|---|---|
| Tidepool | 1, Water Ability | First discard each turn gives a Ripple |
| Wash Out | 1, Water | 4 damage per card discarded this turn |
| Deep Insight | 1, Psychic Ability | First Scry-to-bottom each turn draws 1 |

### Poison
| Card | Cost | Effect |
|---|---|---|
| Festering Wound | 1, Poison | Double an enemy's Poison; Exile |
| Toxic Spikes | 1, Poison Ability | Every discard poisons a random enemy |
| Noxious Cloud | 1, Poison Ability | 2 Poison to all enemies each turn |
| Plague Bearer | 1, Bug/Poison | 2 damage ×3, each hit adds Poison if already Poisoned |

### Burn
| Card | Cost | Effect |
|---|---|---|
| Fan the Flames | 1, Fire | 2 Embers; Threshold 5 gives 3 |
| Wildfire | 1, Fire Ability | An Ember per Burned enemy each turn, up to 2 |
| Heat Wave | 1, Fire | Each enemy takes damage equal to its Burn; Burn stays |

## Reworks
- **Moonlight:** draw 1; if you've drawn 8+ cards this turn, gain 1 AP. The opening hand counts. Art kept.
- **Foresee:** now 1 AP, Scry 3, then 2 damage per card sent to the bottom this turn (targets an enemy).
- **Bounty:** now a Plant card. Plant 2; Harvest: draw 2.
- **Static:** now also Charge 1.
- **Helping Hand:** now also draws 1 card if your party lost HP last turn.

## Retired
- Weathered Wall and Stone Vault no longer appear as rewards or transforms. Copies already in a deck still work.

## Balance choices
- Most new payoffs cost 1 AP so engines come online quickly.
- Every engine piece that could loop triggers once per turn: Void Pact, Tidepool, Deep Insight.
- Wildfire is capped at 2 Embers per turn.

## Other
- New test file: `tests/tower-synergy-browser.cjs` (30 checks).
- Service worker cache bumped to 1040.
