export type VideoProvider = 'youtube' | 'vimeo' | 'none'

interface VideoData {
  provider: VideoProvider
  id: string
  embedUrl: string
}

export function extractVideoUrl(url: string): VideoData | null {
  if (!url) return null

  // YouTube patterns: youtube.com/watch?v=ID or youtu.be/ID
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (youtubeMatch) {
    const id = youtubeMatch[1]
    return {
      provider: 'youtube',
      id,
      embedUrl: `https://www.youtube.com/embed/${id}`,
    }
  }

  // Vimeo pattern: vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    const id = vimeoMatch[1]
    return {
      provider: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}`,
    }
  }

  return null
}