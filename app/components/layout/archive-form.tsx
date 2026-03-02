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
    .min(5, "Title must be at least 5 characters.")
    .max(100, "Title must be at most 100 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be at most 500 characters."),
  content: z
    .string()
    .min(50, "Content must be at least 50 characters.")
    .max(2000, "Content must be at most 2000 characters."),
  URL: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  eventDate: z
    .string()
    .optional(),
})

export function ArchiveForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

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
      payload.append("content", data.content)
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
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties,
      })

      form.reset()
      setSelectedFile(null)
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
    <Card className="w-full max-w-3xl bg-cream/5 border-pink/20 rounded-none">
      <CardHeader>
        <h2 className="text-pink font-impact">Contribute to the Archive</h2>
        <CardDescription className="text-black/80">
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
                  <FieldLabel htmlFor="archive-form-title" className="text-black">
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="archive-form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Name your entry..."
                    autoComplete="off"
                    className="border-orange/30 text-black placeholder:text-black/50"
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
                  <FieldLabel htmlFor="archive-form-description" className="text-black">
                    Description
                  </FieldLabel>
                  <InputGroup className="border-orange/30">
                    <InputGroupTextarea
                      {...field}
                      id="archive-form-description"
                      placeholder="Brief overview of entry..."
                      rows={4}
                      className="min-h-24 resize-none bg-cream/5 border-orange/30 text-black placeholder:text-black/50"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-black/60 bg-cream/5 border-orange/30">
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
                  <FieldLabel htmlFor="archive-form-content" className="text-black">
                    Content
                  </FieldLabel>
                  <InputGroup className="border-orange/30">
                    <InputGroupTextarea
                      {...field}
                      id="archive-form-content"
                      placeholder="Input your entry here."
                      rows={8}
                      className="min-h-32 resize-y bg-cream/5 text-black placeholder:text-black/50 border-orange/30"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-black/60 bg-cream/5 border-orange/30">
                        {field.value.length}/2000
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
                  <FieldLabel htmlFor="archive-form-image" className="text-black">
                    URL (Optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="archive-form-image"
                    type="url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com/your-image.jpg"
                    className="bg-cream/5 border-orange/30 text-black placeholder:text-black/50"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Optional manual URL. If a file is uploaded below, the uploaded file URL is used.
                  </FieldDescription>
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="archive-form-file" className="text-black">
                Upload Image or Audio (Optional)
              </FieldLabel>
              <Input
                id="archive-form-file"
                type="file"
                accept="image/*,audio/*"
                className="bg-cream/5 border-orange/30 text-black file:text-black"
                disabled={isSubmitting}
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null
                  setSelectedFile(nextFile)
                }}
              />
              <FieldDescription>
                Max size: 2MB for images, 5MB for audio. If selected, this upload URL is used instead of the manual URL field.
              </FieldDescription>
            </Field>

            <Controller
              name="eventDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="archive-form-date" className="text-black">
                    Date of publish (Optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="archive-form-date"
                    type="datetime-local"
                    aria-invalid={fieldState.invalid}
                    className="border-orange/30 text-black placeholder:text-black/50"
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
            className="border-pink/30 text-black hover:bg-pink/10"
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            form="archive-form"
            className="bg-pink hover:bg-pink/90 text-black font-impact"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add to Archive"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}