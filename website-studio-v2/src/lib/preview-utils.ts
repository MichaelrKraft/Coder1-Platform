import { PreviewError } from '@/types/preview';

export function validateUrl(url: string): boolean {
  try {
    // Add https:// if no protocol is specified
    const urlToValidate = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const parsed = new URL(urlToValidate);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  try {
    // Add https:// if no protocol is specified
    const urlToSanitize = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const parsed = new URL(urlToSanitize);
    // Remove any potentially harmful parts
    parsed.hash = '';
    parsed.username = '';
    parsed.password = '';
    return parsed.toString();
  } catch {
    return '';
  }
}

export function injectCssIntoHtml(html: string, css: string): string {
  // Find the closing </head> tag and inject our CSS before it
  const headEndIndex = html.toLowerCase().lastIndexOf('</head>');

  if (headEndIndex === -1) {
    // If no head tag, try to add it after <html>
    const htmlIndex = html.toLowerCase().indexOf('<html');
    if (htmlIndex !== -1) {
      const htmlEndIndex = html.indexOf('>', htmlIndex);
      return (
        html.slice(0, htmlEndIndex + 1) +
        `<head><style id="custom-css">${css}</style></head>` +
        html.slice(htmlEndIndex + 1)
      );
    }
    // As a last resort, just prepend
    return `<style id="custom-css">${css}</style>${html}`;
  }

  const customStyle = `<style id="custom-css">${css}</style>`;
  return html.slice(0, headEndIndex) + customStyle + html.slice(headEndIndex);
}

export function getErrorMessage(error: PreviewError): string {
  switch (error.type) {
    case 'cors':
      return 'This website blocks cross-origin requests. Try using the Chrome extension or downloading the CSS to apply manually.';
    case 'network':
      return 'Failed to connect to the website. Please check the URL and try again.';
    case 'invalid-url':
      return 'Please enter a valid website URL starting with http:// or https://';
    case 'blocked':
      return 'This website prevents embedding in iframes. You can still generate and download the CSS to apply manually.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

export function createFallbackHtml(url: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: #f5f5f5;
          color: #333;
        }
        .error-container {
          text-align: center;
          padding: 2rem;
          max-width: 500px;
        }
        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        h2 {
          margin: 0 0 1rem 0;
          color: #1a1a1a;
        }
        p {
          margin: 0 0 1rem 0;
          line-height: 1.6;
          color: #666;
        }
        .url {
          font-family: monospace;
          background: #e5e5e5;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h2>Preview Unavailable</h2>
        <p>${message}</p>
        <p class="url">${url}</p>
      </div>
    </body>
    </html>
  `;
}

export function isLocalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.endsWith('.local')
    );
  } catch {
    return false;
  }
}
