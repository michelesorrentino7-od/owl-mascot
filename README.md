# Owl Mascot

Interactive owl companion for web pages.

## What's included
- Custom `OwlMascot` component (`src/owl-mascot.tsx`) with pose-based behavior
- Owl pose assets in `public/owl/poses/`
- 3×3 sprite sheets for page-mascot in `public/owl/mascots/`
- `page-mascot` dependency

## Quick start
```bash
git clone https://github.com/michelesorrentino7-od/owl-mascot.git
cd owl-mascot
npm install
```

## Testing page-mascot
Sprite sheets are ready:
- `public/owl/mascots/owl-directions.webp`
- `public/owl/mascots/owl-reactions.webp`

See `src/PageMascotDemo.tsx` for a ready-to-use example:

```tsx
<Mascot
  directions="/owl/mascots/owl-directions.webp"
  reactions="/owl/mascots/owl-reactions.webp"
  size={180}
/>
```

To run a local demo, add a simple Vite entry or import `PageMascotDemo` in your app.

## Using the custom OwlMascot
See `README-owl.md` for the existing pose-based component.

## Aesthetic note
The owl aesthetic is final — do not alter the visual style. Focus only on presence and interaction behavior.
