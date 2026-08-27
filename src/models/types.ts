export interface ExternalUrlObject {
  spotify: string;
}

export interface ExternalIdObject {
  isrc?: string;
  ean?: string;
  upc?: string;
}

export interface CopyrightObject {
  text: string;
  type: string;
}

export interface SimplifiedArtistObject {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface ImageObject {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SimplifiedAlbumObject {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  restrictions?: { reason: "market" | "product" | "explicit" };
  type: "album";
  uri: string;
  artists: SimplifiedArtistObject[];
}

export interface AlbumObject extends SimplifiedAlbumObject {
  tracks: PagingObject<SimplifiedTrackObject>;
  copyrights: CopyrightObject[];
  external_ids: ExternalIdObject;
}

export interface SimplifiedTrackObject {
  artists: SimplifiedArtistObject[];
  available_markets?: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: any;
  restrictions?: { reason: "market" | "product" | "explicit" };
  name: string;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
  external_ids?: ExternalIdObject;
}

export interface TrackObject extends SimplifiedTrackObject {
  album: SimplifiedAlbumObject;
  external_ids: ExternalIdObject;
}

export interface AudioFeaturesObject {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: "audio_features";
  uri: string;
  valence: number;
}

export interface PagingObject<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
}

export interface SearchResponse {
  albums?: PagingObject<SimplifiedAlbumObject>;
  artists?: PagingObject<ArtistObject>;
  tracks?: PagingObject<TrackObject>;
  playlists?: PagingObject<any>;
  shows?: PagingObject<any>;
  episodes?: PagingObject<any>;
  audiobooks?: PagingObject<any>;
}

export interface ArtistObject {
  external_urls: ExternalUrlObject;
  followers: { href: string | null; total: number };
  genres: string[];
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

export interface ArtistAlbumsResponse {
  items: SimplifiedAlbumObject[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}