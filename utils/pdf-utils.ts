export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/extract-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to extract text from PDF');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to extract text from PDF. The file might be corrupted or in an unsupported format.'
    );
  }
} 