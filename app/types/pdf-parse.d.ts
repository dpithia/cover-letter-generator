declare module 'pdf-parse' {
  interface PDFParseResult {
    text: string;
    numpages: number;
  }
  
  function parse(buffer: Buffer): Promise<PDFParseResult>;
  export default parse;
} 