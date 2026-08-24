import { datocmsClient } from "./datocms";
import { DatoCMSMarqueSongResponse, DatoCMSSongsPlaylistResponse, DatoCMSSong } from "@/types/datocms";

type SongData = {
  id: string;
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

const PLAYLIST_QUERY = `
  query {
    allMarqueSongs(orderBy: _createdAt_DESC) {
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

    const { id, title, artist, song } = response.marqueSong;

    // Only return if we have all required data
    if (!title || !artist || !song?.url) {
      return null;
    }

    return {
      id,
      title,
      artist,
      audioUrl: song.url,
    };
  } catch (error) {
    console.warn("Failed to fetch song from DatoCMS:", error);
    return null;
  }
}

export async function getPlaylist(): Promise<SongData[]> {
  try {
    const response = await datocmsClient.request<DatoCMSSongsPlaylistResponse>(PLAYLIST_QUERY);

    if (!response?.allMarqueSongs) {
      return [];
    }

    return response.allMarqueSongs
      .filter((song: DatoCMSSong) => song.title && song.artist && song.song?.url)
      .map((song: DatoCMSSong) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        audioUrl: song.song.url,
      }));
  } catch (error) {
    console.warn("Failed to fetch playlist from DatoCMS:", error);
    return [];
  }
}
