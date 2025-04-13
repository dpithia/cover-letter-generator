'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import NavBar from '@/components/NavBar'
import LandingPage from '@/components/LandingPage'
import { FileText, Calendar, ArrowLeft, Copy, CheckCheck, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteCoverLetter } from '@/app/actions/delete-cover-letter'

export default function CoverLetterPage({
  params,
}: {
  params: { id: string }
}) {
  const [letter, setLetter] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadLetter() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/')
          return
        }

        const { data, error } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', session.user.id)
          .single()

        if (error || !data) {
          router.push('/saved')
          return
        }

        setLetter(data)
      } catch (error) {
        console.error('Error loading letter:', error)
        router.push('/saved')
      } finally {
        setIsLoading(false)
      }
    }

    loadLetter()
  }, [params.id, router, supabase])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter.content)
    setIsCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Your cover letter has been copied to clipboard",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteCoverLetter(params.id)
      toast({
        title: "Cover letter deleted",
        description: "Your cover letter has been successfully deleted",
      })
      router.push('/saved')
    } catch (error) {
      console.error('Error deleting letter:', error)
      toast({
        title: "Error",
        description: "Failed to delete cover letter",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <NavBar />
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            Loading...
          </div>
        </main>
      </>
    )
  }

  if (!letter) {
    return null
  }

  return (
    <>
      <NavBar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link href="/saved">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Saved Letters
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="h-9"
                >
                  {isCopied ? (
                    <>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="h-9">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your cover letter.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{letter.name}</h1>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(letter.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Cover Letter
                </h2>
                <div className="whitespace-pre-line font-serif">
                  {letter.content.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Resume Text</h2>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {letter.resume_text}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Job Description</h2>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {letter.job_description}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 