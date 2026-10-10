import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Home, Plug, Package, Palette, BarChart3, Lightbulb, Megaphone, LineChart, Bot, LifeBuoy, Smartphone, Settings,
  Bell, Sparkles, ChevronDown, Search, HelpCircle, Rocket,
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../store'
import { merchant, notifications } from '../data'
import { Copilot } from './Copilot'
import { Badge, cx } from './ui'

const nav = [
  { group: 'Overview', items: [
    { to: '/', label: 'Home', icon: Home },
    { to: '/onboarding', label: 'Setup guide', icon: Rocket, badge: '3/5' },
  ] },
  { group: 'Catalog & brand', items: [
    { to: '/integrations', label: 'Integrations', icon: Plug },
    { to: '/catalog', label: 'Catalog', icon: Package },
    { to: '/brand', label: 'Brand Studio', icon: Palette },
  ] },
  { group: 'Performance', items: [
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/insights', label: 'Market Insights', icon: Lightbulb },
  ] },
  { group: 'Advertising', items: [
    { to: '/ads', label: 'Ads Manager', icon: Megaphone },
    { to: '/ads/reports', label: 'Ads Reporting', icon: LineChart },
  ] },
  { group: 'AI & help', items: [
    { to: '/agents', label: 'Agents', icon: Bot },
    { to: '/support', label: 'Support Center', icon: LifeBuoy, badge: '2' },
    { to: '/simulator', label: 'Shopper Simulator', icon: Smartphone },
  ] },
]

export function Layout() {
  const { copilotOpen, setCopilotOpen, openCopilot } = useApp()
  const [notif, setNotif] = useState(false)
  const loc = useLocation()
  const fullCopilot = loc.pathname === '/copilot'

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex w-60 shrink-0 flex-col bg-brand-900 text-indigo-100">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-pink-500 font-bold text-white">L</div>
          <div>
            <p className="text-sm font-bold leading-none text-white">Lumio</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-indigo-300">Seller Portal</p>
          </div>
        </div>
        <button className="mx-3 mb-3 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-left text-sm hover:bg-white/15">
          <span><span className="block text-[10px] uppercase tracking-wide text-indigo-300">Store</span><span className="font-medium text-white">{merchant.stores[0]}</span></span>
          <ChevronDown size={14} />
        </button>
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
          {nav.map((g) => (
            <div key={g.group}>
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-400">{g.group}</p>
              {g.items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.to === '/' || it.to === '/ads'}
                  className={({ isActive }) => cx('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition', isActive ? 'bg-white/15 font-medium text-white' : 'hover:bg-white/10')}>
                  <it.icon size={16} /> <span className="flex-1">{it.label}</span>
                  {it.badge && <span className="rounded-full bg-pink-500 px-1.5 text-[10px] font-semibold text-white">{it.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <NavLink to="/settings" className={({ isActive }) => cx('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm', isActive ? 'bg-white/15 text-white' : 'hover:bg-white/10')}><Settings size={16} /> Settings</NavLink>
          <div className="flex items-center gap-2 px-2.5 py-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-pink-500 text-xs font-bold text-white">A</div>
            <div className="text-xs"><p className="font-medium text-white">Alex Morgan</p><p className="text-indigo-300">Admin</p></div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-6">
          <div className="relative max-w-md flex-1">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input placeholder="Search products, campaigns, tickets…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge tone="green">● Pixel live</Badge>
            <button onClick={() => openCopilot()} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-pink-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:opacity-95">
              <Sparkles size={15} /> Ask Copilot
            </button>
            <NavLink to="/support" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Help & support"><HelpCircle size={18} /></NavLink>
            <button onClick={() => setNotif(!notif)} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <Bell size={18} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-500" />
            </button>
          </div>
          {notif && (
            <div className="anim-fade absolute right-6 top-12 z-40 w-96 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Notifications</p>
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg px-3 py-2 hover:bg-slate-50">
                  <span className={cx('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.tone === 'red' ? 'bg-rose-500' : n.tone === 'amber' ? 'bg-amber-500' : n.tone === 'blue' ? 'bg-sky-500' : 'bg-violet-500')} />
                  <div><p className="text-sm text-slate-800">{n.t}</p><p className="text-xs text-slate-400">{n.s}</p></div>
                </div>
              ))}
            </div>
          )}
        </header>
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className={cx('mx-auto p-6', fullCopilot ? 'max-w-6xl' : 'max-w-7xl')}><Outlet /></div>
          </main>
          {copilotOpen && !fullCopilot && <Copilot onClose={() => setCopilotOpen(false)} />}
        </div>
      </div>
    </div>
  )
}
