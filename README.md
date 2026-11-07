# Owl Mascot

Interactive owl companion for web pages.

## What's included
- Custom `OwlMascot` component (`src/owl-mascot.tsx`) with pose-based behavior
- Owl pose assets in `public/owl/poses/`
- `page-mascot` dependency for cursor-following experiments

## Quick start
```bash
git clone https://github.com/michelesorrentino7-od/owl-mascot.git
cd owl-mascot
npm install
```

## Using the custom OwlMascot
See `README-owl.md` for the existing pose-based component.

## Testing page-mascot
`page-mascot` expects two 3×3 sprite sheets (directions + reactions).

The current poses are individual PNGs. Next steps to test:
1. Create aligned sprite sheets from the owl poses (or use the page-mascot skill to generate them).
2. Place them in `public/owl/`.
3. Uncomment and adjust the `<Mascot>` usage in `src/PageMascotDemo.tsx`.

Demo site for page-mascot: https://koboyo.com/page-mascot
Repo: https://github.com/nilbuild/page-mascot

## Aesthetic note
The owl aesthetic is final — do not alter the visual style. Focus only on presence and interaction behavior.
