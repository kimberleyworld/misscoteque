interface AboutSectionProps {
  title: string
  copy: string
}

export function AboutSection({ title, copy }: AboutSectionProps) {
  return (
    <div className="w-full gap-3 flex flex-row bg-red p-4">
      <h2 className="text-5xl font-bold flex-none w-1/3">{title}</h2>
      <p className="text-sm sm:columns-3 overflow-hidden" style={{ columnGap: '2rem' }}>
        {copy}
      </p>
    </div>
  )
}