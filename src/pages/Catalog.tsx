import { useState } from 'react'
import { Sparkles, Star, X, Wand2, Check } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Field, PageHeader, Progress, Table, Tabs, Td, cx, inputCls, money, num } from '../components/ui'
import { Product, products } from '../data'
import { useApp } from '../store'
import { PublishToSource } from '../components/PublishToSource'

export function CatalogPage() {
  const { catalogScore, openCopilot } = useApp()
  const [tab, setTab] = useState('Products')
  const [sel, setSel] = useState<Product | null>(null)
  const [filter, setFilter] = useState('All')
  const list = products.filter((p) => filter === 'All' || p.status === filter)
  const fixed = catalogScore >= 70
  return (
    <>
      <PageHeader title="Catalog" sub="1,284 products synced from Shopify, SFTP and Yotpo." actions={<><Button onClick={() => openCopilot('Show products missing data')}>Ask Copilot</Button><Button variant="primary" onClick={() => openCopilot('Run Catalog Fixer')}><Wand2 size={15} /> Fix with agent</Button></>} />
      <div className="mb-6 grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <p className="text-xs font-medium text-slate-500">Agent-readiness score</p>
          <p className="mt-1 text-4xl font-bold text-slate-900">{catalogScore}<span className="text-lg text-slate-400">/100</span></p>
          <div className="my-2"><Progress value={catalogScore} tone={catalogScore < 60 ? 'amber' : 'green'} /></div>
          <p className="text-xs text-slate-500">{fixed ? 'Improved after Catalog Fixer run R-312' : 'Industry median: 71'}</p>
        </Card>
        {[['Live', fixed ? '1,198' : '1,031', 'green'], ['Needs attention', fixed ? '71' : '214', 'amber'], ['Disapproved', fixed ? '15' : '39', 'red']].map(([a, b, t]) => (
          <Card key={a} className="!p-4"><p className="text-xs font-medium text-slate-500">{a}</p><p className="mt-1 text-3xl font-bold text-slate-900">{b}</p><Badge tone={t as 'green'}>{a === 'Live' ? 'Eligible for agents' : a === 'Needs attention' ? 'Reduced visibility' : 'Not shown'}</Badge></Card>
        ))}
      </div>
      <div className="mb-6"><PublishToSource /></div>
      <Tabs tabs={['Products', 'Quality fixes', 'Reviews', 'Size charts & specs']} value={tab} onChange={setTab} />

      {tab === 'Products' && (
        <Card pad={false}>
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-2">{['All', 'Live', 'Needs attention', 'Disapproved'].map((f) => <button key={f} onClick={() => setFilter(f)} className={cx('rounded-full border px-3 py-1 text-xs', filter === f ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600')}>{f}</button>)}</div>
            <input placeholder="Search products…" className="w-60 rounded-lg border border-slate-200 px-3 py-1.5 text-sm" />
          </div>
          <Table head={['Product', 'Category', 'Price', 'Stock', 'Rating', 'Quality', 'Status', 'Conv.']}>
            {list.map((p) => {
              const sc = fixed ? Math.min(96, p.score + 24) : p.score
              return (
                <tr key={p.id} onClick={() => setSel(p)} className="cursor-pointer hover:bg-brand-50/40">
                  <Td><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xl">{p.img}</span><div><p className="font-medium text-slate-900">{p.title}</p><p className="text-xs text-slate-400">{p.id}</p></div></div></Td>
                  <Td>{p.category}</Td><Td>{money(p.price)}</Td><Td>{p.stock}</Td><Td><span className="inline-flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" />{p.rating} <span className="text-slate-400">({p.reviews})</span></span></Td>
                  <Td><div className="flex w-28 items-center gap-2"><Progress value={sc} tone={sc < 55 ? 'red' : sc < 75 ? 'amber' : 'green'} /><span className="text-xs font-medium">{sc}</span></div></Td>
                  <Td><Badge tone={p.status === 'Live' ? 'green' : p.status === 'Disapproved' ? 'red' : 'amber'}>{p.status}</Badge></Td><Td>{p.conv}%</Td>
                </tr>
              )
            })}
          </Table>
        </Card>
      )}

      {tab === 'Quality fixes' && (
        <div className="space-y-3">
          {[['Missing material', 62, '“sustainable”, “cotton”, “wool” queries'], ['Missing occasion / use case', 88, '“wedding guest”, “interview”, “date night” queries'], ['No fit information', 47, '“relaxed fit”, “runs small” queries'], ['Titles too short or unclear', 31, 'Reduces keyword and semantic match'], ['Missing size chart', 22, 'Increases returns and agent hesitation'], ['No GTIN / barcode', 12, 'Blocks price comparison matching']].map(([t, n, why]) => (
            <Card key={t as string} className="flex items-center gap-4 !p-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-amber-50 text-lg font-bold text-amber-700">{fixed ? Math.round((n as number) / 4) : n}</div>
              <div className="flex-1"><p className="font-semibold text-slate-900">{t as string}</p><p className="text-sm text-slate-500">Affects: {why as string}</p></div>
              <Button size="sm" onClick={() => openCopilot('Run Catalog Fixer')}><Sparkles size={12} /> Fix with agent</Button><Button size="sm" variant="ghost">Fix manually</Button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Reviews' && (
        <div className="grid gap-4 lg:grid-cols-2">
          {products.slice(0, 4).map((p) => (
            <Card key={p.id}>
              <div className="flex items-center gap-3"><span className="text-2xl">{p.img}</span><div><p className="font-semibold">{p.title}</p><p className="text-xs text-slate-500">★ {p.rating} · {num(p.reviews)} reviews via Yotpo</p></div></div>
              <div className="mt-3 rounded-lg bg-violet-50 p-3 text-sm text-violet-900"><b className="mr-1">AI summary:</b>Customers love the soft feel and true-to-size fit. A few mention it pills after multiple washes. Frequently bought for travel and office wear.</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs"><div className="rounded bg-emerald-50 p-2 text-emerald-800">👍 Soft · Warm · True to size</div><div className="rounded bg-rose-50 p-2 text-rose-800">👎 Pilling · Pricey</div></div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Size charts & specs' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><CardHeader title="Size chart – Tops" right={<Badge tone="green">Applied to 312 products</Badge>} />
            <Table head={['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)']}>{[['S', '36–38', '27', '33'], ['M', '38–40', '28', '34'], ['L', '40–43', '29', '35'], ['XL', '43–46', '30', '36']].map((r) => <tr key={r[0]}>{r.map((c, i) => <Td key={i}>{c}</Td>)}</tr>)}</Table>
            <div className="mt-3 flex gap-2"><Button size="sm">Edit chart</Button><Button size="sm" variant="ghost">Upload PDF / image</Button></div></Card>
          <Card><CardHeader title="Extra specifications" /><div className="space-y-3 text-sm">{[['Care', 'Machine wash cold, tumble dry low'], ['Sustainability', 'GOTS organic cotton, recycled packaging'], ['Origin', 'Made in Portugal']].map(([a, b]) => <Field key={a} label={a}><input className={inputCls} defaultValue={b} /></Field>)}</div></Card>
        </div>
      )}

      {sel && <ProductDrawer p={sel} fixed={fixed} onClose={() => setSel(null)} />}
    </>
  )
}

function ProductDrawer({ p, fixed, onClose }: { p: Product; fixed: boolean; onClose: () => void }) {
  const [accepted, setAccepted] = useState<string[]>([])
  const suggestions = [
    ['Occasion', 'Work, Weekend, Travel'], ['Material', '80% merino wool, 20% nylon'], ['Fit', 'Regular fit – true to size'], ['Title', `Fernhill ${p.title} – Men's ${p.category} for Work & Weekend`],
  ]
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="anim-slide h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-3xl">{p.img}</span><div><h2 className="text-lg font-bold">{p.title}</h2><p className="text-sm text-slate-500">{p.id} · {money(p.price)} · {p.stock} in stock</p></div></div><button onClick={onClose} className="rounded p-1 hover:bg-slate-100"><X size={18} /></button></div>

        <div className="mb-5 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-900"><Wand2 size={15} /> AI enrichment suggestions</div>
          {suggestions.map(([f, v]) => {
            const on = accepted.includes(f) || (fixed && f !== 'Title')
            return (
              <div key={f} className="flex items-center justify-between gap-2 border-t border-violet-100 py-2 text-sm"><div><p className="text-xs text-violet-600">{f}</p><p className="text-slate-800">{v}</p></div>{on ? <Badge tone="green"><Check size={10} /> Accepted</Badge> : <Button size="sm" onClick={() => setAccepted([...accepted, f])}>Accept</Button>}</div>
            )
          })}
          <Button variant="primary" size="sm" className="mt-2" onClick={() => setAccepted(suggestions.map((s) => s[0]))}>Accept all</Button>
        </div>

        <h4 className="mb-2 text-sm font-semibold">Core attributes</h4>
        <div className="mb-5 grid grid-cols-2 gap-3">
          <Field label="Title"><input className={inputCls} defaultValue={p.title} /></Field><Field label="Category"><input className={inputCls} defaultValue={p.category} /></Field>
          <Field label="Price"><input className={inputCls} defaultValue={p.price} /></Field><Field label="Inventory"><input className={inputCls} defaultValue={p.stock} /></Field>
        </div>
        <h4 className="mb-2 text-sm font-semibold">Agent-ready fields <span className="font-normal text-slate-400">(how shoppers describe what they need)</span></h4>
        <div className="mb-5 space-y-3">
          <Field label="Occasions"><div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-300 p-2">{(accepted.includes('Occasion') || fixed ? ['Work', 'Weekend', 'Travel'] : p.occasions).map((o) => <Badge key={o} tone="violet">{o}</Badge>)}{p.occasions.length === 0 && !accepted.includes('Occasion') && !fixed && <span className="text-xs text-slate-400">None – add occasions</span>}</div></Field>
          <Field label="Who it's for"><input className={inputCls} placeholder="e.g. commuters who want a polished look that travels well" /></Field>
          <Field label="Styling note / subjective description"><textarea className={inputCls} rows={2} placeholder="e.g. Pairs well with dark denim; smart enough for client meetings." /></Field>
          <Field label="FAQs"><button className="text-sm font-medium text-brand-600">+ Add question</button></Field>
        </div>
        <h4 className="mb-2 text-sm font-semibold">Missing data</h4>
        <div className="flex flex-wrap gap-1.5">{(fixed ? [] : p.missing).map((m) => <Badge key={m} tone="amber">{m}</Badge>)}{(fixed || !p.missing.length) && <Badge tone="green">All required fields present</Badge>}</div>
        <div className="mt-6 flex gap-2"><Button variant="primary">Save changes</Button><Button>Ask support about this product</Button></div>
      </div>
    </div>
  )
}
