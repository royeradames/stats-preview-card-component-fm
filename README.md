# Stats preview card

An implementation of the [Frontend Mentor stats preview card challenge](https://www.frontendmentor.io/challenges/stats-preview-card-component-8JqbgoU62), using its supplied photo crops, copy and design references.

The card is static presentation: a heading, a paragraph and three sample stats in a description list. There is no client state, backend or data collection.

## Development

Node 22.13 or later. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Browser tests use installed Chrome and own port 4538.

Next 16.3.6, React 19.2.8, TypeScript 5.9.3 and Tailwind 4.2.1 are pinned to the family baseline. The page is a server component.

## Sources

Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/`. Geometry and colors follow the decoded Figma frames (Mobile 375, Tablet 768, Desktop 1440): the purple `#ab5cdb` fill with the photo multiplied at 75% opacity, Inter 400/700 and Lexend Deca 400 through `next/font`.

## Implementation choices

- Body copy rises from the design's 15px to the family 16px floor. The 12px tracked uppercase stat captions are a deliberate design detail and stay at 12px.
- The tablet stacked layout runs from 640px up; the side-by-side desktop card starts at 1120px, where the 50% text column still fits the 355px stats row.
- Stats are a `<dl>` with the caption as `<dt>`; CSS reverses the visual order so the number sits above its caption as in the design.
