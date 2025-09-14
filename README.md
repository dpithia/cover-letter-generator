# NeuralLetter

<div align="center">

![NeuralLetter Logo](https://img.shields.io/badge/NeuralLetter-AI%20Powered%20Cover%20Letter%20Generator-blue?style=for-the-badge&logo=google&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Made with Next.js](https://img.shields.io/badge/ Made%20with-Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Transform your resume into compelling cover letters with advanced AI.**

[Features](#-features) • [Demo](#-demo) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

NeuralLetter is a sophisticated AI-powered cover letter generator that leverages Google's Gemini 2.0 Flash model to create personalized, professional cover letters tailored to specific job descriptions. Built with modern web technologies, it provides a seamless user experience with multi-format resume upload support and intelligent content generation.

### ✨ Key Benefits

- **AI-Powered Generation**: Advanced language model creates contextually relevant cover letters
- **Multi-Format Support**: Upload PDF, DOCX, or TXT files with intelligent text extraction
- **Professional Quality**: Exemplar-based prompts ensure high-quality, industry-standard output
- **User-Friendly Interface**: Modern, responsive design with intuitive workflow
- **Privacy-Focused**: No authentication required - your data stays private
- **Fast & Efficient**: Optimized for quick generation with minimal latency

---

## 🚀 Features

### Core Functionality
- **📄 Smart Resume Processing**: Extract text from PDF, DOCX, and TXT files
- **🎯 Job Description Analysis**: Understands job requirements and tailors content accordingly
- **✨ AI-Powered Generation**: Creates personalized cover letters using advanced language models
- **📋 Copy-to-Clipboard**: Easy export functionality for immediate use
- **🎨 Modern UI**: Sleek dark theme with smooth animations and responsive design

### Technical Capabilities
- **⚡ High Performance**: Built with Next.js 14 and optimized for speed
- **🔒 Secure Processing**: Client-side text processing with minimal data exposure
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **🌐 Cross-Platform**: Web-based application accessible from any modern browser
- **🛠️ Type-Safe**: Fully implemented with TypeScript for reliability

---

## 🎮 Demo

### Quick Start Guide

1. **Upload Your Resume**: Drag and drop your PDF, DOCX, or TXT file
2. **Paste Job Description**: Copy and paste the target job description
3. **Generate**: Click the generate button and watch AI create your cover letter
4. **Copy & Use**: Copy the generated letter to your clipboard

**Live Demo**: [Visit NeuralLetter](https://your-domain.com)

### Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400/1a1a1a/ffffff?text=NeuralLetter+Interface" alt="NeuralLetter Interface" width="800">
  <br>
  <em>Modern, intuitive interface designed for productivity</em>
</div>

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Google AI API key (Gemini 2.0 Flash)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dpithia/cover-letter-generator.git
   cd cover-letter-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Google AI API key:
   ```env
   NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### API Key Setup

To obtain your Google AI API key:
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Add it to your `.env.local` file as shown above

---

## 🏗️ Architecture

### Project Structure

```
cover-letter-generator/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── Header.tsx         # Application header
│   ├── ui/               # Reusable UI components
│   └── ...               # Other components
├── utils/                 # Utility functions
│   ├── ai-config.ts      # AI configuration and retry logic
│   └── generate-cover-letter.ts  # Core generation logic
└── lib/                   # External library configurations
```

### Key Components

#### AI Generation System
- **Gemini 2.0 Flash Integration**: State-of-the-art language model for high-quality output
- **Exemplar-Based Prompts**: Trained on top-tier cover letters for professional results
- **Customizable Output**: Configurable tone, length, and focus areas
- **Error Handling**: Comprehensive retry logic and graceful degradation

#### File Processing Pipeline
- **Multi-Format Support**: PDF, DOCX, and TXT file processing
- **Intelligent Extraction**: Advanced text extraction with error handling
- **Client-Side Processing**: Privacy-focused with minimal server dependencies
- **User Experience**: Drag-and-drop interface with real-time feedback

---

## 💻 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)**: React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons
- **[Framer Motion](https://www.framer.com/motion/)**: Production-ready motion library

### AI & Processing
- **[Google Gemini 2.0 Flash](https://ai.google.dev/)**: Advanced language model
- **[PDF-parse](https://www.npmjs.com/package/pdf-parse)**: PDF text extraction
- **[Mammoth.js](https://mammoth.js.org/)**: DOCX document processing

### Development Tools
- **[ESLint](https://eslint.org/)**: JavaScript linting utility
- **[Prettier](https://prettier.io/)**: Code formatter
- **[PostCSS](https://postcss.org/)**: CSS transformation tool

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GOOGLE_API_KEY` | Google AI API key for Gemini integration | ✅ |

### Customization

#### AI Generation Parameters
```typescript
const options = {
  tone: 'formal' | 'conversational' | 'technical',
  focusAreas: ['technical', 'leadership', 'creativity', 'growth'],
  length: 'concise' | 'standard' | 'detailed'
};
```

#### Styling Customization
- Modify `app/globals.css` for custom animations
- Update color schemes in the same file
- Customize component styling in individual files

---

## 🚀 Deployment

### Vercel (Recommended)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to [Vercel](https://vercel.com)
   - Add environment variables in Vercel dashboard
   - Deploy automatically on every push

### Other Platforms
- **Netlify**: Works with Next.js static export
- **AWS Amplify**: Full-stack deployment support
- **DigitalOcean**: App Platform support

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Code Standards

- Follow TypeScript best practices
- Use conventional commit messages
- Maintain consistent code style
- Write tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google AI Team** - For the amazing Gemini language model
- **Next.js Team** - For the excellent React framework
- **Tailwind CSS Team** - For the utility-first CSS framework
- **Open Source Community** - For the invaluable tools and libraries

---

## 📞 Support

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/dpithia/cover-letter-generator/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/dpithia/cover-letter-generator/discussions)
- **📧 Email**: [Contact Us](mailto:your-email@example.com)

---

<div align="center">

**Made with ❤️ by the NeuralLetter Team**

[⭐ Star this project](https://github.com/dpithia/cover-letter-generator/stargazers) • [🐛 Report Issue](https://github.com/dpithia/cover-letter-generator/issues) • [📰 View License](LICENSE)

</div>