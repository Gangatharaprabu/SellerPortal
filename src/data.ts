// All data in this prototype is fictional seed data.

function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296)
}

export const merchant = { name: 'Fernhill Apparel', plan: 'Growth', stores: ['Fernhill US', 'Fernhill UK', 'Fernhill Kids'] }

export const daily = (() => {
  const r = rng(7)
  const out: { d: string; impressions: number; recs: number; clicks: number; atc: number; orders: number; gmv: number; paid: number; organic: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const dt = new Date(2026, 9, 10 - i)
    const base = 52000 + (29 - i) * 700 + r() * 6000
    const recs = base * 0.34
    const clicks = recs * (0.11 + r() * 0.02)
    const atc = clicks * 0.19
    const orders = atc * 0.41
    const gmv = orders * 71
    out.push({
      d: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      impressions: Math.round(base), recs: Math.round(recs), clicks: Math.round(clicks),
      atc: Math.round(atc), orders: Math.round(orders), gmv: Math.round(gmv),
      paid: Math.round(gmv * 0.38), organic: Math.round(gmv * 0.62),
    })
  }
  return out
})()

export const surfaces = [
  { name: 'Mobile Lockscreen', impressions: 812000, clicks: 71400, orders: 2210, gmv: 158400, color: '#4f46e5' },
  { name: 'TV Ambient Screensaver', impressions: 604000, clicks: 28100, orders: 980, gmv: 71200, color: '#0ea5e9' },
  { name: 'Agent Search & Chat', impressions: 436000, clicks: 64800, orders: 3350, gmv: 241900, color: '#10b981' },
  { name: 'Laptop Home Feed', impressions: 198000, clicks: 15200, orders: 610, gmv: 47100, color: '#f59e0b' },
]

export const funnel = [
  { stage: 'Shopper queries matching your category', value: 1240000 },
  { stage: 'Your products considered by agents', value: 486000 },
  { stage: 'Shortlisted', value: 172000 },
  { stage: 'Recommended to shopper', value: 94500 },
  { stage: 'Clicked', value: 18900 },
  { stage: 'Purchased', value: 7150 },
]

export const lostReasons = [
  { reason: 'Missing attribute (material, fit, occasion)', pct: 34, fix: 'Run Catalog Fixer' },
  { reason: 'Price higher than comparable options', pct: 22, fix: 'Review pricing' },
  { reason: 'Low review count / rating', pct: 17, fix: 'Connect reviews' },
  { reason: 'Out of stock / limited sizes', pct: 15, fix: 'Sync inventory' },
  { reason: 'Slow delivery promise', pct: 12, fix: 'Update shipping' },
]

export type Product = {
  id: string; title: string; category: string; price: number; stock: number; status: 'Live' | 'Needs attention' | 'Disapproved'
  score: number; missing: string[]; img: string; rating: number; reviews: number; occasions: string[]; conv: number; impressions: number
}
const emojis = ['👕', '👖', '🧥', '👗', '👟', '🧢', '🧣', '🩳', '👚', '🧦']
const names = [
  ['Merino Crew Sweater', 'Knitwear', 98], ['Slim Stretch Chino', 'Pants', 74], ['Trail Shell Jacket', 'Outerwear', 189],
  ['Linen Wrap Dress', 'Dresses', 112], ['Everyday Runner', 'Footwear', 129], ['Organic Cotton Tee', 'Tops', 34],
  ['Wool Blend Scarf', 'Accessories', 45], ['Performance Shorts', 'Shorts', 52], ['Silk Button Blouse', 'Tops', 88],
  ['Cashmere Beanie', 'Accessories', 59], ['Relaxed Denim Jacket', 'Outerwear', 135], ['Weekender Dress Shirt', 'Tops', 79],
  ['Waterproof Hiking Boot', 'Footwear', 164], ['Pleated Midi Skirt', 'Skirts', 69], ['Quilted Vest', 'Outerwear', 119],
  ['Seamless Yoga Legging', 'Activewear', 64],
] as const
export const products: Product[] = names.map(([title, category, price], i) => {
  const r = rng(i + 3)
  const miss = ['Material', 'Fit', 'Occasion', 'Care', 'Size chart', 'Sustainability'].filter(() => r() > 0.62)
  const score = Math.round(38 + (6 - miss.length) * 8 + r() * 10)
  return {
    id: `FH-${1040 + i}`, title, category, price, stock: Math.round(r() * 420), score,
    status: i === 3 ? 'Disapproved' : miss.length > 2 ? 'Needs attention' : 'Live',
    missing: miss, img: emojis[i % emojis.length], rating: +(3.8 + r() * 1.1).toFixed(1), reviews: Math.round(r() * 900),
    occasions: miss.includes('Occasion') ? [] : ['Work', 'Weekend'].slice(0, 1 + Math.round(r())),
    conv: +(1.2 + r() * 3.4).toFixed(1), impressions: Math.round(8000 + r() * 90000),
  }
})

