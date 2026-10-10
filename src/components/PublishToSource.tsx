import { useState } from 'react'
import { Download, UploadCloud, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { Badge, Button, Card, Modal, Progress } from './ui'
import { SourceType, storefrontSources, useApp } from '../store'

const sources: SourceType[] = ['Shopify', 'WooCommerce', 'CSV upload', 'SFTP', 'Feedonomics']
const changeTypes = [['Titles', 96], ['Descriptions', 58], ['Attributes (material, fit, occasion…)', 410], ['Structured data (JSON-LD)', 140], ['FAQs', 44]] as const

export function PublishToSource() {
  const { unpublished, clearUnpublished, source, setSource } = useApp()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [lastPublished, setLastPublished] = useState<string | null>(null)
  const direct = storefrontSources.includes(source)
  const [count, setCount] = useState(0)

  const start = () => { setCount(unpublished); setStep(0); setOpen(true) }
  const finish = () => { clearUnpublished(); setLastPublished(direct ? `Pushed to ${source} just now` : 'Applied in your platform; reconciliation matched'); setOpen(false) }

  return (
    <>
      <Card className="border-brand-200 !bg-gradient-to-r from-brand-50 to-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white"><RefreshCw size={20} /></div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">
              {unpublished > 0 ? <>{unpublished} optimized products are ready to publish back to your store</> : 'Your store is up to date with every optimization'}
            </p>
            <p className="mt-0.5 text-sm text-slate-500">
              Changes made manually or by agents are saved in Glance first. {direct ? `Publish them to ${source} so ChatGPT, Perplexity, Gemini and your own site all see the same improvements.` : `Your catalog comes from ${source}, so Glance can’t write back automatically. Download the optimized data and apply it in your platform.`}
            </p>
            {lastPublished && unpublished === 0 && <p className="mt-1 text-xs font-medium text-emerald-700">✓ {lastPublished}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400">Demo: catalog source
              <select value={source} onChange={(e) => setSource(e.target.value as SourceType)} className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-700">{sources.map((s) => <option key={s}>{s}</option>)}</select></label>
            {direct
              ? <Button variant="primary" disabled={unpublished === 0} onClick={start}><UploadCloud size={15} /> Publish to {source}</Button>
              : <Button variant="primary" disabled={unpublished === 0} onClick={start}><Download size={15} /> Download optimized feed</Button>}
          </div>
        </div>
        {!direct && <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle size={14} className="mt-0.5 shrink-0" />Automatic publishing is available for storefront integrations (Shopify, WooCommerce, BigCommerce, Adobe Commerce). For {source}, you apply the changes yourself and we reconcile afterwards.</div>}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={direct ? `Publish to ${source}` : 'Apply optimized data in your platform'} wide>
        {direct ? <DirectFlow n={count} source={source} step={step} setStep={setStep} onDone={finish} /> : <ManualFlow n={count} source={source} step={step} setStep={setStep} onDone={finish} />}
      </Modal>
    </>
  )
}

function DirectFlow({ n, source, step, setStep, onDone }: { n: number; source: SourceType; step: number; setStep: (n: number) => void; onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const run = () => {
    setStep(1)
    let p = 0
    const t = setInterval(() => { p += 14; setPct(p); if (p >= 100) { clearInterval(t); setStep(2) } }, 350)
  }
  return (
    <div className="space-y-4">
      {step === 0 && (
        <>
          <div className="grid gap-2 sm:grid-cols-2">{changeTypes.map(([a, b]) => <div key={a} className="flex justify-between rounded-lg border border-slate-200 p-3 text-sm"><span>{a}</span><b>{b}</b></div>)}</div>
          <div className="space-y-1.5 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><p>✓ A snapshot of your current {source} data is saved first, so you can <b>roll back</b> in one click.</p><p>✓ Only fields you approved are written. Prices and inventory are never changed.</p><p>✓ Write scope: title, description, tags, metafields, JSON-LD.</p></div>
          <div className="flex justify-end gap-2"><Button variant="primary" onClick={run}>Publish {n} products</Button></div>
        </>
      )}
      {step === 1 && <div className="space-y-3 py-4"><Progress value={pct} /><p className="text-sm text-slate-500">Writing to {source}… {Math.min(100, Math.round((pct / 100) * n))} of {n} products</p></div>}
      {step === 2 && (
        <div className="space-y-3 rounded-xl bg-emerald-50 p-5 text-center"><p className="text-3xl">🎉</p><p className="font-semibold text-emerald-800">{n} products published to {source}</p><p className="text-sm text-emerald-700">Glance will re-sync tonight to confirm the live data matches. AI engines typically refresh within 3 to 14 days.</p><div className="flex justify-center gap-2"><Button variant="primary" onClick={onDone}>Done</Button><Button>Roll back</Button></div></div>
      )}
    </div>
  )
}

function ManualFlow({ n, source, step, setStep, onDone }: { n: number; source: SourceType; step: number; setStep: (n: number) => void; onDone: () => void }) {
  const how: Record<string, string> = {
    'CSV upload': 'Open your store admin or PIM and import the optimized CSV, matching on Product ID.',
    SFTP: 'Replace the file on your SFTP server (e.g. /exports/catalog.csv) with the optimized version.',
    Feedonomics: 'Upload the optimized file as an override source in Feedonomics, or copy the rules into your feed.',
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-xs">{['Download', 'Apply in your platform', 'Reconcile'].map((l, i) => <span key={l} className={`rounded-full px-3 py-1 font-medium ${i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{i + 1}. {l}</span>)}</div>
      {step === 0 && (<>
        <p className="text-sm text-slate-600">We prepared two files for {n} changed products:</p>
        {[['glance_optimized_catalog.csv', 'Your full catalog with optimized titles, descriptions and attributes'], ['glance_changelog.csv', 'Row-by-row list of what changed, so you can review before applying']].map(([a, b]) => <div key={a} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm"><div><p className="font-medium">{a}</p><p className="text-xs text-slate-500">{b}</p></div><Button size="sm"><Download size={12} /> Download</Button></div>)}
        <div className="flex justify-end"><Button variant="primary" onClick={() => setStep(1)}>Next: apply changes</Button></div>
      </>)}
      {step === 1 && (<>
        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700"><p className="font-medium text-slate-900">How to apply for {source}</p><p className="mt-1">{how[source]}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-500"><li>Structured data (JSON-LD) needs to be added to your product templates. A snippet is included in the changelog.</li><li>Keep the Product ID column unchanged so Glance can match rows.</li></ul></div>
        <div className="flex justify-between"><Button variant="ghost" onClick={() => setStep(0)}>Back</Button><Button variant="primary" onClick={() => setStep(2)}>I’ve applied the changes</Button></div>
      </>)}
      {step === 2 && (<>
        <p className="text-sm text-slate-600">On your next sync (or when you re-upload), we compare your live data with what we recommended.</p>
        <div className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between text-sm"><b>Reconciliation preview</b><Badge tone="amber">Sample result</Badge></div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm"><div className="rounded-lg bg-emerald-50 p-3"><p className="text-2xl font-bold text-emerald-700">{Math.round(n * 0.94)}</p><p className="text-xs text-emerald-700">Matched</p></div><div className="rounded-lg bg-amber-50 p-3"><p className="text-2xl font-bold text-amber-700">{Math.round(n * 0.05)}</p><p className="text-xs text-amber-700">Different from recommendation</p></div><div className="rounded-lg bg-rose-50 p-3"><p className="text-2xl font-bold text-rose-700">{Math.max(1, Math.round(n * 0.01))}</p><p className="text-xs text-rose-700">Not found</p></div></div>
          <p className="mt-3 text-xs text-slate-500">Differences are listed with the field and both values so you can accept your version or re-apply ours.</p></div>
        <div className="flex justify-between"><Button variant="ghost" onClick={() => setStep(1)}>Back</Button><Button variant="primary" onClick={onDone}><Check size={14} /> Mark as applied</Button></div>
      </>)}
    </div>
  )
}
