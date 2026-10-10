import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Package, TrendingUp, Megaphone, Palette, ArrowRight, Sparkles } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Kpi, PageHeader, Progress, money } from '../components/ui'
import { campaigns, daily, nextActions, trends } from '../data'
import { useApp } from '../store'

const icons = { catalog: Package, trend: TrendingUp, ads: Megaphone, brand: Palette }

export function HomePage() {
  const { openCopilot, catalogScore } = useApp()
  const gmv = daily.reduce((a, d) => a + d.gmv, 0)
  const orders = daily.reduce((a, d) => a + d.orders, 0)
  return (
    <>
      <PageHeader title="Good morning, Alex 👋" sub="Here is how Fernhill Apparel is performing on the Glance shopping platform." actions={<Button variant="primary" onClick={() => openCopilot()}><Sparkles size={15} /> Ask Copilot</Button>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi label="Revenue (GMV)" value={money(gmv)} delta={18.4} />
        <Kpi label="Orders" value={orders.toLocaleString()} delta={12.1} />
        <Kpi label="Agent recommendations" value="1.02M" delta={22.7} />
        <Kpi label="Ad spend" value="$32.4K" delta={9.3} good={false} />
        <Kpi label="Blended ROAS" value="3.4x" delta={4.2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Next best actions" sub="Prioritized by estimated revenue impact" right={<Badge tone="violet">AI-generated</Badge>} />
            <div className="space-y-3">
              {nextActions.map((a) => {
                const I = icons[a.icon as keyof typeof icons]
                return (
                  <div key={a.id} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-brand-300 hover:shadow-sm">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><I size={20} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                      <p className="mt-0.5 text-xs text-emerald-600">{a.impact}</p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => openCopilot(a.agent)}>{a.action.split(' with ')[0]} with agent</Button>
                  </div>
                )
              })}
            </div>
          </Card>
          <Card>
            <CardHeader title="Revenue by source" sub="Last 30 days · organic vs. paid" />
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="d" tick={{ fontSize: 11 }} interval={4} /><YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => money(Number(v))} />
                  <Area type="monotone" dataKey="organic" stackId="1" stroke="#4f46e5" fill="#c7d2fe" name="Organic (agent recs)" />
                  <Area type="monotone" dataKey="paid" stackId="1" stroke="#ec4899" fill="#fbcfe8" name="Paid ads" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Catalog agent-readiness" right={<Link to="/catalog" className="text-xs font-medium text-brand-600">View</Link>} />
            <p className="text-4xl font-bold text-slate-900">{catalogScore}<span className="text-lg text-slate-400">/100</span></p>
            <div className="my-3"><Progress value={catalogScore} tone={catalogScore < 60 ? 'amber' : 'green'} /></div>
            <p className="text-xs text-slate-500">{catalogScore < 60 ? '214 products are missing key attributes agents use to match shoppers.' : 'Great! Agents can confidently recommend most of your catalog.'}</p>
          </Card>
          <Card>
            <CardHeader title="Setup progress" right={<span className="text-xs font-medium text-slate-500">3 of 5</span>} />
            <Progress value={60} tone="green" />
            <ul className="mt-3 space-y-2 text-sm">
              {[['Connect catalog', true], ['Install pixel', true], ['Sync reviews', true], ['Complete brand profile', false], ['Launch first campaign', false]].map(([l, d]) => (
                <li key={l as string} className="flex items-center gap-2"><span className={d ? 'text-emerald-500' : 'text-slate-300'}>●</span><span className={d ? 'text-slate-500 line-through' : 'text-slate-800'}>{l as string}</span></li>
              ))}
            </ul>
            <Link to="/onboarding" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600">Continue setup <ArrowRight size={12} /></Link>
          </Card>
          <Card>
            <CardHeader title="Trending with shoppers" right={<Link to="/insights" className="text-xs font-medium text-brand-600">All insights</Link>} />
            <div className="space-y-3">
              {trends.slice(0, 3).map((t) => (
                <div key={t.intent} className="text-sm"><p className="font-medium text-slate-800">{t.intent}</p><p className="text-xs text-slate-500"><span className="font-medium text-emerald-600">+{t.growth}%</span> · {t.volume.toLocaleString()} searches/wk</p></div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Active campaigns" right={<Link to="/ads" className="text-xs font-medium text-brand-600">Manage</Link>} />
            {campaigns.filter((c) => c.status === 'Active').slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0"><span className="truncate pr-2 text-slate-700">{c.name}</span><span className="font-medium text-slate-900">{(c.rev / c.spend).toFixed(1)}x</span></div>
            ))}
          </Card>
        </div>
      </div>
    </>
  )
}