export const connectors = [
  { id: 'shopify', cat: 'Storefront', name: 'Shopify', desc: 'Sync products, variants, inventory and orders in real time.', status: 'Connected', logo: '🛍️' },
  { id: 'woo', cat: 'Storefront', name: 'WooCommerce', desc: 'Sync from your WordPress store.', status: 'Available', logo: '🧩' },
  { id: 'bigc', cat: 'Storefront', name: 'BigCommerce', desc: 'Catalog and inventory sync.', status: 'Available', logo: '🏬' },
  { id: 'sfcc', cat: 'Storefront', name: 'Salesforce Commerce', desc: 'Enterprise catalog sync.', status: 'Available', logo: '☁️' },
  { id: 'magento', cat: 'Storefront', name: 'Adobe Commerce (Magento)', desc: 'Catalog sync and write-back of optimized content.', status: 'Available', logo: '🧱' },
  { id: 'feedonomics', cat: 'Feed management', name: 'Feedonomics', desc: 'Pull optimized feeds you already maintain.', status: 'Available', logo: '🔁' },
  { id: 'productsup', cat: 'Feed management', name: 'Productsup', desc: 'Use your Productsup export channel.', status: 'Available', logo: '📦' },
  { id: 'channable', cat: 'Feed management', name: 'Channable', desc: 'Feed rules and exports.', status: 'Available', logo: '📡' },
  { id: 'sftp', cat: 'File transfer', name: 'SFTP', desc: 'Scheduled file drops from your server.', status: 'Connected', logo: '🗄️' },
  { id: 'csv', cat: 'File transfer', name: 'CSV Upload', desc: 'Upload and map a spreadsheet manually.', status: 'Available', logo: '📄' },
  { id: 'bv', cat: 'Reviews', name: 'Bazaarvoice', desc: 'Ratings, reviews and Q&A syndication.', status: 'Available', logo: '⭐' },
  { id: 'yotpo', cat: 'Reviews', name: 'Yotpo', desc: 'Reviews, photos and UGC.', status: 'Connected', logo: '💬' },
  { id: 'powerreviews', cat: 'Reviews', name: 'PowerReviews', desc: 'Reviews and Q&A.', status: 'Available', logo: '🌟' },
  { id: 'okendo', cat: 'Reviews', name: 'Okendo', desc: 'Shopify-native reviews.', status: 'Available', logo: '🏅' },
  { id: 'ga4', cat: 'Attribution & analytics', name: 'Google Analytics 4', desc: 'Import conversions and revenue.', status: 'Connected', logo: '📊' },
  { id: 'northbeam', cat: 'Attribution & analytics', name: 'Northbeam', desc: 'Multi-touch attribution.', status: 'Available', logo: '🧭' },
  { id: 'triplewhale', cat: 'Attribution & analytics', name: 'Triple Whale', desc: 'Blended attribution and MER.', status: 'Available', logo: '🐋' },
  { id: 'rockerbox', cat: 'Attribution & analytics', name: 'Rockerbox', desc: 'Multi-touch and MMM.', status: 'Available', logo: '🪨' },
  { id: 'appsflyer', cat: 'Attribution & analytics', name: 'AppsFlyer', desc: 'Mobile measurement partner.', status: 'Available', logo: '📱' },
  { id: 'adjust', cat: 'Attribution & analytics', name: 'Adjust', desc: 'Mobile measurement partner.', status: 'Available', logo: '🎯' },
  { id: 'branch', cat: 'Attribution & analytics', name: 'Branch', desc: 'Deep linking and attribution.', status: 'Available', logo: '🌿' },
  { id: 'adobe', cat: 'Attribution & analytics', name: 'Adobe Analytics', desc: 'Enterprise web analytics.', status: 'Available', logo: '🅰️' },
  { id: 'gmc', cat: 'Search & AI engines', name: 'Google Merchant Center', desc: 'Feed status, disapprovals and Shopping / AI Overviews eligibility.', status: 'Connected', logo: '🛒' },
  { id: 'gsc', cat: 'Search & AI engines', name: 'Google Search Console', desc: 'Indexing, sitemaps and search queries for AI Overviews.', status: 'Connected', logo: '🔎' },
  { id: 'bing', cat: 'Search & AI engines', name: 'Bing Webmaster & Microsoft Merchant Center', desc: 'Indexing and product feeds that power Copilot answers.', status: 'Available', logo: '🔷' },
  { id: 'oaifeed', cat: 'Search & AI engines', name: 'ChatGPT product feed', desc: 'Publish a product feed in the OpenAI agentic commerce format.', status: 'Available', logo: '💠' },
  { id: 'pplx', cat: 'Search & AI engines', name: 'Perplexity Merchant Program', desc: 'Share your catalog so Perplexity can show and cite your products.', status: 'Available', logo: '🧠' },
  { id: 'cloudflare', cat: 'Site, CMS & logs', name: 'Cloudflare (bot logs)', desc: 'See which AI crawlers visit your pages and where they hit errors.', status: 'Available', logo: '🛡️' },
  { id: 'cloudfront', cat: 'Site, CMS & logs', name: 'AWS CloudFront logs', desc: 'Import CDN logs for AI crawler analysis.', status: 'Available', logo: '📜' },
  { id: 'contentful', cat: 'Site, CMS & logs', name: 'Contentful', desc: 'Publish FAQs, guides and comparison pages to headless CMS.', status: 'Available', logo: '📝' },
  { id: 'sanity', cat: 'Site, CMS & logs', name: 'Sanity', desc: 'Headless CMS publishing for answer-ready content.', status: 'Available', logo: '✍️' },
  { id: 'wordpress', cat: 'Site, CMS & logs', name: 'WordPress', desc: 'Publish buying guides and structured data to your blog.', status: 'Available', logo: '📰' },
  { id: 'gbp', cat: 'Brand profiles', name: 'Google Business Profile', desc: 'Keep brand and store details consistent across the web.', status: 'Available', logo: '📍' },
  { id: 'linkedin', cat: 'Brand profiles', name: 'LinkedIn Page', desc: 'Entity consistency for company information.', status: 'Available', logo: '💼' },
  { id: 'wikidata', cat: 'Brand profiles', name: 'Wikidata / Knowledge graph', desc: 'Check how your brand entity is described in public knowledge graphs.', status: 'Available', logo: '🕸️' },
]

