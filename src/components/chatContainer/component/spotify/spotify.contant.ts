export const typeSerach = "album";

export interface IMusic {
  encodeId: string;
  title: string;
  thumbnail: string;
  thumbnailM: string;
  type: string;
  duration: number;
}
export interface IArtists {
  id: string;
  name: string;
  playlistId: string;
  thumbnail: string;
  thumbnailM: string;
  type: string;
}
export interface Spotify {
  top: {
    id: string;
    playlistId: string;
    thumbnail: string;
    cover: string;
    name: string;
  };
  song: {
    music: IMusic;
    artists: IArtists[];
  }[];
}
