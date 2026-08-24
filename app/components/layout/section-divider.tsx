interface SectionDividerProps {
  heading: string
  variant?: "default" | "small"
}

export function SectionDivider({ heading, variant = "default" }: SectionDividerProps) {
  const isSmall = variant === "small"
  
  return (
    <div className={`${isSmall ? "bg-cream hover:bg-red hover:text-red text-black" : "bg-red mb-4"} w-full  flex items-center justify-center`}>
      <h2 className={`${isSmall ? "text-xs p-1 text-black" : "text-lg md:text-xl py-1 px-4 text-cream"} font-impact text-center`}>
        {heading}
      </h2>
    </div>
  )
}
