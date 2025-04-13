'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PDFUploader() {
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    setExtractedText('');
    setNumPages(0);

    try {
      // Simple health check
      const healthCheck = await fetch('/api/extract');
      if (!healthCheck.ok) {
        throw new Error('Service is not available');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else if (!result.text) {
        setError('No text could be extracted from the PDF');
      } else {
        setExtractedText(result.text);
        setNumPages(result.numPages);
      }
    } catch (err) {
      setError(`Failed to process PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => document.getElementById('pdf-input')?.click()}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Upload PDF'}
        </Button>
        <input
          id="pdf-input"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm p-4 border border-red-200 rounded-lg bg-red-50">
          {error}
        </div>
      )}

      {extractedText && (
        <div className="border rounded-lg p-4 bg-muted">
          <h3 className="font-medium mb-2">
            Extracted Text {numPages > 0 && `(${numPages} page${numPages === 1 ? '' : 's'})`}:
          </h3>
          <div className="whitespace-pre-wrap text-sm">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
} 