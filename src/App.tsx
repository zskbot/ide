/**
 * AgentsIDE — mobile-first application shell.
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Bot,
  ChevronDown,
  Code2,
  GitBranch,
  LayoutGrid,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { Header } from './components/Header';
import { ReadmeViewer } from './components/ReadmeViewer';
import { TerminalSimulator } from './components/TerminalSimulator';
import { ConfigGenerator } from './components/ConfigGenerator';
import { TelemetryDashboard } from './components/TelemetryDashboard';
import { ApiSandbox } from './components/ApiSandbox';
import { SecurityAndBackup } from './components/SecurityAndBackup';
import { CommunityForum } from './components/CommunityForum';
import { PreferencesModal } from './components/PreferencesModal';
import { Language, ThemeMode } from './types';

const navItems = [
  { id: 'readme', label: 'Code', icon: Code2 },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'config', label: 'Agent', icon: Bot },
  { id: 'telemetry', label: 'Review', icon: ShieldCheck },
  { id: 'api', label: 'Tools', icon: LayoutGrid },
  { id: 'security', label: 'Secure', icon: ShieldCheck },
  { id: 'community', label: 'Hub', icon: MoreHorizontal },
];

function ActiveSurface({ activeTab, language }: { activeTab: string; language: Language }) {
  if (activeTab === 'readme') return <ReadmeViewer language={language} />;
  if (activeTab === 'terminal') return <TerminalSimulator />;
  if (activeTab === 'config') return <ConfigGenerator language={language} />;
  if (activeTab === 'telemetry') return <TelemetryDashboard language={language} />;
  if (activeTab === 'api') return <ApiSandbox language={language} />;
  if (activeTab === 'security') return <SecurityAndBackup language={language} />;
  return <CommunityForum language={language} />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('readme');
  const [language, setLanguage] = useState<Language>('vi');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'oled');
    if (theme === 'dark') root.classList.add('dark');
    if (theme === 'oled') root.classList.add('dark', 'oled');
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCloudSyncing(true);
      setTimeout(() => setCloudSyncing(false), 1500);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const selectTab = (id: string) => {
    setActiveTab(id);
    setAgentOpen(false);
  };

  return (
    <div className="agentside-app min-h-screen bg-[#090a0c] text-zinc-100">
      {/* Desktop compatibility header. The mobile shell below is the primary UI. */}
      <div className="hidden md:block">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          cloudSyncing={cloudSyncing}
          onOpenAlerts={() => setAlertsOpen(true)}
        />
      </div>

      <header className="mobile-topbar md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="agentside-mark"><Sparkles size={17} strokeWidth={2.5} /></div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold tracking-tight">AgentsIDE</div>
            <button className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
              workspace / velclaw <ChevronDown size={11} />
            </button>
          </div>
        </div>
        <button className="icon-button" aria-label="Search"><Search size={18} /></button>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-3 pb-24 pt-3 md:px-6 md:pb-16 md:pt-6">
        <section className="mobile-command-card md:hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">ACTIVE PROJECT</p>
              <h1 className="mt-1 text-[20px] font-semibold tracking-tight">AgentsIDE Workspace</h1>
              <p className="mt-1 text-xs leading-5 text-zinc-500">AI-native coding, review and deployment.</p>
            </div>
            <span className="status-pill"><span className="status-dot" /> Ready</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button className="quick-action" onClick={() => selectTab('readme')}><Code2 size={16} /><span>Code</span></button>
            <button className="quick-action" onClick={() => setAgentOpen(true)}><Bot size={16} /><span>Agent</span></button>
            <button className="quick-action" onClick={() => selectTab('telemetry')}><ShieldCheck size={16} /><span>Review</span></button>
          </div>
        </section>

        <div className="mobile-agent-launch md:hidden">
          <div className="flex items-center gap-3">
            <div className="agent-avatar"><Bot size={17} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium">Agent ready</div>
              <div className="truncate text-[11px] text-zinc-500">Ask AgentsIDE to inspect, edit or review.</div>
            </div>
            <button className="agent-ask" onClick={() => setAgentOpen(true)}>Ask</button>
          </div>
        </div>

        <div className="mt-3 md:mt-0">
          <ActiveSurface activeTab={activeTab} language={language} />
        </div>
      </main>

      <footer className="hidden md:block border-t border-zinc-800/80 bg-black/90 py-6 text-center text-xs font-mono text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4">
          <span>AgentsIDE • AI-native development environment</span>
          <span className="text-zinc-600">GitHub / zskbot</span>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav md:hidden" aria-label="Primary navigation">
        {navItems.slice(0, 5).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => selectTab(id)} className={`bottom-nav-item ${activeTab === id ? 'active' : ''}`}>
            <Icon size={19} strokeWidth={activeTab === id ? 2.4 : 1.8} />
            <span>{label}</span>
          </button>
        ))}
        <button className="bottom-nav-item" onClick={() => setAgentOpen(true)}><Bot size={19} /><span>Agent</span></button>
      </nav>

      {/* Mobile agent sheet */}
      {agentOpen && (
        <div className="mobile-sheet-backdrop md:hidden" onClick={() => setAgentOpen(false)}>
          <section className="mobile-agent-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-2"><div className="agent-avatar"><Bot size={16} /></div><span className="text-sm font-semibold">AgentsIDE Agent</span></div>
              <button className="icon-button" onClick={() => setAgentOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="space-y-3 p-4">
              <div className="agent-context">Workspace context loaded · Git · files · tests · review</div>
              <div className="prompt-box">What should I inspect or change?</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="sheet-action" onClick={() => { selectTab('readme'); setAgentOpen(false); }}><Search size={15} /> Inspect code</button>
                <button className="sheet-action" onClick={() => { selectTab('telemetry'); setAgentOpen(false); }}><ShieldCheck size={15} /> Review diff</button>
                <button className="sheet-action" onClick={() => { selectTab('terminal'); setAgentOpen(false); }}><Terminal size={15} /> Run command</button>
                <button className="sheet-action"><Plus size={15} /> New task</button>
              </div>
              <button className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black">Start agent task</button>
            </div>
          </section>
        </div>
      )}

      <PreferencesModal isOpen={alertsOpen} onClose={() => setAlertsOpen(false)} />
    </div>
  );
}
