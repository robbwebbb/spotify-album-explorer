import { Command } from "commander";
import chalk from "chalk";
import { searchAlbums, searchTracks, searchArtists } from "../api/endpoints.js";
import { renderTable, renderKeyValueTable } from "../utils/table.js";
import { formatDate, formatDuration, truncate } from "../utils/format.js";
import type { SimplifiedAlbumObject, TrackObject, ArtistObject } from "../models/types.js";

export const searchCommand = new Command("search")
  .description("Search for albums, tracks, or artists")
  .argument("<query>", "Search query (e.g., 'album:OK Computer artist:Radiohead')")
  .option("-t, --type <type>", "Search type: album, track, artist, or both", "album")
  .option("-l, --limit <number>", "Number of results (max 10)", "10")
  .action(async (query: string, options) => {
    try {
      const limit = Math.min(Math.max(parseInt(options.limit, 10), 1), 10);
      const type = options.type.toLowerCase();
      
      if (type === "album" || type === "both") {
        const result = await searchAlbums(query, { limit });
        
        if (result.items.length === 0) {
          console.log(chalk.yellow("No albums found."));
        } else {
          const rows = result.items.map((album: SimplifiedAlbumObject, i: number) => [
            String(i + 1),
            truncate(album.name, 45),
            truncate(album.artists.map(a => a.name).join(", "), 35),
            formatDate(album.release_date, album.release_date_precision),
            album.album_type,
            album.external_urls?.spotify || "—",
          ]);

          console.log(renderTable(
            ["#", "Album", "Artist(s)", "Released", "Type", "Spotify URL"],
            rows,
            { title: `Albums: Found ${result.total}` }
          ));
        }
      }
      
      if (type === "track" || type === "both") {
        const result = await searchTracks(query, { limit });
        
        if (result.items.length === 0) {
          console.log(chalk.yellow("No tracks found."));
        } else {
          const rows = result.items.map((track: TrackObject, i: number) => [
            String(i + 1),
            truncate(track.name, 45),
            truncate(track.artists.map(a => a.name).join(", "), 30),
            truncate(track.album.name, 30),
            formatDuration(track.duration_ms),
            track.explicit ? "🅴" : "",
            track.external_urls?.spotify || "—",
          ]);

          console.log(renderTable(
            ["#", "Track", "Artist(s)", "Album", "Duration", "Exp", "Spotify URL"],
            rows,
            { title: `Tracks: Found ${result.total}` }
          ));
        }
      }
      
      if (type === "artist" || type === "both") {
        const result = await searchArtists(query, { limit });
        
        if (result.items.length === 0) {
          console.log(chalk.yellow("No artists found."));
        } else {
          const rows = result.items.map((artist: ArtistObject, i: number) => [
            String(i + 1),
            truncate(artist.name, 45),
            artist.images?.length ? "✓" : "—",
            artist.external_urls?.spotify || "—",
          ]);

          console.log(renderTable(
            ["#", "Artist", "Img", "Spotify URL"],
            rows,
            { title: `Artists: Found ${result.total}` }
          ));
        }
      }
    } catch (error) {
      console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });