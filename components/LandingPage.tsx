'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/ui/animated-hero"

export default function LandingPage() {
  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="text-2xl font-bold">NeuralLetter</div>
        <nav className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center">
        <Hero />
      </main>
    </div>
  )
} 