# v1.4.11

- Fixed: card lists in pop-ups (Upgrade which card?, Remove, other card choosers, draw/discard piles, deck viewer, card rewards) wouldn't scroll when your finger started on a card.
- **Smoother dragging.**
  - The dragged card follows your finger every frame with no lag.
  - It tilts slightly with your swipe and eases between full size and its shrunken aiming size.
  - Target and hand positions are measured once when the drag starts, so moving around never stalls the screen.
  - A card dropped back into your hand glides from where you let go into its new spot.
- **Crosshair** no longer spins. It's a single steady crosshair that only moves when the closest target changes, with a quick fade in and out.
- Service worker cache bumped to 1038.
