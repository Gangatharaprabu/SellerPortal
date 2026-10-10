// Fictional seed data for the AEO / GEO module.
function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296)
}

export const engines = [
  { name: 'ChatGPT', mention: 14, pos: 3.8, sentiment: 78, color: '#10a37f' },
  { name: 'Perplexity', mention: 22, pos: 3.1, sentiment: 82, color: '#0ea5e9' },
  { name: 'Gemini', mention: 17, pos: 3.5, sentiment: 76, color: '#6366f1' },
  { name: 'Google AI Overviews', mention: 9, pos: 4.4, sentiment: 71, color: '#f59e0b' },
  { name: 'Copilot', mention: 11, pos: 4.1, sentiment: 74, color: '#8b5cf6' },
  { name: 'Glance Agent', mention: 31, pos: 2.2, sentiment: 88, color: '#ec4899' },
]

export const visTrend = (() => {
  const r = rng(11)
  return Array.from({ length: 12 }, (_, i) => {
    const row: Record<string, number | string> = { w: `W${i + 1}` }
    engines.forEach((e, k) => { row[e.name] = Math.max(2, Math.round(e.mention * (0.55 + i * 0.04) + (r() - 0.5) * 3 - (k === 5 ? 0 : 0))) })
    return row
  })
})()

export const prompts = [
  { q: 'best merino sweater for travel under $120', intent: 'Best X for Y', vol: 'High', src: 'Auto', hits: [1, 1, 0, 0, 1], pos: 2 },
  { q: 'sustainable work-from-home basics', intent: 'Discovery', vol: 'Medium', src: 'Auto', hits: [0, 1, 1, 0, 0], pos: 4 },
  { q: 'Fernhill vs Everlane sweater quality', intent: 'Comparison', vol: 'Low', src: 'You', hits: [1, 1, 1, 1, 1], pos: 1 },
  { q: 'fall wedding guest outfit under $150', intent: 'Best X for Y', vol: 'High', src: 'Auto', hits: [0, 0, 0, 0, 0], pos: 0 },
  { q: 'is Fernhill Apparel good quality? reviews', intent: 'Brand & reviews', vol: 'Medium', src: 'Auto', hits: [1, 1, 1, 0, 1], pos: 1 },
  { q: 'packable waterproof jacket for a Japan trip', intent: 'Best X for Y', vol: 'High', src: 'Auto', hits: [0, 1, 0, 0, 0], pos: 5 },
  { q: 'warm layers for early morning dog walks', intent: 'Discovery', vol: 'Medium', src: 'Auto', hits: [0, 0, 1, 0, 0], pos: 6 },
  { q: 'machine washable wool sweater brands', intent: 'Discovery', vol: 'Low', src: 'Auto', hits: [1, 0, 0, 0, 1], pos: 3 },
  { q: 'best running leggings for winter', intent: 'Best X for Y', vol: 'Medium', src: 'Auto', hits: [0, 0, 0, 1, 0], pos: 7 },
  { q: 'Fernhill return policy', intent: 'Brand & reviews', vol: 'Low', src: 'You', hits: [1, 1, 1, 1, 1], pos: 1 },
]
export const promptEngines = ['ChatGPT', 'Perplexity', 'Gemini', 'AI Overviews', 'Copilot']

export const competitors = [
  { cat: 'Outerwear', you: 11, a: 24, b: 19, c: 15 },
  { cat: 'Knitwear', you: 26, a: 22, b: 18, c: 9 },
  { cat: 'Activewear', you: 8, a: 21, b: 27, c: 14 },
  { cat: 'Dresses', you: 6, a: 17, b: 12, c: 29 },
]
export const sovTrend = Array.from({ length: 12 }, (_, i) => ({ w: `W${i + 1}`, You: 9 + i * 0.7, 'Brand A': 22 - i * 0.2, 'Brand B': 19 + i * 0.1, 'Brand C': 15 - i * 0.1 }))

