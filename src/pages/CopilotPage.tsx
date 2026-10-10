import { Copilot } from '../components/Copilot'
import { PageHeader } from '../components/ui'

export function CopilotPage() {
  return (
    <>
      <PageHeader title="Copilot workspace" sub="Ask questions in plain language, launch agents, and message support. All in one place." />
      <Copilot full />
    </>
  )
}
