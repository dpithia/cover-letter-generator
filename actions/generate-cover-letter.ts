"use server"

import { model, withRetry } from '@/utils/ai-config';

// Validate API key
function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey) {
    throw new Error("Google API key is not configured")
  }
}

export async function generateCoverLetter(resumeText: string, jobDescription: string): Promise<string> {
  try {
    // Validate API key before proceeding
    validateApiKey(process.env.GOOGLE_API_KEY)

    // Trim and validate inputs
    const trimmedResumeText = resumeText.trim()
    const trimmedJobDescription = jobDescription.trim()

    if (!trimmedResumeText || !trimmedJobDescription) {
      throw new Error("Resume text and job description are required")
    }

    console.log("Resume Text received:", trimmedResumeText); // Debug log
    console.log("Job Description received:", trimmedJobDescription); // Debug log

    const prompt = `
You are a professional cover letter writer. Your task is to create a highly personalized cover letter that specifically matches the candidate's resume with the job requirements.

Resume Content (Use this information to personalize the letter):
${trimmedResumeText}

Job Description:
${trimmedJobDescription}

Instructions:
1. Carefully analyze the resume to extract:
   - Specific skills and technologies
   - Work experience and achievements
   - Educational background
   - Any certifications or relevant qualifications

2. Analyze the job description to identify:
   - Key requirements and responsibilities
   - Required skills and qualifications
   - Company values and culture indicators

3. Create a personalized cover letter that:
   - Directly references specific experiences from the resume
   - Shows clear connections between past achievements and job requirements
   - Uses concrete examples from the resume to demonstrate qualifications
   - Maintains a professional yet engaging tone
   - Demonstrates genuine interest in the role

4. Format Requirements:
   - Keep the letter concise (300-400 words)
   - Use "Hiring Manager" as the salutation
   - Include a proper closing with "Sincerely," followed by a placeholder for the candidate's name
   - Do not include the current date

Important: The cover letter must specifically reference actual experiences and qualifications from the provided resume. Do not generate generic content.

Please provide only the cover letter text without any additional commentary.
`

    console.log("Sending request to Gemini API with enhanced prompt...");

    try {
      // Use withRetry to handle rate limiting
      const result = await withRetry(async () => {
        const response = await model.generateContent(prompt);
        return response;
      });

      const text = result.response.text();
      console.log("Received response from Gemini API");

      if (!text || text.trim() === "") {
        throw new Error("Failed to generate cover letter: Empty response from API")
      }

      return text;
    } catch (apiError: any) {
      // Handle specific Gemini API errors
      if (apiError.message?.includes('safety')) {
        throw new Error("Content flagged by safety filters. Please revise your input.");
      }
      if (apiError.message?.includes('invalid')) {
        throw new Error("Invalid request. Please check your input format.");
      }
      // Re-throw the original error with more context
      throw new Error(`Gemini API Error: ${apiError.message}`);
    }
  } catch (error) {
    console.error("Error generating cover letter:", error)

    if (error instanceof Error) {
      // API key validation errors
      if (error.message.includes("API key is not configured")) {
        throw new Error("Google API key is not configured. Please check your environment variables.")
      }

      // If we already have a formatted error message, use it
      if (error.message.startsWith("Gemini API Error:") || 
          error.message.startsWith("Failed to generate") ||
          error.message.includes("Please check") ||
          error.message.includes("Please revise")) {
        throw error;
      }
    }

    // Generic fallback error
    throw new Error("Failed to generate cover letter. Please try again.")
  }
}

