# StackAudit

**Are you overpaying for AI tools?** Enter your team's AI stack and get an instant audit showing exactly where you're overspending and how much you could save.

## What it does

StackAudit analyzes your team's AI tool spending across 8 popular tools:

| Tool | Vendor | Category |
|------|--------|----------|
| Cursor | Anysphere | Coding IDE |
| GitHub Copilot | GitHub / Microsoft | Coding assistant |
| Claude | Anthropic | AI chat |
| ChatGPT | OpenAI | AI chat |
| Anthropic API | Anthropic | API |
| OpenAI API | OpenAI | API |
| Gemini | Google | AI chat |
| Windsurf | Codeium | Coding IDE |

It generates recommendations to:
- **Downgrade plans** you're over-provisioned on
- **Reduce seats** you're not using
- **Switch tools** to cheaper alternatives with equivalent capability
- **Use credits** to get the same access at a discount

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **State:** localStorage persistence via custom hooks
- **Backend:** Supabase (planned — audit storage + lead capture)
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

## Project Structure

```
src/
├── types/          # TypeScript type definitions
│   └── index.ts    # ToolDefinition, FormState, AuditResult, LeadData
├── data/           # Static data
│   ├── tools.ts    # 8 tool definitions with pricing
│   └── index.ts    # Barrel exports
├── hooks/          # React hooks
│   ├── usePersistedState.ts  # localStorage persistence
│   ├── useTools.ts           # Form state management
│   ├── useStack.ts           # Audit engine
│   └── index.ts
├── components/     # UI components
│   └── form/
│       └── ToolCard.tsx      # Tool entry card + add picker
├── pages/          # Route pages
│   └── SpendForm.tsx         # Main spend input form
└── App.tsx         # Router setup
```

## Pricing Data

All pricing is sourced from official vendor pages and documented in [`PRICING_DATA.md`](./PRICING_DATA.md) with verification dates.

## License

Private — not open source.
