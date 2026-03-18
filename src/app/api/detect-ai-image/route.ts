import { NextResponse } from "next/server";

interface SightengineResponse {
  status: string;
  request: {
    id: string;
  };
  type?: {
    ai_generated?: number;
  };
}

interface HuggingFaceResponse {
  label?: string;
  score?: number;
  [key: string]: unknown;
}

async function detectWithSightengine(imageBuffer: Buffer): Promise<{
  confidence: number;
  label: string;
  models_used: string[];
  processing_time: number;
  available: boolean;
}> {
  const startTime = Date.now();

  try {
    const user = process.env.SIGHTENGINE_API_USER || "user_placeholder";
    const secret = process.env.SIGHTENGINE_API_SECRET || "secret_placeholder";

    const formData = new FormData();
    formData.append("api_user", user);
    formData.append("api_secret", secret);
    formData.append("models", "genai");
    formData.append("media", new Blob([new Uint8Array(imageBuffer)], { type: "image/jpeg" }));
    
    const response = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Sightengine API error: ${response.statusText}`);
    }

    const data = (await response.json()) as SightengineResponse;
    const aiConfidence = Math.min(1, Math.max(0, data.type?.ai_generated ?? 0.5));

    return {
      confidence: aiConfidence,
      label: aiConfidence >= 0.5 ? "AI Generated (GenAI)" : "Likely Authentic",
      models_used: ["genai"],
      processing_time: Date.now() - startTime,
      available: true,
    };
  } catch (error) {
    console.error("Sightengine detection error:", error);
    return {
      confidence: 0,
      label: "Unable to analyze (API unavailable)",
      models_used: ["genai"],
      processing_time: Date.now() - startTime,
      available: false,
    };
  }
}

async function detectWithHuggingFace(imageBuffer: Buffer, mimeType: string): Promise<{
  confidence: number;
  label: string;
  processing_time: number;
  available: boolean;
}> {
  const startTime = Date.now();

  try {
    const hfToken = process.env.HF_API_TOKEN || "";
    
    if (!hfToken) {
      return {
        confidence: 0,
        label: "Unable to analyze (missing token)",
        processing_time: Date.now() - startTime,
        available: false,
      };
    }

    // Using Hugging Face Inference API with a vision model
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/Falconsai/nsfw_image_detection",
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": mimeType || "application/octet-stream",
        },
        method: "POST",
          body: new Uint8Array(imageBuffer),
      }
    );

    if (!response.ok) {
      const reason =
        response.status === 401
          ? "Unable to analyze (invalid Hugging Face token or missing permissions)"
          : response.status === 403
            ? "Unable to analyze (Hugging Face token access denied)"
            : response.status === 429
              ? "Unable to analyze (Hugging Face rate limit reached)"
              : `Unable to analyze (Hugging Face error ${response.status})`;

      return {
        confidence: 0,
        label: reason,
        processing_time: Date.now() - startTime,
        available: false,
      };
    }

    const predictions = (await response.json()) as HuggingFaceResponse[];

    if (!Array.isArray(predictions) || predictions.length === 0) {
      return {
        confidence: 0,
        label: "Unable to analyze (empty Hugging Face response)",
        processing_time: Date.now() - startTime,
        available: false,
      };
    }

    const labels = predictions
      .map((entry) => String(entry.label || "").toLowerCase())
      .filter(Boolean);

    const hasNsfwLabels = labels.includes("normal") && labels.includes("nsfw");
    if (hasNsfwLabels) {
      return {
        confidence: 0,
        label: "Excluded from AI vote (NSFW model output)",
        processing_time: Date.now() - startTime,
        available: false,
      };
    }

    const aiLabel = predictions.find((entry) => {
      const label = String(entry.label || "").toLowerCase();
      return label.includes("ai") || label.includes("generated") || label.includes("synthetic") || label.includes("fake");
    });

    const realLabel = predictions.find((entry) => {
      const label = String(entry.label || "").toLowerCase();
      return label.includes("real") || label.includes("authentic") || label.includes("human") || label.includes("natural");
    });

    const aiScore = typeof aiLabel?.score === "number" ? aiLabel.score : null;
    const realScore = typeof realLabel?.score === "number" ? realLabel.score : null;

    if (aiScore === null && realScore === null) {
      return {
        confidence: 0,
        label: "Excluded from AI vote (model does not provide AI/real classes)",
        processing_time: Date.now() - startTime,
        available: false,
      };
    }

    const aiConfidence = aiScore !== null ? aiScore : Math.max(0, Math.min(1, 1 - (realScore || 0.5)));

    return {
      confidence: aiConfidence,
      label: aiConfidence > 0.6 ? "Likely AI Generated" : "Likely Authentic",
      processing_time: Date.now() - startTime,
      available: true,
    };
  } catch (error) {
    console.error("HuggingFace detection error:", error);
    return {
      confidence: 0,
      label: "Unable to analyze (API unavailable)",
      processing_time: Date.now() - startTime,
      available: false,
    };
  }
}

async function analyzeMetadata(imageBuffer: Buffer, file: File): Promise<{
  confidence: number;
  findings: string[];
  processing_time: number;
}> {
  const startTime = Date.now();
  const findings: string[] = [];

  try {
    // Check file metadata
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    const fileType = file.type;

    // Check for common AI tool markers in filename
    const aiToolMarkers = ["ai", "generated", "dall-e", "midjourney", "stable", "craiyon"];
    let suspiciousSignals = 0;

    if (aiToolMarkers.some((marker) => fileName.includes(marker))) {
      findings.push("Filename contains potential AI tool marker");
      suspiciousSignals += 1;
    }

    // Analyze entropy (very basic)
    let entropy = 0;
    const frequencyMap: Record<number, number> = {};

    for (let i = 0; i < Math.min(imageBuffer.length, 10000); i++) {
      frequencyMap[imageBuffer[i]] = (frequencyMap[imageBuffer[i]] || 0) + 1;
    }

    for (const freq of Object.values(frequencyMap)) {
      const p = freq / Math.min(imageBuffer.length, 10000);
      entropy -= p * Math.log2(p);
    }

    // Entropy is a weak signal and should not dominate the verdict.
    if (entropy > 7.9) {
      findings.push("High entropy pattern detected (weak signal)");
      suspiciousSignals += 1;
    }

    // Very small files can indicate heavy compression (weak signal).
    if (fileSize < 20000) {
      findings.push("Very small file size detected (weak signal)");
      suspiciousSignals += 1;
    }

    // Keep metadata confidence conservative to reduce false positives.
    let confidence = 0.08;
    if (suspiciousSignals > 0) {
      confidence = Math.min(0.45, 0.08 + suspiciousSignals * 0.12);
    }

    if (findings.length === 0) {
      findings.push("No suspicious metadata patterns detected");
    }

    return {
      confidence,
      findings,
      processing_time: Date.now() - startTime,
    };
  } catch (error) {
    console.error("Metadata analysis error:", error);
    return {
      confidence: 0.08,
      findings: ["Metadata analysis failed"],
      processing_time: Date.now() - startTime,
    };
  }
}

function getImageDimensions(imageBuffer: Buffer): string {
  // Simplified dimension extraction (would need full image parsing for accuracy)
  // For now, return a placeholder
  return "Unknown dimensions";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image provided." },
        { status: 400 }
      );
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image (PNG, JPG, WebP, etc.)" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const totalStartTime = Date.now();

    // Run all three detection engines in parallel
    const [sightengineResult, huggingfaceResult, metadataResult] = await Promise.all([
      detectWithSightengine(imageBuffer),
      detectWithHuggingFace(imageBuffer, imageFile.type),
      analyzeMetadata(imageBuffer, imageFile),
    ]);

    // Weighted voting system
    // Weights: Sightengine (40%), HuggingFace ViT (40%), Local Metadata (20%)
    const sightengineWeight = 0.4;
    const huggingfaceWeight = 0.4;
    const metadataWeight = 0.2;

    let weightedNumerator = metadataResult.confidence * metadataWeight;
    let weightedDenominator = metadataWeight;

    if (sightengineResult.available) {
      weightedNumerator += sightengineResult.confidence * sightengineWeight;
      weightedDenominator += sightengineWeight;
    }

    if (huggingfaceResult.available) {
      weightedNumerator += huggingfaceResult.confidence * huggingfaceWeight;
      weightedDenominator += huggingfaceWeight;
    }

    const weightedScore = weightedDenominator > 0
      ? weightedNumerator / weightedDenominator
      : metadataResult.confidence;

    const activeEngines = Number(sightengineResult.available) + Number(huggingfaceResult.available);
    const aiThreshold = activeEngines >= 1 ? 0.65 : 0.8;

    // Get image size
    const fileSizeMB = (imageFile.size / (1024 * 1024)).toFixed(2);
    const fileSize = `${fileSizeMB} MB`;

    return NextResponse.json({
      overall_confidence: Math.min(1, Math.max(0, weightedScore)),
      is_ai_generated: weightedScore >= aiThreshold,
      analysis: {
        sightengine: sightengineResult,
        huggingface_vit: huggingfaceResult,
        local_metadata: metadataResult,
      },
      weighted_vote_details: {
        sightengine_score: sightengineResult.confidence,
        huggingface_score: huggingfaceResult.confidence,
        local_score: metadataResult.confidence,
        final_vote: weightedScore,
      },
      processing_details: {
        image_dimensions: getImageDimensions(imageBuffer),
        file_size: fileSize,
        processing_time_total: Date.now() - totalStartTime,
      },
    });
  } catch (error: unknown) {
    console.error("AI detection error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An error occurred during image analysis";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
