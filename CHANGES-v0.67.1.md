# v0.67.1 — Shorter reading protection

Blue reading protection now lasts word count ÷ 3 seconds (3 words per second). Red skim protection remains 0.040 seconds per word. A 20-word prompt locks for 0.8 seconds red plus about 6.7 seconds blue: about 7.5 seconds total. Speed Round automatically uses the revised duration before starting its answer countdown.

Validation: timing/state/lifecycle regression and full app syntax/bundle parity pass.
