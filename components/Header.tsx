"use client"

import React from 'react'
import { FileText, Sparkles, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BorderTrail } from "@/components/ui/border-trail"

const Header = () => {
  const backgroundPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black border-b border-gray-800/30">
      {/* Animated background decoration */}
      <div className="absolute inset-0 bg-[length:60px_60px] animate-pulse" style={{ backgroundImage: backgroundPattern, animationDuration: '20s' }} />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-purple-900/5 to-transparent animate-gradient" style={{ animationDuration: '15s' }} />

      <div className="relative container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="relative">
              <div className="rounded-md bg-gray-900/80 backdrop-blur-sm p-2 border border-gray-700/50 shadow-2xl animate-float">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-md animate-pulse shadow-lg">
                  <FileText className="w-6 h-6 text-white animate-spin-slow" />
                </div>
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-ping" />
            </div>
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                NeuralLetter
              </h1>
              <p className="text-gray-400 text-sm mt-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                AI-Powered Cover Letter Generator
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => window.open('https://github.com/dpithia/cover-letter-generator', '_blank')}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-8 text-center max-w-2xl mx-auto">
          <p className="text-slate-300 text-lg leading-relaxed">
            Transform your resume into compelling cover letters with advanced AI.
            <span className="text-blue-400 font-medium"> Upload, paste, and generate</span> —
            it&apos;s that simple.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Header