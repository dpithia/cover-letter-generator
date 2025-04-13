"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"

interface SaveLetterDialogProps {
  onSave: (name: string) => void
  trigger?: React.ReactNode
}

export function SaveLetterDialog({ onSave, trigger }: SaveLetterDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim())
      setName("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8">
            <Save className="mr-1 h-3.5 w-3.5" />
            Save
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Cover Letter</DialogTitle>
          <DialogDescription>
            Give your cover letter a name to save it for later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              placeholder="My Cover Letter"
              className="col-span-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave()
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Cover Letter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 