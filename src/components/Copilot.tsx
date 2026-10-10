import { ReactNode, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Send, X, Plus, Maximize2, MessageSquare, LifeBuoy, Check, Loader2, Paperclip, ChevronRight } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useApp } from '../store'
import { daily, lostReasons, threads, trends } from '../data'
import { Badge, Button, Progress, cx } from './ui'

type Block =
  | { k: 'text'; t: string }
  | { k: 'score' }
  | { k: 'roas' }
  | { k: 'trends' }
  | { k: 'lost' }
  | { k: 'agent'; agent: string }
  | { k: 'campaign' }
  | { k: 'ticket'; subject: string }
  | { k: 'chips'; items: string[] }
type Msg = { role: 'user' | 'ai'; blocks: Block[] }
type Conv = { id: number; title: string; msgs: Msg[] }

const suggested = [
  'How agent-ready is my catalog?',
  'Why did ROAS drop on TV last week?',
  'What are shoppers asking for in outerwear?',
  'Which products lose to competitors on price?',
  'Draft my brand profile',
  'My Shopify sync failed – help',
]

function respond(q: string): Block[] {
  const s = q.toLowerCase()
  if (s.includes('agent-ready') || s.includes('catalog readiness') || s.includes('how agent'))
    return [{ k: 'text', t: 'Your catalog agent-readiness score is **54/100**. Agents skip products when key attributes are missing, so this is currently your biggest growth lever.' }, { k: 'score' },
      { k: 'text', t: '214 products are missing material, fit or occasion data. I can fix these for you. You will review every change before it goes live.' }, { k: 'chips', items: ['Run Catalog Fixer', 'Show products missing data'] }]
  if (s.includes('roas') || s.includes('tv'))
    return [{ k: 'text', t: 'TV Ambient ROAS fell from **3.4 to 2.6** over the last 7 days. Three drivers explain most of the drop:' }, { k: 'roas' },
      { k: 'text', t: '1) The Outerwear Launch creative hit frequency cap, so CTR fell 18%.\n2) 38% of TV impressions are now going to a low-intent evening time slot.\n3) Two hero SKUs went out of stock on Oct 6.' }, { k: 'chips', items: ['Optimize with Campaign Optimizer', 'Open Ads Reporting'] }]
  if (s.includes('asking') || s.includes('shoppers') || s.includes('trend') || s.includes('outerwear') || s.includes('wedding'))
    return [{ k: 'text', t: 'Here are the fastest-growing shopper intents in your categories this week. Three of them have a **catalog gap** for you:' }, { k: 'trends' },
      { k: 'chips', items: ['Respond with Trend Responder', 'Create a campaign for the wedding intent'] }]
  if (s.includes('price') || s.includes('lose') || s.includes('compet'))
    return [{ k: 'text', t: 'When agents shortlist your products but do not recommend them, these are the reasons:' }, { k: 'lost' }, { k: 'chips', items: ['Run Catalog Fixer', 'Open Analytics'] }]
  if (s.includes('brand'))
    return [{ k: 'text', t: 'I can draft your brand profile from fernhillapparel.com, your Instagram and your About page. I will show you the plan first.' }, { k: 'agent', agent: 'Brand Profile Builder' }]
  if (s.includes('campaign optimizer') || s.includes('optimize'))
    return [{ k: 'agent', agent: 'Campaign Optimizer' }]
  if (s.includes('trend responder') || s.includes('create a campaign'))
    return [{ k: 'text', t: 'Based on the rising “fall wedding guest under $150” intent, here is a campaign I would launch:' }, { k: 'campaign' }]
  if (s.includes('sync') || s.includes('support') || s.includes('ticket') || s.includes('shopify'))
    return [{ k: 'text', t: 'I checked your last sync (Oct 8, job #8841). 41 variants failed because their **price field contained “$”** characters, which the connector cannot parse. I can fix the mapping rule, but if you would like a human to look, I have prepared a ticket with the logs attached.' },
      { k: 'ticket', subject: 'Shopify sync failed on Oct 8 (41 errors)' }]
  if (s.includes('fix') || s.includes('catalog fixer') || s.includes('missing'))
    return [{ k: 'agent', agent: 'Catalog Fixer' }]
  if (s.includes('enrich'))
    return [{ k: 'agent', agent: 'Enrichment Agent' }]
  return [{ k: 'text', t: 'I can answer questions about performance, catalog health, ads and market trends, launch agents to fix things, or connect you to support. Try one of these:' }, { k: 'chips', items: suggested.slice(0, 4) }]
}

