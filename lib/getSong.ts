import { Entry } from "contentful";
import { contentfulClient } from "./contentful";
import { GlobalSettingsSkeleton } from "@/types/contentful";

const DEFAULT_AUDIO_URL = "./public/song.mp3";
const DEFAULT_TITLE = "CHECK Automatic Lover";
const DEFAULT_ARTIST = "Dee D.Jackson";

type SongData = {
  title: string;
  artist: string;
  audioUrl: string;
};

export async function getSong(): Promise<SongData> {
  const response = await contentfulClient.getEntries<GlobalSettingsSkeleton>({
    content_type: "globalSettings",
    limit: 1,
  });

  const entry: Entry<GlobalSettingsSkeleton> | undefined = response.items[0];

  if (!entry) {
    return {
      title: DEFAULT_TITLE,
      artist: DEFAULT_ARTIST,
      audioUrl: DEFAULT_AUDIO_URL,
    };
  }

  const { fields } = entry;

  // runtime check: ensure songFile exists
  const songFile = fields.songFile as unknown as { fields?: { file?: { url?: string } } };
  const audioUrl =
    songFile?.fields?.file?.url ?? DEFAULT_AUDIO_URL;

  return {
    title: String(fields.songTitle || DEFAULT_TITLE),
    artist: String(fields.songArtist || DEFAULT_ARTIST),
    audioUrl: audioUrl.startsWith("http") ? audioUrl : `https:${audioUrl}`,
  };
}
