# Spotify Album/Track Explorer

CLI tool to search and inspect Spotify albums, tracks, and artists without knowing Spotify IDs upfront.

## Setup

1. **Create a Spotify App** at [developer.spotify.com](https://developer.spotify.com/dashboard)
   - Redirect URI: `http://127.0.0.1:8000/callback`
   - Copy **Client ID** and **Client Secret**

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Install & run**:
   ```bash
   bun install
   # Development with watch mode
   bun run dev
   # Or build and run
   bun run build && ./spotify search "album:OK Computer"
   ```

## Commands

### `spotify search "<query>"` 
Search for albums or tracks using field filters.

```bash
# Search albums (default)
spotify search "album:OK Computer artist:Radiohead"
spotify search "year:1990-1999 genre:grunge" --type album

# Search tracks
spotify search "track:Money artist:Pink Floyd" --type track

# Search both
spotify search "Radiohead" --type both

# New releases (past 2 weeks)
spotify search "tag:new" --type album

# Hidden gems (lowest 10% popularity)
spotify search "tag:hipster" --type album

# By UPC/EAN
spotify search "upc:0123456789012" --type album

# Limit results
spotify search "artist:Beatles" --limit 10 --type album
```

### `spotify album <id>`
Show album details + all tracks.

```bash
spotify album 6dVIqQ8qmQ5GBnJ9shOYGE
```

Output: Album metadata (name, artists, release date, type, total tracks, copyrights, UPC/EAN) + tracks table with track number, title, duration, explicit flag, ISRC.

### `spotify track <id>`
Show track details + audio features (if available).

```bash
spotify track 11dFghVXANMlKmJXsNCbNl
```

Output: Track metadata (name, album, artists, duration, track/disc number, explicit, ISRC) + audio features table (danceability, energy, valence, tempo, key, mode, loudness, speechiness, acousticness, instrumentalness, liveness, time signature).

### `spotify artist <id>`
Show artist's albums (all types: album, single, compilation, appears_on).

```bash
spotify artist 4Z8W4fKeB5YxbusRsdQVPb
spotify artist 4Z8W4fKeB5YxbusRsdQVPb --limit 20
```

## Search Field Filters

| Filter | Use With | Example |
|--------|----------|---------|
| `album:` | albums, tracks | `album:"Thriller"` |
| `artist:` | albums, tracks | `artist:"Michael Jackson"` |
| `track:` | tracks | `track:"Bohemian Rhapsody"` |
| `year:` | albums, tracks | `year:1982` or `year:1990-1999` |
| `genre:` | tracks | `genre:"rock"` |
| `upc:` | albums | `upc:0123456789012` |
| `tag:new` | albums | `tag:new` (last 2 weeks) |
| `tag:hipster` | albums | `tag:hipster` (lowest 10% popularity) |

## Defaults

- **Market**: US
- **Album types**: All (album, single, compilation, appears_on)
- **Search limit**: 10 (max 10 per API)
- **Output**: Terminal tables

## Notes

- Audio features endpoint is deprecated - may return "unavailable"
- Client Credentials flow (no user login) - some fields like popularity, genres, label, followers are not returned by Spotify API
- Rate limits: ~100 requests/minute (no auto-retry in V1)