import { useState } from 'react'
import { Badge, Button, Card, CardHeader, Modal, PageHeader, Table, Tabs, Td, Toggle } from '../components/ui'
import { AgentFlow } from '../components/Copilot'
import { agentRuns, agents } from '../data'

export function AgentsPage() {
  const [tab, setTab] = useState('Agent gallery')
  const [run, setRun] = useState<string | null>(null)
  return (
    <>
      <PageHeader title="Agents" sub="AI agents that do the work for you. They always show a plan and ask for approval before changing anything live." />
      <Tabs tabs={['Agent gallery', 'Run history', 'Schedules', 'Guardrails']} value={tab} onChange={setTab} />
      {tab === 'Agent gallery' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((a) => (
            <Card key={a.id}><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{a.emoji}</span><Badge tone="green">{a.status}</Badge></div><h3 className="mt-3 font-semibold text-slate-900">{a.name}</h3><p className="mt-1 text-sm text-slate-500">{a.desc}</p><p className="mt-3 text-xs text-slate-400">{a.runs} runs this quarter</p><Button variant="primary" size="sm" className="mt-3" onClick={() => setRun(a.name)}>Launch agent</Button></Card>
          ))}
        </div>
      )}
      {tab === 'Run history' && (
        <Card pad={false}><Table head={['Run', 'Agent', 'Triggered by', 'When', 'Scope', 'Outcome', 'Status', '']}>{agentRuns.map((r) => <tr key={r.id}><Td>{r.id}</Td><Td className="font-medium">{r.agent}</Td><Td>{r.by}</Td><Td>{r.when}</Td><Td>{r.scope}</Td><Td>{r.result}</Td><Td><Badge tone={r.status === 'Applied' ? 'green' : 'amber'}>{r.status}</Badge></Td><Td><button className="text-xs font-medium text-brand-600">View changes</button> · <button className="text-xs font-medium text-rose-600">Roll back</button></Td></tr>)}</Table></Card>
      )}
      {tab === 'Schedules' && (
        <div className="space-y-3">{[['Catalog Fixer', 'Every night after sync (02:30)', true], ['Campaign Optimizer', 'Daily at 08:00 – suggestions only', true], ['Trend Responder', 'Weekly on Monday', false]].map(([a, b, c]) => <Card key={a as string} className="flex items-center justify-between !p-4"><div><p className="font-semibold">{a as string}</p><p className="text-sm text-slate-500">{b as string}</p></div><Toggle on={c as boolean} onChange={() => {}} /></Card>)}</div>
      )}
      {tab === 'Guardrails' && (
        <Card><CardHeader title="Approval rules" sub="Agents can never exceed these limits." />
          <div className="divide-y divide-slate-100">{[['Require approval for live catalog changes', true], ['Require approval for price changes', true], ['Require approval for budget changes', true], ['Daily agent spend cap $500', true], ['Only Admins can approve agent change sets', false]].map(([a, b]) => <div key={a as string} className="flex items-center justify-between py-3 text-sm">{a as string}<Toggle on={b as boolean} onChange={() => {}} /></div>)}</div></Card>
      )}
      <Modal open={!!run} onClose={() => setRun(null)} title={run ?? ''} wide>{run && <AgentFlow agent={run} />}</Modal>
    </>
  )
}
