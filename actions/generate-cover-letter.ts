"use server"

import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function generateCoverLetter(resumeText: string, jobDescription: string): Promise<string> {
  try {
    // Trim and validate inputs
    const trimmedResumeText = resumeText.trim()
    const trimmedJobDescription = jobDescription.trim()

    if (!trimmedResumeText || !trimmedJobDescription) {
      throw new Error("Resume text and job description are required")
    }

    const prompt = `
You are a professional cover letter writer. Your task is to create a personalized cover letter based on the provided resume and job description.

Resume:
${trimmedResumeText}

Job Description:
${trimmedJobDescription}

Instructions:
1. Analyze the resume to identify the candidate's skills, experience, and qualifications.
2. Analyze the job description to understand the key requirements and responsibilities.
3. Create a personalized cover letter that highlights how the candidate's qualifications match the job requirements.
4. Use a professional tone and format the letter properly with appropriate sections.
5. Keep the cover letter concise (around 300-400 words).
6. Do not include the current date.
7. Use "Hiring Manager" as the salutation if no specific name is provided.
8. Include a proper closing with "Sincerely," followed by a placeholder for the candidate's name.

Please provide only the cover letter text without any additional commentary.
`

    console.log("Sending request to Claude API...")

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
      maxTokens: 1500,
    })

    console.log("Received response from Claude API")

    if (!text || text.trim() === "") {
      throw new Error("Failed to generate cover letter: Empty response from API")
    }

    return text
  } catch (error) {
    console.error("Error generating cover letter:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        throw new Error("API authentication failed. Please check your API key.")
      } else if (error.message.includes("429")) {
        throw new Error("API rate limit exceeded. Please try again later.")
      } else if (error.message.includes("500")) {
        throw new Error("API server error. Please try again later.")
      }
    }

    throw new Error("Failed to generate cover letter. Please try again.")
  }
}

