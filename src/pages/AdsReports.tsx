import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Button, Card, CardHeader, Kpi, PageHeader, Table, Tabs, Td, CHART_COLORS, money, num } from '../components/ui'
import { campaigns, daily } from '../data'
import { useApp } from '../store'

const byType = [
  { type: 'CPM', spend: 13100, impr: 3070000, clicks: 31300, conv: 650, rev: 43500 },
  { type: 'CPC', spend: 5230, impr: 870000, clicks: 38900, conv: 1172, rev: 32100 },
  { type: 'SmartAds', spend: 8420, impr: 1240000, clicks: 38200, conv: 1120, rev: 41800 },
]
const bySurface = [
  { s: 'Lockscreen', spend: 9800, rev: 36200, impr: 2100000 }, { s: 'TV Screensaver', spend: 8900, rev: 27400, impr: 2300000 },
  { s: 'Agent Search', spend: 7050, rev: 31100, impr: 800000 },
]

export function AdsReports() {
  const [tab, setTab] = useState('By buying type')
  const { attribution, setAttribution } = useApp()
  const spend = byType.reduce((a, b) => a + b.spend, 0)
  const rev = byType.reduce((a, b) => a + b.rev, 0)
  return (
    <>
      <PageHeader title="Ads Reporting" sub="Understand where spend works. Numbers shown use your chosen attribution source."
        actions={<><select value={attribution} onChange={(e) => setAttribution(e.target.value as typeof attribution)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option>Glance Pixel</option><option>GA4</option><option>Northbeam</option></select><Button>Export</Button></>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-6">
        <Kpi label="Spend" value={money(spend)} delta={9} good={false} /><Kpi label="Revenue" value={money(rev * (attribution === 'GA4' ? 1.08 : 1))} delta={14} /><Kpi label="ROAS" value={(rev / spend * (attribution === 'GA4' ? 0.92 : 1)).toFixed(2) + 'x'} delta={4} />
        <Kpi label="Impressions" value="8.08M" delta={21} /><Kpi label="CTR" value="1.4%" delta={0.2} /><Kpi label="CPA" value="$9.90" delta={-6} good={false} />
      </div>
      <Tabs tabs={['By buying type', 'By surface & device', 'Organic vs paid', 'Cross-device journeys', 'SmartAds insights']} value={tab} onChange={setTab} />

      {tab === 'By buying type' && (
        <div className="space-y-6">
          <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Performance by buying type" /></div>
            <Table head={['Type', 'Spend', 'Impressions', 'Clicks', 'CTR', 'CPC', 'Conversions', 'Revenue', 'ROAS']}>
              {byType.map((r) => <tr key={r.type}><Td><Badge tone={r.type === 'SmartAds' ? 'violet' : 'blue'}>{r.type}</Badge></Td><Td>{money(r.spend)}</Td><Td>{num(r.impr)}</Td><Td>{num(r.clicks)}</Td><Td>{((r.clicks / r.impr) * 100).toFixed(2)}%</Td><Td>${(r.spend / r.clicks).toFixed(2)}</Td><Td>{r.conv}</Td><Td>{money(r.rev)}</Td><Td className="font-semibold">{(r.rev / r.spend).toFixed(1)}x</Td></tr>)}
            </Table></Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader title="ROAS by buying type" /><div className="h-64"><ResponsiveContainer><BarChart data={byType.map((r) => ({ n: r.type, roas: +(r.rev / r.spend).toFixed(2) }))}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="n" /><YAxis /><Tooltip /><Bar dataKey="roas" radius={6}>{byType.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}</Bar></BarChart></ResponsiveContainer></div></Card>
            <Card><CardHeader title="Spend share" /><div className="h-64"><ResponsiveContainer><PieChart><Pie data={byType} dataKey="spend" nameKey="type" innerRadius={55} outerRadius={90}>{byType.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}</Pie><Legend /><Tooltip formatter={(v) => money(Number(v))} /></PieChart></ResponsiveContainer></div></Card>
          </div>
          <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Campaigns" /></div><Table head={['Campaign', 'Type', 'Spend', 'Revenue', 'ROAS']}>{campaigns.map((c) => <tr key={c.id}><Td>{c.name}</Td><Td>{c.type}</Td><Td>{money(c.spend)}</Td><Td>{money(c.rev)}</Td><Td className="font-semibold">{(c.rev / c.spend).toFixed(1)}x</Td></tr>)}</Table></Card>
        </div>
      )}

      {tab === 'By surface & device' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Spend vs. revenue by surface" /><div className="h-72"><ResponsiveContainer><BarChart data={bySurface}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="s" tick={{ fontSize: 11 }} /><YAxis tickFormatter={(v: number) => `$${v / 1000}k`} /><Tooltip formatter={(v) => money(Number(v))} /><Legend /><Bar dataKey="spend" fill="#f59e0b" radius={4} /><Bar dataKey="rev" name="revenue" fill="#4f46e5" radius={4} /></BarChart></ResponsiveContainer></div></Card>
          <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Surface efficiency" /></div><Table head={['Surface', 'Spend', 'Revenue', 'ROAS', 'CPM']}>{bySurface.map((r) => <tr key={r.s}><Td>{r.s}</Td><Td>{money(r.spend)}</Td><Td>{money(r.rev)}</Td><Td className="font-semibold">{(r.rev / r.spend).toFixed(1)}x</Td><Td>${((r.spend / r.impr) * 1000).toFixed(2)}</Td></tr>)}</Table></Card>
          <Card className="lg:col-span-2"><CardHeader title="By device" /><div className="grid gap-3 sm:grid-cols-4">{[['Mobile', '58%', '3.9x'], ['TV', '24%', '2.7x'], ['Laptop', '14%', '3.3x'], ['Tablet', '4%', '3.0x']].map(([a, b, c]) => <div key={a} className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-500">{a}</p><p className="text-2xl font-bold">{b}</p><p className="text-xs text-slate-500">of spend · ROAS {c}</p></div>)}</div></Card>
        </div>
      )}

      {tab === 'Organic vs paid' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2"><CardHeader title="Revenue: organic vs. paid" /><div className="h-72"><ResponsiveContainer><LineChart data={daily}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="d" interval={4} tick={{ fontSize: 11 }} /><YAxis tickFormatter={(v: number) => `$${v / 1000}k`} /><Tooltip formatter={(v) => money(Number(v))} /><Legend /><Line dataKey="organic" stroke="#4f46e5" dot={false} strokeWidth={2} /><Line dataKey="paid" stroke="#ec4899" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card>
          <Card><CardHeader title="Incrementality" sub="Holdout test · lockscreen" /><p className="text-4xl font-bold text-emerald-600">+23%</p><p className="text-sm text-slate-500">Orders lift vs. holdout group (95% CI 17–29%)</p><div className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><span>Test group</span><b>4.9% CVR</b></div><div className="flex justify-between"><span>Holdout</span><b>4.0% CVR</b></div></div><Badge tone="blue">Sample data</Badge></Card>
        </div>
      )}

      {tab === 'Cross-device journeys' && (
        <Card><CardHeader title="How shoppers convert across devices" sub="Top journey paths (last 30 days)" />
          <div className="space-y-4">{[['📺 TV screensaver', '📱 Mobile lockscreen', '💻 Laptop purchase', '18%'], ['📱 Mobile lockscreen', '💬 Agent chat', '📱 Mobile purchase', '31%'], ['📺 TV screensaver', '💬 Agent chat', '📱 Mobile purchase', '12%'], ['📱 Mobile lockscreen', '💻 Laptop purchase', '', '9%']].map((p, i) => (
            <div key={i} className="flex items-center gap-3">{p.slice(0, 3).filter(Boolean).map((s, j, a) => <span key={j} className="flex items-center gap-3"><span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">{s}</span>{j < a.length - 1 && <span className="text-slate-300">→</span>}</span>)}<Badge tone="violet">{p[3]} of conversions</Badge></div>
          ))}</div>
          <div className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">💡 Last-click models undercount TV by ≈ 3.2× because the purchase happens on another device. Glance credits the first touch in the sequence.</div></Card>
      )}

      {tab === 'SmartAds insights' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Where SmartAds spent your budget" /><div className="space-y-3">{[['Lockscreen – mornings', 41], ['Agent search – evenings', 27], ['TV – weekend afternoons', 19], ['Extended networks (audience extension)', 13]].map(([a, b]) => <div key={a as string}><div className="flex justify-between text-sm"><span>{a}</span><b>{b}%</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-600" style={{ width: `${(b as number) * 2}%` }} /></div></div>)}</div></Card>
          <Card><CardHeader title="Why" /><ul className="space-y-2 text-sm text-slate-700"><li>• Lockscreen mornings convert 2.1× better for commuting products.</li><li>• Agent search peaks with high-intent “under $X” queries after 7 pm.</li><li>• Shifted 18% of TV budget away from late night, saving $1.1K.</li><li>• Target ROAS 3.5x · currently <b>3.7x</b></li></ul></Card>
        </div>
      )}
    </>
  )
}
