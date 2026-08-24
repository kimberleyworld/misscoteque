import Image from "next/image";

export function SpinningRecord() {
  return (
    <div className="relative w-32 h-32 cursor-pointer group">
      <Image
        src="/images/record.png"
        alt="Record"
        width={128}
        height={128}
        className="object-contain group-hover:animate-spin"
      />
    </div>
  );
}