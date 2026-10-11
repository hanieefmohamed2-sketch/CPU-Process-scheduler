import React from 'react';
import { Trophy, ArrowDownRight, Layers, CheckCircle2, BarChart3, Sparkles } from 'lucide-react';
import { runFCFS } from '../algorithms/fcfs.js';
import { runSJN } from '../algorithms/sjn.js';
import { runRoundRobin } from '../algorithms/roundRobin.js';
import { ALGORITHM_CONFIG } from '../App.jsx';

/**
 * ComparisonChart component evaluating all algorithms simultaneously
 */
export function ComparisonChart({
  processes,
  timeQuantum,
  currentAlgorithm,
  onSelectAlgorithm,
  onLoadSampleData
}) {
  // Empty State when no processes are present in queue
  if (!processes || processes.length === 0) {
    return (
      <div className="card comparison-card">
        <div className="card-header">
          <h3>
            <Trophy className="icon text-warning" size={18} />
            Algorithm Performance Comparison & Optimization
          </h3>
          <span className="badge badge-subtle">Comparative Analysis</span>
        </div>

        <div className="empty-state empty-state-benchmark">
          <BarChart3 size={48} className="empty-icon text-muted" />
          <p className="empty-title">No Process Workload Loaded</p>
          <p className="empty-subtitle">
            Add processes to the queue or click <strong>"Load Sample Data"</strong> to view real-time side-by-side performance benchmarks and optimal algorithm recommendations.
          </p>

          {onLoadSampleData && (
            <button
              className="btn btn-primary btn-glow margin-top-md"
              onClick={onLoadSampleData}
            >
              <Sparkles size={16} />
              Load Sample Test Case
            </button>
          )}
        </div>
      </div>
    );
  }

  // Run all three engines on active workload
  const fcfsResult = runFCFS(processes);
  const sjnResult = runSJN(processes);
  const rrResult = runRoundRobin(processes, timeQuantum);

  const algorithms = [
    { key: 'fcfs', label: 'FCFS', metrics: fcfsResult.metrics, engine: fcfsResult },
    { key: 'sjn', label: 'SJN', metrics: sjnResult.metrics, engine: sjnResult },
    { key: 'rr', label: `RR (Q=${timeQuantum})`, metrics: rrResult.metrics, engine: rrResult },
  ];

  // Determine best algorithm (lowest Avg WT, tie breaker lowest Avg TAT)
  let bestAlgo = algorithms[0];
  algorithms.forEach((algo) => {
    if (
      algo.metrics.avgWT < bestAlgo.metrics.avgWT ||
      (algo.metrics.avgWT === bestAlgo.metrics.avgWT && algo.metrics.avgTAT < bestAlgo.metrics.avgTAT)
    ) {
      bestAlgo = algo;
    }
  });

  const maxWT = Math.max(...algorithms.map(a => a.metrics.avgWT), 1);
  const maxTAT = Math.max(...algorithms.map(a => a.metrics.avgTAT), 1);

  return (
    <div className="card comparison-card">
      <div className="card-header">
        <h3>
          <Trophy className="icon text-warning" size={18} />
          Algorithm Performance Comparison & Optimization
        </h3>
        <div className="header-badges">
          <span className="badge badge-warning">Comparative Analysis</span>
          <span className="scroll-indicator-badge">↔ Swipe Table</span>
        </div>
      </div>

      {/* Best Algorithm Winner Banner */}
      <div className="winner-banner">
        <div className="winner-icon-wrapper">
          <Trophy className="winner-trophy text-warning" size={28} />
        </div>
        <div className="winner-details">
          <div className="winner-title">
            🏆 Best Performing Algorithm: <strong>{ALGORITHM_CONFIG[bestAlgo.key]?.name || bestAlgo.label}</strong>
          </div>
          <p className="winner-subtitle">
            Yields the lowest Average Waiting Time of <strong>{bestAlgo.metrics.avgWT} units</strong> and
            Average Turnaround Time of <strong>{bestAlgo.metrics.avgTAT} units</strong> for the current workload.
          </p>
        </div>
        {currentAlgorithm !== bestAlgo.key && (
          <button
            className="btn btn-warning btn-sm"
            onClick={() => onSelectAlgorithm(bestAlgo.key)}
            title="Switch view to optimal algorithm"
          >
            Apply {bestAlgo.label}
          </button>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="comparison-grid">
        {/* Avg WT Bar Chart */}
        <div className="comparison-panel">
          <div className="panel-title">
            <ArrowDownRight size={15} className="text-primary" />
            Average Waiting Time (Lower is Better)
          </div>
          <div className="chart-bars-container">
            {algorithms.map((algo) => {
              const pct = (algo.metrics.avgWT / maxWT) * 100;
              const isBest = algo.key === bestAlgo.key;
              const isCurrent = algo.key === currentAlgorithm;

              return (
                <div
                  key={algo.key}
                  className={`comparison-bar-row ${isCurrent ? 'selected-row' : ''}`}
                  onClick={() => onSelectAlgorithm(algo.key)}
                >
                  <div className="bar-label-group">
                    <span className="bar-algo-name">{algo.label}</span>
                    {isBest && <span className="mini-winner-badge">Optimal</span>}
                  </div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${isBest ? 'bar-best' : 'bar-normal'}`}
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    >
                      <span className="bar-val-text">{algo.metrics.avgWT}u</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Avg TAT Bar Chart */}
        <div className="comparison-panel">
          <div className="panel-title">
            <Layers size={15} className="text-success" />
            Average Turnaround Time (Lower is Better)
          </div>
          <div className="chart-bars-container">
            {algorithms.map((algo) => {
              const pct = (algo.metrics.avgTAT / maxTAT) * 100;
              const isBest = algo.key === bestAlgo.key;
              const isCurrent = algo.key === currentAlgorithm;

              return (
                <div
                  key={algo.key}
                  className={`comparison-bar-row ${isCurrent ? 'selected-row' : ''}`}
                  onClick={() => onSelectAlgorithm(algo.key)}
                >
                  <div className="bar-label-group">
                    <span className="bar-algo-name">{algo.label}</span>
                    {isBest && <span className="mini-winner-badge">Optimal</span>}
                  </div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${isBest ? 'bar-best-tat' : 'bar-normal-tat'}`}
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    >
                      <span className="bar-val-text">{algo.metrics.avgTAT}u</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="table-responsive margin-top-md">
        <table className="custom-table comparison-summary-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Type</th>
              <th>Avg Waiting Time</th>
              <th>Avg Turnaround Time</th>
              <th>Avg Response Time</th>
              <th>CPU Utilization</th>
              <th>Throughput</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {algorithms.map((algo) => {
              const isSelected = algo.key === currentAlgorithm;
              const isWinner = algo.key === bestAlgo.key;

              return (
                <tr key={algo.key} className={`table-row ${isSelected ? 'row-active' : ''}`}>
                  <td>
                    <div className="algo-name-cell">
                      {isWinner && <Trophy size={14} className="text-warning" />}
                      <strong>{algo.label}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-subtle">
                      {ALGORITHM_CONFIG[algo.key]?.type}
                    </span>
                  </td>
                  <td>
                    <strong className={isWinner ? 'text-success' : ''}>
                      {algo.metrics.avgWT} units
                    </strong>
                  </td>
                  <td>{algo.metrics.avgTAT} units</td>
                  <td>{algo.metrics.avgRT} units</td>
                  <td>{algo.metrics.cpuUtilization}%</td>
                  <td>{algo.metrics.throughput}</td>
                  <td>
                    {isSelected ? (
                      <span className="badge badge-primary flex-center gap-xs">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => onSelectAlgorithm(algo.key)}
                      >
                        View Timeline
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