const agentSpecs: Record<string, { scope: string; plan: string[]; steps: string[]; diff: { item: string; field: string; before: string; after: string }[]; result: string }> = {
  'Catalog Fixer': {
    scope: '214 products · 3 attribute groups',
    plan: ['Scan 1,284 products against the agent-readiness checklist', 'Infer material, fit and occasion from titles, images and 9.4K reviews', 'Normalize titles to “Brand + Type + Key attribute”', 'Stage all edits as a reviewable change set (nothing goes live yet)'],
    steps: ['Scanning catalog…', 'Reading reviews and images…', 'Generating attributes…', 'Validating against allowed values…', 'Building change set…'],
    diff: [
      { item: 'Merino Crew Sweater', field: 'Occasion', before: '—', after: 'Work, Weekend, Travel' },
      { item: 'Slim Stretch Chino', field: 'Material', before: '—', after: '97% cotton, 3% elastane' },
      { item: 'Trail Shell Jacket', field: 'Title', before: 'Shell Jkt M', after: 'Fernhill Trail Shell Jacket – Waterproof Hiking Rain Jacket' },
      { item: 'Weekender Dress Shirt', field: 'Fit', before: '—', after: 'Regular fit; runs true to size' },
    ],
    result: 'Score 54 → 78 · estimated +18% match rate',
  },
  'Enrichment Agent': {
    scope: '92 products · occasions, use cases, FAQs',
    plan: ['Mine reviews for use cases', 'Generate FAQs from review questions', 'Tag occasions and styling notes'],
    steps: ['Reading reviews…', 'Clustering use cases…', 'Writing FAQs…', 'Building change set…'],
    diff: [{ item: 'Everyday Runner', field: 'Use case', before: '—', after: 'Daily 5K, treadmill, travel' }, { item: 'Linen Wrap Dress', field: 'FAQ', before: '—', after: 'Q: Is it see-through? A: Fully lined.' }],
    result: '92 products enriched',
  },
  'Brand Profile Builder': {
    scope: 'Brand profile · story, values, tone, certifications',
    plan: ['Crawl fernhillapparel.com (About, Sustainability, FAQ)', 'Read Instagram captions and press mentions', 'Draft story, values, tone of voice and audience', 'Save as draft for your edits'],
    steps: ['Crawling website…', 'Reading social…', 'Drafting story and values…', 'Detecting certifications…'],
    diff: [
      { item: 'Brand story', field: 'Story', before: '(empty)', after: 'Founded in Portland in 2014, Fernhill makes durable everyday clothing from responsibly sourced fibres…' },
      { item: 'Values', field: 'Tags', before: '—', after: 'Sustainable · Small-batch · Lifetime repairs' },
      { item: 'Certifications', field: 'Badges', before: '—', after: 'GOTS Organic, B Corp' },
    ],
    result: 'Profile 40% → 92% complete (draft)',
  },
  'Campaign Optimizer': {
    scope: '3 active campaigns · budget and bids',
    plan: ['Analyze 14 days of pacing and ROAS by placement', 'Shift $2,400 from low-intent TV evening slots to Lockscreen mornings', 'Lower CPC bids on 6 low-converting SKUs', 'Requires approval: budget changes'],
    steps: ['Analyzing pacing…', 'Simulating allocations…', 'Forecasting ROAS…'],
    diff: [
      { item: 'TV Ambient – Outerwear Launch', field: 'Daypart', before: 'All day', after: 'Exclude 22:00–01:00' },
      { item: 'Lockscreen – Clearance Tees', field: 'Daily budget', before: '$250', after: '$340' },
      { item: 'Agent Search – Footwear', field: 'Max CPC', before: '$0.90', after: '$0.72' },
    ],
    result: 'Forecast ROAS 3.1 → 3.7 at the same spend',
  },
  'Trend Responder': {
    scope: '3 intents · 2 promotions',
    plan: ['Match rising intents to catalog', 'Suggest products to enrich and promote'],
    steps: ['Matching intents…', 'Drafting promos…'],
    diff: [{ item: 'Linen Wrap Dress', field: 'Occasion', before: '—', after: 'Wedding guest' }],
    result: '3 opportunities ready',
  },
}

