# @pipeworx/brawl-stars

[Brawl Stars API](https://developer.brawlstars.com/) MCP — player + brawler + ranking data. Free dev key.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1683+ live data sources.

## Auth

- Platform: `PLATFORM_BRAWLSTARS_KEY`. BYO: `?_apiKey=…`.
- **Caveat:** Supercell keys are IP-bound. CF Workers use dynamic egress IPs — generate your key with "Allow any IP" or it will 403.

## Tools

- `player(tag)` — player profile
- `player_battles(tag)` — recent battles
- `club(tag)` — club profile
- `club_members(tag, limit?, after?, before?)` — club members
- `brawlers()` — brawler list
- `brawler(id)` — single brawler
- `events_rotation()` — current event rotation
- `rankings_players(countryCode, limit?, after?, before?)` — country player rankings
- `rankings_clubs(countryCode, limit?, after?, before?)` — country club rankings
- `rankings_brawlers(countryCode, brawlerId, limit?, after?, before?)` — country brawler rankings

## Data source

`https://api.brawlstars.com/v1`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "brawl-stars": {
      "url": "https://gateway.pipeworx.io/brawl-stars/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/brawl-stars/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1683+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

This pack takes your own API key (`_apiKey`) — we don't front one for it, so there's no curl here that would run without it. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/brawl_stars_player`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "brawl-stars": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-brawl-stars"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-brawl-stars
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Brawl Stars data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
