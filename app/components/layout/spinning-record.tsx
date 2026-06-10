import Image from "next/image";

export function SpinningRecord() {
  return (
    <div className="relative w-32 h-32 spinning-record cursor-pointer">
      <Image
        src="/images/record.png"
        alt="Record"
        fill
        sizes="128px"
        className="object-contain"
      />
    </div>
  );
}