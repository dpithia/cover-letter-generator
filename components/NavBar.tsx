'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, FileText, User, Settings, LogOut } from 'lucide-react'
import SignOutButton from './auth/SignOutButton'
import { Button } from '@/components/ui/button'

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const MenuItems = () => (
    <div className="flex flex-col md:flex-row md:items-center gap-2">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800/50 transition-colors"
      >
        <FileText className="w-4 h-4" />
        Dashboard
      </Link>
      <Link
        href="/profile"
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800/50 transition-colors"
      >
        <User className="w-4 h-4" />
        Profile
      </Link>
      <Link
        href="/settings"
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800/50 transition-colors"
      >
        <Settings className="w-4 h-4" />
        Settings
      </Link>
      <div className="md:ml-2">
        <SignOutButton />
      </div>
    </div>
  )

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-black/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span>NeuralLetter</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <MenuItems />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-sm border-t border-gray-800">
            <MenuItems />
          </div>
        </div>
      )}
    </nav>
  )
} 