import { Command } from "commander";
import "dotenv/config";
import { searchCommand } from "./commands/search.js";
import { albumCommand } from "./commands/album.js";
import { trackCommand } from "./commands/track.js";
import { artistCommand } from "./commands/artist.js";

const program = new Command()
  .name("spotify")
  .description("Spotify Album/Track Explorer - search and inspect albums, tracks, artists")
  .version("1.0.0")
  .addCommand(searchCommand)
  .addCommand(albumCommand)
  .addCommand(trackCommand)
  .addCommand(artistCommand);

program.parseAsync(process.argv).catch(() => {
  process.exit(1);
});