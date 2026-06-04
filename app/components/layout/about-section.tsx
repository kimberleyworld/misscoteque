interface AboutSectionProps {
  title: string
  copy: string
}

export function AboutSection({ title, copy }: AboutSectionProps) {
  return (
    <div className="w-full md:w-2/3 h-auto max-w-md md:max-w-3xl gap-3 flex flex-col bg-red">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-sm columns-3" style={{ columnGap: '2rem' }}>
        {copy}
      </p>
    </div>
  )
}