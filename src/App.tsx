/**
 * AgentsIDE — mobile-first application shell.
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  FileCode2,
  FileText,
  Folder,
  GitBranch,
  LayoutGrid,
  MoreHorizontal,
  Play,
  Plus,
  Search,
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
  { id: 'workspace', label: 'Workspace', icon: LayoutGrid },
  { id: 'editor', label: 'Code', icon: Code2 },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'review', label: 'Review', icon: ShieldCheck },
  { id: 'tools', label: 'Tools', icon: MoreHorizontal },
];

const files = [
  { name: 'src', kind: 'folder' },
  { name: 'App.tsx', kind: 'code' },
  { name: 'index.css', kind: 'code' },
  { name: 'package.json', kind: 'text' },
  { name: 'README.md', kind: 'text' },
] as const;

const initialCode = `export default function AgentTask() {
  const context = useWorkspaceContext();

  return (
    <AgentPanel
      context={context}
      mode="review"
      onApprove={approveChanges}
    />
  );
}`;

function WorkspaceSurface({ onOpenEditor, onOpenReview, onOpenAgent }: { onOpenEditor: () => void; onOpenReview: () => void; onOpenAgent: () => void }) {
  return (
    <section className="mobile-workspace-card">
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h2>velclaw / main</h2>
          <p>5 files changed · 2 checks passing</p>
        </div>
        <span className="branch-pill"><GitBranch size={12} /> main</span>
      </div>

      <div className="file-list" aria-label="Project files">
        {files.map((file) => (
          <button key={file.name} className="file-row" onClick={file.name === 'App.tsx' ? onOpenEditor : undefined}>
            {file.kind === 'folder' ? <Folder size={16} /> : file.kind === 'code' ? <FileCode2 size={16} /> : <FileText size={16} />}
            <span>{file.name}</span>
            {file.name === 'App.tsx' && <ChevronRight size={15} className="ml-auto text-zinc-600" />}
          </button>
        ))}
      </div>

      <div className="workspace-stats">
        <div><span>Changes</span><strong>+42 −8</strong></div>
        <div><span>Tests</span><strong>18 / 18</strong></div>
        <div><span>Agent</span><strong>Ready</strong></div>
      </div>

      <div className="workspace-actions">
        <button onClick={onOpenEditor}><Code2 size={15} /> Open editor</button>
        <button onClick={onOpenReview}><ShieldCheck size={15} /> Review</button>
        <button onClick={onOpenAgent}><Bot size={15} /> Agent</button>
      </div>
    </section>
  );
}

function EditorSurface({ code, setCode, onReview }: { code: string; setCode: (value: string) => void; onReview: () => void }) {
  return (
    <section className="mobile-editor-card">
      <div className="editor-toolbar">
        <div className="flex min-w-0 items-center gap-2"><FileCode2 size={15} /><span className="truncate">src / App.tsx</span></div>
        <span className="editor-dirty">Modified</span>
      </div>
      <div className="editor-tabs"><span className="active">App.tsx</span><span>index.css</span><span>package.json</span></div>
      <div className="editor-wrap">
        <div className="editor-gutter" aria-hidden="true">{code.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}</div>
        <textarea
          aria-label="Code editor"
          className="mobile-code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="editor-footer">
        <span><GitBranch size={13} /> main</span>
        <span>TypeScript</span>
        <button onClick={onReview}><ShieldCheck size={14} /> Review changes</button>
      </div>
    </section>
  );
}

function ReviewSurface({ code }: { code: string }) {
  const added = code.includes('AgentPanel');
  return (
    <section className="mobile-review-card">
      <div className="review-heading">
        <div><p className="eyebrow">CODE REVIEW</p><h2>Ready for review</h2></div>
        <span className="review-pass"><Check size={13} /> Checks pass</span>
      </div>
      <div className="review-summary"><strong>1 file</strong><span>+{added ? 8 : 0} −2 lines</span><span>0 blocking issues</span></div>
      <div className="diff-block">
        <div className="diff-file"><FileCode2 size={14} /> src/App.tsx <span>+8 −2</span></div>
        <pre><code><span className="diff-minus">- mode="chat"</span>{'\n'}<span className="diff-plus">+ mode="review"</span>{'\n'}<span className="diff-plus">+ onApprove={'{approveChanges}'}</span></code></pre>
      </div>
      <div className="review-actions"><button><X size={15} /> Request changes</button><button className="primary"><Check size={15} /> Approve</button></div>
    </section>
  );
}

function AgentSurface({ onRun }: { onRun: () => void }) {
  const [prompt, setPrompt] = useState('Review the current workspace and propose safe changes.');
  return (
    <section className="mobile-agent-card">
      <div className="agent-header"><div className="agent-avatar"><Bot size={17} /></div><div><p className="eyebrow">AGENT TASK</p><h2>Workspace Agent</h2></div><span className="status-pill"><span className="status-dot" /> Ready</span></div>
      <div className="agent-context">Context loaded · Git · files · tests · current diff</div>
      <textarea className="agent-prompt-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} aria-label="Agent prompt" />
      <div className="agent-suggestions"><button onClick={() => setPrompt('Find bugs in the current diff and explain them.')}>Find bugs</button><button onClick={() => setPrompt('Refactor this code without changing behavior.')}>Refactor</button><button onClick={() => setPrompt('Run tests and summarize failures.')}>Run tests</button></div>
      <button className="agent-run" onClick={onRun}><Play size={15} /> Start agent task</button>
    </section>
  );
}

function LegacySurface({ activeTab, language }: { activeTab: string; language: Language }) {
  if (activeTab === 'terminal') return <TerminalSimulator />;
  if (activeTab === 'tools') return <ApiSandbox language={language} />;
  if (activeTab === 'security') return <SecurityAndBackup language={language} />;
  if (activeTab === 'community') return <CommunityForum language={language} />;
  if (activeTab === 'config') return <ConfigGenerator language={language} />;
  if (activeTab === 'telemetry') return <TelemetryDashboard language={language} />;
  return <ReadmeViewer language={language} />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [language, setLanguage] = useState<Language>('vi');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [agentRunning, setAgentRunning] = useState(false);

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

  const startAgent = () => {
    setAgentRunning(true);
    setAgentOpen(false);
    setActiveTab('review');
    setTimeout(() => setAgentRunning(false), 2200);
  };

  return (
    <div className="agentside-app min-h-screen bg-[#090a0c] text-zinc-100">
      <div className="hidden md:block">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} cloudSyncing={cloudSyncing} onOpenAlerts={() => setAlertsOpen(true)} />
      </div>

      <header className="mobile-topbar md:hidden">
        <div className="flex min-w-0 items-center gap-3"><div className="agentside-mark"><Sparkles size={17} strokeWidth={2.5} /></div><div className="min-w-0"><div className="truncate text-[15px] font-semibold tracking-tight">AgentsIDE</div><button className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">workspace / velclaw <ChevronDown size={11} /></button></div></div>
        <button className="icon-button" aria-label="Search"><Search size={18} /></button>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-3 pb-24 pt-3 md:px-6 md:pb-16 md:pt-6">
        <section className="mobile-command-card md:hidden">
          <div className="flex items-start justify-between gap-3"><div><p className="eyebrow">ACTIVE PROJECT</p><h1 className="mt-1 text-[20px] font-semibold tracking-tight">AgentsIDE Workspace</h1><p className="mt-1 text-xs leading-5 text-zinc-500">AI-native coding, review and deployment.</p></div><span className="status-pill"><span className="status-dot" /> {agentRunning ? 'Running' : 'Ready'}</span></div>
          <div className="mt-4 grid grid-cols-3 gap-2"><button className="quick-action" onClick={() => selectTab('editor')}><Code2 size={16} /><span>Code</span></button><button className="quick-action" onClick={() => setAgentOpen(true)}><Bot size={16} /><span>Agent</span></button><button className="quick-action" onClick={() => selectTab('review')}><ShieldCheck size={16} /><span>Review</span></button></div>
        </section>

        <div className="mobile-agent-launch md:hidden"><div className="flex items-center gap-3"><div className="agent-avatar"><Bot size={17} /></div><div className="min-w-0 flex-1"><div className="text-xs font-medium">{agentRunning ? 'Agent is working…' : 'Agent ready'}</div><div className="truncate text-[11px] text-zinc-500">Inspect, edit, test and review from one workspace.</div></div><button className="agent-ask" onClick={() => setAgentOpen(true)}>Ask</button></div></div>

        <div className="mt-3 md:mt-0 md:hidden">
          {activeTab === 'workspace' && <WorkspaceSurface onOpenEditor={() => selectTab('editor')} onOpenReview={() => selectTab('review')} onOpenAgent={() => setAgentOpen(true)} />}
          {activeTab === 'editor' && <EditorSurface code={code} setCode={setCode} onReview={() => selectTab('review')} />}
          {activeTab === 'review' && <ReviewSurface code={code} />}
          {activeTab === 'tools' && <LegacySurface activeTab="tools" language={language} />}
          {activeTab === 'terminal' && <LegacySurface activeTab="terminal" language={language} />}
        </div>
        <div className="hidden md:block"><LegacySurface activeTab={activeTab} language={language} /></div>
      </main>

      <footer className="hidden md:block border-t border-zinc-800/80 bg-black/90 py-6 text-center text-xs font-mono text-zinc-500"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4"><span>AgentsIDE • AI-native development environment</span><span className="text-zinc-600">GitHub / zskbot</span></div></footer>

      <nav className="mobile-bottom-nav md:hidden" aria-label="Primary navigation">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => selectTab(id)} className={`bottom-nav-item ${activeTab === id ? 'active' : ''}`}><Icon size={19} strokeWidth={activeTab === id ? 2.4 : 1.8} /><span>{label}</span></button>)}
        <button className="bottom-nav-item" onClick={() => setAgentOpen(true)}><Bot size={19} /><span>Agent</span></button>
      </nav>

      {agentOpen && <div className="mobile-sheet-backdrop md:hidden" onClick={() => setAgentOpen(false)}><section className="mobile-agent-sheet" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3"><div className="flex items-center gap-2"><div className="agent-avatar"><Bot size={16} /></div><span className="text-sm font-semibold">AgentsIDE Agent</span></div><button className="icon-button" onClick={() => setAgentOpen(false)} aria-label="Close"><X size={18} /></button></div><div className="p-4"><AgentSurface onRun={startAgent} /></div></section></div>}

      <PreferencesModal isOpen={alertsOpen} onClose={() => setAlertsOpen(false)} />
    </div>
  );
}
