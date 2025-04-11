declare module 'pdf-to-text' {
  export function pdfToText(
    pdfPath: string,
    options: { from?: number; to?: number } | ((err: Error | null, data: string) => void),
    callback?: (err: Error | null, data: string) => void
  ): void;

  export function info(
    pdfPath: string,
    callback: (err: Error | null, info: {
      title?: string;
      subject?: string;
      author?: string;
      creator?: string;
      producer?: string;
      creationdate?: number;
      moddate?: number;
      tagged?: string;
      form?: string;
      pages?: number;
      encrypted?: string;
      page_size?: string;
      file_size?: string;
      optimized?: string;
      pdf_version?: string;
    }) => void
  ): void;
} 