import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  PenTool, 
  FileText, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Repeat, 
  FastForward, 
  BarChart3, 
  Zap, 
  ExternalLink,
  X,
  Eraser
} from 'lucide-react';

export function IntroSection({ onLaunchSimulator, onSelectAlgorithm, onLoadSampleData }) {
  // Mode selection below input: 'prompt' | 'draw' | 'image' | 'prd'
  const [activeMode, setActiveMode] = useState('prompt');
  
  // Prompt text
  const [promptText, setPromptText] = useState('');
  
  // Generation / Loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedApp, setGeneratedApp] = useState(null);
  
  // Tooltip / Info Modal
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Drawing Canvas State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ea580c');
  const brushSize = 3;
  
  // Sample Quick Prompts
  const quickPrompts = [
    { label: "⚡ Standard 3-Process Benchmark", prompt: "Simulate P1 (Arrival 0, Burst 5), P2 (Arrival 0, Burst 3), P3 (Arrival 0, Burst 1) across all scheduling algorithms." },
    { label: "🔄 Convoy Effect Workload", prompt: "Simulate FCFS convoy effect with one heavy burst process (Burst 20) followed by 3 short burst processes to observe queue latency." },
    { label: "⏱️ Round Robin Time-Slice Test", prompt: "Simulate Round Robin scheduling with time quantum 2 across 5 arriving processes to evaluate context switches." },
    { label: "📊 SJN Latency Minimizer", prompt: "Simulate Shortest Job Next with arrival times 0, 1, 2, 3 and burst times 6, 2, 8, 3 to minimize average waiting time." }
  ];

  // Canvas drawing handlers
  useEffect(() => {
    if (activeMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set display size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = '#0f0a0d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [activeMode]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f0a0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Generation Simulation
  const handleCreateApp = () => {
    const textToUse = promptText.trim() || "Simulate CPU Process Scheduling Workload with Gantt Chart";
    setIsGenerating(true);
    setGenerationStep(1);

    const steps = [
      "Parsing arrived processes & burst times...",
      "Calculating ready queue & context switching...",
      "Computing turnaround & waiting metrics...",
      "Ready! High-precision CPU simulation generated."
    ];

    let current = 1;
    const interval = setInterval(() => {
      current++;
      setGenerationStep(current);
      if (current >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedApp({
            title: textToUse.length > 40 ? textToUse.slice(0, 40) + '...' : textToUse,
            files: ['fcfs.js', 'sjn.js', 'roundRobin.js', 'GanttChart.jsx'],
            timestamp: new Date().toLocaleTimeString()
          });
        }, 600);
      }
    }, 600);
  };

  return (
    <div className="intro-container">
      {/* AMBIENT BACKGROUND GLOWS (Matching reference warm terracotta/orange aura) */}
      <div className="intro-ambient-glow" />
      <div className="intro-side-glow left" />
      <div className="intro-side-glow right" />

      {/* HERO SECTION */}
      <section className="intro-hero">
        {/* Social Proof Badge */}
        <div className="hero-badge-wrapper">
          <div className="hero-badge">
            <span className="badge-icon">⚡</span>
            <span className="badge-text">Made for CS & Systems Engineers</span>
            <span className="badge-dot">•</span>
            <span className="badge-stat">↗ 98,758 Processes Simulated</span>
          </div>
        </div>

        {/* Massive Hero Headline */}
        <h1 className="hero-title">
          Simulate CPU scheduling in a blink!
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Simulate, visualize, and benchmark FCFS, SJN, and Round Robin scheduling algorithms with interactive Gantt analytics.
        </p>

        {/* Micro Subtext */}
        <p className="hero-micro">
          Interactive Gantt timeline • Real-time turnaround & waiting metrics • Zero setup required
        </p>

        {/* CENTRAL INTERACTIVE PROMPT CARD */}
        <div className="prompt-card-wrapper">
          <div className="prompt-card">
            {activeMode === 'prompt' && (
              <div className="prompt-input-area">
                <textarea
                  className="prompt-textarea"
                  placeholder="Describe your CPU workload or enter processes (e.g. 4 processes with bursts 5, 3, 8, 2)..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={3}
                />
                
                {/* Quick Suggestion Chips */}
                {!promptText && (
                  <div className="quick-suggestions-row">
                    <span className="quick-label">Try:</span>
                    {quickPrompts.slice(0, 2).map((item, idx) => (
                      <button
                        key={idx}
                        className="quick-chip"
                        onClick={() => setPromptText(item.prompt)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeMode === 'draw' && (
              <div className="draw-input-area">
                <div className="canvas-toolbar">
                  <span className="canvas-title">✏️ Sketch your wireframe / UI layout</span>
                  <div className="canvas-controls">
                    <button 
                      className={`color-btn ${brushColor === '#ea580c' ? 'active' : ''}`}
                      style={{ background: '#ea580c' }}
                      onClick={() => setBrushColor('#ea580c')}
                      title="Flame Orange"
                    />
                    <button 
                      className={`color-btn ${brushColor === '#38bdf8' ? 'active' : ''}`}
                      style={{ background: '#38bdf8' }}
                      onClick={() => setBrushColor('#38bdf8')}
                      title="Sky Blue"
                    />
                    <button 
                      className={`color-btn ${brushColor === '#10b981' ? 'active' : ''}`}
                      style={{ background: '#10b981' }}
                      onClick={() => setBrushColor('#10b981')}
                      title="Emerald"
                    />
                    <button 
                      className="canvas-action-btn"
                      onClick={clearCanvas}
                      title="Clear Canvas"
                    >
                      <Eraser size={14} />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
                <canvas
                  ref={canvasRef}
                  className="interactive-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            )}

            {activeMode === 'image' && (
              <div className="image-mode-area">
                <div className="image-dropzone">
                  <div className="dropzone-icon">
                    <BarChart3 size={32} />
                  </div>
                  <div className="dropzone-text">
                    <strong>Drop workload dataset or JSON/CSV file here</strong>
                    <span>Supports custom process lists with arrival and burst parameters</span>
                  </div>
                  <div className="preset-images-row">
                    <span className="text-dim text-xs">Or choose standard preset:</span>
                    <button 
                      className="preset-sample-btn"
                      onClick={() => setPromptText("Simulate standard dataset: P1(arrival 0, burst 5), P2(arrival 0, burst 3), P3(arrival 0, burst 1)")}
                    >
                      📊 Standard 3-Process Queue
                    </button>
                    <button 
                      className="preset-sample-btn"
                      onClick={() => setPromptText("Simulate CPU convoy effect: P1(arrival 0, burst 24), P2(arrival 1, burst 3), P3(arrival 2, burst 3)")}
                    >
                      ⚡ Convoy Effect Benchmark
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeMode === 'prd' && (
              <div className="prd-mode-area">
                <div className="prd-input-header">
                  <FileText size={18} className="text-primary" />
                  <span>Upload or paste process scheduling specification (Queue Spec)</span>
                </div>
                <textarea
                  className="prd-textarea"
                  placeholder="Enter process specification: Process IDs, arrival times, CPU burst times, and optional priority..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={4}
                />
                <div className="prd-preset-row">
                  <button
                    className="quick-chip"
                    onClick={() => setPromptText("Process Queue Spec: P1 (Arrival 0, Burst 5), P2 (Arrival 1, Burst 4), P3 (Arrival 2, Burst 2), P4 (Arrival 4, Burst 1) with Time Quantum 2.")}
                  >
                    📄 Load Multi-Process Spec
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Controls Row inside the Card */}
            <div className="prompt-card-bottom">
              <div className="prompt-card-bottom-left">
                {/* Generation feedback or status */}
                {isGenerating && (
                  <div className="generation-status-pill">
                    <Sparkles size={14} className="spin-icon text-primary" />
                    <span>Step {generationStep}/4: Simulating CPU workload...</span>
                  </div>
                )}
              </div>

              <div className="prompt-card-bottom-right">
                <button 
                  className="card-tool-btn" 
                  title="Upload workload preset or dataset"
                  onClick={() => setActiveMode('image')}
                >
                  <BarChart3 size={17} />
                </button>
                
                <button 
                  className="card-tool-btn" 
                  title="Workload guidelines & formats"
                  onClick={() => setShowInfoModal(true)}
                >
                  <Info size={17} />
                </button>

                <button 
                  className="btn-create-app"
                  onClick={handleCreateApp}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles size={15} className="spin-icon" />
                      <span>Simulating...</span>
                    </>
                  ) : (
                    <span>Simulate Workload</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Mode Pill Selectors (Below Card) */}
          <div className="mode-selectors-row">
            <button
              className={`mode-pill ${activeMode === 'prompt' ? 'active' : ''}`}
              onClick={() => setActiveMode('prompt')}
            >
              <MessageSquare size={15} />
              <span>Workload Prompt</span>
            </button>

            <button
              className={`mode-pill ${activeMode === 'draw' ? 'active' : ''}`}
              onClick={() => setActiveMode('draw')}
            >
              <PenTool size={15} />
              <span>Draw Gantt Flow</span>
            </button>

            <button
              className={`mode-pill ${activeMode === 'image' ? 'active' : ''}`}
              onClick={() => setActiveMode('image')}
            >
              <BarChart3 size={15} />
              <span>Workload Presets</span>
            </button>

            <button
              className={`mode-pill ${activeMode === 'prd' ? 'active' : ''}`}
              onClick={() => setActiveMode('prd')}
            >
              <FileText size={15} />
              <span>Process Queue Spec</span>
            </button>
          </div>
        </div>

        {/* AI GENERATED RESULT POPUP / BANNER */}
        {generatedApp && (
          <div className="generated-result-banner">
            <div className="generated-info">
              <div className="generated-badge">
                <CheckCircle2 size={16} />
                <span>Simulation Computed</span>
              </div>
              <h3 className="generated-title">{generatedApp.title}</h3>
              <p className="generated-desc">
                Calculated execution timeline & metrics across FCFS, SJN, and Round Robin engines.
              </p>
            </div>
            <div className="generated-actions">
              <button 
                className="btn-action-primary"
                onClick={() => {
                  onLaunchSimulator('fcfs');
                  onLoadSampleData();
                }}
              >
                <Cpu size={16} />
                <span>Launch in CPU Simulator</span>
                <ArrowRight size={15} />
              </button>
              <button 
                className="btn-action-ghost"
                onClick={() => setGeneratedApp(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* LAPTOP / DEVICE SHOWCASE FRAME (Visible as the bottom bezel in reference) */}
        <div className="laptop-showcase-container">
          <div className="laptop-bezel">
            {/* Top Camera Notch */}
            <div className="laptop-notch">
              <div className="notch-camera" />
            </div>

            {/* Laptop Screen Content */}
            <div className="laptop-screen">
              {/* Screen Top Bar */}
              <div className="screen-window-bar">
                <div className="window-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <div className="window-title">
                  <Cpu size={13} />
                  <span>CPU Scheduling Studio — Live Engine Workspace</span>
                </div>
                <div className="window-actions">
                  <button 
                    className="screen-pill-btn"
                    onClick={() => onLaunchSimulator('fcfs')}
                  >
                    <span>Open Full Screen</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Inside Interactive Preview */}
              <div className="screen-content-grid">
                {/* Mini Algorithm Cards */}
                <div className="preview-card" onClick={() => onSelectAlgorithm('fcfs')}>
                  <div className="preview-card-header">
                    <div className="preview-icon fcfs">
                      <FastForward size={16} />
                    </div>
                    <div>
                      <h4>FCFS Engine</h4>
                      <span>Non-preemptive FIFO</span>
                    </div>
                  </div>
                  <div className="mini-gantt-preview">
                    <div className="mini-bar p1" style={{ width: '50%' }}>P1 (0-5)</div>
                    <div className="mini-bar p2" style={{ width: '30%' }}>P2 (5-8)</div>
                    <div className="mini-bar p3" style={{ width: '20%' }}>P3 (8-9)</div>
                  </div>
                  <div className="preview-stat">
                    <span>Avg Wait: <strong>4.33ms</strong></span>
                    <ArrowRight size={13} className="stat-arrow" />
                  </div>
                </div>

                <div className="preview-card" onClick={() => onSelectAlgorithm('sjn')}>
                  <div className="preview-card-header">
                    <div className="preview-icon sjn">
                      <Layers size={16} />
                    </div>
                    <div>
                      <h4>SJN / SJF Engine</h4>
                      <span>Shortest Job Next</span>
                    </div>
                  </div>
                  <div className="mini-gantt-preview">
                    <div className="mini-bar p3" style={{ width: '20%' }}>P3 (0-1)</div>
                    <div className="mini-bar p2" style={{ width: '30%' }}>P2 (1-4)</div>
                    <div className="mini-bar p1" style={{ width: '50%' }}>P1 (4-9)</div>
                  </div>
                  <div className="preview-stat">
                    <span>Avg Wait: <strong>2.33ms</strong> <em className="text-success text-xs font-semibold">(Fastest)</em></span>
                    <ArrowRight size={13} className="stat-arrow" />
                  </div>
                </div>

                <div className="preview-card" onClick={() => onSelectAlgorithm('rr')}>
                  <div className="preview-card-header">
                    <div className="preview-icon rr">
                      <Repeat size={16} />
                    </div>
                    <div>
                      <h4>Round Robin</h4>
                      <span>Preemptive Quantum: 2</span>
                    </div>
                  </div>
                  <div className="mini-gantt-preview">
                    <div className="mini-bar p1" style={{ width: '25%' }}>P1</div>
                    <div className="mini-bar p2" style={{ width: '25%' }}>P2</div>
                    <div className="mini-bar p3" style={{ width: '15%' }}>P3</div>
                    <div className="mini-bar p1" style={{ width: '25%' }}>P1</div>
                    <div className="mini-bar p2" style={{ width: '10%' }}>P2</div>
                  </div>
                  <div className="preview-stat">
                    <span>Fair Time Slicing</span>
                    <ArrowRight size={13} className="stat-arrow" />
                  </div>
                </div>

                <div className="preview-card" onClick={() => onSelectAlgorithm('comparison')}>
                  <div className="preview-card-header">
                    <div className="preview-icon benchmarks">
                      <BarChart3 size={16} />
                    </div>
                    <div>
                      <h4>Benchmarks</h4>
                      <span>Comparative Analytics</span>
                    </div>
                  </div>
                  <div className="mini-chart-bars">
                    <div className="chart-bar-col">
                      <div className="bar-fill" style={{ height: '65%', background: '#ea580c' }} />
                      <span>FCFS</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="bar-fill" style={{ height: '35%', background: '#10b981' }} />
                      <span>SJN</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="bar-fill" style={{ height: '55%', background: '#a855f7' }} />
                      <span>RR</span>
                    </div>
                  </div>
                  <div className="preview-stat">
                    <span>Full Comparison</span>
                    <ArrowRight size={13} className="stat-arrow" />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Launch Callout */}
              <div className="screen-footer-callout">
                <div className="callout-left">
                  <Zap size={16} className="text-warning" />
                  <span>Ready to run custom workloads? Add processes and simulate step-by-step.</span>
                </div>
                <button 
                  className="btn-launch-pill"
                  onClick={() => onLaunchSimulator('fcfs')}
                >
                  <span>Launch Interactive Simulator</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / KEY CAPABILITIES SECTION */}
      <section className="intro-features-section">
        <div className="section-header-center">
          <span className="section-tag">ARCHITECTED FOR PERFORMANCE</span>
          <h2 className="section-title">Everything you need to master CPU scheduling</h2>
          <p className="section-subtitle">
            An end-to-end interactive laboratory built with React & modern web standards.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card" onClick={() => onSelectAlgorithm('fcfs')}>
            <div className="feature-icon-box">
              <FastForward size={22} className="text-primary" />
            </div>
            <h3>Sequential FCFS Execution</h3>
            <p>
              Execute arrived processes strictly in FIFO order. Explore the convoy effect and understand how long burst times impact queue latency.
            </p>
            <div className="feature-card-footer">
              <span>Test FCFS Engine</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="feature-card" onClick={() => onSelectAlgorithm('sjn')}>
            <div className="feature-icon-box">
              <Layers size={22} style={{ color: '#38bdf8' }} />
            </div>
            <h3>Optimal SJN Delay Reduction</h3>
            <p>
              Minimize average waiting time mathematically by prioritizing processes with the lowest burst times. Ideal for batch execution.
            </p>
            <div className="feature-card-footer">
              <span>Test SJN Engine</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="feature-card" onClick={() => onSelectAlgorithm('rr')}>
            <div className="feature-icon-box">
              <Repeat size={22} style={{ color: '#a855f7' }} />
            </div>
            <h3>Preemptive Round Robin & Quantum</h3>
            <p>
              Configure time slices dynamically. Observe cyclic preemption, context switching distribution, and fair CPU time allocation.
            </p>
            <div className="feature-card-footer">
              <span>Tune Time Quantum</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="feature-card" onClick={() => onSelectAlgorithm('comparison')}>
            <div className="feature-icon-box">
              <BarChart3 size={22} style={{ color: '#10b981' }} />
            </div>
            <h3>Multi-Algorithm Benchmarking</h3>
            <p>
              Compare turnaround times, waiting times, and CPU utilization across all algorithms side-by-side with interactive bar charts.
            </p>
            <div className="feature-card-footer">
              <span>View Benchmarks</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PRESETS WORKLOAD CTA */}
      <section className="intro-presets-section">
        <div className="presets-card">
          <div className="presets-content">
            <div className="presets-tag">
              <Sparkles size={14} />
              <span>ONE-CLICK WORKLOAD TESTING</span>
            </div>
            <h2>Jump straight into the simulation</h2>
            <p>
              Load our benchmark dataset with P1(0,5), P2(0,3), P3(0,1) or configure your own arrival and burst parameters.
            </p>
            <div className="presets-button-group">
              <button 
                className="btn-white-pill-lg"
                onClick={() => {
                  onLoadSampleData();
                  onLaunchSimulator('fcfs');
                }}
              >
                <Cpu size={16} />
                <span>Load Sample Dataset & Launch</span>
              </button>
              <button 
                className="btn-ghost-pill-lg"
                onClick={() => onLaunchSimulator('comparison')}
              >
                <BarChart3 size={16} />
                <span>Explore Benchmark Graphs</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INFO / GUIDELINES MODAL */}
      {showInfoModal && (
        <div className="modal-backdrop" onClick={() => setShowInfoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Info size={20} className="text-primary" />
                <h3>Prompt Guidelines & Workload Format</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowInfoModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                The CPU Scheduler AI engine understands both natural language workload descriptions and operating system scheduling specifications.
              </p>
              <h4>Supported Inputs:</h4>
              <ul>
                <li><strong>Natural Language Workload:</strong> "Simulate a batch workload with 4 processes and varying CPU bursts."</li>
                <li><strong>Process Scheduling Specs:</strong> "P1: arrival 0, burst 5; P2: arrival 0, burst 3; P3: arrival 0, burst 1."</li>
                <li><strong>Wireframes & PRDs:</strong> Draw your UI in the canvas tab or paste your markdown PRD in the PRD tab.</li>
              </ul>
              <div className="modal-tip">
                <Sparkles size={16} className="text-warning" />
                <span>Tip: Click "Load Sample Dataset & Launch" to see instant Gantt charts!</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-primary" onClick={() => setShowInfoModal(false)}>
                Got it, let's explore!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
