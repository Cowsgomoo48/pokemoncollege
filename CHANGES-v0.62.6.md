# PokemonCollege v0.62.6

## Mystery Dungeon battle camera
- **Frames the whole fight:** the camera fits a box around every living ally and every awake foe, instead of only the farthest ally–foe pair, so a third ally or a second foe off to the side stays on screen.
- **Safe area:** framing leaves room for the floor badge and title, the minimap and the info button, so units don't end up underneath them.
- **When the fight is too spread out** (it can't fit even at the 62% zoom limit), the camera shows the Pokémon whose turn it is, its move range and the nearest foe, instead of letting them fall off screen.
- **Foes' turn:** the camera keeps the foe that's acting in view.
- **Battle walks:** the camera follows a walking Pokémon if it nears the edge, instead of letting it walk off screen.
- **Dead zone:** the camera stays still unless something it needs to show is near the edge or off screen, or it can zoom in noticeably, so it no longer jumps on every step or faint.
- Pans and zooms ease a little more smoothly.
