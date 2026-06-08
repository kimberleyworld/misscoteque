"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/components/ui/field"
import { Input } from "@/app/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/app/components/ui/input-group"

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character.")
    .max(100, "Title must be at most 100 characters."),
  description: z
    .string()
    .min(1, "Description must be at least 1 character.")
    .max(500, "Description must be at most 500 characters."),
  content: z
    .string()
    .max(2000, "Content must be at most 2000 characters.")
    .optional()
    .or(z.literal("")),
  URL: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  eventDate: z
    .string()
    .optional(),
})

export function ArchiveForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      URL: "",
      eventDate: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    try {
      const payload = new FormData()
      payload.append("title", data.title)
      payload.append("description", data.description)
      payload.append("content", data.content || "")
      payload.append("URL", data.URL || "")
      payload.append("eventDate", data.eventDate || "")

      if (selectedFile) {
        payload.append("file", selectedFile)
      }

      const response = await fetch('/api/archive-upload', {
        method: 'POST',
        body: payload,
      })

      if (!response.ok) {
        // Check if response is JSON or HTML
        const contentType = response.headers.get('content-type') || ''
        
        if (contentType.includes('application/json')) {
          const errorData = await response.json()
          const message =
            errorData.details
              ? `${errorData.error || 'Failed to submit'}: ${errorData.details}`
              : errorData.error || 'Failed to submit'
          throw new Error(message)
        } else {
          // If we get HTML, it's likely a server error page
          throw new Error(`Server error (${response.status}): ${response.statusText}`)
        }
      }

      // Parse result but don't need to use it if successful
      await response.json()
      
      toast("Submitted to the archive! ✨", {
        description: "Your piece has been submitted, it will be reviewed and then added to the archive usually within a week. We will email you when it is published if you opted in for notifications.",
        position: "top-center",
        duration: 7000,
        classNames: {
          content: "flex flex-col gap-2 bg-black p-6 text-cream border-2 border-cream",
        },
      })

      form.reset()
      setSelectedFile(null)
      onSuccess?.()
    } catch (error) {
      console.error('Submission error:', error)
      toast("Something went wrong", {
        description: error instanceof Error ? error.message : "Please try again later.",
        position: "bottom-right",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl bg-black rounded-none">
      <CardHeader className="flex flex-col items-start">
        <h2 className="text-cream font-impact">Contribute to the Archive</h2>
        <CardDescription className="text-cream/80">
          Add your piece, recording, photo or other content to the Misscoteque Archive.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="archive-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="archive-form-title" className="text-cream">
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="archive-form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Name your entry..."
                    autoComplete="off"
                    className="border-orange/30 text-cream placeholder:text-cream/50"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="archive-form-description" className="text-cream">
                    Description
                  </FieldLabel>
                  <InputGroup className="border-orange/30">
                    <InputGroupTextarea
                      {...field}
                      id="archive-form-description"
                      placeholder="Brief overview of entry..."
                      rows={4}
                      className="min-h-24 resize-none bg-cream/5 border-orange/30 text-cream placeholder:text-cream/50"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-cream/60 bg-cream/5 border-orange/30">
                        {field.value.length}/500
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="archive-form-content" className="text-cream">
                    Content (Optional)
                  </FieldLabel>
                  <InputGroup className="border-orange/30">
                    <InputGroupTextarea
                      {...field}
                      id="archive-form-content"
                      placeholder="Input your entry here."
                      rows={8}
                      className="min-h-32 resize-y bg-cream/5 text-cream placeholder:text-cream/50 border-orange/30"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-cream/60 bg-cream/5 border-orange/30">
                        {(field.value ?? "").length}/2000
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="URL"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="archive-form-url" className="text-cream">
                    URL
                  </FieldLabel>
                  <Input
                    {...field}
                    id="archive-form-url"
                    type="url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com"
                    className="bg-cream/5 border-orange/30 text-cream placeholder:text-cream/50"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    If your entry is hosted elsewhere (e.g. a SoundCloud, YouTube, or a webpage), you can provide the URL here.
                  </FieldDescription>
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="archive-form-file" className="text-cream">
                Upload a file
              </FieldLabel>
              <input
                id="archive-form-file"
                type="file"
                accept="image/*,audio/*,.pdf"
                ref={fileInputRef}
                className="hidden"
                disabled={isSubmitting}
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null
                  setSelectedFile(nextFile)
                }}
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={isSubmitting}
              >
                {selectedFile ? `Selected: ${selectedFile.name}` : "Choose File"}
              </Button>
              <FieldDescription>
                Max size: 2MB for images, 5MB for audio, 10MB for PDFs. Supported formats: JPEG, PNG, GIF for images; MP3, WAV for audio; PDF documents.
              </FieldDescription>
            </Field>

            <Controller
              name="eventDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="archive-form-date" className="text-cream">
                    Date of publish
                  </FieldLabel>
                  <Input
                    {...field}
                    id="archive-form-date"
                    type="datetime-local"
                    aria-invalid={fieldState.invalid}
                    className="bg-cream/5 border-orange/30 text-cream placeholder:text-cream/50 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="w-full justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            variant="outline"
            form="archive-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ADDING..." : "ADD"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}