export const citations = [
  { domain: 'reddit.com', kind: 'Forum', share: 19, example: 'r/BuyItForLife: merino sweaters that last', mine: false, action: 'Earn mentions in relevant threads' },
  { domain: 'youtube.com', kind: 'Video', share: 14, example: '“Best travel jackets 2026” review roundup', mine: false, action: 'Seed review units with creators' },
  { domain: 'fernhillapparel.com', kind: 'Your site', share: 11, example: 'Trail Shell Jacket product page', mine: true, action: 'Add comparison and FAQ content' },
  { domain: 'outdoorgear-guide.example', kind: 'Listicle', share: 9, example: 'The 12 best rain jackets for commuting', mine: false, action: 'Pitch for inclusion' },
  { domain: 'wikipedia.org', kind: 'Reference', share: 8, example: 'Merino wool', mine: false, action: 'Not actionable' },
  { domain: 'sustainable-style.example', kind: 'Review site', share: 7, example: 'Ethical knitwear brands ranked', mine: false, action: 'Pitch for inclusion' },
  { domain: 'trustpilot.com', kind: 'Reviews', share: 6, example: 'Fernhill Apparel reviews', mine: false, action: 'Collect more recent reviews' },
]

export const accuracyIssues = [
  { engine: 'ChatGPT', claim: 'Fernhill has a 14-day return window', truth: 'Return window is 30 days', type: 'Policy', sev: 'High', src: 'Outdated help-centre page cached by crawlers' },
  { engine: 'Perplexity', claim: 'Trail Shell Jacket costs $159', truth: 'Current price is $189 (sale ended Aug 31)', type: 'Price', sev: 'High', src: 'Old Offer schema on category page' },
  { engine: 'Gemini', claim: 'Merino Crew Sweater is out of stock', truth: 'In stock in all sizes', type: 'Availability', sev: 'Medium', src: 'Merchant Center feed lag (18h)' },
  { engine: 'Copilot', claim: 'Available in forest green', truth: 'Forest green was discontinued in July', type: 'Spec', sev: 'Low', src: 'Third-party listicle' },
]

export const aiDaily = (() => {
  const r = rng(21)
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 9, 10 - (29 - i))
    const base = 360 + i * 9
    return {
      d: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ChatGPT: Math.round(base * 0.34 + r() * 40), Perplexity: Math.round(base * 0.26 + r() * 30), Gemini: Math.round(base * 0.2 + r() * 25),
      'AI Overviews': Math.round(base * 0.12 + r() * 20), Copilot: Math.round(base * 0.08 + r() * 12),
    }
  })
})()
export const aiTraffic = [
  { engine: 'ChatGPT', sessions: 6420, atc: 810, orders: 221, rev: 17400, how: 'Referrer + utm_source=chatgpt.com' },
  { engine: 'Perplexity', sessions: 4980, atc: 702, orders: 188, rev: 14700, how: 'Referrer perplexity.ai' },
  { engine: 'Gemini', sessions: 3610, atc: 402, orders: 94, rev: 7300, how: 'Referrer gemini.google.com' },
  { engine: 'AI Overviews', sessions: 2330, atc: 241, orders: 62, rev: 4900, how: 'Click-through with AI Overview parameters' },
  { engine: 'Copilot', sessions: 1060, atc: 118, orders: 47, rev: 3900, how: 'Referrer copilot.microsoft.com' },
]
export const aiLanding = [
  { page: '/products/trail-shell-jacket', sessions: 3120, cvr: 4.1, via: 'ChatGPT, Perplexity' },
  { page: '/collections/merino-sweaters', sessions: 2740, cvr: 3.6, via: 'Perplexity, Gemini' },
  { page: '/pages/sustainability', sessions: 1480, cvr: 1.1, via: 'ChatGPT' },
  { page: '/products/everyday-runner', sessions: 1210, cvr: 3.9, via: 'AI Overviews' },
  { page: '/blogs/how-to-care-for-merino', sessions: 980, cvr: 0.8, via: 'Gemini' },
]

