import { useState } from 'react'
import { Check, Copy, RefreshCw, UploadCloud, AlertTriangle } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Field, Modal, PageHeader, Table, Tabs, Td, Toggle, cx, inputCls, num } from '../components/ui'
import { connectors, syncHistory } from '../data'
import { useApp } from '../store'

const cats = ['All', 'Storefront', 'Feed management', 'File transfer', 'Reviews', 'Attribution & analytics', 'Search & AI engines', 'Site, CMS & logs', 'Brand profiles']

const dataOptions: Record<string, string[]> = {
  store: ['Products & variants', 'Inventory levels', 'Collections', 'Images & media', 'Orders (for attribution)', 'Write-back of optimized content (optional)'],
  search: ['Product feed & item status', 'Disapprovals & diagnostics', 'Performance & query reports', 'Eligibility for AI answers & shopping surfaces'],
  logs: ['Bot & crawler requests', 'HTTP status codes & errors', 'User-agent classification (GPTBot, PerplexityBot, …)', 'Top crawled URLs'],
  cms: ['Pages & content models', 'Structured data fields', 'Publish access for FAQs, guides and comparison pages'],
  profile: ['Business name, address, links', 'Categories & descriptions', 'Consistency checks against your Glance brand profile'],
}

type Flow = null | { id: string; name: string }

