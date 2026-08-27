import { Command } from "commander";
import chalk from "chalk";
import { getArtist, getArtistAlbums, getAlbum } from "../api/endpoints.js";
import { renderTable, renderKeyValueTable } from "../utils/table.js";
import { formatDate, truncate } from "../utils/format.js";
import type { ArtistObject, SimplifiedAlbumObject, AlbumObject } from "../models/types.js";

export const artistCommand = new Command("artist")
  .description("Get artist's albums")
  .argument("<id>", "Spotify Artist ID")
  .option("-l, --limit <number>", "Number of albums", "10")
  .action(async (id: string, options) => {
    try {
      const limit = Math.min(Math.max(parseInt(options.limit, 10), 1), 10);
      const artist = await getArtist(id);
      const albumsResult = await getArtistAlbums(id, { limit });
      const albums = albumsResult.items;

      console.log(renderKeyValueTable([
        ["Name", artist.name],
        ["Spotify URL", artist.external_urls?.spotify || "—"],
      ], artist.name));

      if (albums.length === 0) {
        console.log(chalk.yellow("\nNo albums found."));
        return;
      }

      // Fetch full album details for UPC/EAN
      const albumDetails: AlbumObject[] = [];
      for (const album of albums) {
        try {
          const full = await getAlbum(album.id);
          albumDetails.push(full);
        } catch {
          albumDetails.push({ ...album, external_ids: { upc: undefined, ean: undefined } } as AlbumObject);
        }
      }

      console.log("\n" + renderTable(
        ["#", "Album", "Type", "Released", "Tracks", "UPC/EAN", "Spotify URL"],
        albums.map((album: SimplifiedAlbumObject, i: number) => {
          const full = albumDetails[i];
          const upc = full.external_ids?.upc || full.external_ids?.ean || "—";
          return [
            String(i + 1),
            truncate(album.name, 40),
            album.album_type,
            formatDate(album.release_date, album.release_date_precision),
            String(album.total_tracks),
            truncate(upc, 14),
            album.external_urls?.spotify || "—",
          ];
        }),
        { title: `Albums (${albumsResult.total} total, showing ${albums.length})` }
      ));
    } catch (error) {
      console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });