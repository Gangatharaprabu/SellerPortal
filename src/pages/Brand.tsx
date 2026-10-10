import { useState } from 'react'
import { Sparkles, Plus, Rocket, Tag, Star, Leaf } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Field, PageHeader, Progress, Tabs, inputCls } from '../components/ui'
import { useApp } from '../store'

const signals = [
  { type: 'New launch', icon: Rocket, tone: 'violet', name: 'Autumn Trail Collection', items: 24, dates: 'Oct 1 – Nov 15', boost: 'High' },
  { type: 'Clearance', icon: Tag, tone: 'amber', name: 'Summer tees & shorts', items: 86, dates: 'Until Oct 31', boost: 'Medium' },
  { type: 'Hero product', icon: Star, tone: 'blue', name: 'Merino Crew Sweater', items: 1, dates: 'Ongoing', boost: 'High' },
  { type: 'Seasonal', icon: Leaf, tone: 'green', name: 'Holiday gifting edit', items: 40, dates: 'Nov 15 – Dec 24', boost: 'Scheduled' },
] as const

export function BrandPage() {
  const { openCopilot } = useApp()
  const [tab, setTab] = useState('Brand profile')
  const [q, setQ] = useState('I need a warm sweater for a work trip to Chicago, I care about sustainability')
  const [shown, setShown] = useState(true)
  return (
    <>
      <PageHeader title="Brand Studio" sub="Tell shopping agents who you are and what you want to push." actions={<Button variant="primary" onClick={() => openCopilot('Draft my brand profile')}><Sparkles size={15} /> Draft with agent</Button>} />
      <Tabs tabs={['Brand profile', 'Merchandising', 'Promotions', 'Agent preview']} value={tab} onChange={setTab} />

      {tab === 'Brand profile' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="space-y-4 lg:col-span-2">
            <CardHeader title="Brand story" right={<Badge tone="amber">40% complete</Badge>} />
            <Field label="Brand name"><input className={inputCls} defaultValue="Fernhill Apparel" /></Field>
            <Field label="Brand story" hint="Agents quote this when shoppers ask 'who makes this?'"><textarea rows={4} className={inputCls} defaultValue="Fernhill makes durable everyday clothing from responsibly sourced fibres, designed in Portland and made in small batches." /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tone of voice"><select className={inputCls}><option>Warm & practical</option><option>Premium & minimal</option><option>Playful</option></select></Field>
              <Field label="Primary audience"><input className={inputCls} defaultValue="Urban professionals 28–45, value quality over trends" /></Field>
            </div>
            <Field label="Values"><div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-300 p-2">{['Sustainable', 'Small-batch', 'Lifetime repairs'].map((v) => <Badge key={v} tone="violet">{v} ✕</Badge>)}<span className="text-xs text-slate-400">+ add</span></div></Field>
            <Field label="Certifications"><div className="flex gap-2">{['GOTS Organic', 'B Corp', 'Fair Trade'].map((v, i) => <Badge key={v} tone={i < 2 ? 'green' : 'slate'}>{v}</Badge>)}</div></Field>
            <div className="flex gap-2"><Button variant="primary">Save profile</Button><Button>Preview as shopper</Button></div>
          </Card>
          <div className="space-y-6">
            <Card><CardHeader title="Profile completeness" /><Progress value={40} tone="amber" /><ul className="mt-3 space-y-1.5 text-sm text-slate-600"><li>✅ Name & logo</li><li>✅ Short story</li><li>⬜ Values & certifications</li><li>⬜ Return & shipping policy</li><li>⬜ Brand imagery</li></ul></Card>
            <Card><CardHeader title="Brand assets" /><div className="grid grid-cols-3 gap-2">{['🌲', '🧵', '👖', '📦', '🏔️'].map((e) => <div key={e} className="grid aspect-square place-items-center rounded-lg bg-slate-100 text-2xl">{e}</div>)}<button className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400"><Plus /></button></div></Card>
          </div>
        </div>
      )}

      {tab === 'Merchandising' && (
        <>
          <div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-500">Signals tell agents what to prioritise. Agents still recommend what is best for the shopper.</p><Button variant="primary"><Plus size={14} /> New signal</Button></div>
          <div className="grid gap-4 md:grid-cols-2">
            {signals.map((s) => (
              <Card key={s.name}>
                <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100"><s.icon size={18} /></div><div><Badge tone={s.tone as 'violet'}>{s.type}</Badge><p className="mt-1 font-semibold text-slate-900">{s.name}</p></div></div><Badge>{s.boost}</Badge></div>
                <div className="mt-3 flex justify-between text-sm text-slate-500"><span>{s.items} products</span><span>{s.dates}</span></div>
                <div className="mt-3 flex gap-2"><Button size="sm">Edit</Button><Button size="sm" variant="ghost" onClick={() => openCopilot('Optimize')}>Promote with ads →</Button></div>
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === 'Promotions' && (
        <Card><CardHeader title="Offers agents can surface" right={<Button size="sm" variant="primary"><Plus size={12} /> New offer</Button>} />
          {[['15% off first order', 'Code WELCOME15', 'Active'], ['Free shipping over $75', 'Automatic', 'Active'], ['Bundle: Sweater + Scarf save $20', '12 bundles', 'Scheduled']].map(([a, b, c]) => <div key={a} className="flex items-center justify-between border-t border-slate-100 py-3 text-sm"><div><p className="font-medium">{a}</p><p className="text-xs text-slate-400">{b}</p></div><Badge tone={c === 'Active' ? 'green' : 'blue'}>{c}</Badge></div>)}
        </Card>
      )}

      {tab === 'Agent preview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="How the agent sees your brand" sub="Simulate a shopper query and see what the agent says about you." />
            <Field label="Shopper query"><input value={q} onChange={(e) => setQ(e.target.value)} className={inputCls} /></Field>
            <Button variant="primary" className="mt-3" onClick={() => setShown(true)}>Run simulation</Button>
            <div className="mt-5 space-y-2 text-sm"><p className="font-semibold text-slate-800">Why you were chosen</p>{[['Occasion match: work travel', 92], ['Material: merino wool (sustainable)', 88], ['Brand values: B Corp, GOTS', 74], ['Price within budget', 61]].map(([l, v]) => <div key={l as string}><div className="flex justify-between text-xs"><span>{l}</span><span>{v}</span></div><Progress value={v as number} /></div>)}</div>
          </Card>
          {shown && (
            <div className="rounded-2xl bg-slate-900 p-5">
              <div className="mx-auto max-w-sm rounded-2xl bg-white p-4">
                <p className="mb-2 text-xs font-semibold text-slate-400">GLANCE SHOPPING AGENT</p>
                <div className="mb-3 rounded-xl rounded-bl-sm bg-slate-100 p-3 text-sm">{q}</div>
                <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-3 text-sm text-slate-800">Great choice for Chicago in October! The <b>Fernhill Merino Crew Sweater</b> is warm, packs light and works for client meetings. Fernhill is a B Corp that uses responsibly sourced merino.
                  <div className="mt-3 flex items-center gap-3 rounded-lg bg-white p-2 ring-1 ring-slate-200"><span className="text-3xl">👕</span><div><p className="font-medium">Merino Crew Sweater</p><p className="text-xs text-slate-500">$98 · ★ 4.7 (812) · Free shipping</p></div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
