import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users, Globe } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Kpi, PageHeader, Progress, Table, Tabs, Td, money, num } from '../components/ui'
import { campaigns } from '../data'

export function AdsPage() {
  const [tab, setTab] = useState('Campaigns')
  const spend = campaigns.reduce((a, c) => a + c.spend, 0)
  const rev = campaigns.reduce((a, c) => a + c.rev, 0)
  return (
    <>
      <PageHeader title="Ads Manager" sub="Buy lockscreen, TV screensaver and agent-search traffic. Or let SmartAds do it for you." actions={<Link to="/ads/new"><Button variant="primary"><Plus size={15} /> Create campaign</Button></Link>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi label="Spend (30d)" value={money(spend)} delta={9.3} good={false} /><Kpi label="Revenue from ads" value={money(rev)} delta={14.8} /><Kpi label="ROAS" value={(rev / spend).toFixed(2) + 'x'} delta={4.7} />
        <Kpi label="Impressions" value="8.1M" delta={21} /><Kpi label="Wallet balance" value="$14,820" sub="Auto top-up on" />
      </div>
      <Tabs tabs={['Campaigns', 'Audiences', 'Creatives', 'Off-platform (DSP)', 'Billing & wallet']} value={tab} onChange={setTab} />

      {tab === 'Campaigns' && (
        <Card pad={false}><Table head={['Campaign', 'Buying type', 'Surface', 'Status', 'Budget used', 'Impr.', 'Clicks', 'Orders', 'ROAS']}>
          {campaigns.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <Td><p className="font-medium text-slate-900">{c.name}</p><p className="text-xs text-slate-400">Goal: {c.goal}</p></Td>
              <Td><Badge tone={c.type === 'SmartAds' ? 'violet' : c.type === 'DSP' ? 'pink' : 'blue'}>{c.type}</Badge></Td><Td>{c.surfaces}</Td>
              <Td><Badge tone={c.status === 'Active' ? 'green' : c.status === 'Learning' ? 'amber' : 'slate'}>{c.status}</Badge></Td>
              <Td><div className="w-32"><Progress value={(c.spend / c.budget) * 100} /><p className="mt-1 text-xs text-slate-500">{money(c.spend)} / {money(c.budget)}</p></div></Td>
              <Td>{num(c.impr)}</Td><Td>{num(c.clicks)}</Td><Td>{c.orders}</Td><Td className="font-semibold">{(c.rev / c.spend).toFixed(1)}x</Td>
            </tr>
          ))}
        </Table></Card>
      )}

      {tab === 'Audiences' && (
        <div className="grid gap-4 md:grid-cols-2">
          {[['Site visitors – last 30d', 'Pixel retargeting', '48,200', 'On-platform + DSP'], ['Cart abandoners – 7d', 'Pixel retargeting', '6,120', 'On-platform + DSP'], ['Past purchasers', 'Customer list', '22,400', 'Suppression / upsell'], ['Intent: wedding guest outfits', 'Platform intent', '~310K', 'On-platform'], ['Lookalike: top 10% buyers', 'Audience extension', '~1.8M', 'DSP']].map(([a, b, c, d]) => (
            <Card key={a}><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><Users size={18} /></div><div><p className="font-semibold text-slate-900">{a}</p><p className="text-xs text-slate-500">{b}</p></div></div><Badge>{d}</Badge></div><p className="mt-3 text-2xl font-bold">{c} <span className="text-sm font-normal text-slate-400">users</span></p></Card>
          ))}
          <Card className="grid place-items-center border-dashed text-center"><Button variant="primary"><Plus size={14} /> Build audience</Button></Card>
        </div>
      )}

      {tab === 'Creatives' && (
        <div className="grid gap-4 md:grid-cols-3">
          {[['Lockscreen card', '📱', 'from-indigo-500 to-pink-500'], ['TV ambient full-screen', '📺', 'from-slate-800 to-indigo-900'], ['Sponsored agent result', '💬', 'from-emerald-500 to-sky-500']].map(([a, b, c]) => (
            <Card key={a} pad={false}><div className={`grid h-44 place-items-center rounded-t-xl bg-gradient-to-br ${c} text-6xl`}>{b}</div><div className="p-4"><p className="font-semibold">{a}</p><p className="text-xs text-slate-500">Auto-generated from your catalog and brand profile</p><div className="mt-3 flex gap-2"><Button size="sm">Preview</Button><Button size="sm" variant="ghost">Regenerate</Button></div></div></Card>
          ))}
        </div>
      )}

      {tab === 'Off-platform (DSP)' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2"><CardHeader title="Commerce DSP – reach shoppers beyond Lumio" sub="Use first-party pixel and platform signals to reach shoppers on the open web." />
            <div className="grid gap-4 sm:grid-cols-2">
              {[['Retargeting', 'Re-engage site visitors and cart abandoners on 3P inventory', '48,200 users'], ['Audience extension', 'Reach lookalikes of your best customers', '~1.8M users']].map(([a, b, c]) => <div key={a} className="rounded-xl border border-slate-200 p-4"><Globe className="mb-2 text-brand-600" size={20} /><p className="font-semibold">{a}</p><p className="mt-1 text-sm text-slate-500">{b}</p><p className="mt-2 text-sm font-medium text-slate-800">{c}</p><Link to="/ads/new"><Button size="sm" variant="primary" className="mt-3">Create {a.toLowerCase()} campaign</Button></Link></div>)}
            </div>
          </Card>
          <Card><CardHeader title="Current DSP campaign" /><p className="font-medium">Visitors Retargeting (3P DSP)</p><div className="mt-3 space-y-2 text-sm">{[['Spend', '$4,700'], ['Impressions', '2.9M'], ['ROAS', '3.4x'], ['Frequency', '3.8 / wk']].map(([a, b]) => <div key={a} className="flex justify-between"><span className="text-slate-500">{a}</span><b>{b}</b></div>)}</div></Card>
        </div>
      )}

      {tab === 'Billing & wallet' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card><CardHeader title="Ad wallet" /><p className="text-3xl font-bold">$14,820</p><p className="text-sm text-slate-500">Auto top-up $5,000 when below $2,000</p><div className="mt-3 flex gap-2"><Button variant="primary" size="sm">Add funds</Button><Button size="sm">Set spend cap</Button></div></Card>
          <Card className="lg:col-span-2" pad={false}><div className="p-5 pb-0"><CardHeader title="Invoices" /></div><Table head={['Invoice', 'Period', 'Amount', 'Status']}>{[['INV-0921', 'Sep 2026', '$27,450', 'Disputed'], ['INV-0884', 'Aug 2026', '$22,120', 'Paid'], ['INV-0840', 'Jul 2026', '$18,900', 'Paid']].map((r) => <tr key={r[0]}><Td>{r[0]}</Td><Td>{r[1]}</Td><Td>{r[2]}</Td><Td><Badge tone={r[3] === 'Paid' ? 'green' : 'amber'}>{r[3]}</Badge></Td></tr>)}</Table></Card>
        </div>
      )}
    </>
  )
}