export const syncHistory = [
  { time: 'Today 06:00', source: 'Shopify', items: 1284, errors: 0, status: 'Success', dur: '2m 14s' },
  { time: 'Today 02:00', source: 'SFTP (inventory.csv)', items: 1284, errors: 3, status: 'Warnings', dur: '48s' },
  { time: 'Yesterday 18:00', source: 'Yotpo reviews', items: 9402, errors: 0, status: 'Success', dur: '3m 51s' },
  { time: 'Yesterday 06:00', source: 'Shopify', items: 1279, errors: 0, status: 'Success', dur: '2m 09s' },
  { time: 'Oct 8 06:00', source: 'Shopify', items: 1279, errors: 41, status: 'Failed', dur: '1m 02s' },
  { time: 'Oct 7 22:00', source: 'GA4 conversions', items: 3120, errors: 0, status: 'Success', dur: '31s' },
]

export const campaigns = [
  { id: 1, name: 'Fall Knitwear – SmartAds', type: 'SmartAds', surfaces: 'Auto', status: 'Active', spend: 8420, budget: 12000, impr: 1240000, clicks: 38200, orders: 1120, rev: 41800, goal: 'Sales' },
  { id: 2, name: 'TV Ambient – Outerwear Launch', type: 'CPM', surfaces: 'TV Screensaver', status: 'Active', spend: 6100, budget: 9000, impr: 1420000, clicks: 11400, orders: 240, rev: 18900, goal: 'Launch' },
  { id: 3, name: 'Lockscreen – Clearance Tees', type: 'CPC', surfaces: 'Lockscreen', status: 'Active', spend: 3950, budget: 5000, impr: 690000, clicks: 29800, orders: 910, rev: 22300, goal: 'Clearance' },
  { id: 4, name: 'Agent Search – Footwear', type: 'CPC', surfaces: 'Agent Search', status: 'Learning', spend: 1280, budget: 4000, impr: 180000, clicks: 9100, orders: 262, rev: 9800, goal: 'Sales' },
  { id: 6, name: 'Summer Sale – Dresses', type: 'CPM', surfaces: 'Lockscreen + TV', status: 'Ended', spend: 7000, budget: 7000, impr: 1650000, clicks: 19900, orders: 410, rev: 24600, goal: 'Sales' },
]

