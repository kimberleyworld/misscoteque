import Image from "next/image";

export function SpinningRecord() {
  return (
    <div className="relative w-32 h-32 spinning-record cursor-pointer">
      <Image
        src="/images/record.png"
        alt="Record"
        width={128}
        height={128}
        className="object-contain"
      />
    </div>
  );
}