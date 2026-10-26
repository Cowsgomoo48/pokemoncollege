# PokémonCollege v0.33.0

## Practice problems made by the app
- **41 problem types:**
  - Arithmetic: fractions, percents, order of operations, proportions, scientific notation
  - Algebra: one-step, two-step and multi-step equations, inequalities, slope, line equations, systems, factoring, quadratics, exponent rules, functions, logarithms
  - Geometry: distance and midpoint, Pythagorean theorem, area and perimeter
  - Calculus: power rule, chain rule, derivative at a point, definite integrals, limits
  - Statistics: mean, median, mode and range; probability; z-scores
  - Chemistry: molar mass, grams ↔ moles, molarity, dilutions, ideal gas law, density, pH
  - Physics: kinematics, F = ma, kinetic and potential energy, Ohm's law
- **Always-right answers:** every problem uses new random numbers, and the app works out the answer itself. Wrong choices come from common mistakes (forgetting to flip an inequality, skipping the chain rule's inside derivative, using °C instead of kelvin, and so on). Missing one shows a worked solution.
- **Picking types for a set:** the summary editor has a "Practice problems" section. Until you change it, the app ticks the types it finds in the set's title, notes and source text. "Try a sample problem" shows one with its solution.
- **In the games:** each ticked type adds two fresh problems to every game, in all study minigames and the Mystery Dungeon. Weak spots are tracked per problem type.

## AI study guides (Apple Intelligence)
- **New layout:** the on-device AI now builds a study guide instead of a short summary. Sections are Summary, Problem Types (with how to solve each), Formulas (with when to use them), Concepts and Worked Examples.
- **Big sets keep their coverage:** the whole set is read in parts of about 5,000 characters, up to 24 parts. Each part's problem types, formulas and concepts are kept, then merged with duplicates removed. Before, everything was shrunk to about 6,000 characters first.
- **Linked practice:** problem types and formulas the guide finds also tick the matching practice problem types.
- **Progress and fallback:** the summary list shows which part the AI is reading. If the guide fails, the old summary is used. The AI quiz now asks for 10 questions.
- **Note:** this change includes new Swift code (StudyAIPlugin.studyGuide). If the GitHub build fails, send the log.
