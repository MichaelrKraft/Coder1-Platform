'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Sparkles, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { WebsitePreview, PreviewControls } from '@/components/website-preview';
import type { PreviewMode } from '@/types/preview';
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from '@/types/speech';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCSS, setGeneratedCSS] = useState('');
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [showComparison, setShowComparison] = useState(false);
  const { toast } = useToast();

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleGenerateCSS = async () => {
    if (!transcript.trim() || !websiteUrl.trim()) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/generate-css', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: transcript,
          websiteUrl: websiteUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCSS(data.css);
        setIsAIGenerated(data.metadata?.aiGenerated || false);
        setIsFallback(data.metadata?.fallback || false);

        // Show success notification
        toast({
          title: 'CSS Generated Successfully!',
          description: data.metadata?.aiGenerated
            ? 'AI-powered CSS has been generated from your voice input'
            : 'CSS generated using fallback system',
          variant: data.metadata?.fallback ? 'default' : 'success',
        });
      } else {
        console.error('Failed to generate CSS:', data.error);
        toast({
          title: 'Generation Failed',
          description: 'Failed to generate CSS. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating CSS:', error);
      toast({
        title: 'Network Error',
        description: 'Failed to connect to the server. Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCSS);
      toast({
        title: 'Copied to Clipboard',
        description: 'CSS has been copied to your clipboard',
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy CSS to clipboard',
        variant: 'destructive',
      });
    }
  };

  const downloadCSS = () => {
    const blob = new Blob([generatedCSS], { type: 'text/css' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-styles-${Date.now()}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">
            <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
            <span className="text-sm font-medium text-[#8b5cf6]">AI-Powered CSS Magic</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Transform Any Website</span>
            <br />
            <span className="text-white">With Your Voice</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simply speak your design changes and watch them happen in real-time. The future of web
            customization is here.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Website URL Input */}
            <Card>
              <div className="flex items-center gap-4 mb-4">
                <Globe className="w-5 h-5 text-[#8b5cf6]" />
                <h2 className="text-xl font-semibold">Website URL</h2>
              </div>

              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => {
                  console.log('Key pressed:', e.key);
                  if (e.key === 'Enter') {
                    console.log('Enter key detected!');
                    e.preventDefault();
                    console.log('Event prevented, current URL:', websiteUrl);
                  }
                }}
                placeholder="https://example.com or www.example.com"
                className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-white/10 focus:border-[#8b5cf6] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
              />
            </Card>

            {/* Voice Input */}
            <Card>
              <div className="flex items-center gap-4 mb-4">
                <Zap className="w-5 h-5 text-[#8b5cf6]" />
                <h2 className="text-xl font-semibold">Describe Your Changes</h2>
              </div>

              <div className="space-y-4">
                <div className="min-h-[120px] p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                  {transcript || (
                    <p className="text-gray-500">
                      Click the microphone and say something like:
                      <br />
                      &ldquo;Make the header purple with a gradient&rdquo;
                      <br />
                      &ldquo;Add rounded corners to all buttons&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant={isListening ? 'destructive' : 'gradient'}
                    size="lg"
                    onClick={toggleListening}
                    className="flex-1"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Start Recording
                      </>
                    )}
                  </Button>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleGenerateCSS}
                    disabled={!transcript.trim() || !websiteUrl.trim() || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate CSS
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Generated CSS */}
            {generatedCSS && (
              <Card className="animate-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Generated CSS</h3>
                  <div className="flex items-center gap-2">
                    {isAIGenerated && !isFallback && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">
                        <Sparkles className="w-3 h-3 text-[#8b5cf6]" />
                        <span className="text-xs font-medium text-[#8b5cf6]">AI Generated</span>
                      </div>
                    )}
                    {isFallback && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20">
                        <span className="text-xs font-medium text-[#f59e0b]">Fallback Mode</span>
                      </div>
                    )}
                  </div>
                </div>
                <pre className="p-4 bg-[#1a1a1a] rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{generatedCSS}</code>
                </pre>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    Copy CSS
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadCSS}>
                    Download
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8">
            <Card className="h-[600px] flex flex-col p-0">
              <div className="p-6 pb-4">
                <PreviewControls
                  mode={previewMode}
                  onModeChange={setPreviewMode}
                  showComparison={showComparison}
                  onComparisonToggle={() => setShowComparison(!showComparison)}
                  url={websiteUrl}
                />
              </div>

              <div className="flex-1 overflow-hidden">
                <WebsitePreview
                  url={websiteUrl}
                  css={generatedCSS}
                  mode={previewMode}
                  showComparison={showComparison}
                  onError={(error) => {
                    toast({
                      title: 'Preview Error',
                      description: error,
                      variant: 'destructive',
                    });
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
