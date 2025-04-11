"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import mammoth from 'mammoth'
import { pdfjs } from 'react-pdf'

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void
  maxFileSize?: number // in bytes, defaults to 5MB
}

export default function FileUpload({ onTextExtracted, maxFileSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [isPdfReady, setIsPdfReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        setIsPdfReady(true)
      } catch (error) {
        console.error('Error initializing PDF.js worker:', error)
      }
    }
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    if (file) {
      await processFile(file)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const extractDocxText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (!result.value.trim()) {
        throw new Error("No readable text could be extracted from the DOCX file.");
      }
      
      return result.value;
    } catch (error) {
      console.error("Error extracting DOCX text:", error);
      throw new Error("Failed to extract text from DOCX. Please ensure the file is not corrupted.");
    }
  }

  const extractPdfText = async (file: File): Promise<string> => {
    if (!isPdfReady) {
      throw new Error("PDF processor is not ready. Please try again in a moment.");
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      
      loadingTask.onPassword = () => {
        throw new Error("This PDF is password protected. Please provide an unprotected PDF.");
      };

      const pdf = await loadingTask.promise;
      
      if (pdf.numPages === 0) {
        throw new Error("The PDF file appears to be empty");
      }

      let fullText = '';
      let hasExtractableText = false;
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .filter((item: any) => item.str && typeof item.str === 'string')
          .map((item: any) => item.str)
          .join(' ')
          .trim();

        if (pageText) {
          hasExtractableText = true;
          fullText += pageText + '\n\n';
        }
      }
      
      const cleanedText = fullText
        .trim()
        .replace(/(\r\n|\n|\r){3,}/g, '\n\n')
        .replace(/\s+/g, ' ')
        .trim();

      if (!hasExtractableText) {
        throw new Error(
          "This appears to be a scanned or image-based PDF with no extractable text. " +
          "Please try using OCR software first, or manually type/paste the content."
        );
      }

      return cleanedText;
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      
      // Handle specific PDF.js errors
      if (error instanceof Error) {
        if (error.message.includes("password")) {
          throw new Error("This PDF is password protected. Please provide an unprotected PDF.");
        }
        if (error.name === "MissingPDFException") {
          throw new Error("This file appears to be corrupted or is not a valid PDF.");
        }
        if (error.name === "InvalidPDFException") {
          throw new Error("This file is not a valid PDF or is severely corrupted.");
        }
        if (error.message.includes("scanned") || error.message.includes("image-based")) {
          throw error; // Re-throw our custom scanned PDF error
        }
      }
      
      throw new Error("Failed to extract text from PDF. The file might be corrupted or in an unsupported format.");
    }
  }

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    
    // Handle PDFs that come as octet-stream
    const isPdf = file.type === 'application/pdf' || 
      (file.type === 'application/octet-stream' && file.name.toLowerCase().endsWith('.pdf'))
    
    if (!isPdf && !validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF, DOCX, or TXT file.')
    }
    if (file.size > maxFileSize) {
      throw new Error(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit.`)
    }
  }

  const processFile = async (file: File) => {
    try {
      validateFile(file)
      setCurrentFile(file)
      setIsLoading(true)

      let extractedText = ''
      if (file.type === 'application/pdf') {
        extractedText = await extractPdfText(file)
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractDocxText(file)
      } else if (file.type === 'text/plain') {
        extractedText = await file.text()
      }

      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the file.')
      }

      onTextExtracted(extractedText, file.name)
      toast({
        title: "Success!",
        description: "Text has been successfully extracted from your file.",
      })
    } catch (error) {
      console.error('Error processing file:', error)
      setCurrentFile(null)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsDragging(false)
    }
  }

  const handleRemoveFile = () => {
    setCurrentFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx,.txt"
        className="hidden"
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="mt-2 text-sm text-gray-500">Processing your file...</p>
        </div>
      ) : currentFile ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Upload className="h-6 w-6 text-blue-500" />
            <span className="ml-2 text-sm text-gray-600">{currentFile.name}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Drag and drop your file here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Supports PDF, DOCX, and TXT files up to {maxFileSize / (1024 * 1024)}MB
          </p>
        </button>
      )}
    </div>
  )
}

