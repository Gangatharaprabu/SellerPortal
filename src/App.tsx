import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { Integrations } from './pages/Integrations'
import { CatalogPage } from './pages/Catalog'
import { BrandPage } from './pages/Brand'
import { AnalyticsPage } from './pages/Analytics'
import { InsightsPage } from './pages/Insights'
import { AdsPage } from './pages/Ads'
import { CampaignWizard } from './pages/CampaignWizard'
import { AdsReports } from './pages/AdsReports'
import { AgentsPage } from './pages/Agents'
import { SupportPage } from './pages/Support'
import { Simulator } from './pages/Simulator'
import { SettingsPage } from './pages/Settings'
import { CopilotPage } from './pages/CopilotPage'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="copilot" element={<CopilotPage />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="brand" element={<BrandPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="ads" element={<AdsPage />} />
        <Route path="ads/new" element={<CampaignWizard />} />
        <Route path="ads/reports" element={<AdsReports />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="simulator" element={<Simulator />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
