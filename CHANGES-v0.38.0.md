# PokémonCollege v0.38.0

## Equations display properly
- **Real math:** questions, answers, explanations, flashcards and Match-Up cards now draw fractions, superscripts, subscripts, roots and Greek letters.
- **Broken AI text fixed:** AI text that arrived with broken LaTeX (the boxes before "rac{1}{2}" and "ext{net}") is repaired and displayed correctly.
- **Summaries:** text turns LaTeX into readable Unicode (v₀, ½, √, θ, Δ).
- **Prevention:** both the on-device AI and Gemini are now told to write math as plain Unicode instead of LaTeX.
- **Template leftovers removed:** placeholder text the on-device AI sometimes echoed ("idea: what it means in one sentence", "the formula — when to use it") is stripped from study guides and never becomes a quiz question.

## Scientific calculator
- **Where:** a 🧮 Calculator drawer under any question with numbers in it: Mystery Dungeon, treasure rooms, Luxor and Speed Round.
- **Keys:** sin/cos/tan and their inverses (DEG/RAD toggle, degrees by default), √, x², ^, ln, log, π, e, parentheses, ± and backspace.
- **Live result:** the answer shows as you type. It uses its own safe parser.

## TMs
- **Free:** teaching a TM costs nothing.
- **Kept:** the TM disc stays in your collection, so you can teach it to as many Pokémon as you like.
