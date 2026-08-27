import { spotifyFetch } from "./client.js";
import type {
  SimplifiedAlbumObject,
  AlbumObject,
  TrackObject,
  SimplifiedTrackObject,
  AudioFeaturesObject,
  PagingObject,
  SearchResponse,
  ArtistObject,
  ArtistAlbumsResponse,
} from "../models/types.js";

const MARKET = "US";

export async function searchAlbums(
  query: string,
  options?: { limit?: number; offset?: number }
): Promise<PagingObject<SimplifiedAlbumObject>> {
  const limit = Math.min(Math.max(options?.limit ?? 10, 1), 10);
  const params = new URLSearchParams({
    q: query,
    type: "album",
    market: MARKET,
    limit: String(limit),
    offset: String(options?.offset ?? 0),
  });
  
  const data = await spotifyFetch<SearchResponse>(`/search?${params}`);
  return data.albums ?? { href: "", limit: 0, next: null, offset: 0, previous: null, total: 0, items: [] };
}

export async function searchTracks(
  query: string,
  options?: { limit?: number; offset?: number }
): Promise<PagingObject<TrackObject>> {
  const limit = Math.min(Math.max(options?.limit ?? 10, 1), 10);
  const params = new URLSearchParams({
    q: query,
    type: "track",
    market: MARKET,
    limit: String(limit),
    offset: String(options?.offset ?? 0),
  });
  
  const data = await spotifyFetch<SearchResponse>(`/search?${params}`);
  return data.tracks ?? { href: "", limit: 0, next: null, offset: 0, previous: null, total: 0, items: [] };
}

export async function searchArtists(
  query: string,
  options?: { limit?: number; offset?: number }
): Promise<PagingObject<ArtistObject>> {
  const limit = Math.min(Math.max(options?.limit ?? 10, 1), 10);
  const params = new URLSearchParams({
    q: query,
    type: "artist",
    market: MARKET,
    limit: String(limit),
    offset: String(options?.offset ?? 0),
  });
  
  const data = await spotifyFetch<SearchResponse>(`/search?${params}`);
  return data.artists ?? { href: "", limit: 0, next: null, offset: 0, previous: null, total: 0, items: [] };
}

export async function getAlbum(id: string): Promise<AlbumObject> {
  return spotifyFetch<AlbumObject>(`/albums/${id}?market=${MARKET}`);
}

export async function getAlbumTracks(
  id: string,
  options?: { limit?: number; offset?: number }
): Promise<PagingObject<SimplifiedTrackObject>> {
  const params = new URLSearchParams({
    market: MARKET,
    limit: String(options?.limit ?? 50),
    offset: String(options?.offset ?? 0),
  });
  return spotifyFetch<PagingObject<SimplifiedTrackObject>>(`/albums/${id}/tracks?${params}`);
}

export async function getTrack(id: string): Promise<TrackObject> {
  return spotifyFetch<TrackObject>(`/tracks/${id}?market=${MARKET}`);
}

export async function getAudioFeatures(id: string): Promise<AudioFeaturesObject> {
  return spotifyFetch<AudioFeaturesObject>(`/audio-features/${id}`);
}

export async function getArtist(id: string): Promise<ArtistObject> {
  return spotifyFetch<ArtistObject>(`/artists/${id}`);
}

export async function getArtistAlbums(
  artistId: string,
  options?: { limit?: number; offset?: number }
): Promise<ArtistAlbumsResponse> {
  const limit = Math.min(Math.max(options?.limit ?? 10, 1), 10);
  const params = new URLSearchParams({
    market: MARKET,
    include_groups: "album,single,compilation,appears_on",
    limit: String(limit),
    offset: String(options?.offset ?? 0),
  });
  return spotifyFetch<ArtistAlbumsResponse>(`/artists/${artistId}/albums?${params}`);
}