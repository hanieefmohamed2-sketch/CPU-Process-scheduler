import React, { useState, useMemo } from 'react';
import { Cpu, Sparkles, CheckCircle2, ShieldAlert, BarChart3, FastForward, Layers, Repeat, ArrowRight, Plus } from 'lucide-react';
import { ProcessForm } from './components/ProcessForm.jsx';
import { ProcessTable } from './components/ProcessTable.jsx';
import { QuantumControls } from './components/QuantumControls.jsx';
import { GanttChart } from './components/GanttChart.jsx';
import { MetricsTable } from './components/MetricsTable.jsx';
import { ComparisonChart } from './components/ComparisonChart.jsx';
import { IntroSection } from './components/IntroSection.jsx';

import { runFCFS } from './algorithms/fcfs.js';
import { runSJN } from './algorithms/sjn.js';
import { runRoundRobin } from './algorithms/roundRobin.js';

const SAMPLE_DATASET = [
  { id: 'P1', arrivalTime: 0, burstTime: 5 },
  { id: 'P2', arrivalTime: 0, burstTime: 3 },
  { id: 'P3', arrivalTime: 0, burstTime: 1 },
];

export const ALGORITHM_CONFIG = {
  fcfs: {
    id: 'fcfs',
    name: 'First Come First Served (FCFS)',
    shortName: 'FCFS Engine',
    type: 'Non-preemptive',
    icon: FastForward,
    description: 'Processes are executed sequentially in order of arrival time without preemption.'
  },
  sjn: {
    id: 'sjn',
    name: 'Shortest Job Next (SJN / SJF)',
    shortName: 'SJN Engine',
    type: 'Non-preemptive',
    icon: Layers,
    description: 'Selects the arrived process with the shortest burst time to minimize queue delay.'
  },
  rr: {
    id: 'rr',
    name: 'Round Robin (RR)',
    shortName: 'Round Robin',
    type: 'Preemptive',
    icon: Repeat,
    description: 'Allocates CPU time slices (quantum) cyclically using a FIFO ready queue.'
  },
  comparison: {
    id: 'comparison',
    name: 'Multi-Algorithm Benchmark Analytics',
    shortName: 'Benchmarks',
    type: 'Comparative Analysis',
    icon: BarChart3,
    description: 'Real-time performance comparison across FCFS, SJN, and Round Robin algorithms.'
  }
};

