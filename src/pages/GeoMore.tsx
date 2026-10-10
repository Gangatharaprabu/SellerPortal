import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, Check, Plus, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, CardHeader, Field, Progress, Table, Td, Toggle, cx, inputCls, num } from '../components/ui'
import { botDaily, botPages, bots, crawlChecks, entities, experiments, mentionTargets, opportunities, reputation, tasks } from '../geoData'
import { connectors } from '../data'
import { SubNav } from './Geo'
import { useApp } from '../store'

export function GeoTechnical() {
  const [s, setS] = useState('Crawler audit')
  const [blocked, setBlocked] = useState<Record<string, boolean>>(Object.fromEntries(bots.map((b) => [b.bot, b.status === 'Blocked'])))
  return (
    <>
      <SubNav items={['Crawler audit', 'Bot log analysis', 'GEO-readiness scorecard']} value={s} onChange={setS} />
      {s === 'Crawler audit' && (
        <div className="space-y-6">
          <Card pad={false}><div className="p-5 pb-0"><CardHeader title="AI crawler access" sub="Based on your robots.txt" /></div>
            <Table head={['Crawler', 'Owner', 'Used for', 'Allowed?', 'Status']}>
              {bots.map((b) => <tr key={b.bot}><Td className="font-mono text-xs font-semibold">{b.bot}</Td><Td>{b.owner}</Td><Td className="text-xs text-slate-500">{b.use}</Td><Td><Toggle on={!blocked[b.bot]} onChange={(v) => setBlocked({ ...blocked, [b.bot]: !v })} /></Td><Td>{blocked[b.bot] ? <Badge tone="red"><AlertTriangle size={10} /> Blocked</Badge> : <Badge tone="green">Allowed</Badge>}</Td></tr>)}</Table>
            <div className="m-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><b>PerplexityBot and Google-Extended are blocked</b>, so those engines can’t read your pages. Allow them, then publish the updated robots.txt. <Button size="sm" variant="primary" className="ml-2">Update robots.txt</Button></div></Card>
          <Card><CardHeader title="Page health for AI crawlers" />
            <div className="space-y-2">{crawlChecks.map((c) => <div key={c.name} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm"><span className={cx('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white', c.ok ? 'bg-emerald-500' : 'bg-amber-500')}>{c.ok ? <Check size={12} /> : <AlertTriangle size={11} />}</span><div><p className="font-medium text-slate-900">{c.name}</p>{c.note && <p className="text-xs text-slate-500">{c.note}</p>}</div></div>)}</div></Card>
        </div>
      )}
      {s === 'Bot log analysis' && (
        <div className="space-y-6">
          <Card className="flex flex-wrap items-center gap-3 !bg-sky-50"><p className="flex-1 text-sm text-sky-900">Bot logs come from your CDN or server. <b>Connect Cloudflare or CloudFront</b> under Integrations to see real crawler visits. Sample data shown.</p><Link to="/integrations"><Button size="sm" variant="primary">Connect logs</Button></Link></Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader title="AI crawler hits per day" /><div className="h-64"><ResponsiveContainer><BarChart data={botDaily}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="d" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="OpenAI" stackId="a" fill="#10a37f" /><Bar dataKey="Google" stackId="a" fill="#6366f1" /><Bar dataKey="Microsoft" stackId="a" fill="#8b5cf6" /><Bar dataKey="Other" stackId="a" fill="#94a3b8" /></BarChart></ResponsiveContainer></div></Card>
            <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Most crawled pages" /></div>
              <Table head={['Page', 'Hits', 'Crawlers']}>{botPages.map((p) => <tr key={p.page}><Td className="font-mono text-xs">{p.page}</Td><Td>{num(p.hits)}</Td><Td className={cx('text-xs', p.bots.includes('404') ? 'text-rose-600' : 'text-slate-500')}>{p.bots}</Td></tr>)}</Table></Card>
          </div>
          <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Crawler health" /></div>
            <Table head={['Crawler', 'Hits (30d)', 'Error rate']}>{bots.filter((b) => b.hits).map((b) => <tr key={b.bot}><Td className="font-mono text-xs">{b.bot}</Td><Td>{num(b.hits)}</Td><Td><Badge tone={b.err > 2 ? 'amber' : 'green'}>{b.err}%</Badge></Td></tr>)}</Table></Card>
        </div>
      )}
      {s === 'GEO-readiness scorecard' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card><p className="text-xs font-medium text-slate-500">GEO-readiness score</p><p className="mt-1 text-5xl font-bold text-slate-900">62<span className="text-xl text-slate-400">/100</span></p><div className="my-3"><Progress value={62} tone="amber" /></div><p className="text-sm text-slate-500">Median for your category: 58</p></Card>
          <Card className="lg:col-span-2"><CardHeader title="Score breakdown" />{[['Crawler access', 63], ['Structured data', 78], ['Content depth', 48], ['Catalog attributes', 55], ['Site performance', 59], ['Off-site authority', 66]].map(([a, b]) => <div key={a as string} className="mb-3"><div className="flex justify-between text-sm"><span>{a}</span><b>{b}</b></div><Progress value={b as number} tone={(b as number) < 55 ? 'red' : (b as number) < 70 ? 'amber' : 'green'} /></div>)}</Card>
          <Card className="lg:col-span-3"><CardHeader title="Prioritized fixes" />{['Allow PerplexityBot and Google-Extended (+4 pts)', 'Render price and sizes without JavaScript on product pages (+3 pts)', 'Add use-case content to 214 products (+3 pts)', 'Fix 14 noindexed collection pages (+2 pts)'].map((f, i) => <div key={f} className="flex items-center gap-3 border-t border-slate-100 py-2.5 text-sm first:border-0"><span className="grid h-6 w-6 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{i + 1}</span>{f}</div>)}</Card>
        </div>
      )}
    </>
  )
}

export function GeoOffsite() {
  const [s, setS] = useState('Mentions & citations')
  return (
    <>
      <SubNav items={['Mentions & citations', 'Entity manager', 'Reputation']} value={s} onChange={setS} />
      {s === 'Mentions & citations' && (
        <Card pad={false}><div className="flex items-center justify-between p-5 pb-0"><CardHeader title="Where to earn mentions" sub="Sites AI engines already cite for your category" /><Button size="sm"><Plus size={12} /> Add target</Button></div>
          <Table head={['Site', 'Type', 'Cited by', 'Notes', 'Outreach status']}>
            {mentionTargets.map((m) => <tr key={m.site}><Td className="font-medium">{m.site}</Td><Td><Badge>{m.type}</Badge></Td><Td className="text-xs">{m.cited}</Td><Td className="max-w-xs whitespace-normal text-xs text-slate-500">{m.note}</Td><Td><Badge tone={m.status === 'Won' ? 'green' : m.status === 'Pitched' || m.status === 'In progress' ? 'blue' : 'slate'}>{m.status}</Badge></Td></tr>)}</Table></Card>
      )}
      {s === 'Entity manager' && (
        <div className="space-y-6">
          <Card className="!bg-violet-50"><p className="text-sm text-violet-900">AI engines trust brands whose details match everywhere. Entity consistency: <b>2 of 5</b> profiles match your Glance brand profile.</p></Card>
          <Card pad={false}><Table head={['Profile', 'Status', 'Issue', '']}>{entities.map((e) => <tr key={e.src}><Td className="font-medium">{e.src}</Td><Td><Badge tone={e.status === 'Consistent' ? 'green' : e.status === 'Missing' ? 'red' : 'amber'}>{e.status}</Badge></Td><Td className="text-xs text-slate-500">{e.issue || '—'}</Td><Td>{e.status !== 'Consistent' && <Button size="sm">Fix</Button>}</Td></tr>)}</Table></Card>
        </div>
      )}
      {s === 'Reputation' && (
        <div className="grid gap-4 md:grid-cols-3">{reputation.map((r) => <Card key={r.src}><p className="text-sm font-semibold">{r.src}</p>{r.rating > 0 && <p className="mt-1 text-3xl font-bold">{r.rating}<span className="text-sm text-slate-400"> / 5</span></p>}<p className="text-sm text-slate-500">{num(r.count)} {r.rating ? 'reviews' : 'mentions'} · {r.trend}</p>{r.alert && <div className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">⚠️ {r.alert}</div>}</Card>)}</div>
      )}
    </>
  )
}

export function GeoAct() {
  const { openCopilot } = useApp()
  const [s, setS] = useState('Opportunities')
  return (
    <>
      <SubNav items={['Opportunities', 'Tasks & approvals', 'Experiments']} value={s} onChange={setS} />
      {s === 'Opportunities' && (
        <div className="space-y-3">{opportunities.map((o, i) => (
          <Card key={o.t} className="flex flex-wrap items-center gap-4 !p-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{i + 1}</span><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900">{o.t}</p><p className="text-xs text-emerald-700">{o.gain}</p></div><Badge>{o.cat}</Badge><Badge tone={o.impact === 'High' ? 'green' : 'blue'}>{o.impact} impact</Badge><Badge tone={o.effort === 'Low' ? 'green' : o.effort === 'High' ? 'red' : 'amber'}>{o.effort} effort</Badge>
            {o.agent ? <Button size="sm" variant="primary" onClick={() => openCopilot('GEO Optimizer')}>Fix with agent</Button> : <Button size="sm">Create task</Button>}</Card>))}</div>
      )}
      {s === 'Tasks & approvals' && (
        <div className="grid gap-4 md:grid-cols-3">{Object.entries(tasks).map(([col, items]) => (
          <div key={col} className="rounded-xl bg-slate-100 p-3"><p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{col} · {items.length}</p>
            <div className="space-y-2">{items.map((t) => <div key={t.t} className="rounded-lg bg-white p-3 shadow-sm"><p className="text-sm font-medium">{t.t}</p><div className="mt-2 flex items-center justify-between text-xs text-slate-500"><Badge>{t.tag}</Badge><span>{t.who}</span></div>{col === 'In review' && <div className="mt-2 flex gap-1.5"><Button size="sm" variant="primary">Approve</Button><Button size="sm"><X size={11} /></Button></div>}</div>)}</div></div>))}</div>
      )}
      {s === 'Experiments' && (
        <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Before / after" sub="Did your changes move visibility and revenue?" /></div>
          <Table head={['Change', 'Date', 'AI visibility', 'AI revenue', 'Verdict']}>{experiments.map((e) => <tr key={e.change}><Td className="max-w-sm whitespace-normal font-medium">{e.change}</Td><Td>{e.date}</Td><Td className="text-emerald-600">{e.vis}</Td><Td>{e.rev}</Td><Td><Badge tone={e.verdict === 'Worked' ? 'green' : e.verdict === 'Too early' ? 'slate' : 'blue'}>{e.verdict}</Badge></Td></tr>)}</Table></Card>
      )}
    </>
  )
}

export function GeoPlatform() {
  const [s, setS] = useState('Integrations')
  const needed = ['shopify', 'gmc', 'gsc', 'ga4', 'bing', 'oaifeed', 'cloudflare', 'contentful']
  return (
    <>
      <SubNav items={['Integrations', 'Reports & alerts', 'Roles & agency mode']} value={s} onChange={setS} />
      {s === 'Integrations' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{needed.map((id) => { const c = connectors.find((x) => x.id === id)!; return <Card key={id}><div className="flex items-start justify-between"><span className="text-2xl">{c.logo}</span><Badge tone={c.status === 'Connected' ? 'green' : 'slate'}>{c.status === 'Connected' ? '● Connected' : 'Available'}</Badge></div><p className="mt-2 font-semibold text-slate-900">{c.name}</p><p className="mt-1 text-xs text-slate-500">{c.desc}</p><Link to="/integrations"><Button size="sm" className="mt-3">{c.status === 'Connected' ? 'Manage' : 'Connect'}</Button></Link></Card> })}</div>
      )}
      {s === 'Reports & alerts' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Scheduled reports" right={<Button size="sm"><Plus size={12} /> New report</Button>} />{[['Weekly AI visibility summary', 'Mondays 08:00 · Owners'], ['Monthly GEO report for agency client', '1st of month · PDF'], ['AI traffic & revenue', 'Fridays · Marketing']].map(([a, b]) => <div key={a} className="flex items-center justify-between border-t border-slate-100 py-3 text-sm first:border-0"><div><p className="font-medium">{a}</p><p className="text-xs text-slate-500">{b}</p></div><Button size="sm" variant="ghost">Edit</Button></div>)}</Card>
          <Card><CardHeader title="Alerts" />{[['Visibility drops by more than 20% on any engine', true], ['New wrong or outdated claim detected', true], ['A crawler is blocked or errors spike', true], ['A competitor overtakes you in a category', false]].map(([a, b]) => <div key={a as string} className="flex items-center justify-between border-t border-slate-100 py-3 text-sm first:border-0">{a as string}<Toggle on={b as boolean} onChange={() => {}} /></div>)}</Card>
        </div>
      )}
      {s === 'Roles & agency mode' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Access" />{[['Admin', 'Everything, including publishing to your store'], ['Content editor', 'Draft and edit content; needs approval to publish'], ['Analyst', 'View-only reports'], ['Agency', 'Manage multiple client stores']].map(([a, b]) => <div key={a} className="flex items-center justify-between border-t border-slate-100 py-3 text-sm first:border-0"><div><p className="font-medium">{a}</p><p className="text-xs text-slate-500">{b}</p></div></div>)}</Card>
          <Card><CardHeader title="Agency mode" sub="Manage several merchants from one login" /><Field label="Client stores"><div className="space-y-1.5 text-sm">{['Fernhill Apparel · AI visibility 62', 'Oak & Ember · AI visibility 48', 'Brightside Kids · AI visibility 71'].map((x) => <div key={x} className="rounded-lg border border-slate-200 p-2.5">{x}</div>)}</div></Field><input className={cx(inputCls, 'mt-3')} placeholder="Invite a client by email…" /></Card>
        </div>
      )}
    </>
  )
}
