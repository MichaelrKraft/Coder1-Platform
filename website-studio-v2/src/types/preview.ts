export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export interface PreviewDimensions {
  width: string;
  height: string;
  scale?: number;
}

export const PREVIEW_DIMENSIONS: Record<PreviewMode, PreviewDimensions> = {
  desktop: {
    width: '100%',
    height: '100%',
  },
  tablet: {
    width: '768px',
    height: '1024px',
    scale: 0.8,
  },
  mobile: {
    width: '375px',
    height: '667px',
    scale: 0.8,
  },
};

export interface WebsitePreviewProps {
  url: string;
  css: string;
  mode: PreviewMode;
  showComparison: boolean;
  onError?: (error: string) => void;
}

export interface PreviewApiResponse {
  success: boolean;
  html?: string;
  error?: string;
  fallback?: boolean;
}

export interface PreviewError {
  type: 'cors' | 'network' | 'invalid-url' | 'blocked' | 'unknown';
  message: string;
  suggestion?: string;
}
