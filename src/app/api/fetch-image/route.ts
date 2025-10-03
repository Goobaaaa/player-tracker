import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      const url = new URL(imageUrl);
      if (!url.protocol.startsWith('http')) {
        return NextResponse.json(
          { error: 'Invalid URL protocol. Only HTTP and HTTPS are allowed.' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log('Fetching image from URL:', imageUrl);

    // Fetch the image from the server (bypasses CORS)
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
      },
      // Don't follow redirects to avoid potential issues
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      return NextResponse.json(
        {
          error: `Failed to fetch image: ${response.status} ${response.statusText}`,
          status: response.status
        },
        { status: 400 }
      );
    }

    // Get the content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'URL does not point to a valid image' },
        { status: 400 }
      );
    }

    // Get image data as buffer
    const imageBuffer = await response.arrayBuffer();

    // Convert to base64
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      dataUrl,
      contentType,
      size: imageBuffer.byteLength
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch image from URL. The image may not be accessible or may have CORS restrictions.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}