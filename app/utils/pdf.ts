import { Buffer } from 'buffer';
import pdfParse from 'pdf-parse';

export type PDFExtractResult = {
  text: string;
  numPages: number;
  error?: string;
};

/**
 * Extracts text from a PDF buffer
 * @param buffer - The PDF file buffer to process
 * @returns Promise<PDFExtractResult> - The extracted text and metadata
 */
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<PDFExtractResult> {
  try {
    // Convert ArrayBuffer to Buffer
    const pdfBuffer = Buffer.from(buffer);
    
    // Parse PDF
    const data = await pdfParse(pdfBuffer);

    return {
      text: data.text,
      numPages: data.numpages
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return {
      text: '',
      numPages: 0,
      error: error instanceof Error ? error.message : 'Failed to extract text from PDF'
    };
  }
} 