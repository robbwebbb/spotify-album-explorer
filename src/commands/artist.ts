import { Command } from "commander";
import chalk from "chalk";
import { getArtist, getArtistAlbums } from "../api/endpoints.js";
import { renderTable, renderKeyValueTable } from "../utils/table.js";
import { formatDate, truncate } from "../utils/format.js";
import type { ArtistObject, SimplifiedAlbumObject } from "../models/types.js";

export const artistCommand = new Command("artist")
  .description("Get artist's albums")
  .argument("<id>", "Spotify Artist ID")
  .option("-l, --limit <number>", "Number of albums", "50")
  .action(async (id: string, options) => {
    try {
      const limit = Math.min(Math.max(parseInt(options.limit, 10), 1), 10);
      const artist = await getArtist(id);
      const albumsResult = await getArtistAlbums(id, { limit });
      const albums = albumsResult.items;

      console.log(renderKeyValueTable([
        ["Name", artist.name],
      ], artist.name));

      if (albums.length === 0) {
        console.log(chalk.yellow("\nNo albums found."));
        return;
      }

      console.log("\n" + renderTable(
        ["#", "Album", "Type", "Released", "Tracks", "ID"],
        albums.map((album: SimplifiedAlbumObject, i: number) => [
          String(i + 1),
          truncate(album.name, 45),
          album.album_type,
          formatDate(album.release_date, album.release_date_precision),
          String(album.total_tracks),
          album.id,
        ]),
        { title: `Albums (${albumsResult.total} total, showing ${albums.length})` }
      ));
    } catch (error) {
      console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });