"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void
}

export default function FileUpload({ onTextExtracted }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

  // Simplified approach - read file as text for all formats
  const readFileAsText = async (file: File): Promise<string> => {
    // For PDFs, we'll use a simpler approach - just inform the user
    if (file.type === "application/pdf") {
      toast({
        title: "PDF detected",
        description: "Please copy and paste the content from your PDF for best results",
      })
      return "Please paste your resume content in the text area for better results."
    }

    // For DOCX, inform the user
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast({
        title: "DOCX detected",
        description: "Please copy and paste the content from your DOCX file for best results",
      })
      return "Please paste your resume content in the text area for better results."
    }

    // For TXT files, read directly
    try {
      return await file.text()
    } catch (error) {
      console.error("Error reading file:", error)
      throw new Error("Failed to read file content")
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

    setIsLoading(true)
    try {
      const text = await readFileAsText(file)
      onTextExtracted(text, file.name)
    } catch (error) {
      toast({
        title: "Error extracting text",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.txt" className="hidden" />
        <div className="flex flex-col items-center justify-center space-y-2">
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <div className="text-sm font-medium">Processing file...</div>
            </>
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

