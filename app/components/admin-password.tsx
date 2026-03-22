"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Field, FieldLabel } from "@/app/components/ui/field"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { toast } from "sonner"

interface AdminPasswordProps {
  onSuccess: () => void
}

export function AdminPassword({ onSuccess }: AdminPasswordProps) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Set password cookie valid for 7 days
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      document.cookie = `admin_auth=${btoa(password)}; path=/; expires=${expiryDate.toUTCString()}`
      toast("Access granted!", { position: "top-center" })
      setTimeout(() => {
        onSuccess()
      }, 300)
    } else {
      toast("Incorrect password", {
        description: "Please try again",
        position: "bottom-right",
      })
      setPassword("")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-cream/5 border-pink/30 rounded-none">
        <CardHeader className="bg-pink/10 border-b border-pink/20">
          <h1 className="text-pink font-impact text-3xl">Admin Access</h1>
          <p className="text-black/60 text-sm">Enter password to continue</p>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field>
              <FieldLabel htmlFor="password" className="text-black">
                Password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="bg-cream/5 border-orange/30 text-black"
                autoFocus
                required
              />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pink hover:bg-pink/90 text-black font-impact"
            >
              {loading ? "Verifying..." : "Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
