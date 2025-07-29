import { NextRequest, NextResponse } from 'next/server';
import { PreviewApiResponse, PreviewError } from '@/types/preview';
import { validateUrl, sanitizeUrl, injectCssIntoHtml } from '@/lib/preview-utils';
import { getDemoWebsiteForUrl } from '@/lib/demo-website';

export async function POST(request: NextRequest) {
  try {
    const { url, css } = await request.json();

    // Validate URL
    if (!url || !validateUrl(url)) {
      const error: PreviewError = {
        type: 'invalid-url',
        message: 'Invalid URL provided',
      };
      return NextResponse.json<PreviewApiResponse>(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    const sanitizedUrl = sanitizeUrl(url);

    // For now, always return the demo website due to CORS restrictions
    // In the future, this could use a proxy service or browser extension
    const demoHtml = getDemoWebsiteForUrl(sanitizedUrl);

    return NextResponse.json<PreviewApiResponse>({
      success: true,
      html: css ? injectCssIntoHtml(demoHtml, css) : demoHtml,
      fallback: false,
    });
  } catch (error) {
    console.error('Preview API error:', error);
    return NextResponse.json<PreviewApiResponse>(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
