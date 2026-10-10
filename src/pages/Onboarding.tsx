import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button, Card, PageHeader, Progress, cx } from '../components/ui'

const steps = [
  { t: 'Verify your business', d: 'Fernhill Apparel Inc. · verified', done: true, to: '/settings', cta: 'View' },
  { t: 'Connect your catalog', d: 'Shopify connected · 1,284 products synced', done: true, to: '/integrations', cta: 'Manage' },
  { t: 'Install the Lumio pixel', d: 'Events detected: view, add-to-cart, purchase', done: true, to: '/integrations', cta: 'Check health' },
  { t: 'Sync reviews & connect attribution', d: 'Yotpo and GA4 connected. Add a second attribution source (optional).', done: true, to: '/integrations', cta: 'Add' },
  { t: 'Complete your brand profile', d: 'Tell agents who you are. 40% complete.', done: false, to: '/brand', cta: 'Continue' },
  { t: 'Launch your first campaign', d: 'Use SmartAds to get started in 2 minutes.', done: false, to: '/ads/new', cta: 'Create campaign' },
]

export function Onboarding() {
  const done = steps.filter((s) => s.done).length
  return (
    <>
      <PageHeader title="Setup guide" sub="Get to your first sale on the Lumio platform in four steps." />
      <Card className="mb-6">
        <div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-800">{done} of {steps.length} complete</span><span className="text-slate-500">≈ 8 min remaining</span></div>
        <div className="mt-2"><Progress value={(done / steps.length) * 100} tone="green" /></div>
      </Card>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <Card key={s.t} className="flex items-center gap-4 !p-4">
            <div className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold', s.done ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-50 text-brand-600')}>{s.done ? <Check size={18} /> : i + 1}</div>
            <div className="flex-1"><p className="font-semibold text-slate-900">{s.t}</p><p className="text-sm text-slate-500">{s.d}</p></div>
            <Link to={s.to}><Button variant={s.done ? 'secondary' : 'primary'} size="sm">{s.cta}</Button></Link>
          </Card>
        ))}
      </div>
    </>
  )
}
