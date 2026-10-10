import { useState } from 'react'
import { Badge, Button, Card, CardHeader, Field, PageHeader, Table, Tabs, Td, inputCls } from '../components/ui'

export function SettingsPage() {
  const [tab, setTab] = useState('Team & roles')
  return (
    <>
      <PageHeader title="Settings" sub="Account, team, billing and developer tools." />
      <Tabs tabs={['Team & roles', 'Business', 'Billing', 'API keys', 'Audit log']} value={tab} onChange={setTab} />
      {tab === 'Team & roles' && <Card pad={false}><div className="flex justify-between p-5 pb-0"><CardHeader title="Team" /><Button variant="primary" size="sm">Invite</Button></div><Table head={['Name', 'Role', 'Can launch agents', 'Can approve changes', 'Billing']}>{[['Alex Morgan', 'Admin', '✓', '✓', '✓'], ['Sam Rivera', 'Marketer', '✓', 'Ads only', '—'], ['Jo Park', 'Catalog manager', '✓', 'Catalog only', '—'], ['Kim Lee', 'Analyst', '—', '—', '—']].map((r) => <tr key={r[0]}>{r.map((c, i) => <Td key={i} className={i === 0 ? 'font-medium' : ''}>{i === 1 ? <Badge tone="violet">{c}</Badge> : c}</Td>)}</tr>)}</Table></Card>}
      {tab === 'Business' && <Card className="max-w-2xl space-y-4"><Field label="Legal name"><input className={inputCls} defaultValue="Fernhill Apparel Inc." /></Field><Field label="Website"><input className={inputCls} defaultValue="https://fernhillapparel.com" /></Field><Badge tone="green">✓ Business verified</Badge></Card>}
      {tab === 'Billing' && <Card className="max-w-2xl"><CardHeader title="Payment method" /><p className="text-sm">Visa •••• 4242 · expires 08/28</p><Button size="sm" className="mt-3">Update</Button></Card>}
      {tab === 'API keys' && <Card className="max-w-2xl"><CardHeader title="API keys" right={<Button size="sm">Create key</Button>} /><code className="block rounded bg-slate-100 p-3 text-sm">gl_live_••••••••••••••••••4f2a</code></Card>}
      {tab === 'Audit log' && <Card pad={false}><Table head={['When', 'Who', 'Action']}>{[['Today 08:14', 'Catalog Fixer (Alex)', 'Updated 168 products'], ['Yesterday', 'Sam', 'Changed budget on “Fall Knitwear – SmartAds”'], ['Oct 7', 'Alex', 'Connected GA4'], ['Oct 5', 'Enrichment Agent', 'Added FAQs to 92 products']].map((r) => <tr key={r[0]}>{r.map((c, i) => <Td key={i}>{c}</Td>)}</tr>)}</Table></Card>}
    </>
  )
}
