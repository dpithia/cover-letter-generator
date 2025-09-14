import { model, withRetry } from './ai-config';

// Define customization options interface
interface CoverLetterOptions {
  tone?: 'formal' | 'conversational' | 'technical';
  focusAreas?: ('technical' | 'leadership' | 'creativity' | 'growth')[];
  length?: 'concise' | 'standard' | 'detailed';
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  options: CoverLetterOptions = {}
): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google API key is not configured")
    }

    const trimmedResumeText = resumeText.trim()
    const trimmedJobDescription = jobDescription.trim()

    if (!trimmedResumeText || !trimmedJobDescription) {
      throw new Error("Resume text and job description are required")
    }

    // Define tone guides based on options
    const toneGuide = {
      formal: 'Use formal language and traditional business writing style.',
      conversational: 'Maintain professional but approachable tone.',
      technical: 'Emphasize technical expertise and use industry-specific terminology.'
    };

    // Get word count based on length option
    const wordCountGuide = {
      concise: '250-300',
      standard: '300-400',
      detailed: '400-450'
    };

    const exemplarCoverLetters = `
EXEMPLAR COVER LETTERS FROM TOP TECH COMPANIES:

Example 1 - Meta SWE Intern:
Resume: "Second-year CS student at Waterloo. Developed 'WanderMap' using Next.js and Firebase with 5,000+ monthly users. Shopify internship with React, GraphQL, TypeScript. Hack the North winner."
Letter: "Dear Hiring Manager,
I am a second-year Computer Science student at the University of Waterloo, excited to apply for the Software Engineering Internship at Meta. With a solid foundation in full-stack development and hands-on experience from my internship at Shopify, I am eager to contribute to Meta's mission of building impactful and scalable technology.
My project, WanderMap, is a full-stack application developed using Next.js and Firebase, which has garnered over 5,000 monthly users. At Shopify, I contributed to internal React components and integrated new GraphQL endpoints, improving form performance by 35%.
I am deeply interested in distributed systems and have explored backend scalability using Docker and serverless architectures in personal projects. Additionally, my participation in Hack the North 2024, where I led a cloud-native app build using Google Cloud Platform and Firestore, showcases my initiative and technical skills.
Meta's scale and emphasis on innovation are aspects I am eager to engage with. I look forward to the opportunity to learn from Meta's engineering teams and contribute to projects that impact billions of users.
Sincerely, [Name]"

Example 2 - Google ML Research Intern:
Resume: "CS and Stats major at Berkeley. NLP research assistant working on BERT fine-tuning. Created ML-powered Chrome extension with OpenAI. Published in Berkeley AI Journal."
Letter: "Dear Hiring Manager,
I am excited to apply for the Machine Learning Research Intern position at Google. As a Computer Science and Statistics major at UC Berkeley with hands-on research experience in NLP and deep learning, I am eager to contribute to Google's innovative AI projects.
In my role as a research assistant, I fine-tuned BERT models for sentiment classification, achieving an 8% improvement in F1 scores across multi-domain datasets. I also developed a Chrome extension that utilizes OpenAI's API to summarize YouTube transcripts, aiding over 3,000 users in digesting long-form content.
My technical toolkit includes TensorFlow, PyTorch, and scikit-learn, and I have experience in both experimental research and deployment. My academic background in machine learning and statistics complements my practical skills.
I am inspired by Google's commitment to open research and scalable AI solutions. I would welcome the opportunity to contribute to your team and further develop my skills in a collaborative environment.
Sincerely, [Name]"

KEY PATTERNS TO NOTICE:
1. Strong Technical Opening: Immediately establish relevant background
2. Quantified Achievements: User counts, performance improvements, specific metrics
3. Technical Depth: Named technologies, frameworks, and methodologies
4. Company Knowledge: Reference to company's scale, mission, or specific initiatives
5. Growth Mindset: Express enthusiasm for learning and contributing
`;

    const csContext = `
APPLICANT CONTEXT:
- Computer Science student with a technical background in software engineering, system design, and project development.
- Experience may include: React, Python, Java, AWS, Git, Agile, databases, ML models, CI/CD, etc.
- Projects and internships should reflect real-world impact, collaboration, and modern development practices.

HIRING CONTEXT:
- Target roles may include SWE, ML/AI, Cloud, Security, or Full Stack.
- Companies value: system design, technical depth, version control, agile dev, real-world problem solving, measurable results.

EMPHASIS:
- Align candidate skills to job requirements with clear, quantified accomplishments.
- Use action-oriented language, focus on technical growth, teamwork, and ownership.
`;

    const exampleTransformations = `
TRANSFORM BASIC RESPONSES INTO ELITE ONES:
Use this technique to turn average technical phrases into specific, quantified achievements.

Example 1:
"I worked with microservices."
→ "Built a distributed billing service using Dockerized microservices, reducing deployment time by 60% and handling 10k+ requests/day."

Example 2:
"I know React and JavaScript."
→ "Built a real-time task manager with React 18 + TypeScript, using Redux Toolkit and WebSocket for instant sync across devices."

Example 3:
"I have experience with AWS."
→ "Deployed a multi-region app with AWS Lambda and S3, reducing latency by 40% and enabling auto-scaling with zero-downtime updates."
`;

    const prompt = `
You are a top-tier AI cover letter generator for CS students. Given a resume and job description, write a personalized, highly technical cover letter for a Software/CS-related role. Study the exemplar cover letters carefully and follow their patterns.

Guidelines:
- Length: ${options.length ? wordCountGuide[options.length] : wordCountGuide.standard} words
- Tone: ${options.tone ? toneGuide[options.tone] : toneGuide.conversational}
- Focus: ${options.focusAreas?.join(', ') || 'balanced'}
- Salutation: "Dear Hiring Manager,"
- Closing: "Sincerely, [Name]"

Output Requirements:
- Mention the company and role in the first paragraph
- Highlight 1–2 technical projects or internships
- Quantify impact wherever possible (metrics, scale, improvement)
- Reference relevant skills/tools from resume + job description
- End with a confident, eager closing

${csContext}

${exemplarCoverLetters}

Resume:
${trimmedResumeText}

Job Description:
${trimmedJobDescription}

${exampleTransformations}

Use precise technical terminology and tailor everything to the role. Do not include commentary or extra text—only return the final cover letter.
`;

    console.log("Sending request to Gemini API with enhanced prompt...");

    const result = await withRetry(async () => {
      const response = await model.generateContent(prompt);
      return response;
    });

    const text = result.response.text();
    console.log("Received response from Gemini API");

    if (!text || text.trim() === "") {
      throw new Error("Failed to generate cover letter: Empty response from API");
    }

    return text;
  } catch (error) {
    console.error("Error generating cover letter:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key is not configured")) {
        throw new Error("Google API key is not configured. Please check your environment variables.");
      }

      if (error.message.startsWith("Gemini API Error:") ||
          error.message.startsWith("Failed to generate") ||
          error.message.includes("Please check") ||
          error.message.includes("Please revise")) {
        throw error;
      }
    }

    throw new Error("Failed to generate cover letter. Please try again.");
  }
}