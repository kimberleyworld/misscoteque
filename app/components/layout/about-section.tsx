interface AboutSectionProps {
  title: string
  copy: string
}

export function AboutSection({ title, copy }: AboutSectionProps) {
  return (
    <div className="w-full gap-3 flex flex-row justify-center items-center bg-red p-8">
      <h2 className="text-5xl font-bold flex-none w-1/3 md:w-1/6">{title}</h2>
      <p className="text-sm overflow-hidden flex">
        {copy}
      </p>
    </div>
  )
}