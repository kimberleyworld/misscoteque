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
  link: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  contactDetails: z
    .string()
    .min(1, "Contact details are required.")
    .max(200, "Contact details must be at most 200 characters."),
})

export function CommunityNoticeForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      contactDetails: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    try {
      const payload = new FormData()
      payload.append("title", data.title)
      payload.append("description", data.description)
      payload.append("link", data.link || "")
      payload.append("contactDetails", data.contactDetails)

      const response = await fetch('/api/notice-submit', {
        method: 'POST',
        body: payload,
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || ''
        
        if (contentType.includes('application/json')) {
          const errorData = await response.json()
          const message =
            errorData.details
              ? `${errorData.error || 'Failed to submit'}: ${errorData.details}`
              : errorData.error || 'Failed to submit'
          throw new Error(message)
        } else {
          throw new Error(`Server error (${response.status}): ${response.statusText}`)
        }
      }

      await response.json()
      
      toast("Notice submitted!", {
        description: "Your notice has been submitted to the community board and will be reviewed before appearing.",
        position: "top-center",
        duration: 7000,
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties,
      })

      form.reset()
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
    <Card className="w-full max-w-3xl bg-black border-pink/20 rounded-none">
      <CardHeader>
        <h2 className="text-pink font-impact">Add a notice to the community board</h2>
        <CardDescription className="text-cream/80">
          This could be a request for a pet sitter, a missed connection callout, an event you want to advertise, etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="notice-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="notice-form-title" className="text-cream">
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="notice-form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="What's your notice about?"
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
                  <FieldLabel htmlFor="notice-form-description" className="text-cream">
                    Description
                  </FieldLabel>
                  <InputGroup className="border-orange/30">
                    <InputGroupTextarea
                      {...field}
                      id="notice-form-description"
                      placeholder="Tell us more about your notice..."
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
              name="link"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="notice-form-link" className="text-cream">
                    Link (Optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="notice-form-link"
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
                    If your notice links to something external, you can provide the URL here.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              name="contactDetails"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="notice-form-contact" className="text-cream">
                    Contact Details
                  </FieldLabel>
                  <InputGroup className="border-orange/30">
                    <InputGroupTextarea
                      {...field}
                      id="notice-form-contact"
                      placeholder="How can people get in touch? (email, phone, social media, etc.)"
                      rows={2}
                      className="min-h-16 resize-none bg-cream/5 border-orange/30 text-cream placeholder:text-cream/50"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-cream/60 bg-cream/5 border-orange/30">
                        {field.value.length}/200
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
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
            className="border-pink/30 text-cream hover:bg-pink/10"
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            form="notice-form"
            className="bg-pink hover:bg-pink/90 text-cream font-impact"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Post Notice"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}