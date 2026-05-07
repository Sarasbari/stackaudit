# DEVLOG — StackAudit

---

## Day 1 — 2026-05-07

**Hours worked:** 5

**What I did:**
- Scaffolded Vite + React + TypeScript project with Tailwind CSS v3
- Designed and implemented the complete type system (`src/types/index.ts`) covering ToolDefinition, FormState, ToolEntry, AuditResult, and LeadData
- Built tool definitions and pricing data for all 8 required tools: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf — with plan breakdowns and per-seat pricing
- Implemented `usePersistedState` hook for localStorage form persistence across page reloads
- Built the ToolCard component with plan selector, seat counter, and manual spend override
- Built the AddToolPicker dropdown for adding tools not yet in the list
- Built the full SpendForm page with team context panel, live spend summary, and form submission
- Set up React Router with `/` (form) and `/audit` (placeholder) routes
- Confirmed zero TypeScript errors and clean production build

**What I learned:**
- Vite's TypeScript path handling required careful import resolution — `clsx` and `lucide-react` needed to be installed explicitly
- When pricing has both seat-based and API/pay-per-token tools in the same form, the UX needs to clearly distinguish the two input modes (auto-calculated vs manual). Added an "Auto: $X/mo" quick-fill button for seat-based tools
- localStorage persistence is straightforward but deserves its own versioned key (`stackaudit_form_v1`) so future schema changes don't break existing users

**Blockers / what I'm stuck on:**
- None today. Build is clean.
- Need to decide on the audit engine's recommendation logic for edge cases: e.g., a user on Claude Team with 2 seats (below the 5-seat minimum) — should we flag this as overspend or just note the pricing anomaly?

**Plan for tomorrow:**
- Build the full audit engine (`src/engine/audit.ts`) with all recommendation types: downgrade_plan, reduce_seats, switch_tool, use_credits, already_optimal
- Implement the AuditResults page with per-tool breakdown cards and hero savings display
- Implement unique audit ID generation and Supabase storage stub
- Make sure all recommendation reasoning is defensible — run through the logic with numbers for each tool
