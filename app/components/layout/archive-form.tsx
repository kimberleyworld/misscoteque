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
  CardTitle,
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
    .max(32, "Title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})

// interface ArchiveFormProps {
//   // Add props as needed
// }

export function ArchiveForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("Added to the archive! ✨", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius) + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md bg-cream/5 border-pink/20">
      <CardHeader>
        <CardTitle className="text-red font-impact">Community Archive</CardTitle>
        <CardDescription className="text-cream/80">
          Share your story with the Misscoteque community.
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
                    placeholder="What's your story?"
                    autoComplete="off"
                    className="bg-cream/5 border-orange/30 text-cream placeholder:text-cream/50"
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
                    Share Your Experience
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="archive-form-description"
                      placeholder="Tell us about your journey, memories, or what brings you joy..."
                      rows={6}
                      className="min-h-24 resize-none bg-cream/5 border-orange/30 text-cream placeholder:text-cream/50"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-cream/60 bg-cream/5">
                        {field.value.length}/100
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription className="text-cream/70">
                    This will be shared as part of our community archive.
                  </FieldDescription>
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
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            form="archive-form"
            className="bg-red hover:bg-red/90 text-cream font-impact"
          >
            Add to Archive
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}