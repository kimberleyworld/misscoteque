interface AboutSectionProps {
  title: string
  copy: string
}

export function AboutSection({ title, copy }: AboutSectionProps) {
  return (
    <div className="w-full gap-3 flex flex-col md:flex-row justify-center items-center bg-red p-8">
      <h2 className="text-5xl font-bold flex-none w-full md:w-1/3 md:w-1/6">{title}</h2>
      <p className="text-sm break-words text-cream bg-black px-2 w-full md:w-auto">
        {copy}
      </p>
    </div>
  )
}