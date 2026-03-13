/**
 * Ported RemoveBanana logic for client-side browser usage.
 * Based on https://github.com/removebanana/removebanana
 */

// Constants from blendModes.js
const ALPHA_NOISE_FLOOR = 3 / 255;
const ALPHA_THRESHOLD = 0.002;
const MAX_ALPHA = 0.99;
const LOGO_VALUE = 255;

export interface Region {
    x: number;
    y: number;
    width: number;
    height: number;
    size?: number;
}

export interface WatermarkConfig {
    logoSize: number;
    marginRight: number;
    marginBottom: number;
}

/**
 * Calculate alpha map from background Captured image data
 */
export function calculateAlphaMap(data: Uint8ClampedArray, width: number, height: number): Float32Array {
    const alphaMap = new Float32Array(width * height);
    for (let i = 0; i < alphaMap.length; i++) {
        const idx = i * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const maxChannel = Math.max(r, g, b);
        alphaMap[i] = maxChannel / 255.0;
    }
    return alphaMap;
}

/**
 * Detect watermark configuration based on image size
 */
export function detectWatermarkConfig(imageWidth: number, imageHeight: number): WatermarkConfig {
    if (imageWidth > 1024 && imageHeight > 1024) {
        return {
            logoSize: 96,
            marginRight: 64,
            marginBottom: 64
        };
    }
    return {
        logoSize: 48,
        marginRight: 32,
        marginBottom: 32
    };
}

/**
 * Calculate initial watermark position
 */
export function calculateWatermarkPosition(imageWidth: number, imageHeight: number, config: WatermarkConfig): Region {
    const { logoSize, marginRight, marginBottom } = config;
    return {
        x: imageWidth - marginRight - logoSize,
        y: imageHeight - marginBottom - logoSize,
        width: logoSize,
        height: logoSize
    };
}

/**
 * Core removal algorithm: Reverse alpha blending
 */
export function removeWatermark(
    imageData: ImageData,
    alphaMap: Float32Array,
    position: Region,
    options: { alphaGain?: number } = {}
) {
    const { x, y, width, height } = position;
    const alphaGain = options.alphaGain || 1;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const imgIdx = ((y + row) * imageData.width + (x + col)) * 4;
            const alphaIdx = row * width + col;
            const rawAlpha = alphaMap[alphaIdx];

            const signalAlpha = Math.max(0, rawAlpha - ALPHA_NOISE_FLOOR) * alphaGain;
            if (signalAlpha < ALPHA_THRESHOLD) continue;

            const alpha = Math.min(rawAlpha * alphaGain, MAX_ALPHA);
            const oneMinusAlpha = 1.0 - alpha;

            for (let c = 0; c < 3; c++) {
                const watermarked = imageData.data[imgIdx + c];
                const original = (watermarked - alpha * LOGO_VALUE) / oneMinusAlpha;
                imageData.data[imgIdx + c] = Math.max(0, Math.min(255, Math.round(original)));
            }
        }
    }
}

/**
 * Computes the normalized cross-correlation between two arrays.
 */
function normalizedCrossCorrelation(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length || a.length === 0) return 0;

    let sumA = 0, sumB = 0;
    for (let i = 0; i < a.length; i++) { sumA += a[i]; sumB += b[i]; }
    const meanA = sumA / a.length;
    const meanB = sumB / b.length;

    let sqA = 0, sqB = 0, num = 0;
    for (let i = 0; i < a.length; i++) {
        const da = a[i] - meanA;
        const db = b[i] - meanB;
        num += da * db;
        sqA += da * da;
        sqB += db * db;
    }

    const den = Math.sqrt(sqA * sqB);
    return den < 1e-8 ? 0 : num / den;
}

/**
 * Extracts a grayscale region from ImageData.
 */
function getRegionGrayscale(imageData: ImageData, region: Region): Float32Array {
    const { width, height, data } = imageData;
    const size = region.width;
    const out = new Float32Array(size * size);

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const idx = ((region.y + row) * width + (region.x + col)) * 4;
            // Standard grayscale conversion
            out[row * size + col] = (0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2]) / 255;
        }
    }
    return out;
}

/**
 * Resolves whether the image contains a 48px or 96px watermark by checking templates.
 */
export function resolveConfig(imageData: ImageData, alpha48: Float32Array, alpha96: Float32Array): WatermarkConfig {
    const config48 = { logoSize: 48, marginRight: 32, marginBottom: 32 };
    const config96 = { logoSize: 96, marginRight: 64, marginBottom: 64 };

    const pos48 = calculateWatermarkPosition(imageData.width, imageData.height, config48);
    const pos96 = calculateWatermarkPosition(imageData.width, imageData.height, config96);

    // Default to 48 if image too small for 96
    if (imageData.width < 160 || imageData.height < 160) return config48;

    const patch48 = getRegionGrayscale(imageData, pos48);
    const patch96 = getRegionGrayscale(imageData, pos96);

    const score48 = normalizedCrossCorrelation(patch48, alpha48);
    const score96 = normalizedCrossCorrelation(patch96, alpha96);

    return score96 > score48 ? config96 : config48;
}

/**
 * Helper to load an image and get its ImageData
 */
export async function getImageData(url: string | File): Promise<{ imageData: ImageData; canvas: HTMLCanvasElement }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return reject("Could not get context");
            ctx.drawImage(img, 0, 0);
            resolve({
                imageData: ctx.getImageData(0, 0, img.width, img.height),
                canvas
            });
        };
        img.onerror = () => reject("Failed to load image at " + url);
        if (typeof url === 'string') {
            img.src = url;
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(url);
        }
    });
}

/**
 * Main function to process the image on the client side
 */
export async function processGeminiImage(file: File): Promise<string> {
    // 1. Load the user image
    const { imageData, canvas } = await getImageData(file);
    const ctx = canvas.getContext('2d')!;

    // 2. Load the reference alpha maps (from public/assets)
    const { imageData: img48 } = await getImageData('/assets/bg_48.png');
    const { imageData: img96 } = await getImageData('/assets/bg_96.png');

    const alpha48 = calculateAlphaMap(img48.data, 48, 48);
    const alpha96 = calculateAlphaMap(img96.data, 96, 96);

    // 3. Resolve config (48 vs 96)
    const config = resolveConfig(imageData, alpha48, alpha96);
    const position = calculateWatermarkPosition(imageData.width, imageData.height, config);
    const alphaMap = config.logoSize === 96 ? alpha96 : alpha48;

    // 4. Remove
    removeWatermark(imageData, alphaMap, position);

    // 5. Put back and return URL
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
}
