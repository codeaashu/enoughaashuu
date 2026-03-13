import { removeWatermarkFromBuffer } from 'removebanana';
import { NextResponse } from 'next/server';



export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    console.log('Processing Gemini Watermark Removal...');

    // Remove the watermark using the canvas library under the hood
    const result = await removeWatermarkFromBuffer(buffer, {
      format: 'png',
      silent: true,
    });

    if (!result || !result.buffer) {
      throw new Error("Failed to process the image");
    }

    // Return the clean image as a PNG response (BodyInit needs Uint8Array)
    return new NextResponse(new Uint8Array(result.buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="clean-image.png"',
      },
    });

  } catch (error: any) {
    console.error('Error removing Gemini watermark:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing the image. Make sure it is a valid Gemini/Imagen image with a watermark.' },
      { status: 500 }
    );
  }
}
