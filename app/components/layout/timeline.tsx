import Image from "next/image"

interface TimelineStep {
  id: number
  label: string
  imageUrl: string
  imageAlt: string
  description?: string
}

interface TimelineProps {
  steps: TimelineStep[]
}

export function Timeline({ steps }: TimelineProps) {
  return (
    <div className="w-full py-12 px-4 md:w-2/3 h-auto max-w-md md:max-w-3xl ">
      <div className="relative flex items-start justify-between gap-4">
        {/* Timeline steps */}
        {steps.map((step, index) => {
          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Step number circle with image */}
              <div className="relative mb-4 z-10">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink bg-cream">
                  <Image
                    src={step.imageUrl}
                    alt={step.imageAlt}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Step number badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-pink text-cream font-bold flex items-center justify-center border-2 border-cream text-sm">
                  {index + 1}
                </div>
              </div>

              {/* Step label */}
              <h3 className="text-lg font-bold text-center mt-4">{step.label}</h3>

              {/* Step description */}
              {step.description && (
                <p className="text-sm text-center mt-2 max-w-xs text-black/70">
                  {step.description}
                </p>
              )}
            </div>
          )
        })}

        {/* Connection line behind */}
        <div className="absolute top-16 left-0 right-0 h-2 bg-black" style={{ zIndex: 0 }} />
      </div>
    </div>
  )
}
