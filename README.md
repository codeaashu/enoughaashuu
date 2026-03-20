<div align="center"> 
<a href="https://peerlist.io/aashuu/project/enough-aashuu" target="_blank" rel="noreferrer">
				<img
					src="https://peerlist.io/api/v1/projects/embed/PRJHNN7JQ6QA9KKLJ1OA9AK8O9AQP8?showUpvote=true&theme=dark"
					alt="enough aashuu"
					style="width: auto; height: 72px;"
				/>
			</a>
<img width="1781" height="740" alt="enoughaashuu" src="https://github.com/user-attachments/assets/0951b6fe-d120-4ee5-9429-915f3007f1f1" />

<h2 align="center"><a href="https://enough.aashuu.tech/"><strong>✦ enough.aashuu.tech ✦</strong></a></h2>

`Enough Aashuu is an all-in-one toolkit that removes the hard parts, so you can clean, detect, and generate in seconds.`
<hr>
</div>

- Remove Gemini and Imagen watermarks from images
- Extract clean MP4 links from shared Sora videos
- Remove image backgrounds locally in the browser
- Detect AI-generated images with a hybrid voting pipeline
- Generate styled QR codes for multiple payload types

## Feature Overview

| Tool | Route | What it does | Processing model |
| --- | --- | --- | --- |
| Gemini/Image Watermark Remover | /image-remover | Removes Gemini/Imagen/Nano Banana watermarking using reverse alpha blending | Client-side |
| Sora Video Remover | /video-remover | Accepts Sora links and extracts clean MP4 + prompt | Server route fetch + parsing |
| Background Remover | /background-remover | Removes background from one or many images, supports recolor/recompose and ZIP export | Client-side AI model |
| AI Image Detector | /ai-image-detector | Multi-engine AI-image detection with weighted voting and JSON export | Server route + external APIs + metadata analysis |
| QR Generator | /qr-code-generator | Styled QR generation for URL/text/Wi-Fi/vCard/event/phone/SMS/geo with PNG/JPEG/SVG export | Client-side |

## Product Notes

### Image Watermark Removal

- Uses reverse alpha blending (see src/lib/watermark.ts)
- Auto-selects watermark config (48px vs 96px pattern)
- In-browser processing for private local workflow

### Sora Workflow

- Supports public Sora links
- Handles both /p/ shared links and /g/gen_* pattern with fallback extraction
- Returns extracted prompt and direct MP4 URL for download

### Background Removal Workflow

- Multi-file queue with per-card status
- Local model warm-up and progress tracking
- Output controls: transparent background, solid color, custom image background
- Single image PNG download + ZIP batch export

### AI Detector Workflow

- Ensemble of:
  Sightengine GenAI classifier, Hugging Face inference model, and local metadata heuristic analysis
- Weighted scoring with thresholding
- Full downloadable JSON report from UI

### QR Generator Workflow

- Payload types: text/URL, Wi-Fi, vCard, event, phone, SMS, geo
- Style controls: gradients, dot styles, corner styles, logo upload, randomizer
- Export: PNG, JPEG, SVG
- Extra actions: copy image, embed code, print

## Security and Privacy

- Most heavy media workflows are browser-side by design
- Install prompt uses localStorage-based dismiss window
- Service worker is pass-through (installability-oriented)
- Background remover route has COOP/COEP headers via next.config.ts

## SEO and PWA

- Centralized brand metadata in src/lib/brand.ts
- Rich metadata in src/app/layout.tsx
- robots.ts + sitemap.ts configured for production domain
- Web app manifest via src/app/manifest.ts