export const trends = [
  { intent: 'Outfit for a fall wedding guest under $150', growth: 212, volume: 18400, cat: 'Dresses', gap: true },
  { intent: 'Warm layers for 5am dog walks', growth: 164, volume: 12900, cat: 'Outerwear', gap: false },
  { intent: 'Sustainable work-from-home basics', growth: 118, volume: 9800, cat: 'Tops', gap: true },
  { intent: 'Packable jacket for a Japan trip', growth: 96, volume: 7700, cat: 'Outerwear', gap: false },
  { intent: 'Gift for a new runner', growth: 81, volume: 11200, cat: 'Activewear', gap: true },
  { intent: 'Machine-washable wool sweater', growth: 63, volume: 6100, cat: 'Knitwear', gap: false },
]

export const phrasing = [
  { modifier: 'under $X / budget', share: 38 }, { modifier: 'occasion (wedding, interview…)', share: 31 },
  { modifier: 'sustainable / ethical', share: 19 }, { modifier: 'fast delivery', share: 17 }, { modifier: 'for [person] (gift)', share: 14 },
]

export const threads = [
  { id: 'T-2041', subject: 'Shopify sync failed on Oct 8 (41 errors)', cat: 'Integrations', status: 'Open', priority: 'High', updated: '12m ago', assignee: 'Priya (Integrations)', linked: 'Sync job #8841', unread: true },
  { id: 'T-2037', subject: 'Invoice mismatch for September ad spend', cat: 'Ads & Billing', status: 'Pending you', priority: 'Medium', updated: '3h ago', assignee: 'Marco (Billing)', linked: 'Invoice INV-0921', unread: false },
  { id: 'T-2029', subject: 'Request: Productsup feed connector setup help', cat: 'Integrations', status: 'In progress', priority: 'Low', updated: 'Yesterday', assignee: 'Priya (Integrations)', linked: '—', unread: false },
  { id: 'T-2018', subject: 'Ad strategy review for holiday season', cat: 'Account manager', status: 'Open', priority: 'Medium', updated: '2d ago', assignee: 'Dana (Account Manager)', linked: 'Campaign #2', unread: false },
  { id: 'T-1994', subject: 'GA4 purchase events not matching', cat: 'Measurement', status: 'Resolved', priority: 'Medium', updated: 'Oct 2', assignee: 'Lee (Measurement)', linked: 'GA4 connector', unread: false },
  { id: 'T-1980', subject: 'Your clearance campaign qualifies for a TV promo', cat: 'Platform outreach', status: 'Open', priority: 'Low', updated: 'Oct 1', assignee: 'Dana (Account Manager)', linked: 'Campaign #3', unread: true },
]

