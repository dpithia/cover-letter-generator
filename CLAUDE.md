# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Architecture

NeuralLetter is a Next.js 14 application that generates personalized cover letters using AI. The app uses Google's Gemini 2.0 Flash model for cover letter generation. The authentication system has been removed for simplicity.

### Key Technologies
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google Gemini API
- **File Processing**: PDF parsing (pdf-parse), DOCX parsing (mammoth)

### Core Architecture

#### File Processing Pipeline
- PDF extraction handled via `/app/api/extract/route.ts` (Node.js runtime required)
- DOCX extraction using mammoth library in client components
- Text files processed directly via browser APIs
- Multi-format support: PDF, DOCX, TXT (5MB max file size)

#### AI Generation System
- Main generation logic in `actions/generate-cover-letter.ts`
- Uses enhanced prompts with exemplar cover letters from top tech companies
- Configurable options: tone (formal/conversational/technical), focus areas, length
- Exponential backoff retry logic in `utils/ai-config.ts`
- Gemini 2.0 Flash model with specific generation config

#### Simplified Architecture
- No authentication required - app works anonymously
- No database persistence - cover letters are generated and copied to clipboard
- Client-side AI generation using utility functions
- Clean, minimal file structure without auth complexity

### Component Structure

#### Main Components
- `components/neural-letter-generator.tsx` - Core cover letter generation interface
- `components/file-upload.tsx` - Multi-format file upload with drag-and-drop

#### UI Components
- shadcn/ui components in `components/ui/`
- Custom components like `AIInputWithSuggestions` for enhanced input
- Toast notifications for user feedback

### Key Configuration

#### Environment Variables
- `NEXT_PUBLIC_GOOGLE_API_KEY` - Required for Gemini AI integration (client-side accessible)

#### Build Configuration
- Custom Next.js config with Node.js runtime for PDF processing
- TypeScript configuration with strict typing
- Tailwind CSS with custom theme and animations


### Development Notes

#### File Upload Processing
- PDF extraction requires Node.js runtime due to pdf-parse dependency
- Client-side DOCX processing using mammoth
- Comprehensive error handling for various file types and corruption scenarios

#### AI Prompt Engineering
- Uses detailed exemplar cover letters from Meta, Google, etc.
- Emphasizes quantified achievements and technical depth
- Customizable tone, length, and focus areas
- Specific patterns for CS/tech industry applications

#### Error Handling
- Comprehensive error handling throughout the application
- User-friendly toast notifications for all operations
- Graceful fallbacks for file processing failures
- API error handling with retry logic

#### Performance Considerations
- Server-side rendering for authenticated routes
- Client-side processing where possible (DOCX, text files)
- Optimized AI model configuration for balance of quality and speed