export function Integrations() {
  const [tab, setTab] = useState('Connectors')
  const [cat, setCat] = useState('All')
  const [flow, setFlow] = useState<Flow>(null)
  const [connected, setConnected] = useState<string[]>(connectors.filter((c) => c.status === 'Connected').map((c) => c.id))

  return (
    <>
      <PageHeader title="Integrations" sub="Connect your catalog, reviews, pixel and attribution tools. Glance keeps everything in sync." actions={<Button variant="primary" onClick={() => setFlow({ id: 'csv', name: 'CSV Upload' })}><UploadCloud size={15} /> Upload CSV</Button>} />
      <Tabs tabs={['Connectors', 'Sync status', 'Pixel', 'Attribution']} value={tab} onChange={setTab} />

      {tab === 'Connectors' && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={cx('rounded-full border px-3 py-1 text-sm', cat === c ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50')}>{c}</button>)}
          </div>
          {cats.slice(1).filter((c) => cat === 'All' || cat === c).map((c) => (
            <div key={c} className="mb-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{c}</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {connectors.filter((x) => x.cat === c).map((x) => {
                  const on = connected.includes(x.id)
                  return (
                    <Card key={x.id} className="flex flex-col">
                      <div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-2xl">{x.logo}</div>{on ? <Badge tone="green">● Connected</Badge> : <Badge>Available</Badge>}</div>
                      <h4 className="mt-3 font-semibold text-slate-900">{x.name}</h4>
                      <p className="mt-1 flex-1 text-sm text-slate-500">{x.desc}</p>
                      <div className="mt-4 flex gap-2">
                        <Button variant={on ? 'secondary' : 'primary'} size="sm" onClick={() => setFlow({ id: x.id, name: x.name })}>{on ? 'Manage' : 'Connect'}</Button>
                        {on && <Button variant="ghost" size="sm"><RefreshCw size={12} /> Sync now</Button>}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'Sync status' && <SyncStatus />}
      {tab === 'Pixel' && <PixelTab />}
      {tab === 'Attribution' && <AttributionTab onConnect={() => setFlow({ id: 'northbeam', name: 'Northbeam' })} />}

      {flow && <ConnectModal flow={flow} connected={connected.includes(flow.id)} onClose={() => setFlow(null)} onDone={() => { setConnected((c) => c.includes(flow.id) ? c : [...c, flow.id]); setFlow(null) }} />}
    </>
  )
}

function ConnectModal({ flow, connected, onClose, onDone }: { flow: NonNullable<Flow>; connected: boolean; onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState(connected ? 3 : 0)
  const kind = flow.id === 'csv' ? 'csv' : flow.id === 'sftp' ? 'sftp' : ['ga4', 'northbeam', 'triplewhale', 'rockerbox', 'appsflyer', 'adjust', 'branch', 'adobe'].includes(flow.id) ? 'attr' : ['bv', 'yotpo', 'powerreviews', 'okendo'].includes(flow.id) ? 'reviews' : ['gmc', 'gsc', 'bing', 'oaifeed', 'pplx'].includes(flow.id) ? 'search' : ['cloudflare', 'cloudfront'].includes(flow.id) ? 'logs' : ['contentful', 'sanity', 'wordpress'].includes(flow.id) ? 'cms' : ['gbp', 'linkedin', 'wikidata'].includes(flow.id) ? 'profile' : 'store'
  const labels = kind === 'csv' ? ['Upload', 'Map columns', 'Review'] : kind === 'attr' ? ['Authorize', 'Choose events', 'Attribution window', 'Done'] : ['Authorize', 'Choose data', 'Schedule', 'Done']
  const last = labels.length - 1
  return (
    <Modal open onClose={onClose} title={`${connected ? 'Manage' : 'Connect'} ${flow.name}`} wide>
      <div className="mb-5 flex items-center gap-2">
        {labels.map((l, i) => <div key={l} className="flex flex-1 items-center gap-2"><span className={cx('grid h-6 w-6 place-items-center rounded-full text-xs font-bold', i <= step ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400')}>{i < step ? <Check size={12} /> : i + 1}</span><span className={cx('text-xs', i === step ? 'font-semibold text-slate-900' : 'text-slate-400')}>{l}</span></div>)}
      </div>

      {kind === 'csv' && step === 0 && <div className="grid place-items-center rounded-xl border-2 border-dashed border-slate-300 p-10 text-center"><UploadCloud className="mb-2 text-slate-400" /><p className="text-sm font-medium">Drop your CSV here or click to browse</p><p className="text-xs text-slate-400">fernhill_catalog_oct.csv · 1,284 rows detected</p></div>}
      {kind === 'csv' && step === 1 && (
        <div className="space-y-2">
          <p className="mb-2 text-sm text-slate-500">We auto-matched 9 of 12 columns. Review the rest.</p>
          {[['sku', 'Product ID', true], ['name', 'Title', true], ['price_usd', 'Price', true], ['colour', 'Color', true], ['desc', 'Description', true], ['fabric', 'Material', false], ['wear_for', 'Occasion', false], ['stock_qty', 'Inventory', true]].map(([a, b, auto]) => (
            <div key={a as string} className="grid grid-cols-[1fr_24px_1fr_auto] items-center gap-2 text-sm"><code className="rounded bg-slate-100 px-2 py-1">{a as string}</code>→<select defaultValue={b as string} className={inputCls}><option>{b as string}</option><option>Ignore</option></select>{auto ? <Badge tone="green">Auto</Badge> : <Badge tone="amber">Suggested</Badge>}</div>
          ))}
        </div>
      )}
      {kind === 'csv' && step === 2 && <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">✅ 1,271 rows are valid · ⚠️ 13 rows have warnings (missing price, bad URL) – you can download the error report.</div>}

      {kind !== 'csv' && step === 0 && (
        kind === 'sftp' ? (
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Host"><input className={inputCls} defaultValue="sftp.fernhill.com" /></Field><Field label="Port"><input className={inputCls} defaultValue="22" /></Field><Field label="Username"><input className={inputCls} defaultValue="glance_feed" /></Field><Field label="Path"><input className={inputCls} defaultValue="/exports/catalog.csv" /></Field></div>
        ) : kind === 'attr' && flow.id !== 'ga4' ? (
          <Field label="API key" hint="Generated in Northbeam › Settings › API"><input className={inputCls} defaultValue="nb_live_••••••••••••" /></Field>
        ) : (
          <div className="rounded-xl border border-slate-200 p-5 text-center"><div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-3xl">{flow.id === 'shopify' ? '🛍️' : '🔐'}</div><p className="font-medium text-slate-900">Authorize Glance to access {flow.name}</p><p className="mt-1 text-sm text-slate-500">Read-only access to products, inventory, orders and collections.</p><Button variant="primary" className="mt-4" onClick={() => setStep(1)}>Continue to {flow.name}</Button></div>
        )
      )}
      {kind !== 'csv' && step === 1 && (
        kind === 'attr' ? (
          <div>
            <p className="mb-3 text-sm text-slate-500">Map conversion events from {flow.name} to Glance events.</p>
            {[['page_view', 'Product view'], ['add_to_cart', 'Add to cart'], ['begin_checkout', 'Checkout started'], ['purchase', 'Purchase']].map(([a, b]) => <div key={a} className="mb-2 grid grid-cols-[1fr_24px_1fr_auto] items-center gap-2 text-sm"><code className="rounded bg-slate-100 px-2 py-1">{a}</code>→<span className="font-medium">{b}</span><Badge tone="green">Matched</Badge></div>)}
          </div>
        ) : (
          <div className="space-y-2 text-sm">{(dataOptions[kind] ?? dataOptions.store).map((x) => <label key={x} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3"><input type="checkbox" defaultChecked className="accent-brand-600" />{x}</label>)}</div>
        )
      )}
      {kind !== 'csv' && step === 2 && (
        kind === 'attr' ? (
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Click-through window"><select className={inputCls}><option>7 days</option><option>14 days</option><option>30 days</option></select></Field><Field label="View-through window"><select className={inputCls}><option>1 day</option><option>Off</option></select></Field><Field label="Source of truth"><select className={inputCls}><option>Glance pixel</option><option>{flow.name}</option></select></Field><Field label="De-duplication"><select className={inputCls}><option>Prefer click-based</option></select></Field></div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Sync frequency"><select className={inputCls}><option>Every 6 hours</option><option>Hourly</option><option>Daily</option></select></Field><Field label="On product removed"><select className={inputCls}><option>Mark as inactive</option></select></Field></div>
        )
      )}
      {step === last && kind !== 'csv' && <div className="rounded-xl bg-emerald-50 p-5 text-center"><p className="text-3xl">🎉</p><p className="mt-1 font-semibold text-emerald-800">{flow.name} {connected ? 'is connected' : 'connected successfully'}</p><p className="text-sm text-emerald-700">First sync is running… 1,284 items discovered.</p></div>}

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={step === 0 || connected ? onClose : () => setStep(step - 1)}>{step === 0 || connected ? 'Cancel' : 'Back'}</Button>
        {!(step === 0 && kind !== 'csv' && kind !== 'sftp' && !(kind === 'attr' && flow.id !== 'ga4')) && <Button variant="primary" onClick={() => (step === last || connected ? onDone() : setStep(step + 1))}>{step === last || connected ? 'Done' : 'Next'}</Button>}
      </div>
    </Modal>
  )
}

function SyncStatus() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[['Last successful sync', '2h ago', 'green'], ['Products synced', '1,284', 'green'], ['Open errors', '3', 'amber'], ['Next scheduled', 'in 4h', 'green']].map(([a, b]) => <Card key={a} className="!p-4"><p className="text-xs text-slate-500">{a}</p><p className="mt-1 text-2xl font-bold text-slate-900">{b}</p></Card>)}
      </div>
      <Card pad={false}>
        <div className="p-5 pb-0"><CardHeader title="Sync history" right={<Button size="sm"><RefreshCw size={12} /> Sync all</Button>} /></div>
        <Table head={['Time', 'Source', 'Items', 'Errors', 'Duration', 'Status', '']}>
          {syncHistory.map((s, i) => (
            <tr key={i} className="hover:bg-slate-50"><Td>{s.time}</Td><Td className="font-medium">{s.source}</Td><Td>{num(s.items)}</Td><Td>{s.errors}</Td><Td>{s.dur}</Td>
              <Td><Badge tone={s.status === 'Success' ? 'green' : s.status === 'Failed' ? 'red' : 'amber'}>{s.status}</Badge></Td>
              <Td>{s.errors > 0 && <button className="text-xs font-medium text-brand-600">View errors</button>}</Td></tr>
          ))}
        </Table>
      </Card>
      <Card>
        <CardHeader title="Feed diagnostics" sub="Issues from the last 3 syncs" />
        <div className="space-y-2">
          {[['41 variants', 'Price field contains non-numeric characters (“$”)', 'red'], ['3 products', 'Missing image URL', 'amber'], ['12 products', 'GTIN missing – recommended for matching', 'amber']].map(([a, b, t]) => (
            <div key={b} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm"><span className="flex items-center gap-2"><AlertTriangle size={14} className={t === 'red' ? 'text-rose-500' : 'text-amber-500'} /><b>{a}</b> · {b}</span><span className="flex gap-2"><Button size="sm">Fix with Copilot</Button><Button size="sm" variant="ghost">Ask support</Button></span></div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function PixelTab() {
  const [m, setM] = useState('Shopify app')
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="Install the Glance pixel" sub="Lets us attribute sales to lockscreen, TV and agent traffic." />
        <Tabs tabs={['Shopify app', 'Google Tag Manager', 'Manual']} value={m} onChange={setM} />
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300">{`<script>
  !function(l,u,m,i,o){l.glance=l.glance||function(){(l.glance.q=l.glance.q||[]).push(arguments)};
  var s=u.createElement('script');s.async=1;s.src='https://cdn.glance.shop/px.js';u.head.appendChild(s)}(window,document);
  glance('init', 'PX-FH-48291');
  glance('track', 'page_view');
</script>`}</pre>
        <div className="mt-3 flex gap-2"><Button size="sm"><Copy size={12} /> Copy snippet</Button><Button size="sm" variant="ghost">Email to developer</Button></div>
        <p className="mt-4 text-sm text-slate-500">{m === 'Shopify app' ? 'Install the Glance app from the Shopify App Store – the pixel is added automatically.' : m === 'Google Tag Manager' ? 'Create a Custom HTML tag, paste the snippet, trigger on All Pages.' : 'Paste before the closing </head> tag on every page.'}</p>
      </Card>
      <Card>
        <CardHeader title="Pixel health" right={<Badge tone="green">● Healthy</Badge>} />
        <div className="space-y-3 text-sm">
          {[['page_view', '48.2K', 'now'], ['product_view', '31.7K', '1m ago'], ['add_to_cart', '5.9K', '2m ago'], ['purchase', '1.1K', '6m ago']].map(([e, c, t]) => <div key={e} className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /><code>{e}</code></span><span className="text-slate-500">{c} · {t}</span></div>)}
        </div>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Last 24h · Domain verified: fernhillapparel.com · Consent mode: respected</div>
        <Button className="mt-3 w-full" size="sm">Run verification</Button>
      </Card>
    </div>
  )
}

function AttributionTab({ onConnect }: { onConnect: () => void }) {
  const { attribution, setAttribution } = useApp()
  const rows = [
    ['Orders', '7,150', '7,842', '+9.7%'], ['Revenue', '$518.6K', '$561.2K', '+8.2%'], ['ROAS (paid)', '3.4x', '3.1x', '-8.8%'], ['New customers', '3,420', '3,980', '+16.4%'],
  ]
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[['Glance Pixel', 'Platform first-party pixel', 'Active'], ['Google Analytics 4', 'Imported conversions · last import 06:00', 'Connected'], ['Northbeam', 'Multi-touch attribution', 'Not connected']].map(([n, d, s]) => (
          <Card key={n}><div className="flex items-start justify-between"><b className="text-slate-900">{n}</b><Badge tone={s === 'Not connected' ? 'slate' : 'green'}>{s}</Badge></div><p className="mt-1 text-sm text-slate-500">{d}</p>{s === 'Not connected' && <Button size="sm" variant="primary" className="mt-3" onClick={onConnect}>Connect</Button>}</Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Reconciliation" sub="Glance-reported vs. GA4-reported · last 30 days" right={<Badge tone="amber">Gap explained</Badge>} />
          <Table head={['Metric', 'Glance pixel', 'GA4', 'Difference']}>
            {rows.map((r) => <tr key={r[0]}><Td className="font-medium">{r[0]}</Td><Td>{r[1]}</Td><Td>{r[2]}</Td><Td className={r[3].startsWith('-') ? 'text-rose-600' : 'text-slate-600'}>{r[3]}</Td></tr>)}
          </Table>
          <div className="mt-4 space-y-2 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Why the numbers differ</p>
            <p>• GA4 uses a last-non-direct-click model with a 30-day window; Glance uses 7-day click + 1-day view.</p>
            <p>• 4.1% of GA4 purchases come from users who first saw an ad on a TV screensaver (view-through), which GA4 cannot see.</p>
            <p>• 1.8% duplicate purchase events were de-duplicated on the Glance side.</p>
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Attribution source" sub="Applies to Analytics & Ads Reporting" />
            {(['Glance Pixel', 'GA4', 'Northbeam'] as const).map((a) => (
              <label key={a} className="mb-2 flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input type="radio" checked={attribution === a} onChange={() => setAttribution(a)} className="accent-brand-600" />{a}{a === 'Northbeam' && <Badge>Not connected</Badge>}</label>
            ))}
            <div className="mt-3 space-y-2"><Toggle on label="Include view-through conversions" onChange={() => {}} /><Toggle on label="De-duplicate across sources" onChange={() => {}} /></div>
          </Card>
          <Card>
            <CardHeader title="Data health" />
            <div className="space-y-2 text-sm">{[['Event match rate', '96.4%'], ['Last import', 'Today 06:00'], ['Unmapped events', '0'], ['Flagged discrepancies', '2']].map(([a, b]) => <div key={a} className="flex justify-between"><span className="text-slate-500">{a}</span><b>{b}</b></div>)}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
