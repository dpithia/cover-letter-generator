"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import mammoth from 'mammoth'

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void
  maxFileSize?: number // in bytes, defaults to 5MB
}

export default function FileUpload({ onTextExtracted, maxFileSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pdfjs, setPdfjs] = useState<any>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        // Use a specific version of the worker from CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfjs(pdfjsLib);
      } catch (error) {
        console.error('Error loading PDF.js:', error);
      }
    };
    loadPdfJs();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const extractDocxText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value.trim();
    } catch (error) {
      console.error("Error extracting DOCX text:", error);
      throw new Error("Failed to extract text from DOCX file. Please try copying and pasting the content manually.");
    }
  }

  const extractPdfText = async (file: File): Promise<string> => {
    if (!pdfjs) {
      throw new Error("PDF.js is not initialized yet. Please try again.");
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      // Extract text from each page with improved formatting
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items by their y-coordinate to maintain layout
        const textItems = textContent.items.reduce((lines: any, item: any) => {
          const y = Math.round(item.transform[5]); // y-coordinate
          if (!lines[y]) {
            lines[y] = [];
          }
          lines[y].push(item.str);
          return lines;
        }, {});

        // Sort by y-coordinate (top to bottom) and join lines
        const sortedKeys = Object.keys(textItems).sort((a, b) => Number(b) - Number(a));
        const pageText = sortedKeys.map(y => textItems[y].join(' ')).join('\n');
        
        fullText += pageText + '\n\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      throw new Error("Failed to extract text from PDF. Please try copying and pasting the content manually.");
    }
  }

  const readFileAsText = async (file: File): Promise<string> => {
    // Check file size
    if (file.size > maxFileSize) {
      throw new Error(`File size exceeds the maximum limit of ${Math.round(maxFileSize / 1024 / 1024)}MB`);
    }

    console.log(`Processing file: ${file.name} (${Math.round(file.size / 1024)}KB)`);

    if (file.type === "application/pdf") {
      return await extractPdfText(file);
    }

    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return await extractDocxText(file);
    }

    // For TXT files, read directly
    try {
      const text = await file.text();
      if (!text.trim()) {
        throw new Error("The file appears to be empty");
      }
      return text;
    } catch (error) {
      console.error("Error reading file:", error);
      throw new Error("Failed to read file content. Please ensure the file is not corrupted.");
    }
  }

  const handleFile = async (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file",
        variant: "destructive",
      })
      return
    }

    setCurrentFile(file)
    setIsLoading(true)
    try {
      const text = await readFileAsText(file)
      console.log(`Successfully extracted ${text.length} characters from ${file.name}`);
      
      if (!text.trim()) {
        throw new Error("No text could be extracted from the file");
      }

      onTextExtracted(text, file.name)
      
      toast({
        title: "File processed successfully",
        description: `Text has been extracted from your ${file.type === "application/pdf" ? "PDF" : 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? "DOCX" : "TXT"} file`,
      })
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error extracting text",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      setCurrentFile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent div's onClick
    setCurrentFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onTextExtracted('', '') // Clear the extracted text
    toast({
      title: "File removed",
      description: "You can now upload a different file",
    })
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf,.docx,.txt" 
          className="hidden" 
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <div className="text-sm font-medium">Processing file...</div>
            </>
          ) : currentFile ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-primary truncate max-w-[200px]" title={currentFile.name}>
                  {currentFile.name}
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                  title="Remove file"
                >
                  <X className="h-5 w-5 text-destructive" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Click to upload a different file</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm font-medium">
                <span className="text-primary">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (max 5MB)</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

