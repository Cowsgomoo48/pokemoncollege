# v1.6.0: engine pack 2

31 new cards so every engine has its own builders and payoffs.

## Charge (Electric)
| Card | Cost | Effect |
|---|---|---|
| Capacitor | 1, Ability | Charge 1 each turn |
| Discharge | 1 | Spend all Charge: 4 + 4 per Charge |
| Lightning Rod | 1 | 5 Block + 2 per Charge, then Charge 1 |
| Chain Lightning | 2 | 4 to all, repeated once per Charge spent (max 2) |

## Ward + Retain (Fairy)
| Card | Cost | Effect |
|---|---|---|
| Guardian Charm | 1, Retain | 4 Block + 1 Ward |
| Moonblessing | 1, Ability | 3 Block per Retained card each turn |
| Patient Wish | 1, Retain | 4 Block + 3 per turn it was Retained |
| Ward Burst | 1 | Spend all Ward: 6 + 6 per Ward |

## Chill (Ice)
| Card | Cost | Effect |
|---|---|---|
| Shatter | 1 | Remove all Chill: 3 damage per Chill |
| Deep Freeze | 1, Ability | Chill 1 to all enemies each turn |
| Frostbite | 1 | 6 damage, or 10 + Vulnerable 1 on a Chilled enemy |
| Glacier Wall | 1 | 5 Block + 1 per Chill on enemies |

## Constructs (Steel)
| Card | Cost | Effect |
|---|---|---|
| Gear Grinder | 1, Built | 7 damage; when attached, 4 to the lowest-HP enemy |
| Overdrive Core | 1, Built | Draw 1; when attached, gain 1 AP |
| Foreman | 2, Ability | 4 Block per active Construct each turn |
| Piston Punch | 1 | 5 + 3 per card attached to your Constructs |

## Fly (Flying)
| Card | Cost | Effect |
|---|---|---|
| Aerial Ace | 1 | 6, or 10 if you gained Fly this turn |
| Thermal | 1, Ability | +1 Fly each turn |
| Sky Cover | 1 | 4 Block + 3 per Fly, without spending it |
| Feather Storm | 1 | Spend all Fly: 3 damage to a random enemy, once plus once per Fly |

## Plant (Grass)
| Card | Cost | Effect |
|---|---|---|
| Overgrowth | 2, Ability | +1 counter on every Planted card each turn |
| Thornwall | 1 | 4 Block + 2 per Plant counter |
| Pruning Shears | 0 | −1 counter from each Planted card (never removes the last), draw 1 per counter, up to 3 |

## Multi-hit (Fighting / Normal)
| Card | Cost | Effect |
|---|---|---|
| Fury Swipes | 1, Normal | 2 damage × 5 |
| Rapid Jab | 0, Fighting | 2 damage × 2 |
| Momentum | 1, Fighting Ability | Your 6th hit each turn gives 1 AP |

## Big-cost (Dragon)
| Card | Cost | Effect |
|---|---|---|
| Dragon Rage | 3 | 14 to all; costs 1 less per 3+ cost card played this turn |
| Dragon Dance | 1 | 1 Strength, or 3 after a 3+ cost card |
| Scale Shot | 2 | 4 damage to random enemies × 4, or × 5 if you ended last turn with AP left |

## Cross-type (Normal)
| Card | Cost | Effect |
|---|---|---|
| Versatile | 1 | Draw 1 per type in your hand, up to 3 |
| Teamwork | 1, Ability | 2 Block whenever you switch types between plays |

## Other
- `tests/tower-synergy-browser.cjs` now has 59 checks.
- Service worker cache bumped to 1041.
