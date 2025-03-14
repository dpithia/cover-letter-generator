import CoverLetterGenerator from "@/components/cover-letter-generator"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Cover Letter Generator</h1>
      <CoverLetterGenerator />
    </main>
  )
}

