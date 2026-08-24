export function ArchiveDescription({ description }: { description: string }) {
  return (
    <div className="w-full px-4 md:mb-12 md:px-0 md:mt-auto flex flex-col md:flex-col">
      <div className="md:mr-4 mb-1">
        <h2 className="text-4xl font-bold md:hidden">Digital Lesbian Archive</h2>
        <a href="/artifacts" className="text-sm md:text-sm text-black underline hover:text-red border-b border-black/30 md:border-b-0">Go To Archive →</a>
      </div>
    <div>
      <div className="text-left">
        <p className="text-sm leading-relaxed text-black">
          {description}
        </p>
      </div>
    </div>
    </div>
  );
}
