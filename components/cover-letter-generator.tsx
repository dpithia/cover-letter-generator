"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateCoverLetter } from "@/actions/generate-cover-letter"
import FileUpload from "@/components/file-upload"

export default function CoverLetterGenerator() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const { toast } = useToast()

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

    console.log('Resume Text being sent:', resumeText);

    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste the job description",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("Generating cover letter...")
      const result = await generateCoverLetter(resumeText, jobDescription)
      console.log("Cover letter generated successfully")
      setCoverLetter(result)
      toast({
        title: "Success!",
        description: "Your cover letter has been generated",
      })
    } catch (error) {
      console.error("Error in component:", error)
      toast({
        title: "Error generating cover letter",
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
      description: "Your cover letter has been copied to clipboard",
    })
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Resume</h2>
            <Tabs defaultValue="upload" onValueChange={setActiveTab} className="text-gray-200">
              <TabsList className="mb-4 bg-gray-800">
                <TabsTrigger value="upload" className="data-[state=active]:bg-gray-700">Upload Resume</TabsTrigger>
                <TabsTrigger value="paste" className="data-[state=active]:bg-gray-700">Paste Resume</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <FileUpload onTextExtracted={handleFileTextExtracted} />
              </TabsContent>
              <TabsContent value="paste">
                <Textarea
                  placeholder="Paste your resume text here..."
                  className="min-h-[200px] bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-400"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                {activeTab === "paste" && uploadedFileName && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                    <FileText size={16} />
                    <span>Content from: {uploadedFileName}</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Job Description</h2>
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[200px] bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-400"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        <Button 
          onClick={handleGenerateCoverLetter} 
          disabled={isLoading} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Cover Letter"
          )}
        </Button>
      </div>

      <div>
        <Card className="h-full bg-gray-900 border-gray-800">
          <CardContent className="pt-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Generated Cover Letter</h2>
              {coverLetter && (
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="border-gray-700 text-gray-200 hover:bg-gray-800">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <div className="bg-gray-800 rounded-md p-4 flex-grow overflow-auto whitespace-pre-wrap text-gray-200">
              {coverLetter ? (
                coverLetter
              ) : (
                <p className="text-gray-400 text-center mt-8">Your generated cover letter will appear here</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