export const nextActions = [
  { id: 'a1', icon: 'catalog', title: '214 products are missing material, fit or occasion data', impact: '+18% estimated agent match rate', action: 'Fix with Catalog Fixer', agent: 'Catalog Fixer' },
  { id: 'a2', icon: 'trend', title: 'Rising intent: “fall wedding guest outfit under $150”', impact: '18.4K searches/wk · you rank for 6%', action: 'Respond with Trend Responder', agent: 'Trend Responder' },
  { id: 'a3', icon: 'ads', title: 'TV campaign is pacing 22% under budget', impact: '+$6.2K revenue if budget is fully delivered', action: 'Optimize with Campaign Optimizer', agent: 'Campaign Optimizer' },
  { id: 'a5', icon: 'geo', title: 'ChatGPT mentions you in 14% of “best outerwear” prompts; a competitor gets 31%', impact: '+9% AI-referred revenue · 3 fixes ready', action: 'Optimize with GEO Optimizer', agent: 'GEO Optimizer' },
  { id: 'a4', icon: 'brand', title: 'Brand profile is 40% complete', impact: 'Agents cite brand story in 1 of 4 recommendations', action: 'Build with Brand Profile Builder', agent: 'Brand Profile Builder' },
]

export const agents = [
  { id: 'catalog', name: 'Catalog Fixer', desc: 'Fills missing attributes, fixes disapprovals, improves titles and descriptions.', emoji: '🛠️', runs: 14, status: 'Ready' },
  { id: 'enrich', name: 'Enrichment Agent', desc: 'Adds occasions, use cases and FAQs from reviews and your website.', emoji: '✨', runs: 6, status: 'Ready' },
  { id: 'brand', name: 'Brand Profile Builder', desc: 'Drafts your brand profile from your site, socials and assets.', emoji: '🏷️', runs: 2, status: 'Ready' },
  { id: 'size', name: 'Size Chart & Specs Agent', desc: 'Extracts size charts and specs from PDFs and images.', emoji: '📐', runs: 3, status: 'Ready' },
  { id: 'campaign', name: 'Campaign Optimizer', desc: 'Shifts budget and bids; builds campaigns from a goal.', emoji: '📈', runs: 9, status: 'Ready' },
  { id: 'geo', name: 'GEO Optimizer', desc: 'Improves how ChatGPT, Perplexity, Gemini and others understand and cite your products.', emoji: '🌐', runs: 0, status: 'New' },
  { id: 'trend', name: 'Trend Responder', desc: 'Matches emerging intents to catalog gaps and suggests promotions.', emoji: '🔥', runs: 4, status: 'Ready' },
]

export const agentRuns = [
  { id: 'R-311', agent: 'Catalog Fixer', by: 'Alex (Admin)', when: 'Oct 8, 09:12', scope: '168 products', result: 'Score 51 → 62', status: 'Applied' },
  { id: 'R-308', agent: 'Campaign Optimizer', by: 'Sam (Marketer)', when: 'Oct 7, 15:40', scope: '3 campaigns', result: 'ROAS 3.1 → 3.6', status: 'Applied' },
  { id: 'R-302', agent: 'Enrichment Agent', by: 'Alex (Admin)', when: 'Oct 5, 11:03', scope: '92 products', result: 'Partially accepted', status: 'Partial' },
  { id: 'R-297', agent: 'Brand Profile Builder', by: 'Alex (Admin)', when: 'Oct 2, 10:21', scope: 'Brand profile', result: 'Draft saved', status: 'Draft' },
]

export const notifications = [
  { t: 'Shopify sync failed with 41 errors', s: '12m ago', tone: 'red' as const },
  { t: 'Catalog Fixer is waiting for your approval (214 products)', s: '1h ago', tone: 'amber' as const },
  { t: 'TV Ambient campaign is pacing 22% under budget', s: '3h ago', tone: 'amber' as const },
  { t: 'Marco replied on “Invoice mismatch for September ad spend”', s: '3h ago', tone: 'blue' as const },
  { t: 'New trend: “fall wedding guest outfit” +212%', s: 'Yesterday', tone: 'violet' as const },
]