export const attrs = [
  { name: 'Material & composition', pct: 71 }, { name: 'Occasion / use case', pct: 48 }, { name: 'Who it’s for / audience', pct: 39 },
  { name: 'Fit & sizing', pct: 63 }, { name: 'GTIN / MPN', pct: 88 }, { name: 'Care instructions', pct: 57 }, { name: 'Comparison-ready specs', pct: 34 },
]
export const schemaTypes = [
  { type: 'Product', pages: 1284, valid: 1102, warn: 138, err: 44, fix: 'Missing brand and GTIN on 44 pages' },
  { type: 'Offer', pages: 1284, valid: 1010, warn: 201, err: 73, fix: 'priceValidUntil missing; stale prices on 73 pages' },
  { type: 'AggregateRating / Review', pages: 904, valid: 860, warn: 44, err: 0, fix: '' },
  { type: 'FAQPage', pages: 36, valid: 36, warn: 0, err: 0, fix: '' },
  { type: 'Organization', pages: 1, valid: 1, warn: 0, err: 0, fix: '' },
  { type: 'BreadcrumbList', pages: 412, valid: 380, warn: 32, err: 0, fix: '' },
]
export const contentGaps = [
  { topic: 'Merino vs cotton sweaters: which is warmer?', cited: '9 of 10 answers cite pages on this', you: 'No page', impact: 'High' },
  { topic: 'How to wash a merino sweater without shrinking it', cited: '7 of 10', you: 'Thin page (120 words)', impact: 'High' },
  { topic: 'Best jackets for commuting in the rain', cited: '8 of 10', you: 'Product page only', impact: 'Medium' },
  { topic: 'Fernhill vs [Brand A] jackets', cited: '5 of 10', you: 'No page', impact: 'Medium' },
  { topic: 'Wedding guest outfits under $150', cited: '6 of 10', you: 'No page', impact: 'High' },
]
export const bots = [
  { bot: 'GPTBot', owner: 'OpenAI', use: 'Model training', status: 'Allowed', hits: 4120, err: 1.2 },
  { bot: 'OAI-SearchBot', owner: 'OpenAI', use: 'ChatGPT search results', status: 'Allowed', hits: 2890, err: 0.8 },
  { bot: 'ChatGPT-User', owner: 'OpenAI', use: 'Live browsing for users', status: 'Allowed', hits: 1530, err: 2.1 },
  { bot: 'PerplexityBot', owner: 'Perplexity', use: 'Perplexity search index', status: 'Blocked', hits: 0, err: 0 },
  { bot: 'ClaudeBot', owner: 'Anthropic', use: 'Model training', status: 'Allowed', hits: 980, err: 1.4 },
  { bot: 'Google-Extended', owner: 'Google', use: 'Gemini training & grounding', status: 'Blocked', hits: 0, err: 0 },
  { bot: 'Googlebot', owner: 'Google', use: 'Search & AI Overviews', status: 'Allowed', hits: 18400, err: 0.4 },
  { bot: 'Bingbot', owner: 'Microsoft', use: 'Bing & Copilot answers', status: 'Allowed', hits: 6120, err: 0.6 },
]
export const crawlChecks = [
  { name: 'Product pages render without JavaScript', ok: false, note: 'Price and size selector load via JS only on 62% of pages' },
  { name: 'Sitemap is current and submitted', ok: true, note: '1,284 URLs · updated 6h ago' },
  { name: 'Canonical tags consistent', ok: true, note: '' },
  { name: 'Page speed (LCP under 2.5s)', ok: false, note: 'Median LCP 3.4s on mobile' },
  { name: 'robots.txt reachable and valid', ok: true, note: '' },
  { name: 'No important pages noindexed', ok: false, note: '14 collection pages are noindex' },
]
export const botPages = [
  { page: '/products/trail-shell-jacket', hits: 640, bots: 'GPTBot, OAI-SearchBot, Bingbot' },
  { page: '/collections/merino-sweaters', hits: 512, bots: 'Googlebot, Bingbot' },
  { page: '/pages/returns', hits: 310, bots: 'ChatGPT-User, OAI-SearchBot' },
  { page: '/products/old-discontinued-item', hits: 188, bots: 'GPTBot (404 errors)' },
]
export const botDaily = Array.from({ length: 14 }, (_, i) => ({ d: `D${i + 1}`, OpenAI: 480 + ((i * 37) % 90), Google: 1200 + ((i * 53) % 160), Microsoft: 380 + ((i * 29) % 60), Other: 70 + ((i * 11) % 30) }))

