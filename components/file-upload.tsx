"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import mammoth from 'mammoth'
import { extractTextFromPdf } from '@/utils/pdf-utils'

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
      if (file.type === 'application/pdf' || 
          (file.type === 'application/octet-stream' && file.name.toLowerCase().endsWith('.pdf'))) {
        extractedText = await extractTextFromPdf(file)
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
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
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
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Processing your file...</p>
        </div>
      ) : currentFile ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Upload className="h-6 w-6 text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">{currentFile.name}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-1 hover:bg-muted rounded-full"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-32 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-medium">Click to upload</span> or drag and drop
              <br />
              PDF, DOCX, or TXT files
            </p>
          </button>
        </div>
      )}
    </div>
  )
}

