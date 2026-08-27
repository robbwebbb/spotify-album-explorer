import { Command } from "commander";
import chalk from "chalk";
import { getTrack, getAudioFeatures } from "../api/endpoints.js";
import { renderTable, renderKeyValueTable } from "../utils/table.js";
import { formatDuration, formatExplicit, formatKey, formatMode, formatTimeSignature, truncate } from "../utils/format.js";
import type { TrackObject, AudioFeaturesObject } from "../models/types.js";

export const trackCommand = new Command("track")
  .description("Get track details and audio features")
  .argument("<id>", "Spotify Track ID")
  .action(async (id: string) => {
    try {
      const track = await getTrack(id);
      
      console.log(renderKeyValueTable([
        ["Name", track.name],
        ["Album", track.album.name],
        ["Artist(s)", track.artists.map(a => a.name).join(", ")],
        ["Duration", formatDuration(track.duration_ms)],
        ["Track #", String(track.track_number)],
        ["Disc #", String(track.disc_number)],
        ["Explicit", track.explicit ? "Yes" : "No"],
        ["ISRC", track.external_ids.isrc || "—"],
        ["Spotify URL", track.external_urls?.spotify || "—"],
      ], track.name));

      try {
        const features = await getAudioFeatures(id);
        console.log("\n" + renderTable(
          ["Feature", "Value"],
          [
            ["Danceability", features.danceability.toFixed(3)],
            ["Energy", features.energy.toFixed(3)],
            ["Valence", features.valence.toFixed(3)],
            ["Tempo", `${features.tempo.toFixed(1)} BPM`],
            ["Key", formatKey(features.key)],
            ["Mode", formatMode(features.mode)],
            ["Loudness", `${features.loudness.toFixed(1)} dB`],
            ["Speechiness", features.speechiness.toFixed(3)],
            ["Acousticness", features.acousticness.toFixed(3)],
            ["Instrumentalness", features.instrumentalness.toFixed(3)],
            ["Liveness", features.liveness.toFixed(3)],
            ["Time Signature", formatTimeSignature(features.time_signature)],
          ],
          { title: "Audio Features" }
        ));
      } catch {
        console.log(chalk.yellow("\nAudio features unavailable (deprecated endpoint)"));
      }
    } catch (error) {
      console.error(chalk.red("Error:"), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });