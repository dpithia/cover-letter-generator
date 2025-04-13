import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/app/utils/pdf';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Convert File to ArrayBuffer
    const buffer = await file.arrayBuffer();
    const result = await extractTextFromPDF(buffer);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 