import { createContext, ReactNode, useContext, useState } from 'react'

type Ctx = {
  copilotOpen: boolean
  setCopilotOpen: (v: boolean) => void
  launch: string | null            // prompt/agent the copilot should start with
  openCopilot: (launch?: string) => void
  clearLaunch: () => void
  catalogScore: number
  setCatalogScore: (n: number) => void
  attribution: 'Glance Pixel' | 'GA4' | 'Northbeam'
  setAttribution: (a: 'Glance Pixel' | 'GA4' | 'Northbeam') => void
}
const C = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(C)

export function AppProvider({ children }: { children: ReactNode }) {
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [launch, setLaunch] = useState<string | null>(null)
  const [catalogScore, setCatalogScore] = useState(54)
  const [attribution, setAttribution] = useState<Ctx['attribution']>('Glance Pixel')
  return (
    <C.Provider value={{
      copilotOpen, setCopilotOpen, launch,
      openCopilot: (l) => { setLaunch(l ?? null); setCopilotOpen(true) },
      clearLaunch: () => setLaunch(null),
      catalogScore, setCatalogScore, attribution, setAttribution,
    }}>{children}</C.Provider>
  )
}
