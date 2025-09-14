"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Loader2, CheckCheck, Copy, Wand2, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateCoverLetter } from "@/utils/generate-cover-letter"
import FileUpload from "@/components/file-upload"
import { AIInputWithSuggestions } from "@/components/ui/ai-input-with-suggestions"
import { BorderTrail } from "@/components/ui/border-trail"
import { cn } from "@/lib/utils"

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
      const result = await generateCoverLetter(resumeText, trimmedJobDescription)
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
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="border-gray-800/30 bg-gray-900/20 backdrop-blur-sm shadow-2xl animate-fade-in-up">
          <CardContent className="p-8">
            <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-200 flex items-center animate-fade-in-up">
              <FileText className="mr-3 h-6 w-6 text-blue-400 animate-pulse" />
              Your Resume
            </h2>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-gray-800/50 p-1 rounded-lg border border-gray-700/50">
                <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 transition-all duration-200">
                  <FileText className="h-4 w-4" />
                  <span>Upload Resume</span>
                </TabsTrigger>
                <TabsTrigger value="paste" className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 transition-all duration-200">
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
                <h3 className="text-xl font-semibold text-gray-200 flex items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <Settings className="mr-2 h-5 w-5 text-purple-400 animate-pulse" />
                  Job Description
                </h3>
                <div className="space-y-4">
                  <AIInputWithSuggestions
                    placeholder="Paste the job description here..."
                    minHeight={200}
                    maxHeight={400}
                    actions={jobDescriptionActions}
                    onSubmit={handleJobDescriptionSubmit}
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateCoverLetter}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-4 text-lg border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-gradient-x"
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
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800/30 bg-gray-900/20 backdrop-blur-sm shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center text-gray-200">
                <FileText className="mr-2 h-6 w-6 text-blue-400 animate-pulse" />
                Generated Cover Letter
              </h3>
              {coverLetter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-9 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 hover:scale-105"
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
              )}
            </div>

            <div
              ref={letterRef}
              className={cn(
                "min-h-[500px] p-8 rounded-xl border border-gray-700/30 bg-gray-900/10 backdrop-blur-sm transition-all duration-300",
                !coverLetter && "flex items-center justify-center"
              )}
            >
              {coverLetter ? (
                <div className="whitespace-pre-line font-serif text-gray-100 leading-relaxed animate-fade-in-up">
                  {coverLetter.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="relative">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-30 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-blue-500/10 animate-ping"></div>
                    </div>
                  </div>
                  <p className="text-lg mb-2 animate-fade-in-up">Your cover letter will appear here</p>
                  <p className="text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Upload your resume and provide a job description to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 