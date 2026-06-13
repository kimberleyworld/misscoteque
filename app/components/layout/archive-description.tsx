export function ArchiveDescription({ description }: { description: string }) {
  return (
    <div className="w-full px-4 md:mb-12 md:px-0 md:mt-auto flex flex-row md:flex-col">
      <div className="mr-4">
        <h2 className="text-4xl font-bold md:hidden">Digital Lesbian Archive</h2>
        <a href="/artifacts" className="text-sm md:text-sm text-red hover:underline hover:text-black border-b border-black/30 md:border-b-0">Go To Archive →</a>
      </div>
    <div>
      <div className="text-left border-t-none md:border-t border-black/30">
        <p className="text-sm md:text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
    </div>
  );
}
