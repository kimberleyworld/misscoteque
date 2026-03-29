import { datocmsClient } from "./datocms";
import { DatoCMSMarqueSongResponse } from "@/types/datocms";

type SongData = {
  title: string;
  artist: string;
  audioUrl: string;
};

const SONG_QUERY = `
  query {
    marqueSong {
      id
      title
      artist
      song {
        url
      }
    }
  }
`;

export async function getSong(): Promise<SongData | null> {
  try {
    const response = await datocmsClient.request<DatoCMSMarqueSongResponse>(SONG_QUERY);

    if (!response?.marqueSong) {
      return null;
    }

    const { title, artist, song } = response.marqueSong;

    // Only return if we have all required data
    if (!title || !artist || !song?.url) {
      return null;
    }

    return {
      title,
      artist,
      audioUrl: song.url,
    };
  } catch (error) {
    console.warn("Failed to fetch song from DatoCMS:", error);
    return null;
  }
}
