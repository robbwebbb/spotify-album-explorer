import { Command } from "commander";
import chalk from "chalk";
import { getAlbum, getAlbumTracks } from "../api/endpoints.js";
import { renderTable, renderKeyValueTable } from "../utils/table.js";
import { formatDate, formatDuration, formatExplicit, truncate } from "../utils/format.js";
import type { AlbumObject, SimplifiedTrackObject } from "../models/types.js";

export const albumCommand = new Command("album")
  .description("Get album details and tracks")
  .argument("<id>", "Spotify Album ID")
  .action(async (id: string) => {
    try {
      const album = await getAlbum(id);
      
      console.log(renderKeyValueTable([
        ["Name", album.name],
        ["Artist(s)", album.artists.map(a => a.name).join(", ")],
        ["Release Date", formatDate(album.release_date, album.release_date_precision)],
        ["Type", album.album_type],
        ["Total Tracks", String(album.total_tracks)],
        ["Copyrights", album.copyrights.map(c => `${c.type}: ${c.text}`).join("; ") || "—"],
        ["UPC/EAN", album.external_ids.upc || album.external_ids.ean || "—"],
        ["Spotify URL", album.external_urls?.spotify || "—"],
      ], album.name));

      const tracksResult = await getAlbumTracks(id);
      const allTracks = tracksResult.items;

      if (allTracks.length > 0) {
        console.log("\n" + renderTable(
          ["#", "Title", "Duration", "Exp", "ISRC", "Spotify URL"],
          allTracks.map((track: SimplifiedTrackObject, i: number) => [
            String(track.track_number),
            truncate(track.name, 45),
            formatDuration(track.duration_ms),
            formatExplicit(track.explicit),
            track.external_ids?.isrc || "—",
            track.external_urls?.spotify || "—",
          ]),
          { title: `Tracks (${allTracks.length})` }
        ));
      }
    } catch (error) {
      console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });