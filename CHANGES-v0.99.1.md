# v0.99.1 — Boss relics

- After winning in a Boss room on the Tower map, choose 1 of up to 3 unowned boss relics, or skip. Normal victory rewards follow as usual. Eligibility is decided by the map room, so event fights classed as bosses don't count. If all boss relics are owned, the normal victory screen shows directly.
- New boss relics:
  - Overloaded Battery: +1 AP after every start-of-turn AP refresh (including turn one); draw 1 fewer card in the start-of-turn draw.
  - Sealed Purse: +1 AP after every start-of-turn AP refresh (including turn one); battle victories pay no base Tickets (bonus Tickets still work).
  - Glass Crown: Attack cards deal 30% more damage; on pickup, Max team HP drops to 80% (rounded down, minimum 1), and HP is capped to it. Applied once.
- Each choice shows the full benefit and downside before you confirm. Boss relics appear with your other relics and are never in regular relic rolls or the Merchant.
- The pending choice is saved with the run: reloading shows the same offer, and choosing or skipping resolves it once.
- The 60 regular relics, rarity pools, drop weights, and Merchant prices are unchanged.
- Tests: 22 new checks in tests/tower-relics-browser.cjs (102 total).
