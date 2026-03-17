# AI Image Detector - API Keys Setup Guide

This file contains the API keys needed for the AI Image Detector feature to work at full capacity.

## Getting Your API Keys

### 1. Sightengine API (Required for best results)
Sightengine provides commercial-grade AI detection for DALL-E, Midjourney, Stable Diffusion, and other AI models.

**Steps:**
1. Visit https://sightengine.com
2. Click "Sign Up" (free account available)
3. Go to Settings > API Keys
4. Copy your **User ID** and **API Secret**
5. Add them below:

```bash
SIGHTENGINE_API_USER=your_user_id_here
SIGHTENGINE_API_SECRET=your_api_secret_here
```

**Features Available:**
- Detection of DALL-E, Midjourney, Stable Diffusion
- Commercial-grade accuracy
- Multiple AI model detection

---

### 2. Hugging Face API Token (Optional but recommended)
Provides access to Vision Transformer (ViT) models for advanced image analysis.

**Steps:**
1. Visit https://huggingface.co
2. Sign up (free account available)
3. Click your profile icon > Settings > Access Tokens
4. Create a new token (select "read" permissions)
5. Copy the token and add below:

```bash
HF_API_TOKEN=hf_your_token_here
```

**Features Available:**
- Advanced Vision Transformer (ViT) analysis
- High-accuracy detection using deep learning
- Better performance for edge cases

---

## Environment Variables Explanation

### SIGHTENGINE_API_USER
Your unique Sightengine user ID for API authentication.
- **Type:** String
- **Required:** No (but highly recommended)
- **Default:** "user_placeholder"

### SIGHTENGINE_API_SECRET
Your Sightengine API secret for authentication.
- **Type:** String
- **Required:** No (but highly recommended)
- **Default:** "secret_placeholder"

### HF_API_TOKEN
Your Hugging Face API token for Vision Transformer access.
- **Type:** String
- **Required:** No (optional)
- **Default:** "" (empty string)

---

## How the Detection Works

The system uses a **Weighted Voting System** with three engines:

1. **Sightengine API** (40% weight)
   - Commercial-grade detection engine
   - Specialized in detecting DALL-E, Midjourney, Stable Diffusion
   - Best for professional-grade analysis

2. **Hugging Face Vision Transformer** (40% weight)
   - Deep learning-based image analysis
   - ViT (Vision Transformer) model
   - Excellent for general AI detection

3. **Local Metadata Analysis** (20% weight)
   - EXIF data examination
   - File entropy analysis
   - AI tool markers detection
   - Runs locally without external API calls

The final confidence score is calculated using weighted voting: if each engine returns a score, they are combined to produce the most accurate overall verdict.

---

## Installation Instructions

### 1. Create .env.local file
Create a new file named `.env.local` in the root directory of your project:

```bash
touch .env.local
```

### 2. Add your API keys
Copy the template below and add your actual API keys:

```
SIGHTENGINE_API_USER=your_user_id_here
SIGHTENGINE_API_SECRET=your_api_secret_here
HF_API_TOKEN=hf_your_token_here
```

### 3. Restart Development Server
```bash
npm run dev
```

---

## Testing Without API Keys

You can still use the AI Image Detector without API keys! The system will:

- Use demo/placeholder credentials
- Provide basic detection using local metadata analysis
- Show reduced confidence scores
- Still provide detailed analysis breakdowns

**Full features require:**
- ✅ Sightengine API keys (free tier available)
- ✅ Hugging Face token (free tier available)

---

## Troubleshooting

### "Unable to analyze (API unavailable)"
- Check your API keys are correct
- Verify your Sightengine account is active
- Ensure you're within API rate limits

### Slow detection results
- First request may take longer as APIs initialize
- Local metadata analysis is always fast
- Consider upgrading free API tier for faster responses

### Connection errors
- Verify internet connection
- Check firewall settings
- Ensure API endpoints are accessible

---

## How to Update API Keys

Simply update the `.env.local` file with new values and restart the development server:

```bash
npm run dev
```

No code changes needed!

---

## Privacy & Security

- ✅ Images are processed in real-time
- ✅ Images are **NOT stored** on servers
- ✅ All analysis happens client-side or through trusted APIs
- ✅ Sightengine and HuggingFace have strict privacy policies
- ✅ Your API keys are never exposed to the browser

---

## Free Tier Limits

### Sightengine
- Free tier: 100 requests/day
- Upgrade for unlimited API calls

### Hugging Face
- Free tier: Good for testing
- Upgrade for higher rate limits

---

For more information:
- Sightengine Docs: https://sightengine.com/docs
- Hugging Face Docs: https://huggingface.co/docs/api-inference
