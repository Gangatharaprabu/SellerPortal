import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Badge, Button, Card, PageHeader, cx } from '../components/ui'
import { Preview } from './CampaignWizard'

export function Simulator() {
  const [surf, setSurf] = useState<'lock' | 'tv' | 'agent'>('lock')
  const [bought, setBought] = useState(false)
  const [events, setEvents] = useState<string[]>(['impression · Lockscreen'])
  const push = (e: string) => setEvents((x) => [e, ...x].slice(0, 7))
  return (
    <>
      <PageHeader title="Shopper Simulator" sub="See what the shopper sees. Actions here appear in your reporting." actions={<Link to="/ads/reports"><Button>View in reporting</Button></Link>} />
      <div className="mb-5 flex gap-2">{([['lock', '📱 Mobile lockscreen'], ['tv', '📺 TV screensaver'], ['agent', '💬 Agent chat']] as const).map(([k, l]) => <Button key={k} variant={surf === k ? 'dark' : 'secondary'} onClick={() => { setSurf(k); push(`impression · ${l.slice(3)}`) }}>{l}</Button>)}</div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="grid min-h-[520px] place-items-center bg-gradient-to-br from-slate-100 to-slate-200 lg:col-span-2">
          {surf !== 'agent' ? (
            <div className="text-center"><Preview kind={surf} /><Button variant="primary" className="mt-6" onClick={() => { push('click · Autumn Trail ad'); setSurf('agent') }}>Tap the ad →</Button></div>
          ) : (
            <div className="w-full max-w-sm rounded-3xl border-8 border-slate-900 bg-white p-4 shadow-xl">
              <p className="mb-3 text-center text-xs font-semibold text-slate-400">GLANCE AGENT</p>
              <div className="mb-2 ml-8 rounded-2xl bg-slate-100 p-3 text-sm">warm jacket for my commute, under $200</div>
              <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-3 text-sm">I found 3 options. My top pick is the <b>Fernhill Trail Shell Jacket</b>: waterproof, warm, and highly rated for commuting.
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-2 ring-1 ring-slate-200"><span className="text-3xl">🧥</span><div className="flex-1"><p className="text-sm font-medium">Trail Shell Jacket</p><p className="text-xs text-slate-500">$189 · ★ 4.6 · Free returns</p></div><Badge tone="violet">Sponsored</Badge></div>
                {!bought ? <Button variant="primary" className="mt-3 w-full" onClick={() => { setBought(true); push('add_to_cart'); push('purchase · $189'); }}>Buy now</Button> : <p className="mt-3 flex items-center gap-1 rounded-lg bg-emerald-50 p-2 text-emerald-700"><Check size={14} /> Order placed. Confirmation sent to your phone.</p>}
              </div>
            </div>
          )}
        </Card>
        <Card>
          <h3 className="mb-3 text-sm font-semibold">Live event stream</h3>
          <div className="space-y-2">{events.map((e, i) => <div key={i} className={cx('rounded-lg border px-3 py-2 text-xs', i === 0 ? 'border-brand-200 bg-brand-50' : 'border-slate-100')}><code>{e}</code><span className="float-right text-slate-400">{i === 0 ? 'now' : `${i * 4}s`}</span></div>)}</div>
          <p className="mt-4 text-xs text-slate-500">Each event is captured by the Glance pixel and attributed to the campaign.</p>
        </Card>
      </div>
    </>
  )
}
