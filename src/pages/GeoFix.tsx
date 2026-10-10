import { useState } from 'react'
import { Check, Copy, FileText, Sparkles } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Progress, Table, Td, cx } from '../components/ui'
import { attrs, contentGaps, schemaTypes } from '../geoData'
import { PublishToSource } from '../components/PublishToSource'
import { SubNav } from './Geo'
import { useApp } from '../store'

export function GeoFix() {
  const [s, setS] = useState('Feed & data enrichment')
  return (
    <>
      <SubNav items={['Feed & data enrichment', 'Structured data', 'Content gaps', 'Content generator', 'Reviews & UGC', 'llms.txt']} value={s} onChange={setS} />
      {s === 'Feed & data enrichment' && <Feed />}
      {s === 'Structured data' && <Schema />}
      {s === 'Content gaps' && <Gaps />}
      {s === 'Content generator' && <Generator />}
      {s === 'Reviews & UGC' && <Reviews />}
      {s === 'llms.txt' && <Llms />}
    </>
  )
}

function Feed() {
  const { openCopilot } = useApp()
  return (
    <div className="space-y-6">
      <PublishToSource />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Attributes AI engines match against prompts" sub="Share of products with each attribute filled" right={<Button size="sm" variant="primary" onClick={() => openCopilot('GEO Optimizer')}><Sparkles size={12} /> Fill with agent</Button>} />
          <div className="space-y-3">{attrs.map((a) => <div key={a.name}><div className="flex justify-between text-sm"><span>{a.name}</span><b>{a.pct}%</b></div><Progress value={a.pct} tone={a.pct < 50 ? 'red' : a.pct < 75 ? 'amber' : 'green'} /></div>)}</div>
        </Card>
        <div className="space-y-6">
          <Card><CardHeader title="Agentic commerce feeds" />
            {[['ChatGPT product feed', 'Not connected', 'Available'], ['Google Merchant Center', '1,198 approved · 15 disapproved', 'Connected'], ['Perplexity Merchant Program', 'Not connected', 'Available'], ['Microsoft Merchant Center', 'Not connected', 'Available']].map(([a, b, c]) => (
              <div key={a} className="flex items-center justify-between border-t border-slate-100 py-2.5 text-sm first:border-0"><div><p className="font-medium">{a}</p><p className="text-xs text-slate-500">{b}</p></div>{c === 'Connected' ? <Badge tone="green">● Live</Badge> : <Button size="sm">Connect</Button>}</div>))}
          </Card>
          <Card className="!bg-violet-50"><p className="text-sm text-violet-900"><b>Tip:</b> Products with use-case and audience attributes are mentioned <b>2.4×</b> more often in “best X for Y” answers.</p></Card>
        </div>
      </div>
    </div>
  )
}

const sample = `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Fernhill Trail Shell Jacket",
  "brand": { "@type": "Brand", "name": "Fernhill Apparel" },
  "gtin13": "0850012345678",
  "description": "Waterproof, packable commuter jacket made from recycled nylon.",
  "offers": {
    "@type": "Offer",
    "price": "189.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31"
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.6", "reviewCount": "812" }
}`

function Schema() {
  const [copied, setCopied] = useState(false)
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card pad={false} className="lg:col-span-3"><div className="flex items-center justify-between p-5 pb-0"><CardHeader title="Structured data coverage" sub="JSON-LD found on your store" /><Button size="sm">Re-validate</Button></div>
        <Table head={['Type', 'Pages', 'Valid', 'Warnings', 'Errors', 'Fix']}>
          {schemaTypes.map((t) => <tr key={t.type}><Td className="font-medium">{t.type}</Td><Td>{t.pages}</Td><Td className="text-emerald-600">{t.valid}</Td><Td className="text-amber-600">{t.warn}</Td><Td className={t.err ? 'font-semibold text-rose-600' : ''}>{t.err}</Td><Td className="max-w-[220px] whitespace-normal text-xs text-slate-500">{t.fix || '—'}</Td></tr>)}</Table>
        <div className="p-4"><Button variant="primary" size="sm"><Sparkles size={12} /> Auto-fix schema (stages changes)</Button></div></Card>
      <Card className="lg:col-span-2"><CardHeader title="Generated Product schema" sub="Trail Shell Jacket" right={<Button size="sm" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }}>{copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}</Button>} />
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-[11px] leading-relaxed text-emerald-300">{sample}</pre>
        <p className="mt-2 text-xs text-slate-500">Published automatically on storefront integrations; copy-paste for other platforms.</p></Card>
    </div>
  )
}

function Gaps() {
  return (
    <div className="space-y-4">
      <Card className="!bg-amber-50"><p className="text-sm text-amber-900">We compared your pages with the pages AI engines cite for your category. <b>5 topics</b> are missing or too thin on your site.</p></Card>
      {contentGaps.map((g) => (
        <Card key={g.topic} className="flex flex-wrap items-center gap-4 !p-4"><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900">{g.topic}</p><p className="text-sm text-slate-500">Cited in {g.cited} · Your site: <b>{g.you}</b></p></div><Badge tone={g.impact === 'High' ? 'red' : 'amber'}>{g.impact} impact</Badge><Button size="sm" variant="primary">Draft with agent</Button></Card>
      ))}
    </div>
  )
}

