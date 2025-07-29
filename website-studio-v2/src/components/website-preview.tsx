'use client';

import { useState, useEffect, useRef } from 'react';
import { Monitor, Tablet, Smartphone, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  WebsitePreviewProps,
  PreviewMode,
  PREVIEW_DIMENSIONS,
  PreviewApiResponse,
} from '@/types/preview';
import { validateUrl } from '@/lib/preview-utils';
import { useToast } from '@/hooks/use-toast';

export function WebsitePreview({ url, css, mode, showComparison, onError }: WebsitePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isFallback, setIsFallback] = useState(false);

  const beforeIframeRef = useRef<HTMLIFrameElement>(null);
  const afterIframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Load website content
  useEffect(() => {
    if (!url || !validateUrl(url)) {
      setHtmlContent('');
      setError('');
      return;
    }

    const loadWebsite = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, css: '' }), // Load without CSS first
        });

        const data: PreviewApiResponse = await response.json();

        if (!data.success) {
          setError(data.error || 'Failed to load website');
          onError?.(data.error || 'Failed to load website');
          return;
        }

        setHtmlContent(data.html || '');
        setIsFallback(data.fallback || false);

        // Show info about demo mode
        if (!data.fallback) {
          toast({
            title: 'Demo Mode Active',
            description:
              'Previewing on a demo website. Your CSS will work on any website when downloaded.',
            variant: 'default',
          });
        }
      } catch (err) {
        console.error('Preview error:', err);
        setError('Failed to load website preview');
        onError?.('Failed to load website preview');
      } finally {
        setIsLoading(false);
      }
    };

    loadWebsite();
  }, [url, toast, onError]);

  // Update CSS in after iframe
  useEffect(() => {
    if (!afterIframeRef.current || !css || isFallback) return;

    try {
      afterIframeRef.current.contentWindow?.postMessage(
        {
          type: 'UPDATE_CSS',
          css: css,
        },
        '*'
      );
    } catch (err) {
      console.error('Failed to update CSS:', err);
    }
  }, [css, isFallback]);

  const dimensions = PREVIEW_DIMENSIONS[mode];

  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading website...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
          <div className="text-center max-w-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      );
    }

    if (!htmlContent && !url) {
      return (
        <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
          <div className="text-center">
            <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Enter a website URL to preview</p>
          </div>
        </div>
      );
    }

    if (!htmlContent) return null;

    const iframeStyle: React.CSSProperties =
      mode !== 'desktop'
        ? {
            width: dimensions.width,
            height: dimensions.height,
            transform: `scale(${dimensions.scale})`,
            transformOrigin: 'top center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          }
        : {
            width: '100%',
            height: '100%',
          };

    return (
      <div className="h-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        {showComparison ? (
          <div className="flex h-full w-full">
            <div className="flex-1 flex flex-col">
              <div className="text-center py-2 bg-black/20 text-xs font-medium text-gray-400">
                Before
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
                <iframe
                  ref={beforeIframeRef}
                  srcDoc={htmlContent}
                  style={iframeStyle}
                  className="bg-white"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  title="Website Preview - Before"
                />
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1 flex flex-col">
              <div className="text-center py-2 bg-black/20 text-xs font-medium text-primary">
                After
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
                <iframe
                  ref={afterIframeRef}
                  srcDoc={htmlContent.replace(
                    'id="custom-css"></style>',
                    `id="custom-css">${css}</style>`
                  )}
                  style={iframeStyle}
                  className="bg-white"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  title="Website Preview - After"
                />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={afterIframeRef}
            srcDoc={htmlContent.replace(
              'id="custom-css"></style>',
              `id="custom-css">${css}</style>`
            )}
            style={iframeStyle}
            className="bg-white"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Website Preview"
          />
        )}
      </div>
    );
  };

  return <>{renderPreviewContent()}</>;
}

export function PreviewControls({
  mode,
  onModeChange,
  showComparison,
  onComparisonToggle,
  url,
}: {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  showComparison: boolean;
  onComparisonToggle: () => void;
  url: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Live Preview</h2>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Open Original
          </a>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={showComparison ? 'default' : 'outline'}
          size="sm"
          onClick={onComparisonToggle}
        >
          {showComparison ? 'Side by Side' : 'Single View'}
        </Button>
        <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-lg">
          <Button
            variant={mode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('desktop')}
            className="p-2"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={mode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('tablet')}
            className="p-2"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={mode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('mobile')}
            className="p-2"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
