Perceptual use case
- Great to prevent using expensive pipelines for the same image.
- Weakness: A slight image manipulation such as cropping, size, rotation or color can change the result significantly.

# Ecommerce example
Seller uploads iphone15.jpg
    ↓
Upload to S3/Cloud Storage ($0.023/GB)
    ↓
Image optimization API ($$$)
    • Resize to 5 sizes
    • WebP conversion
    • Quality optimization
    ↓
Generate thumbnails ($)
    • 150x150
    • 300x300
    • 600x600
    • 1200x1200
    ↓
Store 6 versions × 100 sellers = 600 files ($)
    ↓
CDN distribution ($$)
    ↓
Database entry ($)
```

**Cost per upload**: ~$0.05-0.15
**For 100 duplicate uploads**: **$5-15 wasted**
**Across all products**: **Thousands of dollars monthly**

---

## With Perceptual Check
```
Seller uploads iphone15.jpg
    ↓
Calculate perceptual hash (50ms, FREE)
    ↓
Query database for similar hashes
    ↓
MATCH FOUND! 96% similar to existing image
    ↓
Response: "This product image already exists"
    ↓
Option 1: Link to existing image (zero cost)
Option 2: Allow upload but show warning
    ↓
Seller uses existing optimized image
    ↓
PIPELINE SKIPPED → $0.15 saved
```

**Cost**: ~$0.000001 (hash calculation + DB query)
**Savings per duplicate**: **$0.15**
**ROI**: **99.9%+ cost reduction**


## Gemini API configuration

This project can use Google Gemini for semantic image comparison on the server.

1. Create a `.env.local` file in the project root (do NOT commit it).

```text
GEMINI_API_KEY=your_gemini_api_key_here
```

2. Restart your Next.js dev server.

Notes:
- For demos the server embeds base64 images in the prompt; for production upload images to storage and pass URLs or use the official multimodal APIs.
- The server will also fall back to `OPENAI_API_KEY` if `GEMINI_API_KEY` is not set, for compatibility.

