# Alternate and unmatched menu shots

Not built. `scripts/optimize-images.mjs` only reads image files directly in
`assets/source/menu`, so anything in here is ignored until you move it up a
level and name it after an item slug.

**Alternates** — second shots of items that already have a photo. Swap one in
by moving it up and renaming it to the slug (e.g. `chicken.png`), then run
`npm run images`.

Every item that had a photo in the shared folder is now live, so what remains
here is duplicates only. Three menu items are still without a photo:
`doughnuts`, `fayrous` and `exotic`.
