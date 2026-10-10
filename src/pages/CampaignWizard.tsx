import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Smartphone, Tv, MessageSquare, Globe, Zap, SlidersHorizontal } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Field, Kpi, PageHeader, cx, inputCls, money } from '../components/ui'

const steps = ['Objective', 'Buying mode', 'Products', 'Audience', 'Budget & schedule', 'Creative', 'Review']
const objectives = [['Sales', 'Drive purchases and ROAS'], ['Awareness', 'Reach as many relevant shoppers as possible'], ['Traffic', 'Send shoppers to your store'], ['Product launch', 'Introduce new arrivals'], ['Clearance', 'Move excess inventory']]
const placements = [{ id: 'lock', name: 'Mobile Lockscreen', Icon: Smartphone, cpm: 9.2, cpc: 0.46 }, { id: 'tv', name: 'TV Ambient Screensaver', Icon: Tv, cpm: 12.5, cpc: 0.95 }, { id: 'agent', name: 'Agent Search & Chat (sponsored)', Icon: MessageSquare, cpm: 14.8, cpc: 0.72 }, { id: 'dsp', name: '3P Open Web (DSP)', Icon: Globe, cpm: 6.4, cpc: 0.55 }]

export function CampaignWizard() {
  const [step, setStep] = useState(0)
  const [obj, setObj] = useState('Sales')
  const [mode, setMode] = useState<'smart' | 'manual'>('smart')
  const [bid, setBid] = useState<'CPM' | 'CPC'>('CPM')
  const [places, setPlaces] = useState<string[]>(['lock', 'tv'])
  const [budget, setBudget] = useState(6000)
  const [roas, setRoas] = useState(3.5)
  const [prod, setProd] = useState('Collection: Autumn Trail')
  const [done, setDone] = useState(false)
  const [preview, setPreview] = useState<'lock' | 'tv' | 'agent'>('lock')

  const mult = mode === 'smart' ? 1.12 : 1
  const impr = Math.round(((budget / 10) * 1000) * mult)
  const clicks = Math.round(impr * 0.034)
  const rev = Math.round(budget * (mode === 'smart' ? roas : 3.0 + places.length * 0.12))

  if (done)
    return (
      <Card className="mx-auto mt-10 max-w-lg text-center"><p className="text-5xl">🚀</p><h2 className="mt-3 text-xl font-bold">Campaign submitted</h2><p className="mt-1 text-sm text-slate-500">Creatives are in review (≈ 15 min). SmartAds will start in a learning phase.</p><div className="mt-5 flex justify-center gap-2"><Link to="/ads"><Button variant="primary">Back to campaigns</Button></Link><Link to="/simulator"><Button>See it in the shopper simulator</Button></Link></div></Card>
    )

  return (
    <>
      <PageHeader title="Create campaign" sub="Step by step. Forecast updates as you change settings." />
      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((s, i) => <button key={s} onClick={() => setStep(i)} className={cx('flex items-center gap-2 rounded-full px-3 py-1.5 text-sm', i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-500 ring-1 ring-slate-200')}>{i < step ? <Check size={13} /> : <span className="text-xs">{i + 1}</span>}{s}</button>)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {step === 0 && (<><CardHeader title="What is your goal?" /><div className="grid gap-3 sm:grid-cols-2">{objectives.map(([a, b]) => <button key={a} onClick={() => setObj(a)} className={cx('rounded-xl border p-4 text-left', obj === a ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300')}><p className="font-semibold">{a}</p><p className="text-sm text-slate-500">{b}</p></button>)}</div></>)}

          {step === 1 && (
            <>
              <CardHeader title="How do you want to buy?" />
              <div className="grid gap-4 md:grid-cols-2">
                <button onClick={() => setMode('smart')} className={cx('rounded-xl border p-5 text-left', mode === 'smart' ? 'border-brand-600 bg-brand-50' : 'border-slate-200')}><Zap className="mb-2 text-brand-600" /><p className="font-semibold">SmartAds <Badge tone="violet">Recommended</Badge></p><p className="mt-1 text-sm text-slate-500">Set a budget and target ROAS. Lumio picks surfaces, bids and audiences automatically.</p></button>
                <button onClick={() => setMode('manual')} className={cx('rounded-xl border p-5 text-left', mode === 'manual' ? 'border-brand-600 bg-brand-50' : 'border-slate-200')}><SlidersHorizontal className="mb-2 text-brand-600" /><p className="font-semibold">Manual</p><p className="mt-1 text-sm text-slate-500">Choose placements and pay per 1,000 impressions (CPM) or per click (CPC).</p></button>
              </div>
              {mode === 'manual' && (
                <div className="mt-5 space-y-4">
                  <div className="flex gap-2">{(['CPM', 'CPC'] as const).map((b) => <button key={b} onClick={() => setBid(b)} className={cx('rounded-lg border px-4 py-2 text-sm font-medium', bid === b ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200')}>{b}</button>)}</div>
                  <div className="space-y-2">{placements.map((p) => (
                    <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3"><input type="checkbox" className="accent-brand-600" checked={places.includes(p.id)} onChange={() => setPlaces(places.includes(p.id) ? places.filter((x) => x !== p.id) : [...places, p.id])} /><p.Icon size={18} className="text-slate-500" /><span className="flex-1 text-sm font-medium">{p.name}</span><span className="text-xs text-slate-400">Suggested {bid === 'CPM' ? `$${p.cpm} CPM` : `$${p.cpc} CPC`}</span><input className="w-20 rounded border border-slate-300 px-2 py-1 text-sm" defaultValue={bid === 'CPM' ? p.cpm : p.cpc} /></label>
                  ))}</div>
                </div>
              )}
              {mode === 'smart' && <div className="mt-5 rounded-xl bg-violet-50 p-4 text-sm text-violet-900">SmartAds will allocate across Lockscreen, TV, agent search and 3P based on live conversion data and shift budget to what works.</div>}
            </>
          )}

          {step === 2 && (<><CardHeader title="Which products?" /><div className="space-y-2">{['All products', 'Collection: Autumn Trail', 'Merchandising flag: Clearance', 'Merchandising flag: New launches', 'Choose individually'].map((x) => <label key={x} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input type="radio" className="accent-brand-600" checked={prod === x} onChange={() => setProd(x)} />{x}</label>)}</div><p className="mt-3 text-xs text-amber-700">⚠️ 6 products in this selection have low quality scores and may under-deliver. <button className="font-medium underline">Fix with agent</button></p></>)}

          {step === 3 && (
            <><CardHeader title="Who should see it?" />
              <div className="space-y-4">
                <Field label="Shopper intents"><div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-300 p-2">{['Wedding guest outfits', 'Work-from-home basics', 'Warm layers'].map((i) => <Badge key={i} tone="violet">{i} ✕</Badge>)}</div></Field>
                <Field label="Retargeting audiences"><div className="space-y-1.5 text-sm">{['Site visitors – last 30d', 'Cart abandoners – 7d'].map((a) => <label key={a} className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-brand-600" />{a}</label>)}</div></Field>
                <div className="grid grid-cols-3 gap-3"><Field label="Age"><select className={inputCls}><option>25–54</option></select></Field><Field label="Geo"><select className={inputCls}><option>United States</option></select></Field><Field label="Devices"><select className={inputCls}><option>Mobile, TV, Laptop</option></select></Field></div>
              </div>
            </>
          )}

          {step === 4 && (
            <><CardHeader title="Budget & schedule" />
              <div className="space-y-5">
                <Field label={`Total budget: ${money(budget)}`}><input type="range" min={1000} max={30000} step={500} value={budget} onChange={(e) => setBudget(+e.target.value)} className="w-full accent-brand-600" /></Field>
                {mode === 'smart' && <Field label={`Target ROAS: ${roas.toFixed(1)}x`} hint="Higher targets mean tighter delivery and fewer conversions."><input type="range" min={1.5} max={6} step={0.1} value={roas} onChange={(e) => setRoas(+e.target.value)} className="w-full accent-brand-600" /></Field>}
                <div className="grid grid-cols-2 gap-3"><Field label="Start"><input type="date" className={inputCls} defaultValue="2026-10-12" /></Field><Field label="End"><input type="date" className={inputCls} defaultValue="2026-11-12" /></Field></div>
              </div>
            </>
          )}

          {step === 5 && (
            <><CardHeader title="Creatives" sub="Generated from your products and brand profile. Edit or regenerate." />
              <div className="flex gap-2">{(['lock', 'tv', 'agent'] as const).map((p) => <Button key={p} size="sm" variant={preview === p ? 'dark' : 'secondary'} onClick={() => setPreview(p)}>{p === 'lock' ? 'Lockscreen' : p === 'tv' ? 'TV screensaver' : 'Agent result'}</Button>)}</div>
              <div className="mt-4 grid place-items-center rounded-xl bg-slate-100 p-6"><Preview kind={preview} /></div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Headline"><input className={inputCls} defaultValue="Warmth that works. Autumn Trail." /></Field><Field label="Call to action"><select className={inputCls}><option>Shop now</option></select></Field></div></>
          )}

          {step === 6 && (
            <><CardHeader title="Review" />
              <div className="divide-y divide-slate-100 text-sm">{[['Objective', obj], ['Buying mode', mode === 'smart' ? `SmartAds · target ROAS ${roas.toFixed(1)}x` : `Manual · ${bid} · ${places.length} placements`], ['Products', prod], ['Budget', money(budget)], ['Schedule', 'Oct 12 – Nov 12']].map(([a, b]) => <div key={a} className="flex justify-between py-2.5"><span className="text-slate-500">{a}</span><b>{b}</b></div>)}</div>
              <Button variant="primary" className="mt-5" onClick={() => setDone(true)}>Launch campaign</Button></>
          )}

          <div className="mt-6 flex justify-between border-t border-slate-100 pt-4"><Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>{step < 6 && <Button variant="primary" onClick={() => setStep(step + 1)}>Continue</Button>}</div>
        </Card>

        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader title="Forecast" sub="Based on similar campaigns" right={<Badge tone="green">Live</Badge>} />
            <div className="grid grid-cols-2 gap-3">
              <Kpi label="Est. impressions" value={`${(impr / 1000).toFixed(0)}K`} sub="" /><Kpi label="Est. clicks" value={`${(clicks / 1000).toFixed(1)}K`} sub="" />
              <Kpi label="Est. revenue" value={money(rev)} sub="" /><Kpi label="Est. ROAS" value={`${(rev / budget).toFixed(1)}x`} sub="" />
            </div>
            <p className="mt-3 text-xs text-slate-500">Increase budget by $1,000 → ≈ +{Math.round(rev / budget * 780)} revenue (diminishing returns after $12K).</p>
          </Card>
        </div>
      </div>
    </>
  )
}

export function Preview({ kind }: { kind: 'lock' | 'tv' | 'agent' }) {
  if (kind === 'lock')
    return (
      <div className="w-56 rounded-[2rem] border-8 border-slate-900 bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 p-3 pb-6 text-white shadow-xl">
        <p className="mt-6 text-center text-5xl font-light">9:41</p><p className="text-center text-xs">Saturday, October 10</p>
        <div className="mt-8 rounded-2xl bg-white/90 p-3 text-slate-800 backdrop-blur"><p className="text-[9px] font-semibold uppercase text-slate-400">Sponsored · Fernhill</p><div className="my-2 grid h-24 place-items-center rounded-xl bg-amber-100 text-5xl">🧥</div><p className="text-sm font-semibold">Warmth that works.</p><p className="text-xs text-slate-500">Autumn Trail from $98</p><div className="mt-2 rounded-lg bg-slate-900 py-1.5 text-center text-xs font-medium text-white">Shop now</div></div>
      </div>
    )
  if (kind === 'tv')
    return (
      <div className="w-full max-w-md"><div className="aspect-video overflow-hidden rounded-lg border-[6px] border-slate-900 bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 p-5 text-white shadow-xl"><div className="flex h-full items-center gap-4"><div className="text-8xl">🧥</div><div><p className="text-[10px] uppercase tracking-widest text-indigo-300">Ambient · Sponsored</p><p className="text-xl font-bold">Autumn Trail Collection</p><p className="text-xs text-indigo-200">Waterproof. Warm. Made to last.</p><p className="mt-2 inline-block rounded bg-white/15 px-2 py-1 text-[10px]">Scan QR or say “Hey Lumio, show me this jacket”</p></div></div></div><div className="mx-auto h-2 w-24 rounded-b bg-slate-700" /></div>
    )
  return (
    <div className="w-72 rounded-2xl bg-white p-4 shadow-xl"><div className="mb-2 rounded-xl bg-slate-100 p-2 text-xs">warm jacket for commuting under $200</div><div className="rounded-xl border border-brand-200 p-3 text-xs"><div className="mb-1 flex justify-between"><Badge tone="violet">Sponsored</Badge><span className="text-slate-400">Fernhill</span></div><div className="flex items-center gap-3"><span className="text-3xl">🧥</span><div><p className="font-semibold text-sm">Trail Shell Jacket</p><p className="text-slate-500">$189 · ★ 4.6 · Waterproof</p></div></div></div></div>
  )
}
