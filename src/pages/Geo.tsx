import { ReactNode, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts'
import { AlertTriangle, Plus, Sparkles } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Kpi, PageHeader, Progress, Table, Td, cx, money, num } from '../components/ui'
import { accuracyIssues, aiDaily, aiLanding, aiTraffic, citations, competitors, engines, promptEngines, prompts, sovTrend, visTrend } from '../geoData'
import { useApp } from '../store'
import { GeoFix } from './GeoFix'
import { GeoTechnical, GeoOffsite, GeoAct, GeoPlatform } from './GeoMore'

const groups = ['Measure', 'Fix', 'Technical', 'Off-site', 'Act', 'Platform'] as const
const blurbs: Record<(typeof groups)[number], string> = {
  Measure: 'See how often AI engines mention and cite you, and what that traffic is worth.',
  Fix: 'Improve your product data and content so AI engines understand and recommend you.',
  Technical: 'Make sure AI crawlers can reach, read and trust your site.',
  'Off-site': 'Build the third-party authority that AI engines draw on.',
  Act: 'A ranked to-do list, with approvals, publishing and before/after proof.',
  Platform: 'Connections, reports, alerts and team access.',
}

export function SubNav({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {items.map((i) => <button key={i} onClick={() => onChange(i)} className={cx('rounded-full px-3 py-1.5 text-sm font-medium transition', value === i ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50')}>{i}</button>)}
    </div>
  )
}

export function GeoPage() {
  const [g, setG] = useState<(typeof groups)[number]>('Measure')
  const { openCopilot } = useApp()
  return (
    <>
      <PageHeader title="AEO / GEO" sub="Get recommended and cited by ChatGPT, Perplexity, Gemini, Google AI Overviews, Copilot and Glance."
        actions={<><select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select><Button variant="primary" onClick={() => openCopilot('GEO Optimizer')}><Sparkles size={15} /> Optimize with agent</Button></>} />
      <div className="mb-2 flex flex-wrap gap-2">
        {groups.map((x, i) => (
          <button key={x} onClick={() => setG(x)} className={cx('flex items-center gap-2 rounded-xl border px-4 py-2.5 text-left text-sm transition', g === x ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300')}>
            <span className={cx('grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold', g === x ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500')}>{i + 1}</span>
            <span className="font-semibold">{x}</span>
          </button>
        ))}
      </div>
      <p className="mb-5 text-sm text-slate-500">{blurbs[g]}</p>
      {g === 'Measure' && <Measure />}
      {g === 'Fix' && <GeoFix />}
      {g === 'Technical' && <GeoTechnical />}
      {g === 'Off-site' && <GeoOffsite />}
      {g === 'Act' && <GeoAct />}
      {g === 'Platform' && <GeoPlatform />}
    </>
  )
}

function Measure() {
  const [s, setS] = useState('Visibility')
  return (
    <>
      <SubNav items={['Visibility', 'Prompt library', 'Share of voice', 'Citations', 'Accuracy & sentiment', 'AI traffic']} value={s} onChange={setS} />
      {s === 'Visibility' && <Visibility />}
      {s === 'Prompt library' && <Prompts />}
      {s === 'Share of voice' && <ShareOfVoice />}
      {s === 'Citations' && <Citations />}
      {s === 'Accuracy & sentiment' && <Accuracy />}
      {s === 'AI traffic' && <AiTraffic />}
    </>
  )
}

function Visibility() {
  const { openCopilot } = useApp()
  const [hide, setHide] = useState<string[]>([])
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="AI visibility score" value="62 / 100" delta={7} sub="vs last month" />
        <Kpi label="Mention rate (avg of 5 engines)" value="14.6%" delta={3.1} sub="of tracked prompts" />
        <Kpi label="Avg. position when mentioned" value="3.8" delta={-0.3} good={false} sub="lower is better" />
        <Kpi label="Prompts tracked" value="248" sub="across 5 engines · daily" />
      </div>
      <Card>
        <CardHeader title="Visibility by engine" sub="Each engine is measured separately · share of tracked prompts where you are mentioned" right={<Badge tone="blue">Runs daily</Badge>} />
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">{['Engine', 'Mention rate', 'Avg. position', 'Sentiment', ''].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{engines.map((e) => (
            <tr key={e.name}><td className="px-3 py-3"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: e.color }} /><b>{e.name}</b></td>
              <td className="px-3 py-3"><div className="flex w-48 items-center gap-2"><Progress value={e.mention * 2.5} /><span className="w-10 text-right font-semibold">{e.mention}%</span></div></td>
              <td className="px-3 py-3">{e.pos}</td><td className="px-3 py-3"><Badge tone={e.sentiment > 80 ? 'green' : 'blue'}>{e.sentiment}% positive</Badge></td>
              <td className="px-3 py-3 text-right"><button className="text-xs font-medium text-brand-600" onClick={() => openCopilot('How visible am I in ChatGPT and Perplexity?')}>Explain</button></td></tr>))}</tbody></table></div>
      </Card>
      <Card>
        <CardHeader title="Mention rate over time" right={<div className="flex flex-wrap gap-1.5">{engines.map((e) => <button key={e.name} onClick={() => setHide(hide.includes(e.name) ? hide.filter((x) => x !== e.name) : [...hide, e.name])} className={cx('rounded-full border px-2 py-0.5 text-[11px]', hide.includes(e.name) ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-700')}>{e.name}</button>)}</div>} />
        <div className="h-72"><ResponsiveContainer><LineChart data={visTrend}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="w" tick={{ fontSize: 11 }} /><YAxis unit="%" tick={{ fontSize: 11 }} /><Tooltip /><Legend />
          {engines.filter((e) => !hide.includes(e.name)).map((e) => <Line key={e.name} dataKey={e.name} stroke={e.color} strokeWidth={2} dot={false} />)}</LineChart></ResponsiveContainer></div>
      </Card>
    </div>
  )
}

function Prompts() {
  const [list, setList] = useState(prompts)
  const [q, setQ] = useState('')
  const [intent, setIntent] = useState('All')
  const intents = ['All', 'Discovery', 'Comparison', 'Best X for Y', 'Brand & reviews']
  const shown = list.filter((p) => intent === 'All' || p.intent === intent)
  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center gap-3 !bg-violet-50">
        <Sparkles className="text-violet-600" size={18} />
        <p className="flex-1 text-sm text-violet-900"><b>186 prompts were auto-generated</b> from your catalog and categories. Add your own below, or let us suggest more from Market Insights.</p>
        <Button size="sm">Regenerate suggestions</Button>
      </Card>
      <div className="flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add a prompt, e.g. best running shoes for flat feet under $100" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
        <Button variant="primary" onClick={() => { if (q) { setList([{ q, intent: 'Discovery', vol: 'New', src: 'You', hits: [0, 0, 0, 0, 0], pos: 0 }, ...list]); setQ('') } }}><Plus size={14} /> Add</Button></div>
      <div className="flex flex-wrap gap-1.5">{intents.map((i) => <button key={i} onClick={() => setIntent(i)} className={cx('rounded-full border px-3 py-1 text-xs', intent === i ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600')}>{i}</button>)}</div>
      <Card pad={false}>
        <Table head={['Prompt', 'Intent', 'Source', ...promptEngines, 'Best pos.']}>
          {shown.map((p) => (
            <tr key={p.q} className="hover:bg-slate-50"><Td className="max-w-sm whitespace-normal font-medium text-slate-900">{p.q}</Td><Td><Badge tone="violet">{p.intent}</Badge></Td><Td><Badge>{p.src}</Badge></Td>
              {p.hits.map((h, i) => <Td key={i} className="text-center">{h ? <span className="text-emerald-600">●</span> : <span className="text-slate-300">○</span>}</Td>)}<Td>{p.pos ? `#${p.pos}` : '—'}</Td></tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

function ShareOfVoice() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader title="Share of voice by category" sub="Share of AI answers mentioning each brand" />
        <div className="h-72"><ResponsiveContainer><BarChart data={competitors}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="cat" /><YAxis unit="%" /><Tooltip /><Legend />
          <Bar dataKey="you" name="You" fill="#4f46e5" radius={4} /><Bar dataKey="a" name="Brand A" fill="#94a3b8" radius={4} /><Bar dataKey="b" name="Brand B" fill="#cbd5e1" radius={4} /><Bar dataKey="c" name="Brand C" fill="#e2e8f0" radius={4} /></BarChart></ResponsiveContainer></div></Card>
      <Card><CardHeader title="Trend vs competitors" sub="Outerwear · last 12 weeks" />
        <div className="h-72"><ResponsiveContainer><LineChart data={sovTrend}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="w" /><YAxis unit="%" /><Tooltip /><Legend />
          <Line dataKey="You" stroke="#4f46e5" strokeWidth={3} dot={false} /><Line dataKey="Brand A" stroke="#94a3b8" dot={false} /><Line dataKey="Brand B" stroke="#cbd5e1" dot={false} /><Line dataKey="Brand C" stroke="#e2e8f0" dot={false} /></LineChart></ResponsiveContainer></div></Card>
      <Card className="lg:col-span-2"><CardHeader title="Competitor benchmark" right={<Button size="sm"><Plus size={12} /> Add competitor</Button>} />
        <Table head={['Category', 'You', 'Brand A', 'Brand B', 'Brand C', 'Gap to leader']}>
          {competitors.map((c) => { const lead = Math.max(c.a, c.b, c.c, c.you); return <tr key={c.cat}><Td className="font-medium">{c.cat}</Td><Td className="font-semibold text-brand-700">{c.you}%</Td><Td>{c.a}%</Td><Td>{c.b}%</Td><Td>{c.c}%</Td><Td>{c.you === lead ? <Badge tone="green">Leading</Badge> : <Badge tone="amber">–{lead - c.you} pts</Badge>}</Td></tr> })}
        </Table></Card>
    </div>
  )
}

function Citations() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card pad={false} className="lg:col-span-2"><div className="p-5 pb-0"><CardHeader title="Sources AI engines cite in your category" sub="Where answers about your category come from" /></div>
        <Table head={['Domain', 'Type', 'Share of citations', 'Example', 'Opportunity']}>
          {citations.map((c) => <tr key={c.domain} className={c.mine ? 'bg-brand-50/50' : ''}><Td className="font-medium">{c.domain}</Td><Td><Badge tone={c.mine ? 'violet' : 'slate'}>{c.kind}</Badge></Td><Td><div className="flex w-32 items-center gap-2"><Progress value={c.share * 4} /><span className="text-xs font-medium">{c.share}%</span></div></Td><Td className="max-w-xs truncate text-xs text-slate-500">{c.example}</Td><Td className="text-xs text-brand-700">{c.action}</Td></tr>)}
        </Table></Card>
      <div className="space-y-6">
        <Card><CardHeader title="Where citations come from" />{[['Third-party sites', 74], ['Your own site', 11], ['Reference (wiki)', 8], ['Other', 7]].map(([a, b]) => <div key={a as string} className="mb-3"><div className="flex justify-between text-sm"><span>{a}</span><b>{b}%</b></div><Progress value={(b as number) * 1.3} /></div>)}</Card>
        <Card className="!bg-amber-50"><p className="text-sm text-amber-900"><b>Insight:</b> 74% of citations come from sites you do not own. Off-site mentions matter more than your own pages for “best X” prompts.</p></Card>
      </div>
    </div>
  )
}

function Accuracy() {
  const { openCopilot } = useApp()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">{[['Accuracy of AI answers', '91%', 'green'], ['Wrong or outdated claims', '4', 'red'], ['Positive sentiment', '78%', 'green'], ['Neutral / negative', '22%', 'amber']].map(([a, b]) => <Card key={a} className="!p-4"><p className="text-xs text-slate-500">{a}</p><p className="mt-1 text-2xl font-bold text-slate-900">{b}</p></Card>)}</div>
      <Card><CardHeader title="Wrong or outdated claims about your brand" sub="Detected by comparing AI answers with your live catalog and policies" />
        <div className="space-y-3">{accuracyIssues.map((a) => (
          <div key={a.claim} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center gap-2"><Badge tone={a.sev === 'High' ? 'red' : a.sev === 'Medium' ? 'amber' : 'slate'}><AlertTriangle size={10} /> {a.sev}</Badge><Badge tone="blue">{a.engine}</Badge><Badge>{a.type}</Badge></div>
            <p className="mt-2 text-sm text-slate-800"><span className="text-rose-600 line-through">{a.claim}</span></p>
            <p className="text-sm text-emerald-700">✓ {a.truth}</p>
            <p className="mt-1 text-xs text-slate-500">Likely source: {a.src}</p>
            <div className="mt-3 flex gap-2"><Button size="sm" variant="primary" onClick={() => openCopilot('GEO Optimizer')}>Fix at the source</Button><Button size="sm">Mark as reviewed</Button></div>
          </div>))}</div></Card>
    </div>
  )
}

function AiTraffic() {
  const tot = aiTraffic.reduce((a, b) => ({ sessions: a.sessions + b.sessions, atc: a.atc + b.atc, orders: a.orders + b.orders, rev: a.rev + b.rev }), { sessions: 0, atc: 0, orders: 0, rev: 0 })
  const steps: [string, number][] = [['AI engine sends a visitor', tot.sessions], ['Views a product', Math.round(tot.sessions * 0.71)], ['Adds to cart', tot.atc], ['Starts checkout', Math.round(tot.atc * 0.52)], ['Purchases', tot.orders]]
  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center gap-3 !bg-emerald-50"><span className="text-xl">✅</span><p className="flex-1 text-sm text-emerald-900"><b>Tracked end to end with the Glance pixel.</b> Every AI-referred session is followed from the first click to purchase on your store, with no GA4 setup needed. Pixel coverage: <b>94%</b> of AI sessions identified.</p><Badge tone="green">Pixel live</Badge></Card>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi label="AI-referred sessions" value={num(tot.sessions)} delta={34} /><Kpi label="Add-to-carts" value={num(tot.atc)} delta={29} /><Kpi label="Orders" value={num(tot.orders)} delta={31} /><Kpi label="Revenue" value={money(tot.rev)} delta={36} /><Kpi label="Conversion rate" value={((tot.orders / tot.sessions) * 100).toFixed(1) + '%'} delta={0.4} />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3"><CardHeader title="AI sessions by engine" /><div className="h-64"><ResponsiveContainer><AreaChart data={aiDaily}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="d" interval={4} tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
          {[['ChatGPT', '#10a37f'], ['Perplexity', '#0ea5e9'], ['Gemini', '#6366f1'], ['AI Overviews', '#f59e0b'], ['Copilot', '#8b5cf6']].map(([k, c]) => <Area key={k} dataKey={k} stackId="1" stroke={c} fill={c} fillOpacity={0.5} />)}</AreaChart></ResponsiveContainer></div></Card>
        <Card className="lg:col-span-2"><CardHeader title="Journey from AI answer to sale" /><div className="space-y-3">{steps.map(([l, v], i) => <div key={l}><div className="flex justify-between text-sm"><span>{l}</span><b>{num(v)}</b></div><div className="mt-1 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-brand-600" style={{ width: `${(v / steps[0][1]) * 100}%` }} /></div>{i > 0 && <p className="mt-0.5 text-[11px] text-slate-400">{((v / steps[i - 1][1]) * 100).toFixed(0)}% continue</p>}</div>)}</div></Card>
      </div>
      <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Performance by engine" sub="How each session was identified" /></div>
        <Table head={['Engine', 'Sessions', 'Add-to-cart', 'Orders', 'Revenue', 'Conv.', 'Detected by']}>
          {aiTraffic.map((r) => <tr key={r.engine}><Td className="font-medium">{r.engine}</Td><Td>{num(r.sessions)}</Td><Td>{num(r.atc)}</Td><Td>{r.orders}</Td><Td>{money(r.rev)}</Td><Td>{((r.orders / r.sessions) * 100).toFixed(1)}%</Td><Td className="text-xs text-slate-500">{r.how}</Td></tr>)}</Table></Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Top landing pages from AI" /></div>
          <Table head={['Page', 'Sessions', 'Conv.', 'Via']}>{aiLanding.map((l) => <tr key={l.page}><Td className="font-mono text-xs">{l.page}</Td><Td>{num(l.sessions)}</Td><Td>{l.cvr}%</Td><Td className="text-xs text-slate-500">{l.via}</Td></tr>)}</Table></Card>
        <Card><CardHeader title="Attribution notes" />
          <ul className="space-y-2.5 text-sm text-slate-700">
            <li>• <b>6% “dark AI traffic”</b> (no referrer) is estimated from landing-page and user-agent patterns and shown separately.</li>
            <li>• GA4 files <b>41%</b> of these sessions under “Direct”. The Glance pixel recovers them. See the reconciliation view under Integrations → Attribution.</li>
            <li>• <b>Assisted impact:</b> branded search rose 18% in weeks when mention rate rose.</li>
            <li>• Cross-device: 22% of AI-assisted purchases complete on a different device from the first click.</li>
          </ul></Card>
      </div>
    </div>
  )
}
