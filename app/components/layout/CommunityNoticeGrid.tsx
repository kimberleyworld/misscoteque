"use client"

import { Card, CardContent } from "@/app/components/ui/card"
import Image from "next/image"
import { FormsModal } from "./forms-modal"
import navStarFive from "@/public/images/nav-star-five.png"

interface Notice {
  id: string
  title: string
  description: string
  link?: string | null
  contactDetails?: string | null
  createdAt: Date
}

interface CommunityNoticeGridProps {
  notices: Notice[]
  description?: string
}

export function CommunityNoticeGrid({ notices, description }: CommunityNoticeGridProps) {
  if (notices.length === 0) {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-6 px-4">
      <p>{description}</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {notices.map((notice) => (
          <Card
            key={notice.id}
            className="flex-1 bg-cream border-2 border-black rounded-none flex flex-col relative"
          >
            {/* Corner stars */}
            <Image
              src="/images/star.png"
              alt="corner star"
              width={24}
              height={24}
              className="w-6 h-6 absolute top-2 left-2 object-cover"
            />
            <Image
              src="/images/star.png"
              alt="corner star"
              width={24}
              height={24}
              className="w-6 h-6 absolute top-2 right-2 object-cover"
            />
            <Image
              src="/images/star.png"
              alt="corner star"
              width={24}
              height={24}
              className="w-6 h-6 absolute bottom-2 left-2 object-cover"
            />
            <Image
              src="/images/star.png"
              alt="corner star"
              width={24}
              height={24}
              className="w-6 h-6 absolute bottom-2 right-2 object-cover"
            />
            <CardContent className="flex flex-col h-full">
              <div className="flex-1">
                
                <h3 className="text-black font-bold text-lg mb-2">
                  {notice.title}
                </h3>
                <p className="text-black text-sm mb-3 line-clamp-3">
                  {notice.description}
                </p>
              </div>

              <div className="text-black/70 text-xs mt-auto">
                <p className="font-semibold truncate">Contact:</p>
                <p className="line-clamp-2">{notice.contactDetails}</p>
                {notice.link && (
                  <a
                    href={notice.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red underline hover:text-pink text-xs block"
                  >
                    View link →
                  </a>
                )}
              </div>

              <div className="text-black/60 text-xs mt-3">
                {new Date(notice.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Submit Notice Card */}
        <div className="flex flex-col items-center justify-center p-4 border-2 border-black rounded-none bg-cream gap-4">
          <Image
            src="/images/star.png"
            alt="star"
            width={100}
            height={100}
            className="w-40 h-40 object-cover"
          />
          <FormsModal showNotice={true} showArchive={false} />
        </div>
      </div>
    </div>
  )
}
