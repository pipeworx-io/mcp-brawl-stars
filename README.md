# @pipeworx/brawl-stars

[Brawl Stars API](https://developer.brawlstars.com/) MCP — player + brawler + ranking data. Free dev key.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Brawl Stars data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
