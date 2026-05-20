interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Brawl Stars MCP.
 */


const BASE = 'https://api.brawlstars.com/v1';
const UA = 'pipeworx-mcp-brawl-stars/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'player', description: 'Player profile.', inputSchema: { type: 'object', properties: { tag: { type: 'string' } }, required: ['tag'] } },
  { name: 'player_battles', description: 'Recent battles.', inputSchema: { type: 'object', properties: { tag: { type: 'string' } }, required: ['tag'] } },
  { name: 'club', description: 'Club profile.', inputSchema: { type: 'object', properties: { tag: { type: 'string' } }, required: ['tag'] } },
  {
    name: 'club_members',
    description: 'Club members.',
    inputSchema: { type: 'object', properties: { tag: { type: 'string' }, limit: { type: 'number' }, after: { type: 'string' }, before: { type: 'string' } }, required: ['tag'] },
  },
  { name: 'brawlers', description: 'Brawler list.', inputSchema: { type: 'object', properties: {} } },
  { name: 'brawler', description: 'Single brawler.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'events_rotation', description: 'Current event rotation.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'rankings_players',
    description: 'Country player rankings.',
    inputSchema: { type: 'object', properties: { countryCode: { type: 'string' }, limit: { type: 'number' }, after: { type: 'string' }, before: { type: 'string' } }, required: ['countryCode'] },
  },
  {
    name: 'rankings_clubs',
    description: 'Country club rankings.',
    inputSchema: { type: 'object', properties: { countryCode: { type: 'string' }, limit: { type: 'number' }, after: { type: 'string' }, before: { type: 'string' } }, required: ['countryCode'] },
  },
  {
    name: 'rankings_brawlers',
    description: 'Country brawler rankings.',
    inputSchema: {
      type: 'object',
      properties: { countryCode: { type: 'string' }, brawlerId: { type: 'number' }, limit: { type: 'number' }, after: { type: 'string' }, before: { type: 'string' } },
      required: ['countryCode', 'brawlerId'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Brawl Stars requires an API key. Set PLATFORM_BRAWLSTARS_KEY or pass ?_apiKey=… (free at https://developer.brawlstars.com — generate with "Allow any IP").');
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (k !== '_apiKey' && v != null) p.set(k, String(v));
    const url = `${BASE}${path}${[...p].length ? `?${p}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA, Authorization: `Bearer ${apiKey}` } });
    if (res.status === 401) throw new Error('Brawl Stars: invalid API key.');
    if (res.status === 403) throw new Error('Brawl Stars: 403 — likely IP not allowlisted on this key (regenerate with "Allow any IP").');
    if (!res.ok) throw new Error(`Brawl Stars: ${res.status}`);
    return res.json();
  };
  const tag = (k = 'tag', ex = '"#9LJ2YR9"') => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return encodeURIComponent(v.startsWith('#') ? v : `#${v}`);
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'player':
      return get(`/players/${tag()}`);
    case 'player_battles':
      return get(`/players/${tag()}/battlelog`);
    case 'club':
      return get(`/clubs/${tag()}`);
    case 'club_members':
      return get(`/clubs/${tag()}/members`, args);
    case 'brawlers':
      return get('/brawlers');
    case 'brawler':
      return get(`/brawlers/${reqNum('id', '16000000')}`);
    case 'events_rotation':
      return get('/events/rotation');
    case 'rankings_players':
      return get(`/rankings/${encodeURIComponent(reqStr('countryCode', '"global"'))}/players`, args);
    case 'rankings_clubs':
      return get(`/rankings/${encodeURIComponent(reqStr('countryCode', '"global"'))}/clubs`, args);
    case 'rankings_brawlers':
      return get(`/rankings/${encodeURIComponent(reqStr('countryCode', '"global"'))}/brawlers/${reqNum('brawlerId', '16000000')}`, args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
