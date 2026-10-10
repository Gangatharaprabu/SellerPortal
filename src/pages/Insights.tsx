import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Search, Sparkles } from 'lucide-react'
import { Badge, Button, Card, CardHeader, PageHeader, Progress, Tabs } from '../components/ui'
import { phrasing, trends } from '../data'
import { useApp } from '../store'

const demand = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => ({ m, outerwear: [20, 24, 41, 68, 92, 100][i], dresses: [70, 62, 55, 48, 60, 74][i], activewear: [50, 48, 52, 58, 61, 66][i] }))

export function InsightsPage() {
  const [tab, setTab] = useState('Trending intents')
  const { openCopilot } = useApp()
  return (
    <>
      <PageHeader title="Market Insights" sub="What shoppers are asking their agents across Lumio. Anonymised and aggregated." actions={<Button variant="primary" onClick={() => openCopilot('What are shoppers asking for in outerwear?')}><Sparkles size={15} /> Ask about trends</Button>} />
      <Tabs tabs={['Trending intents', 'How shoppers ask', 'Category demand', 'Unmet demand']} value={tab} onChange={setTab} />

      {tab === 'Trending intents' && (
        <div className="grid gap-4 md:grid-cols-2">
          {trends.map((t) => (
            <Card key={t.intent}>
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-400">“{t.intent}”</p><p className="mt-1 text-lg font-semibold text-slate-900">{t.cat}</p></div><Badge tone="green">+{t.growth}% WoW</Badge></div>
              <div className="my-3 h-14"><ResponsiveContainer><LineChart data={[3, 4, 4, 6, 9, 14, 22].map((v, i) => ({ i, v: v * (t.growth / 100) }))}><Line dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
              <div className="flex items-center justify-between text-sm"><span className="text-slate-500">{t.volume.toLocaleString()} searches / wk</span>{t.gap ? <Badge tone="amber">Catalog gap</Badge> : <Badge tone="green">You cover this</Badge>}</div>
              <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => openCopilot('Respond with Trend Responder')}>Respond with agent</Button><Button size="sm" variant="ghost">See sample queries</Button></div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'How shoppers ask' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Top modifiers in requests" />{phrasing.map((p) => <div key={p.modifier} className="mb-3"><div className="flex justify-between text-sm"><span>{p.modifier}</span><b>{p.share}%</b></div><Progress value={p.share * 2} /></div>)}</Card>
          <Card><CardHeader title="Real phrasing (anonymised)" />
            <div className="space-y-2">{['“something warm but not bulky for a morning commute, under $120”', '“a gift for my dad who just started running”', '“wedding guest dress, outdoor, October, not black”', '“sweater that won\'t shrink, machine washable, ethical brand”', '“packable rain jacket for a Japan trip”'].map((q) => <div key={q} className="flex gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><Search size={14} className="mt-0.5 shrink-0 text-slate-400" />{q}</div>)}</div></Card>
          <Card className="lg:col-span-2"><CardHeader title="Use cases shoppers mention" /><div className="flex flex-wrap gap-2">{['Commute', 'Wedding guest', 'Travel', 'Interview', 'Hiking', 'Gym', 'Date night', 'Work from home', 'Gifting', 'Dog walking', 'Festival'].map((u, i) => <span key={u} className="rounded-full bg-brand-50 px-3 py-1.5 font-medium text-brand-700" style={{ fontSize: 12 + (i % 4) * 2 }}>{u}</span>)}</div></Card>
        </div>
      )}

      {tab === 'Category demand' && (
        <Card><CardHeader title="Demand index – next 6 months" sub="Seasonality + current trend momentum" /><div className="h-80"><ResponsiveContainer><LineChart data={demand}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="m" /><YAxis /><Tooltip />
          <Line dataKey="outerwear" stroke="#4f46e5" strokeWidth={2} /><Line dataKey="dresses" stroke="#ec4899" strokeWidth={2} /><Line dataKey="activewear" stroke="#10b981" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">{[['Outerwear', 'Rising fast – stock up and campaign by Oct 20'], ['Dresses', 'Seasonal dip, but “wedding guest” rising'], ['Activewear', 'Steady, gifting lift in Dec']].map(([a, b]) => <div key={a} className="rounded-lg bg-slate-50 p-3 text-sm"><b>{a}</b><p className="text-slate-500">{b}</p></div>)}</div></Card>
      )}

      {tab === 'Unmet demand' && (
        <>
          <Card className="mb-4 !bg-gradient-to-r from-amber-50 to-pink-50"><p className="text-sm text-slate-700"><b>3 high-value gaps</b> where shoppers ask and the platform lacks a strong match in your category. Filling them could add ≈ <b>$38K/month</b>.</p></Card>
          <div className="space-y-3">{trends.filter((t) => t.gap).map((t) => (
            <Card key={t.intent} className="flex items-center gap-4 !p-4">
              <div className="min-w-0 flex-1"><p className="font-semibold text-slate-900">“{t.intent}”</p><p className="text-sm text-slate-500">{t.volume.toLocaleString()} searches/wk · only 6% got a good match · opportunity $12K/mo</p><p className="mt-1 text-xs text-emerald-700">Suggestion: tag 14 existing dresses with “wedding guest”, add 3 mid-price styles under $150</p></div>
              <Button size="sm" variant="primary" onClick={() => openCopilot('Respond with Trend Responder')}>Close gap with agent</Button>
            </Card>
          ))}</div>
          <Card className="mt-6"><CardHeader title="Match rate by intent" /><div className="h-56"><ResponsiveContainer><BarChart data={trends.map((t) => ({ n: t.cat, m: t.gap ? 6 : 41 }))}><XAxis dataKey="n" /><YAxis unit="%" /><Tooltip /><Bar dataKey="m" fill="#6366f1" radius={6} /></BarChart></ResponsiveContainer></div></Card>
        </>
      )}
    </>
  )
}
