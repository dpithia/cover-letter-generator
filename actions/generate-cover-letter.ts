"use server"

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCoverLetter(resumeText: string, jobDescription: string): Promise<string> {
  try {
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

    console.log("Sending request to OpenAI API with enhanced prompt...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const text = completion.choices[0].message.content;

    console.log("Received response from OpenAI API");

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

