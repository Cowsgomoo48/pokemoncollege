# v1.2.1: Equation practice in Help me start

- **Removed the Equation Lab minigame.** Its practice now lives in your study sets' practice problems.
- **New practice problems:** physics and precalc practice types now include equation-choice word problems from the old Equation Lab, about 2 in every 3 generated problems.
  - Covers kinematics, forces, energy, power, projectiles, circular motion, circuits, arcs, sinusoids, unit circle and growth.
  - Equations you keep missing come up more often.
- **Better "Help me start" for these problems:**
  1. **What do you know?** Mark each quantity as given or asked for. The hint points out hidden numbers like "from rest" (v₀ = 0).
  2. **Pick the equation.** A wrong pick explains when to use the one you picked and when to use the right one, and tells you how many times you've mixed up those two.
  3. **Solve it.** The answers come back with your givens and the equation shown. "Show it rearranged" is there if you need it.
- The 💡 Hint button walks the same three steps.
- Other problems keep the existing Help me start.
- Your old Equation Lab right/wrong and mix-up history is kept and still decides which equations come up more often.
- Service worker cache bumped to 1020. tests/eqlab-browser.cjs is replaced by tests/eqpractice-browser.cjs (20 checks).
