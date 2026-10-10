# Glance Seller Portal – UI prototype

Clickable, UI-only prototype of a seller portal for an AI shopping platform. All data is fictional seed data in `src/data.ts`; there is no backend.

```
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

## What is in it
Home & next best actions · Setup guide · Integrations hub (storefront, feeds, SFTP/CSV, reviews, attribution, pixel, sync status, reconciliation) · Catalog & quality score · Brand Studio (profile, merchandising, agent preview) · Analytics (surfaces, agent funnel) · Market Insights (intents, unmet demand) · Ads Manager (campaign wizard with SmartAds vs manual CPM/CPC, creatives) · Ads Reporting · Agents (plan → approve → diff) · Support Center (multi-thread) · Copilot (side panel + full page, scripted) · Shopper Simulator · Settings.

## Suggested demo path
1. Home → "Fix with agent" (Catalog Fixer: plan, approve, review diff, score 54 → 78)
2. Integrations → Attribution tab (reconciliation, source toggle)
3. Ads Manager → Create campaign (SmartAds, forecast, creative previews)
4. Shopper Simulator → tap the ad and buy
5. Ads Reporting, then Copilot → "My Shopify sync failed – help" → send to support