export const mentionTargets = [
  { site: 'outdoorgear-guide.example', type: 'Listicle', cited: 'ChatGPT, Perplexity', status: 'Not started', note: 'The 12 best rain jackets for commuting' },
  { site: 'sustainable-style.example', type: 'Review site', cited: 'Gemini, AI Overviews', status: 'Pitched', note: 'Ethical knitwear brands ranked' },
  { site: 'reddit.com/r/BuyItForLife', type: 'Forum', cited: 'ChatGPT, Perplexity', status: 'Not started', note: 'Community-led. Contribute, do not advertise.' },
  { site: 'youtube.com (creator reviews)', type: 'Video', cited: 'Gemini, AI Overviews', status: 'In progress', note: '2 creators received review units' },
  { site: 'commute-style-weekly.example', type: 'Newsletter', cited: 'Perplexity', status: 'Won', note: 'Featured in Sept issue' },
]
export const entities = [
  { src: 'Google Business Profile', status: 'Consistent', issue: '' },
  { src: 'Wikidata', status: 'Missing', issue: 'No entity found for Fernhill Apparel' },
  { src: 'LinkedIn', status: 'Inconsistent', issue: 'Founded year says 2015, brand profile says 2014' },
  { src: 'Amazon brand registry', status: 'Inconsistent', issue: 'Brand description is 3 years old' },
  { src: 'Instagram bio', status: 'Consistent', issue: '' },
]
export const reputation = [
  { src: 'Trustpilot', rating: 4.4, count: 1820, trend: '+0.1', alert: '' },
  { src: 'Google reviews', rating: 4.6, count: 940, trend: '0.0', alert: '' },
  { src: 'Reddit mentions (30d)', rating: 0, count: 64, trend: '-8 neg.', alert: '3 threads mention sizing issues and are cited by ChatGPT' },
]

export const opportunities = [
  { t: 'Unblock PerplexityBot in robots.txt', cat: 'Technical', impact: 'High', effort: 'Low', gain: '+6 pts Perplexity visibility', agent: false },
  { t: 'Fix stale prices in Offer schema on 73 pages', cat: 'Accuracy', impact: 'High', effort: 'Low', gain: 'Removes wrong-price answers', agent: true },
  { t: 'Add use-case and audience attributes to 214 products', cat: 'Catalog', impact: 'High', effort: 'Low', gain: '+11% mention rate', agent: true },
  { t: 'Publish “Merino vs cotton” comparison guide', cat: 'Content', impact: 'High', effort: 'Medium', gain: '9 of 10 answers cite this topic', agent: true },
  { t: 'Add 5 FAQ blocks to top collection pages', cat: 'Content', impact: 'Medium', effort: 'Low', gain: '+4% citation rate', agent: true },
  { t: 'Pitch 3 listicles for inclusion', cat: 'Off-site', impact: 'Medium', effort: 'High', gain: 'New cited sources', agent: false },
]
export const tasks = {
  'To do': [{ t: 'Unblock PerplexityBot', who: 'Jo', tag: 'Technical' }, { t: 'Fix 44 missing GTINs', who: 'Jo', tag: 'Catalog' }],
  'In review': [{ t: 'Merino vs cotton guide (draft)', who: 'Alex', tag: 'Content' }, { t: 'FAQ blocks for 5 collections', who: 'Sam', tag: 'Content' }],
  Published: [{ t: 'Updated Offer schema (73 pages)', who: 'Agent', tag: 'Schema' }, { t: 'llms.txt live', who: 'Agent', tag: 'Technical' }],
}
export const experiments = [
  { change: 'Added use-case attributes to 92 products', date: 'Sep 12', vis: '+5.2 pts', rev: '+$3.1K/mo', verdict: 'Worked' },
  { change: 'Published llms.txt and clean markdown pages', date: 'Sep 20', vis: '+1.1 pts', rev: '+$0.4K/mo', verdict: 'Small lift' },
  { change: 'Rewrote 30 titles to answer-first style', date: 'Oct 1', vis: '+0.3 pts', rev: '–', verdict: 'Too early' },
]
