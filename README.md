![RemoveBanana Logo](public/Banana.webp)

# RemoveBanana

Remove invisible AI watermarks from Google Gemini-generated images using reverse alpha blending mathematics.

Website: https://removebanana.aashuu.tech/

Author: aashuu

X: https://x.com/warrioraashuu/

GitHub: https://github.com/codeaashu/RemoveBanana

## What is this?

Google's AI image generators (Gemini, Imagen 2, Imagen 3, Nano Banana) embed invisible SynthID watermarks into every generated image. These watermarks are invisible to the human eye but can be detected by automated systems.

RemoveBanana uses the exact mathematical inverse of Google's alpha blending formula to perfectly reconstruct the original pixels, no AI guessing, no quality loss.

```text
Gemini adds:   watermarked = α × logo + (1 - α) × original
We reverse it: original = (watermarked - α × logo) / (1 - α)
```

## Current Codebase Overview

- `src/app/page.tsx`: landing page, navigation, product tabs, and feature grid
- `src/components/GeminiRemover.tsx`: Gemini image upload and browser-side processing UI
- `src/components/SoraRemover.tsx`: Sora share-link extraction UI
- `src/lib/watermark.ts`: browser-side watermark math and image processing helpers
- `src/app/api/remove-gemini/route.ts`: server route using the `removebanana` package
- `src/app/api/extract-sora/route.ts`: server route for extracting MP4 and prompt data from a public Sora share link

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```
