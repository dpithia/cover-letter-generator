import { NextRequest, NextResponse } from 'next/server';
import * as pdfUtil from 'pdf-to-text';
import { promisify } from 'util';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const pdfToTextAsync = promisify(pdfUtil.pdfToText);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create a temporary file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}.pdf`);
    
    // Convert File to Buffer and write to temp file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFileAsync(tempFilePath, buffer);

    try {
      // Extract text from PDF
      const text = await pdfToTextAsync(tempFilePath);
      
      if (!text || typeof text !== 'string') {
        throw new Error('No text could be extracted from the PDF file.');
      }

      // Clean up the extracted text
      const cleanedText = text
        .trim()
        .replace(/(\r\n|\n|\r){3,}/g, '\n\n')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanedText) {
        throw new Error('The PDF appears to be empty or contains no extractable text.');
      }

      return NextResponse.json({ text: cleanedText });
    } finally {
      // Clean up: Delete the temporary file
      try {
        await unlinkAsync(tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to extract text from PDF. The file might be corrupted or in an unsupported format.'
      },
      { status: 500 }
    );
  }
} 