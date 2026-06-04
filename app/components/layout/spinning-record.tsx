import Image from "next/image";

export function SpinningRecord() {
  return (
    <div className="relative w-32 h-32">
      <Image
        src="/images/record.png"
        alt="Record"
        fill
        className="object-contain spinning-record"
      />
    </div>
  );
}