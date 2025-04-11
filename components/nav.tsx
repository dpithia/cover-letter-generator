"use client"

import AuthModal from "./auth/auth-modal"

export default function Nav() {
  return (
    <nav className="fixed top-0 right-0 p-4 z-50">
      <AuthModal />
    </nav>
  )
} 