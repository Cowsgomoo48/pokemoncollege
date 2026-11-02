# PokémonCollege v0.44.3

## Workout Gym breakthroughs depend on the grade
- **How a hit works:** each Gym hit works on one random growth rate that isn't maxed yet.
- **Breakthrough chance:** whether that rate goes up depends on its current grade. It's 75% at F and slides down to 12% at A, about 5 points lower per grade:
  - F 75%, D- 64%, D+ 54%, C 43%, B- 33%, B+ 22%, A 12%
  - In code: 0.75 − 0.63 × (grade − 1) / 12
- **Simulated time to max all six growth rates (Gym starting at Lv 1):**
  - All D-: about 65 days (51–83).
  - Typical (around C to C+): about 54 days (38–70).
  - All B: about 41 days (30–51).
- **Unchanged:** the hourly check (1% start, doubling on each miss), half-rate EXP, and lights-out after 3 hits.
