import type { ToolDefinition } from '../types';

// Pricing data — verified May 2026
// Sources documented in PRICING_DATA.md

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    vendor: 'Anysphere',
    category: 'coding',
    logoColor: '#7C5CFC',
    primaryUseCases: ['coding'],
    plans: [
      { id: 'hobby',      label: 'Hobby',      pricePerSeat: 0,   notes: 'Free tier, limited completions' },
      { id: 'pro',        label: 'Pro',         pricePerSeat: 20,  notes: '500 fast requests/month' },
      { id: 'business',   label: 'Business',    pricePerSeat: 40,  minSeats: 1 },
      { id: 'enterprise', label: 'Enterprise',  pricePerSeat: 100, minSeats: 20, notes: 'Custom, est. $100/seat' },
    ],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    vendor: 'GitHub / Microsoft',
    category: 'coding',
    logoColor: '#6e5494',
    primaryUseCases: ['coding'],
    plans: [
      { id: 'individual', label: 'Individual',  pricePerSeat: 10,  notes: '$10/mo or $100/yr' },
      { id: 'business',   label: 'Business',    pricePerSeat: 19 },
      { id: 'enterprise', label: 'Enterprise',  pricePerSeat: 39 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    category: 'chat',
    logoColor: '#CC785C',
    primaryUseCases: ['writing', 'coding', 'research', 'mixed'],
    plans: [
      { id: 'free',       label: 'Free',        pricePerSeat: 0 },
      { id: 'pro',        label: 'Pro',          pricePerSeat: 20 },
      { id: 'max_5x',     label: 'Max (5x)',     pricePerSeat: 100 },
      { id: 'max_20x',    label: 'Max (20x)',    pricePerSeat: 200 },
      { id: 'team',       label: 'Team',         pricePerSeat: 30,  minSeats: 5, notes: 'Min 5 seats' },
      { id: 'enterprise', label: 'Enterprise',   pricePerSeat: 60,  notes: 'Est. $60+/seat, custom' },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    vendor: 'OpenAI',
    category: 'chat',
    logoColor: '#10a37f',
    primaryUseCases: ['writing', 'coding', 'research', 'mixed'],
    plans: [
      { id: 'free',       label: 'Free',        pricePerSeat: 0 },
      { id: 'plus',       label: 'Plus',         pricePerSeat: 20 },
      { id: 'team',       label: 'Team',         pricePerSeat: 30,  minSeats: 2, notes: 'Min 2 seats, billed annually' },
      { id: 'enterprise', label: 'Enterprise',   pricePerSeat: 60,  notes: 'Est. custom pricing' },
      { id: 'api_direct', label: 'API Direct',   pricePerSeat: 0,   notes: 'Pay-per-token — enter actual spend' },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    vendor: 'Anthropic',
    category: 'api',
    logoColor: '#CC785C',
    primaryUseCases: ['coding', 'data', 'mixed'],
    plans: [
      { id: 'api_direct', label: 'API (pay-per-token)', pricePerSeat: 0, notes: 'Enter actual monthly spend' },
    ],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    vendor: 'OpenAI',
    category: 'api',
    logoColor: '#10a37f',
    primaryUseCases: ['coding', 'data', 'mixed'],
    plans: [
      { id: 'api_direct', label: 'API (pay-per-token)', pricePerSeat: 0, notes: 'Enter actual monthly spend' },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    vendor: 'Google',
    category: 'chat',
    logoColor: '#4285F4',
    primaryUseCases: ['writing', 'research', 'mixed'],
    plans: [
      { id: 'free',       label: 'Free',        pricePerSeat: 0 },
      { id: 'advanced',   label: 'Advanced',    pricePerSeat: 20, notes: 'Part of Google One AI Premium' },
      { id: 'business',   label: 'Business',    pricePerSeat: 30, notes: 'Workspace add-on' },
      { id: 'api',        label: 'API',         pricePerSeat: 0,  notes: 'Pay-per-token — enter actual spend' },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    vendor: 'Codeium',
    category: 'coding',
    logoColor: '#00C7B7',
    primaryUseCases: ['coding'],
    plans: [
      { id: 'free',       label: 'Free',        pricePerSeat: 0 },
      { id: 'pro',        label: 'Pro',          pricePerSeat: 15 },
      { id: 'teams',      label: 'Teams',        pricePerSeat: 35, minSeats: 5 },
      { id: 'enterprise', label: 'Enterprise',   pricePerSeat: 60, notes: 'Custom pricing' },
    ],
  },
];

export const TOOL_MAP = Object.fromEntries(
  TOOL_DEFINITIONS.map(t => [t.id, t])
) as Record<string, ToolDefinition>;

export const USE_CASES = [
  { id: 'coding',   label: 'Coding & Development', emoji: '💻' },
  { id: 'writing',  label: 'Writing & Content',     emoji: '✍️' },
  { id: 'data',     label: 'Data & Analytics',      emoji: '📊' },
  { id: 'research', label: 'Research',               emoji: '🔬' },
  { id: 'mixed',    label: 'Mixed / General',        emoji: '🔀' },
] as const;