function Generator() {
  const [sel, setSel] = useState(0)
  const [approved, setApproved] = useState<number[]>([])
  const items = [
    { type: 'Comparison guide', title: 'Merino vs cotton sweaters: which is warmer?', body: 'Merino wool keeps you warm even when damp and regulates temperature, while cotton absorbs moisture and feels cold when wet. For a morning commute in 40°F weather, a 200 gsm merino crew is warmer than a midweight cotton sweater and weighs 30% less. Pick cotton for mild days and easy care; pick merino for travel and variable weather.' },
    { type: 'FAQ block', title: 'Merino Crew Sweater: FAQs', body: 'Is it machine washable? Yes, on the wool cycle at 30°C. Does it shrink? Not if washed cold and laid flat. Is it itchy? Fernhill uses 18.5-micron fibre, which is soft against skin. How does it fit? Regular fit; size down for a slimmer look.' },
    { type: 'Buying guide', title: 'How to choose a commuter rain jacket', body: 'Look for a hydrostatic head of at least 10,000 mm, taped seams, and a packable weight under 400 g. The Fernhill Trail Shell is rated at 15,000 mm and packs into its own pocket. Best for: daily commutes, travel, light hikes. Not ideal for: heavy winter cold without a mid-layer.' },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-2">{items.map((it, i) => <button key={it.title} onClick={() => setSel(i)} className={cx('block w-full rounded-xl border p-3 text-left', sel === i ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white')}><Badge tone="violet">{it.type}</Badge><p className="mt-1 text-sm font-medium text-slate-900">{it.title}</p>{approved.includes(i) && <p className="mt-1 text-xs text-emerald-600">✓ Approved</p>}</button>)}</div>
      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><FileText size={16} className="text-slate-400" /><b>{items[sel].title}</b></div><Badge tone="amber">AI draft · needs your approval</Badge></div>
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">{items[sel].body}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500"><Badge>Answer-first</Badge><Badge>Fact-dense</Badge><Badge>Quotable passages</Badge><Badge>Brand tone: warm & practical</Badge></div>
        <div className="mt-4 flex gap-2"><Button variant="primary" onClick={() => setApproved([...approved, sel])}>Approve & stage</Button><Button>Edit</Button><Button>Regenerate</Button></div>
      </Card>
    </div>
  )
}

function Reviews() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader title="Review content AI engines can read" />
        {[['Reviews rendered in page HTML (crawlable)', '58%', 'amber'], ['Review schema (AggregateRating)', '70%', 'amber'], ['Reviews mentioning a use case', '31%', 'red'], ['Reviews from the last 90 days', '44%', 'amber']].map(([a, b, t]) => <div key={a} className="flex items-center justify-between border-t border-slate-100 py-2.5 text-sm first:border-0"><span>{a}</span><Badge tone={t as 'amber'}>{b}</Badge></div>)}
        <Button variant="primary" size="sm" className="mt-3">Make reviews crawlable</Button></Card>
      <Card><CardHeader title="Ask for more useful reviews" sub="Review-request prompts that draw out attributes AI engines look for" />
        <div className="space-y-2 text-sm">{['“What did you wear it for? (commute, travel, hiking…)”', '“How did it fit compared with your usual size?”', '“How did it hold up after washing?”'].map((q) => <div key={q} className="rounded-lg bg-slate-50 p-3">{q}</div>)}</div>
        <p className="mt-3 text-xs text-slate-500">Sends through your connected review platform (Yotpo).</p><Button size="sm" className="mt-2">Update request template</Button></Card>
    </div>
  )
}

function Llms() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader title="llms.txt" sub="A machine-readable summary of your store for AI engines" right={<Badge tone="green">● Live at /llms.txt</Badge>} />
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-[11px] leading-relaxed text-sky-200">{`# Fernhill Apparel
> Durable everyday clothing from responsibly sourced fibres. Portland, since 2014. B Corp.

## Collections
- [Merino sweaters](/collections/merino-sweaters.md): warm, machine-washable knitwear
- [Outerwear](/collections/outerwear.md): packable rain and trail jackets

## Policies
- [Returns: 30 days](/pages/returns.md)
- [Shipping](/pages/shipping.md)

## Optional
- [Care guides](/blogs/care.md)`}</pre></Card>
      <Card><CardHeader title="Clean content packaging" />
        {[['Markdown version of key pages', '412 pages', 'Generated'], ['Product JSON endpoint', '1,284 products', 'Generated'], ['Policy pages (returns, shipping)', '4 pages', 'Generated']].map(([a, b, c]) => <div key={a} className="flex items-center justify-between border-t border-slate-100 py-2.5 text-sm first:border-0"><div><p className="font-medium">{a}</p><p className="text-xs text-slate-500">{b}</p></div><Badge tone="green">{c}</Badge></div>)}
        <p className="mt-3 text-xs text-slate-500">Published automatically on storefront integrations; download a bundle for other platforms.</p><Button size="sm" className="mt-2">Regenerate</Button></Card>
    </div>
  )
}