export function AgentFlow({ agent, onDone }: { agent: string; onDone?: () => void }) {
  const spec = agentSpecs[agent] ?? agentSpecs['Catalog Fixer']
  const { setCatalogScore } = useApp()
  const [phase, setPhase] = useState<'plan' | 'run' | 'review' | 'applied'>('plan')
  const [step, setStep] = useState(0)
  const [rejected, setRejected] = useState<number[]>([])

  useEffect(() => {
    if (phase !== 'run') return
    if (step >= spec.steps.length) { setPhase('review'); return }
    const t = setTimeout(() => setStep(step + 1), 900)
    return () => clearTimeout(t)
  }, [phase, step, spec.steps.length])

  const apply = () => {
    setPhase('applied')
    if (agent === 'Catalog Fixer') setCatalogScore(78)
    onDone?.()
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-white">
      <div className="flex items-center justify-between rounded-t-xl bg-brand-50 px-3 py-2">
        <span className="text-xs font-semibold text-brand-700">🤖 {agent}</span>
        <Badge tone={phase === 'applied' ? 'green' : phase === 'run' ? 'blue' : 'violet'}>{phase === 'plan' ? 'Plan ready' : phase === 'run' ? 'Running' : phase === 'review' ? 'Review changes' : 'Applied'}</Badge>
      </div>
      <div className="space-y-3 p-3">
        {phase === 'plan' && (
          <>
            <p className="text-xs text-slate-500">Scope: <b className="text-slate-700">{spec.scope}</b></p>
            <ol className="space-y-1.5 text-xs text-slate-700">
              {spec.plan.map((p, i) => <li key={i} className="flex gap-2"><span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] font-semibold">{i + 1}</span>{p}</li>)}
            </ol>
            <div className="rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800">🔒 Nothing will go live until you approve the changes.</div>
            <div className="flex gap-2"><Button variant="primary" size="sm" onClick={() => setPhase('run')}>Approve plan & run</Button><Button size="sm">Edit scope</Button></div>
          </>
        )}
        {phase === 'run' && (
          <div className="space-y-2">
            <Progress value={(step / spec.steps.length) * 100} />
            {spec.steps.map((s, i) => (
              <p key={i} className={cx('flex items-center gap-2 text-xs', i <= step ? 'text-slate-700' : 'text-slate-300')}>
                {i < step ? <Check size={12} className="text-emerald-500" /> : i === step ? <Loader2 size={12} className="animate-spin text-brand-600" /> : <span className="w-3" />}{s}
              </p>
            ))}
          </div>
        )}
        {(phase === 'review' || phase === 'applied') && (
          <>
            <p className="text-xs text-slate-500">{phase === 'review' ? 'Review the proposed changes. Reject any you do not want.' : 'Changes applied. You can roll back from Agent history.'}</p>
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {spec.diff.map((d, i) => (
                <div key={i} className={cx('p-2 text-xs', rejected.includes(i) && 'opacity-40')}>
                  <div className="flex items-center justify-between"><span className="font-medium text-slate-800">{d.item} <span className="text-slate-400">· {d.field}</span></span>
                    {phase === 'review' && <button className="text-[11px] text-slate-400 hover:text-rose-600" onClick={() => setRejected(rejected.includes(i) ? rejected.filter((x) => x !== i) : [...rejected, i])}>{rejected.includes(i) ? 'Undo' : 'Reject'}</button>}</div>
                  <p className="mt-1 text-rose-600 line-through">{d.before}</p><p className="text-emerald-700">{d.after}</p>
                </div>
              ))}
              <p className="p-2 text-center text-[11px] text-slate-400">+ {agent === 'Catalog Fixer' ? '210' : '…'} more changes in the full change set</p>
            </div>
            {phase === 'review' ? (
              <div className="flex gap-2"><Button variant="primary" size="sm" onClick={apply}>Apply {spec.diff.length - rejected.length} of {spec.diff.length} shown + all others</Button><Button size="sm">Review all</Button></div>
            ) : (
              <div className="rounded-lg bg-emerald-50 p-2 text-xs font-medium text-emerald-700">✅ {spec.result}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ScoreBlock() {
  const { catalogScore } = useApp()
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-end justify-between"><span className="text-3xl font-bold text-slate-900">{catalogScore}<span className="text-base text-slate-400">/100</span></span>
        <Badge tone={catalogScore < 60 ? 'amber' : 'green'}>{catalogScore < 60 ? 'Needs work' : 'Good'}</Badge></div>
      <div className="mt-2"><Progress value={catalogScore} tone={catalogScore < 60 ? 'amber' : 'green'} /></div>
    </div>
  )
}

function BlockView({ b, onChip, onTicket }: { b: Block; onChip: (s: string) => void; onTicket: (s: string) => void }) {
  switch (b.k) {
    case 'text':
      return <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: b.t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') }} />
    case 'score': return <ScoreBlock />
    case 'roas':
      return (
        <div className="h-36 rounded-xl border border-slate-200 p-2">
          <ResponsiveContainer><LineChart data={daily.slice(-14).map((d, i) => ({ d: d.d, roas: +(3.4 - Math.max(0, i - 7) * 0.12 + (i % 3) * 0.05).toFixed(2) }))}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="d" tick={{ fontSize: 10 }} interval={2} /><YAxis tick={{ fontSize: 10 }} domain={[2, 4]} width={28} /><Tooltip />
            <Line type="monotone" dataKey="roas" stroke="#4f46e5" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
        </div>
      )
    case 'trends':
      return (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {trends.slice(0, 4).map((t) => (
            <div key={t.intent} className="flex items-center justify-between gap-2 p-2.5 text-xs">
              <span className="font-medium text-slate-800">{t.intent}</span>
              <span className="flex shrink-0 items-center gap-1.5"><Badge tone="green">+{t.growth}%</Badge>{t.gap && <Badge tone="amber">Gap</Badge>}</span>
            </div>
          ))}
        </div>
      )
    case 'lost':
      return (
        <div className="h-44 rounded-xl border border-slate-200 p-2">
          <ResponsiveContainer><BarChart data={lostReasons} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide /><YAxis type="category" dataKey="reason" width={150} tick={{ fontSize: 9 }} tickFormatter={(v: string) => v.slice(0, 26)} /><Tooltip />
            <Bar dataKey="pct" fill="#6366f1" radius={4} /></BarChart></ResponsiveContainer>
        </div>
      )
    case 'agent': return <AgentFlow agent={b.agent} />
    case 'campaign':
      return (
        <div className="rounded-xl border border-slate-200 p-3 text-xs">
          <div className="flex items-center justify-between"><b className="text-sm text-slate-900">Fall Wedding Guest – SmartAds</b><Badge tone="violet">Draft</Badge></div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[['Budget', '$6,000'], ['Target ROAS', '3.5x'], ['Est. orders', '410–520']].map(([a, c]) => <div key={a} className="rounded-lg bg-slate-50 p-2"><p className="text-slate-400">{a}</p><p className="font-semibold text-slate-800">{c}</p></div>)}
          </div>
          <div className="mt-3 flex gap-2"><Link to="/ads/new"><Button variant="primary" size="sm">Open in campaign wizard</Button></Link><Button size="sm">Adjust</Button></div>
        </div>
      )
    case 'ticket':
      return (
        <div className="rounded-xl border border-slate-200 p-3 text-xs">
          <p className="font-semibold text-slate-900">🎫 {b.subject}</p>
          <p className="mt-1 text-slate-500">Attached: Sync job #8841 · error log (41 rows) · connector config</p>
          <div className="mt-2 flex gap-2"><Button variant="primary" size="sm" onClick={() => onTicket(b.subject)}>Send to support</Button><Button size="sm">Let the copilot fix the mapping</Button></div>
        </div>
      )
    case 'chips':
      return <div className="flex flex-wrap gap-1.5">{b.items.map((c) => <button key={c} onClick={() => onChip(c)} className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100">{c}</button>)}</div>
  }
}

const pageContext: Record<string, string> = {
  '/': 'Home', '/catalog': 'Catalog', '/integrations': 'Integrations', '/ads': 'Ads Manager', '/ads/reports': 'Ads Reporting',
  '/analytics': 'Analytics', '/insights': 'Market Insights', '/brand': 'Brand Studio', '/support': 'Support Center', '/agents': 'Agents',
}

export function Copilot({ onClose, full }: { onClose?: () => void; full?: boolean }) {
  const { launch, clearLaunch } = useApp()
  const loc = useLocation()
  const [tab, setTab] = useState<'chat' | 'support'>('chat')
  const [convs, setConvs] = useState<Conv[]>([{ id: 1, title: 'New chat', msgs: [] }])
  const [active, setActive] = useState(1)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [newTickets, setNewTickets] = useState<string[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const conv = convs.find((c) => c.id === active)!

  const send = (text: string) => {
    if (!text.trim()) return
    setTab('chat')
    setConvs((cs) => cs.map((c) => c.id === active ? { ...c, title: c.msgs.length ? c.title : text.slice(0, 32), msgs: [...c.msgs, { role: 'user', blocks: [{ k: 'text', t: text }] }] } : c))
    setInput(''); setThinking(true)
    setTimeout(() => {
      setConvs((cs) => cs.map((c) => c.id === active ? { ...c, msgs: [...c.msgs, { role: 'ai', blocks: respond(text) }] } : c))
      setThinking(false)
    }, 900)
  }

  useEffect(() => { if (launch) { send(launch); clearLaunch() } /* eslint-disable-next-line */ }, [launch])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [conv.msgs.length, thinking, tab])

  const newConv = () => { const id = Math.max(...convs.map((c) => c.id)) + 1; setConvs([...convs, { id, title: 'New chat', msgs: [] }]); setActive(id); setTab('chat') }
  const ctx = pageContext[loc.pathname] ?? 'Portal'

  const body: ReactNode = (
    <>
      <div className="flex items-center gap-1 border-b border-slate-200 px-3 pt-2">
        {([['chat', 'Copilot', MessageSquare], ['support', 'Support', LifeBuoy]] as const).map(([k, l, I]) => (
          <button key={k} onClick={() => setTab(k)} className={cx('-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium', tab === k ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500')}><I size={14} />{l}</button>
        ))}
      </div>

      {tab === 'chat' ? (
        <>
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <select value={active} onChange={(e) => setActive(+e.target.value)} className="min-w-0 flex-1 truncate rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
              {convs.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <Button size="sm" onClick={newConv}><Plus size={12} /> New</Button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {conv.msgs.length === 0 && (
              <div className="anim-fade">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-pink-500 text-white"><Sparkles size={20} /></div>
                <h3 className="text-lg font-bold text-slate-900">Hi Alex, what can I help with?</h3>
                <p className="mt-1 text-sm text-slate-500">Ask about performance, catalog health, ads or market trends. I can also launch agents to fix things for you.</p>
                <div className="mt-4 rounded-lg bg-sky-50 p-2.5 text-xs text-sky-800">📍 I can see you are on <b>{ctx}</b>. Ask me to explain what is on this page.</div>
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Suggested</p>
                <div className="space-y-1.5">
                  {suggested.map((s) => <button key={s} onClick={() => send(s)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 hover:border-brand-300 hover:bg-brand-50">{s}<ChevronRight size={14} className="text-slate-300" /></button>)}
                </div>
                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><b>While you were away:</b> 3 things changed – a sync failed, TV pacing slipped, and a new trend appeared.</div>
              </div>
            )}
            {conv.msgs.map((m, i) => (
              <div key={i} className={cx('anim-fade flex', m.role === 'user' && 'justify-end')}>
                {m.role === 'user' ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2 text-sm text-white">{(m.blocks[0] as { t: string }).t}</div>
                ) : (
                  <div className="w-full space-y-3">{m.blocks.map((b, j) => <BlockView key={j} b={b} onChip={send} onTicket={(s) => { setNewTickets((t) => [...t, s]); setTab('support') }} />)}</div>
                )}
              </div>
            ))}
            {thinking && <p className="flex items-center gap-2 text-xs text-slate-400"><Loader2 size={12} className="animate-spin" /> Analyzing your data…</p>}
            <div ref={endRef} />
          </div>
          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 focus-within:border-brand-500">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input)} placeholder="Ask anything about your store…" className="flex-1 bg-transparent text-sm outline-none" />
              <button onClick={() => send(input)} className="rounded-lg bg-brand-600 p-1.5 text-white"><Send size={14} /></button>
            </div>
          </div>
        </>
      ) : (
        <SupportTab extra={newTickets} />
      )}
    </>
  )

  if (full) return <div className="flex h-[calc(100vh-8.5rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{body}</div>
  return (
    <aside className="anim-slide flex w-[420px] shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-pink-500 text-white"><Sparkles size={14} /></div><b className="text-sm text-slate-900">Lumio Copilot</b></div>
        <div className="flex gap-1"><Link to="/copilot" className="rounded p-1.5 text-slate-400 hover:bg-slate-100"><Maximize2 size={15} /></Link><button onClick={onClose} className="rounded p-1.5 text-slate-400 hover:bg-slate-100"><X size={16} /></button></div>
      </div>
      {body}
    </aside>
  )
}

function SupportTab({ extra }: { extra: string[] }) {
  const [composing, setComposing] = useState(false)
  const [subject, setSubject] = useState('')
  const [created, setCreated] = useState<string[]>([])
  const all = [...extra, ...created]
  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Your conversations</p>
        <Button size="sm" variant="primary" onClick={() => setComposing(!composing)}><Plus size={12} /> New thread</Button>
      </div>
      {composing && (
        <div className="anim-fade space-y-2 rounded-xl border border-brand-200 bg-brand-50 p-3">
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What do you need help with?" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none" />
          <div className="flex items-center gap-2 text-xs text-slate-500"><Paperclip size={12} /> Attach screenshot · The copilot will try to answer first</div>
          <div className="flex gap-2"><Button size="sm" variant="primary" onClick={() => { if (subject) { setCreated([...created, subject]); setSubject(''); setComposing(false) } }}>Start thread</Button><Button size="sm" onClick={() => setComposing(false)}>Cancel</Button></div>
        </div>
      )}
      {all.map((s) => (
        <div key={s} className="anim-fade rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm"><div className="flex items-center justify-between"><b className="text-slate-900">{s}</b><Badge tone="green">New</Badge></div><p className="mt-1 text-xs text-slate-500">Ticket created with context attached · Priya (Integrations) will reply within 4h</p></div>
      ))}
      {threads.slice(0, 4).map((t) => (
        <Link to="/support" key={t.id} className="block rounded-xl border border-slate-200 p-3 hover:border-brand-300">
          <div className="flex items-center justify-between"><span className="text-xs text-slate-400">{t.id} · {t.cat}</span><Badge tone={t.status === 'Resolved' ? 'green' : t.status === 'Open' ? 'blue' : 'amber'}>{t.status}</Badge></div>
          <p className="mt-1 text-sm font-medium text-slate-900">{t.subject}</p><p className="mt-0.5 text-xs text-slate-400">{t.assignee} · {t.updated}</p>
        </Link>
      ))}
      <Link to="/support" className="block text-center text-xs font-medium text-brand-600">Open Support Center →</Link>
    </div>
  )
}
