# PRICING_DATA.md

All pricing used in the StackAudit audit engine. Every number traces to an official vendor pricing page. Prices are USD/user/month unless noted.

---

## Cursor

- Hobby: $0/month — https://www.cursor.com/pricing — verified 2026-05-07
- Pro: $20/user/month — https://www.cursor.com/pricing — verified 2026-05-07
- Business: $40/user/month — https://www.cursor.com/pricing — verified 2026-05-07
- Enterprise: Custom (est. $100+/seat based on market comps) — https://www.cursor.com/pricing — verified 2026-05-07

---

## GitHub Copilot

- Individual: $10/user/month (or $100/user/year) — https://github.com/features/copilot#pricing — verified 2026-05-07
- Business: $19/user/month — https://github.com/features/copilot#pricing — verified 2026-05-07
- Enterprise: $39/user/month — https://github.com/features/copilot#pricing — verified 2026-05-07

---

## Claude (Anthropic)

- Free: $0 — https://www.anthropic.com/pricing — verified 2026-05-07
- Pro: $20/user/month — https://www.anthropic.com/pricing — verified 2026-05-07
- Max (5× usage): $100/user/month — https://www.anthropic.com/pricing — verified 2026-05-07
- Max (20× usage): $200/user/month — https://www.anthropic.com/pricing — verified 2026-05-07
- Team: $30/user/month (min 5 seats) — https://www.anthropic.com/pricing — verified 2026-05-07
- Enterprise: Custom (est. $60+/seat) — https://www.anthropic.com/pricing — verified 2026-05-07

---

## ChatGPT (OpenAI)

- Free: $0 — https://openai.com/chatgpt/pricing — verified 2026-05-07
- Plus: $20/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-07
- Team: $30/user/month, min 2 seats, billed annually ($25/user/month) — https://openai.com/chatgpt/pricing — verified 2026-05-07
- Enterprise: Custom pricing — https://openai.com/chatgpt/pricing — verified 2026-05-07

---

## Anthropic API (Direct)

- Pay-per-token. No seat pricing. Users enter actual monthly invoice.
- Claude 3.5 Sonnet: $3/MTok input, $15/MTok output — https://www.anthropic.com/pricing#api — verified 2026-05-07
- Claude 3 Haiku: $0.25/MTok input, $1.25/MTok output — https://www.anthropic.com/pricing#api — verified 2026-05-07

---

## OpenAI API (Direct)

- Pay-per-token. No seat pricing. Users enter actual monthly invoice.
- GPT-4o: $2.50/MTok input, $10/MTok output — https://openai.com/api/pricing — verified 2026-05-07
- GPT-4o mini: $0.15/MTok input, $0.60/MTok output — https://openai.com/api/pricing — verified 2026-05-07

---

## Gemini (Google)

- Free: $0 — https://one.google.com/about/ai-premium — verified 2026-05-07
- Advanced (Google One AI Premium): $20/user/month — https://one.google.com/about/ai-premium — verified 2026-05-07
- Business (Workspace add-on): $30/user/month — https://workspace.google.com/products/gemini — verified 2026-05-07
- API: Pay-per-token — https://ai.google.dev/pricing — verified 2026-05-07

---

## Windsurf (Codeium)

- Free: $0 — https://windsurf.com/pricing — verified 2026-05-07
- Pro: $15/user/month — https://windsurf.com/pricing — verified 2026-05-07
- Teams: $35/user/month (min 5 seats) — https://windsurf.com/pricing — verified 2026-05-07
- Enterprise: Custom — https://windsurf.com/pricing — verified 2026-05-07

---

## Notes on API tools

For Anthropic API and OpenAI API, the audit engine cannot calculate spend from plan × seats because pricing is token-based and highly usage-dependent. Users are asked to enter their actual monthly invoice. Audit recommendations for API tools focus on:
1. Model downgrade opportunities (e.g., GPT-4o → GPT-4o mini for high-volume low-complexity tasks)
2. Switching API provider for equivalent capability at lower cost
3. Credex credits as a mechanism to get the same API access at a discount