export default function App() {
  const [processes, setProcesses] = useState(SAMPLE_DATASET);
  const [activeTab, setActiveTab] = useState('intro'); // 'intro' | 'fcfs' | 'sjn' | 'rr' | 'comparison'
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [mobileWorkspaceView, setMobileWorkspaceView] = useState('all'); // 'all' | 'input' | 'results'
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddProcess = (newProc) => {
    setProcesses(prev => [...prev, newProc]);
    showToast(`Added process ${newProc.id}`);
  };

  const handleDeleteProcess = (pid) => {
    setProcesses(prev => prev.filter(p => p.id !== pid));
    showToast(`Removed process ${pid}`, 'info');
  };

  const handleLoadSampleData = () => {
    setProcesses(SAMPLE_DATASET);
    showToast('Loaded sample dataset: P1(0,5), P2(0,3), P3(0,1)');
  };

  const handleClearAll = () => {
    setProcesses([]);
    showToast('Cleared process queue', 'warning');
  };

  // Compute results for active algorithm
  const currentResult = useMemo(() => {
    if (processes.length === 0) {
      return { timeline: [], processStats: [], metrics: {} };
    }

    switch (activeTab) {
      case 'fcfs':
        return runFCFS(processes);
      case 'sjn':
        return runSJN(processes);
      case 'rr':
        return runRoundRobin(processes, timeQuantum);
      default:
        return runFCFS(processes);
    }
  }, [processes, activeTab, timeQuantum]);

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      {notification && (
        <div className={`toast toast-${notification.type}`}>
          {notification.type === 'success' && <CheckCircle2 size={16} />}
          {notification.type === 'warning' && <ShieldAlert size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <header className="app-header">
        <div className="header-container">
          {/* CPU Scheduler Brand Logo */}
          <div 
            className="brand-group"
            onClick={() => setActiveTab('intro')}
            style={{ cursor: 'pointer' }}
            title="CPU Scheduler Home"
          >
            <div className="brand-logo-icon">
              <Cpu size={20} className="brand-icon" style={{ color: '#ffffff' }} />
            </div>
            <div className="brand-text">
              <span className="brand-name">CPU Scheduler</span>
              <span className="brand-badge">STUDIO</span>
            </div>
          </div>

          {/* Segmented Top Navigation Pills */}
          <nav className="segmented-nav">
            <button
              className={`nav-pill ${activeTab === 'intro' ? 'active' : ''}`}
              onClick={() => setActiveTab('intro')}
            >
              <span>Overview</span>
            </button>

            <button
              className={`nav-pill ${activeTab === 'fcfs' ? 'active' : ''}`}
              onClick={() => setActiveTab('fcfs')}
            >
              <FastForward size={14} />
              <span>FCFS</span>
            </button>

            <button
              className={`nav-pill ${activeTab === 'sjn' ? 'active' : ''}`}
              onClick={() => setActiveTab('sjn')}
            >
              <Layers size={14} />
              <span>SJN</span>
            </button>

            <button
              className={`nav-pill ${activeTab === 'rr' ? 'active' : ''}`}
              onClick={() => setActiveTab('rr')}
            >
              <Repeat size={14} />
              <span>Round Robin</span>
            </button>

            <button
              className={`nav-pill nav-pill-benchmark ${activeTab === 'comparison' ? 'active' : ''}`}
              onClick={() => setActiveTab('comparison')}
            >
              <BarChart3 size={14} />
              <span>Benchmarks</span>
            </button>
          </nav>

          {/* Action Button: Load Sample Data */}
          <button
            className="btn-white-pill"
            onClick={handleLoadSampleData}
          >
            <Sparkles size={15} />
            <span>Load Sample Data</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="main-content-wrapper">
        {activeTab === 'intro' ? (
          /* INTRODUCTION INTERFACE (Replicating the reference landing page) */
          <IntroSection
            onLaunchSimulator={(algo) => {
              setActiveTab(algo || 'fcfs');
              showToast(`Switched to ${algo?.toUpperCase() || 'FCFS'} simulator`);
            }}
            onSelectAlgorithm={(algo) => {
              setActiveTab(algo);
              showToast(`Switched to ${algo.toUpperCase()}`);
            }}
            onLoadSampleData={handleLoadSampleData}
          />
        ) : activeTab !== 'comparison' ? (
          /* DEDICATED ALGORITHM PAGE */
          <div className="tab-page page-algorithm">
            {/* Algorithm Workspace Header Banner */}
            <div className="algo-workspace-banner">
              <div className="banner-left">
                <div className="banner-title-row">
                  <h2>{ALGORITHM_CONFIG[activeTab]?.name}</h2>
                  <span className="badge badge-mode">
                    {ALGORITHM_CONFIG[activeTab]?.type}
                  </span>
                </div>
                <p>{ALGORITHM_CONFIG[activeTab]?.description}</p>
              </div>

              <div className="banner-right">
                <button
                  className="btn btn-benchmark-link"
                  onClick={() => setActiveTab('comparison')}
                >
                  <span>Compare Performance</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Mobile Workspace View Selector (Visible on mobile / small screens) */}
            <div className="mobile-workspace-nav" role="tablist" aria-label="Mobile workspace view switch">
              <button
                type="button"
                role="tab"
                aria-selected={mobileWorkspaceView === 'all'}
                className={`mobile-view-pill ${mobileWorkspaceView === 'all' ? 'active' : ''}`}
                onClick={() => setMobileWorkspaceView('all')}
              >
                <Layers size={13} />
                <span>All Sections</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobileWorkspaceView === 'input'}
                className={`mobile-view-pill ${mobileWorkspaceView === 'input' ? 'active' : ''}`}
                onClick={() => setMobileWorkspaceView('input')}
              >
                <Plus size={13} />
                <span>Input & Queue ({processes.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobileWorkspaceView === 'results'}
                className={`mobile-view-pill ${mobileWorkspaceView === 'results' ? 'active' : ''}`}
                onClick={() => setMobileWorkspaceView('results')}
              >
                <BarChart3 size={13} />
                <span>Gantt & Metrics</span>
              </button>
            </div>

            <div className="grid-two-columns">
              {/* Left Column: Process Input & Queue */}
              <div className={`column-section ${mobileWorkspaceView === 'results' ? 'mobile-hidden' : ''}`}>
                <ProcessForm
                  onAddProcess={handleAddProcess}
                  onLoadSampleData={handleLoadSampleData}
                  onClearAll={handleClearAll}
                  existingPids={processes.map(p => p.id)}
                />

                {activeTab === 'rr' && (
                  <QuantumControls
                    timeQuantum={timeQuantum}
                    onChangeTimeQuantum={setTimeQuantum}
                  />
                )}

                <ProcessTable
                  processes={processes}
                  onDeleteProcess={handleDeleteProcess}
                />
              </div>

              {/* Right Column: Timeline & Metrics */}
              <div className={`column-section ${mobileWorkspaceView === 'input' ? 'mobile-hidden' : ''}`}>
                <GanttChart
                  timeline={currentResult.timeline}
                  processes={processes}
                />

                <MetricsTable
                  processStats={currentResult.processStats}
                  metrics={currentResult.metrics}
                  processes={processes}
                  algorithmName={ALGORITHM_CONFIG[activeTab]?.shortName}
                />
              </div>
            </div>
          </div>
        ) : (
          /* BENCHMARKS PAGE */
          <div className="tab-page page-comparison">
            <ComparisonChart
              processes={processes}
              timeQuantum={timeQuantum}
              currentAlgorithm={activeTab}
              onSelectAlgorithm={(algoKey) => {
                setActiveTab(algoKey);
                showToast(`Switched page to ${algoKey.toUpperCase()}`);
              }}
              onLoadSampleData={handleLoadSampleData}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <span>CPU Process Scheduling Simulator & Performance Analyzer</span>
        </div>
      </footer>
    </div>
  );
}

