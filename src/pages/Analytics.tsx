import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Button, Card, CardHeader, Kpi, PageHeader, Table, Tabs, Td, CHART_COLORS, money, num } from '../components/ui'
import { daily, funnel, lostReasons, products, surfaces } from '../data'
import { useApp } from '../store'

export function AnalyticsPage() {
  const [tab, setTab] = useState('Overview')
  const { attribution, openCopilot } = useApp()
  const maxF = funnel[0].value
  return (
    <>
      <PageHeader title="Analytics" sub={`Organic performance across Lumio surfaces · Attribution source: ${attribution}`}
        actions={<><select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select><Button onClick={() => openCopilot('Which products lose to competitors on price?')}>Explain this page</Button></>} />
      <Tabs tabs={['Overview', 'Surfaces & devices', 'Agent funnel', 'Products', 'Competitive']} value={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-6">
            <Kpi label="Impressions" value="2.05M" delta={14} /><Kpi label="Agent recs" value="1.02M" delta={22.7} /><Kpi label="Clicks" value="179K" delta={11} />
            <Kpi label="Add to cart" value="34K" delta={9} /><Kpi label="Orders" value="7,150" delta={12.1} /><Kpi label="Conv. rate" value="4.0%" delta={0.4} />
          </div>
          <Card>
            <CardHeader title="Funnel over time" />
            <div className="h-80"><ResponsiveContainer><LineChart data={daily}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="d" tick={{ fontSize: 11 }} interval={3} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
              <Line dataKey="recs" name="Recommendations" stroke="#4f46e5" dot={false} strokeWidth={2} /><Line dataKey="clicks" name="Clicks" stroke="#0ea5e9" dot={false} strokeWidth={2} /><Line dataKey="orders" name="Orders" stroke="#10b981" dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer></div>
          </Card>
        </>
      )}

      {tab === 'Surfaces & devices' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Revenue by surface" /><div className="h-72"><ResponsiveContainer><PieChart><Pie data={surfaces} dataKey="gmv" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>{surfaces.map((s, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}</Pie><Tooltip formatter={(v) => money(Number(v))} /><Legend /></PieChart></ResponsiveContainer></div></Card>
          <Card pad={false}><div className="p-5 pb-0"><CardHeader title="Surface performance" /></div>
            <Table head={['Surface', 'Impr.', 'Clicks', 'CTR', 'Orders', 'GMV']}>{surfaces.map((s) => <tr key={s.name}><Td className="font-medium">{s.name}</Td><Td>{num(s.impressions)}</Td><Td>{num(s.clicks)}</Td><Td>{((s.clicks / s.impressions) * 100).toFixed(1)}%</Td><Td>{num(s.orders)}</Td><Td>{money(s.gmv)}</Td></tr>)}</Table></Card>
          <Card className="lg:col-span-2"><CardHeader title="By device" /><div className="h-56"><ResponsiveContainer><BarChart data={[{ n: 'Mobile', gmv: 158400 }, { n: 'TV', gmv: 71200 }, { n: 'Laptop', gmv: 47100 }, { n: 'Tablet', gmv: 12800 }]}><XAxis dataKey="n" /><YAxis tickFormatter={(v: number) => `$${v / 1000}k`} /><Tooltip formatter={(v) => money(Number(v))} /><Bar dataKey="gmv" fill="#4f46e5" radius={6} /></BarChart></ResponsiveContainer></div></Card>
        </div>
      )}

      {tab === 'Agent funnel' && (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader title="How agents treat your products" sub="From shopper request to purchase" />
            <div className="space-y-3">{funnel.map((f, i) => (
              <div key={f.stage}><div className="mb-1 flex justify-between text-sm"><span className="text-slate-700">{f.stage}</span><span className="font-semibold">{num(f.value)} {i > 0 && <span className="font-normal text-slate-400">({((f.value / funnel[i - 1].value) * 100).toFixed(0)}%)</span>}</span></div>
                <div className="h-7 overflow-hidden rounded-md bg-slate-100"><div className="h-full rounded-md bg-gradient-to-r from-brand-600 to-pink-500" style={{ width: `${Math.max(3, (f.value / maxF) * 100)}%` }} /></div></div>
            ))}</div>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader title="Why you were not recommended" sub="Shortlisted but dropped" />
            <div className="space-y-3">{lostReasons.map((l) => <div key={l.reason}><div className="flex justify-between text-sm"><span>{l.reason}</span><b>{l.pct}%</b></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber-500" style={{ width: `${l.pct * 2.5}%` }} /></div><button onClick={() => openCopilot('Run Catalog Fixer')} className="mt-1 text-xs font-medium text-brand-600">{l.fix} →</button></div>)}</div>
          </Card>
        </div>
      )}

      {tab === 'Products' && (
        <Card pad={false}><Table head={['Product', 'Impressions', 'Conv.', 'Trend', 'Insight']}>
          {[...products].sort((a, b) => b.conv - a.conv).map((p, i) => (
            <tr key={p.id}><Td><span className="mr-2">{p.img}</span>{p.title}</Td><Td>{num(p.impressions)}</Td><Td>{p.conv}%</Td><Td><Badge tone={i < 8 ? 'green' : 'red'}>{i < 8 ? '▲' : '▼'} {(3 + i * 1.4).toFixed(0)}%</Badge></Td><Td className="text-xs text-slate-500">{i < 3 ? 'Top performer – consider boosting with ads' : i > 12 ? 'Low match: missing occasion data' : '—'}</Td></tr>
          ))}</Table></Card>
      )}

      {tab === 'Competitive' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Share of voice – Outerwear" /><div className="h-64"><ResponsiveContainer><BarChart data={[{ n: 'You', v: 11 }, { n: 'Brand A', v: 24 }, { n: 'Brand B', v: 19 }, { n: 'Brand C', v: 15 }, { n: 'Others', v: 31 }]}><XAxis dataKey="n" /><YAxis unit="%" /><Tooltip /><Bar dataKey="v" fill="#6366f1" radius={6} /></BarChart></ResponsiveContainer></div></Card>
          <Card><CardHeader title="Price position" /><p className="text-sm text-slate-600">Your median outerwear price is <b>$135</b> – <b className="text-amber-600">14% above</b> the category median of $118.</p><div className="mt-4 space-y-3 text-sm">{[['Trail Shell Jacket', '$189', '$162'], ['Quilted Vest', '$119', '$112'], ['Relaxed Denim Jacket', '$135', '$139']].map(([a, b, c]) => <div key={a} className="flex justify-between border-b border-slate-100 pb-2"><span>{a}</span><span className="text-slate-500">You {b} · Market {c}</span></div>)}</div></Card>
        </div>
      )}
    </>
  )
}
