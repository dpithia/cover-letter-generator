"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Loader2, CheckCheck, Copy, Wand2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateCoverLetter } from "@/actions/generate-cover-letter"
import FileUpload from "@/components/file-upload"
import { AIInputWithSuggestions } from "@/components/ui/ai-input-with-suggestions"
import { BorderTrail } from "@/components/ui/border-trail"
import { cn } from "@/lib/utils"
import { SaveLetterDialog } from "@/components/ui/save-letter-dialog"
import { saveCoverLetter } from "@/app/actions/save-cover-letter"

export default function NeuralLetterGenerator() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const { toast } = useToast()
  const letterRef = useRef<HTMLDivElement>(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleFileTextExtracted = (text: string, fileName: string) => {
    console.log('Extracted Resume Text:', text);
    if (!text || text === "Please paste your resume content in the text area for better results.") {
      toast({
        title: "Warning",
        description: "The resume text couldn't be extracted automatically. Please paste it manually.",
        variant: "destructive",
      })
      return;
    }
    setResumeText(text)
    setUploadedFileName(fileName)
    toast({
      title: "Resume uploaded successfully",
      description: `Extracted text from ${fileName}`,
    })
  }

  const handleGenerateCoverLetter = async () => {
    if (!resumeText.trim() || resumeText === "Please paste your resume content in the text area for better results.") {
      toast({
        title: "Resume required",
        description: "Please upload your resume or paste your resume text",
        variant: "destructive",
      })
      return
    }

    const trimmedJobDescription = jobDescription.trim();
    if (!trimmedJobDescription) {
      toast({
        title: "Job description required",
        description: "Please paste the job description",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("Generating letter with job description length:", trimmedJobDescription.length);
      const result = await generateCoverLetter(resumeText, trimmedJobDescription)
      console.log("Letter generated successfully")
      setCoverLetter(result)
      toast({
        title: "Success!",
        description: "Your letter has been generated",
      })
    } catch (error) {
      console.error("Error in component:", error)
      toast({
        title: "Error generating letter",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter)
    toast({
      title: "Copied to clipboard",
      description: "Your letter has been copied to clipboard",
    })
    setIsCopied(true)
  }

  const handleJobDescriptionSubmit = (text: string, action?: string) => {
    const trimmedText = text.trim();
    if (trimmedText) {
      setJobDescription(trimmedText);
      if (action) {
        toast({
          title: `Action: ${action}`,
          description: "This action would typically trigger an AI enhancement",
        });
      }
    }
  }

  const handleSaveLetter = async (name: string) => {
    try {
      await saveCoverLetter({
        name,
        content: coverLetter,
        resumeText,
        jobDescription,
      })
      
      toast({
        title: "Cover Letter Saved",
        description: `Successfully saved "${name}" to your account`,
      })
    } catch (error) {
      console.error('Error saving cover letter:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save cover letter",
        variant: "destructive",
      })
    }
  }

  const jobDescriptionActions = [
    {
      text: "Identify Key Requirements",
      icon: CheckCheck,
      colors: {
        icon: "text-emerald-600",
        border: "border-emerald-500",
        bg: "bg-emerald-100",
      },
    },
    {
      text: "Suggest Keywords",
      icon: Wand2,
      colors: {
        icon: "text-blue-600",
        border: "border-blue-500",
        bg: "bg-blue-100",
      },
    },
    {
      text: "Extract Skills",
      icon: FileText,
      colors: {
        icon: "text-purple-600",
        border: "border-purple-500",
        bg: "bg-purple-100",
      },
    },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cover Letter Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create a professional cover letter in minutes. Upload your resume and provide a job description to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border bg-background shadow-sm">
          <CardContent className="p-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Upload Resume</span>
                </TabsTrigger>
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Paste Resume</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-2">
                <FileUpload onTextExtracted={handleFileTextExtracted} />
              </TabsContent>

              <TabsContent value="paste" className="mt-2">
                <Textarea
                  placeholder="Paste your resume text here..."
                  className="min-h-[200px]"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                {activeTab === "paste" && uploadedFileName && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <FileText size={16} />
                    <span>Content from: {uploadedFileName}</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Job Description</h3>
                <div className="rounded-md">
                  <AIInputWithSuggestions
                    placeholder="Paste the job description here..."
                    minHeight={100}
                    maxHeight={300}
                    actions={jobDescriptionActions}
                    onSubmit={handleJobDescriptionSubmit}
                  />
                  {jobDescription && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="font-medium text-sm mb-1">Current Job Description:</p>
                      <p className="text-sm">{jobDescription}</p>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleGenerateCoverLetter} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-background shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Generated Cover Letter
              </h3>
              {coverLetter && (
                <div className="flex gap-2">
                  <SaveLetterDialog onSave={handleSaveLetter} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8"
                  >
                    {isCopied ? (
                      <>
                        <CheckCheck className="mr-1 h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div 
              ref={letterRef}
              className={cn(
                "min-h-[500px] p-6 rounded-lg border border-border bg-card/50",
                !coverLetter && "flex items-center justify-center"
              )}
            >
              {coverLetter ? (
                <div className="whitespace-pre-line font-serif">
                  {coverLetter.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Your cover letter will appear here after generation</p>
                  <p className="text-sm mt-2">Upload your resume and provide a job description to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 