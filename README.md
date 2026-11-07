# Owl Mascot

Interactive owl companion that perches on page elements and tracks the cursor with a 3×3 sprite sheet.

## Run the demo

```bash
git clone https://github.com/michelesorrentino7-od/owl-mascot.git
cd owl-mascot
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## How it works

- Drop `<OwlMascot />` once on the page.
- Mark perch points with `data-seat` (optional `data-seat-edge="top|right|bottom"`).
- While sitting, the owl uses the 3×3 directions sprite sheet (`public/owl/mascots/owl-directions.webp`) and follows the mouse angle.
- When a seat scrolls away or it gets bored, it flies to the nearest visible seat.

## Assets

- `public/owl/poses/` — individual flight / alert poses
- `public/owl/mascots/` — 3×3 directions and reactions sheets

Aesthetic is final — do not change the visual style.
