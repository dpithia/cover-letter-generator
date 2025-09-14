import NeuralLetterGenerator from '@/components/neural-letter-generator'
import Header from '@/components/Header'
import { FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <NeuralLetterGenerator />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/30 bg-black/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 font-medium">NeuralLetter</span>
            </div>
            <p className="text-gray-500 text-sm">
              Powered by Google Gemini AI • Built with Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

