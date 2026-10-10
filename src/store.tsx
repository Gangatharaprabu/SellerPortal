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
  unpublished: number
  addUnpublished: (n: number) => void
  clearUnpublished: () => void
  source: SourceType
  setSource: (s: SourceType) => void
  setAttribution: (a: 'Glance Pixel' | 'GA4' | 'Northbeam') => void
}
export type SourceType = 'Shopify' | 'WooCommerce' | 'CSV upload' | 'SFTP' | 'Feedonomics'
export const storefrontSources: SourceType[] = ['Shopify', 'WooCommerce']
const C = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(C)

export function AppProvider({ children }: { children: ReactNode }) {
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [launch, setLaunch] = useState<string | null>(null)
  const [catalogScore, setCatalogScore] = useState(54)
  const [unpublished, setUnpublished] = useState(36)
  const [source, setSource] = useState<SourceType>('Shopify')
  const [attribution, setAttribution] = useState<Ctx['attribution']>('Glance Pixel')
  return (
    <C.Provider value={{
      copilotOpen, setCopilotOpen, launch,
      openCopilot: (l) => { setLaunch(l ?? null); setCopilotOpen(true) },
      clearLaunch: () => setLaunch(null),
      catalogScore, setCatalogScore, attribution, setAttribution,
      unpublished, addUnpublished: (n) => setUnpublished((u) => u + n), clearUnpublished: () => setUnpublished(0), source, setSource,
    }}>{children}</C.Provider>
  )
}
