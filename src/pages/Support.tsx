import { useState } from 'react'
import { Paperclip, Plus, Send, Sparkles } from 'lucide-react'
import { Badge, Button, Card, Field, Modal, PageHeader, Tabs, Table, Td, cx, inputCls } from '../components/ui'
import { threads as seed } from '../data'

type Thread = (typeof seed)[number]
const msgsFor = (t: Thread) => [
  { from: 'you', name: 'Alex (you)', text: t.subject.includes('Shopify') ? 'Our morning sync failed. 41 products didn’t update. Can you check?' : 'Hi team, could you help with this?', time: '2h ago' },
  { from: 'ai', name: 'Lumio Copilot', text: 'I checked the logs: 41 variants have “$” in the price field. I attached the error report and handed this to Integrations with full context.', time: '2h ago' },
  { from: 'agent', name: t.assignee, text: 'Thanks Alex, confirmed. The Shopify connector will strip currency symbols from the next release. For now I have re-run the sync with a mapping rule. Can you confirm the prices look right?', time: '12m ago' },
]

const categories = ['Integrations', 'Catalog', 'Ads & Billing', 'Measurement', 'Account manager', 'Partnership / custom request']

export function SupportPage() {
  const [tab, setTab] = useState('My threads')
  const [list, setList] = useState<Thread[]>(seed)
  const [sel, setSel] = useState<Thread>(seed[0])
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [cat, setCat] = useState(categories[0])
  const [reply, setReply] = useState('')
  const [extra, setExtra] = useState<Record<string, { name: string; text: string }[]>>({})
  const shown = list.filter((t) => filter === 'All' || t.status === filter || (filter === 'Open' && t.status === 'Open'))

  const create = () => {
    const t: Thread = { id: `T-${2042 + list.length - seed.length}`, subject: subject || 'New question', cat, status: 'Open', priority: 'Medium', updated: 'just now', assignee: 'Unassigned (AI triage)', linked: 'Auto-attached', unread: false }
    setList([t, ...list]); setSel(t); setOpen(false); setSubject('')
  }
  const send = () => { if (reply) { setExtra({ ...extra, [sel.id]: [...(extra[sel.id] ?? []), { name: 'Alex (you)', text: reply }] }); setReply('') } }

  return (
    <>
      <PageHeader title="Support Center" sub="Talk to your account team. Every question gets its own thread." actions={<Button variant="primary" onClick={() => setOpen(true)}><Plus size={15} /> New thread</Button>} />
      <Tabs tabs={['My threads', 'Help articles', 'Support team console (internal view)']} value={tab} onChange={setTab} />

      {tab === 'My threads' && (
        <div className="grid h-[640px] gap-4 lg:grid-cols-[340px_1fr]">
          <Card pad={false} className="flex flex-col overflow-hidden">
            <div className="flex gap-1 border-b border-slate-100 p-3">{['All', 'Open', 'Pending you', 'Resolved'].map((f) => <button key={f} onClick={() => setFilter(f)} className={cx('rounded-full px-2.5 py-1 text-xs', filter === f ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600')}>{f}</button>)}</div>
            <div className="flex-1 overflow-y-auto">
              {shown.map((t) => (
                <button key={t.id} onClick={() => setSel(t)} className={cx('block w-full border-b border-slate-100 p-3 text-left hover:bg-slate-50', sel.id === t.id && 'bg-brand-50')}>
                  <div className="flex items-center justify-between text-[11px] text-slate-400"><span>{t.id} · {t.cat}</span><span>{t.updated}</span></div>
                  <p className={cx('mt-1 text-sm text-slate-900', t.unread && 'font-bold')}>{t.unread && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-pink-500" />}{t.subject}</p>
                  <div className="mt-1.5 flex gap-1.5"><Badge tone={t.status === 'Resolved' ? 'green' : t.status === 'Open' ? 'blue' : 'amber'}>{t.status}</Badge><Badge tone={t.priority === 'High' ? 'red' : 'slate'}>{t.priority}</Badge></div>
                </button>
              ))}
            </div>
          </Card>

          <Card pad={false} className="flex flex-col overflow-hidden">
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-start justify-between"><div><p className="text-xs text-slate-400">{sel.id} · {sel.cat}</p><h3 className="font-semibold text-slate-900">{sel.subject}</h3></div><Badge tone={sel.status === 'Resolved' ? 'green' : 'blue'}>{sel.status}</Badge></div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500"><span>Assignee: {sel.assignee}</span><span>Linked: <b className="text-brand-600">{sel.linked}</b></span><span>SLA: first reply within 4h ✓</span></div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
              {[...msgsFor(sel).slice(0, sel.id === 'T-2041' || sel.id === seed[0].id ? 3 : 2), ...(extra[sel.id] ?? []).map((m) => ({ ...m, from: 'you', time: 'now' }))].map((m, i) => (
                <div key={i} className={cx('flex', m.from === 'you' && 'justify-end')}>
                  <div className={cx('max-w-[75%] rounded-2xl px-4 py-2.5 text-sm', m.from === 'you' ? 'bg-brand-600 text-white' : m.from === 'ai' ? 'border border-violet-200 bg-violet-50 text-slate-800' : 'border border-slate-200 bg-white text-slate-800')}>
                    <p className={cx('mb-0.5 flex items-center gap-1 text-[11px] font-semibold', m.from === 'you' ? 'text-indigo-200' : 'text-slate-500')}>{m.from === 'ai' && <Sparkles size={10} />}{m.name} · {m.time}</p>{m.text}
                  </div>
                </div>
              ))}
              {sel.cat === 'Platform outreach' && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">📣 <b>From Dana (Account Manager):</b> Your clearance tees campaign has been selected for a featured TV promotional slot. <div className="mt-2 flex gap-2"><Button size="sm" variant="primary">Accept</Button><Button size="sm">Not now</Button></div></div>}
            </div>
            <div className="flex items-center gap-2 border-t border-slate-100 p-3"><button className="rounded p-2 text-slate-400 hover:bg-slate-100"><Paperclip size={16} /></button><input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Reply…" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none" /><Button variant="primary" onClick={send}><Send size={14} /></Button></div>
          </Card>
        </div>
      )}

      {tab === 'Help articles' && (
        <div className="grid gap-4 md:grid-cols-3">{[['Getting started with Shopify sync', 'Integrations'], ['Fixing feed errors', 'Catalog'], ['SmartAds explained', 'Ads'], ['Install the Lumio pixel', 'Measurement'], ['Connecting GA4 or Northbeam', 'Measurement'], ['Understanding Catalog Quality Score', 'Catalog']].map(([a, b]) => <Card key={a}><Badge>{b}</Badge><p className="mt-2 font-semibold text-slate-900">{a}</p><p className="mt-1 text-sm text-slate-500">5 min read</p></Card>)}</div>
      )}

      {tab.startsWith('Support team') && (
        <Card pad={false}>
          <div className="border-b border-slate-100 p-4 text-sm text-slate-500">Internal queue view for the Lumio support team. Each ticket shows merchant context automatically.</div>
          <Table head={['Ticket', 'Merchant', 'Subject', 'Priority', 'SLA', 'Merchant context', 'Assignee']}>
            {[['T-2041', 'Fernhill Apparel', 'Shopify sync failed (41 errors)', 'High', '2h left', 'Growth plan · 1,284 SKUs · $32K/mo spend', 'Priya'], ['T-2040', 'Oak & Ember', 'Pixel not firing on checkout', 'High', '3h left', 'Starter · 210 SKUs', 'Lee'], ['T-2037', 'Fernhill Apparel', 'Invoice mismatch', 'Medium', '1d left', 'Growth plan', 'Marco'], ['T-2036', 'Brightside Kids', 'Request custom integration', 'Low', '2d left', 'Enterprise', 'Dana']].map((r) => <tr key={r[0]} className="hover:bg-slate-50">{r.map((c, i) => <Td key={i}>{i === 3 ? <Badge tone={c === 'High' ? 'red' : 'slate'}>{c}</Badge> : c}</Td>)}</tr>)}
          </Table>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New support thread">
        <div className="space-y-4">
          <Field label="What do you need help with?"><input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} placeholder="e.g. My TV campaign isn’t delivering" /></Field>
          <Field label="Category"><select value={cat} onChange={(e) => setCat(e.target.value)} className={inputCls}>{categories.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Attach context"><div className="flex flex-wrap gap-1.5"><Badge tone="blue">Sync job #8841 ✕</Badge><Badge tone="slate">+ Product</Badge><Badge tone="slate">+ Campaign</Badge><Badge tone="slate">+ Screenshot</Badge></div></Field>
          <div className="rounded-lg bg-violet-50 p-3 text-sm text-violet-900"><Sparkles size={13} className="mr-1 inline" />The copilot will try to answer first. If it can’t, a person from the team joins this thread.</div>
          <div className="flex justify-end gap-2"><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={create}>Start thread</Button></div>
        </div>
      </Modal>
    </>
  )
}
