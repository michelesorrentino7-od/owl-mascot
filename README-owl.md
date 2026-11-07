# Owl mascot

Pose-based page companion. The owl is always a finished painting. It sits, looks, and only flies when its seat leaves the screen.

## Files

- `src/components/owl-mascot.tsx` — the component
- `public/owl/poses/` — seven PNGs, 700×800, feet at y=740

## Mount

```tsx
import { OwlMascot } from "@/components/owl-mascot";

// once, at the end of the page
<OwlMascot />
```

## Seats

Add `data-seat` to elements the owl can perch on. Optional `data-seat-edge`: `top` (default), `right`, or `bottom`.

```html
<header data-seat="mast" data-seat-edge="top">…</header>
<article data-seat="card" data-seat-edge="top">…</article>
```

The owl starts on `[data-seat="mast"]` if it exists, otherwise the first seat.

## Behaviour

- Sit on the current seat. Feet stay on the edge.
- Pointer nearby: switches to look-left or look-right. Does not fly while you are close.
- Seat scrolls off, or a long idle: takeoff → flight → landing on the seat nearest the middle of the viewport.
- Click: a small hop and “Night owl.”
- `prefers-reduced-motion`: stays on the home seat, no flight.

## Size

About 132 px wide on small screens, 158 px on larger. Constant across poses because every PNG shares the same canvas and foot line.
