"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AuthForm from "./auth-form"

export default function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
          Login
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Login or create an account to continue
          </DialogDescription>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  )
} 