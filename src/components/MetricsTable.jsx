import React from 'react';
import { Calculator, Award, Cpu, Zap, Timer } from 'lucide-react';
import { getProcessColor } from '../utils/metrics.js';

/**
 * MetricsTable component displaying process-by-process metrics and summary stats
 */
export function MetricsTable({ processStats, metrics, processes, algorithmName }) {
  if (!processStats || processStats.length === 0) {
    return null;
  }

  const processIndexMap = new Map();
  processes.forEach((p, idx) => processIndexMap.set(p.id, idx));

  return (
    <div className="card metrics-card">
      <div className="card-header">
        <h3>
          <Calculator className="icon text-primary" size={18} />
          {algorithmName ? `${algorithmName} Performance Metrics` : 'Performance Metrics'}
        </h3>
        <div className="header-badges">
          <span className="badge badge-success">Output Stats</span>
          <span className="scroll-indicator-badge">↔ Swipe Table</span>
        </div>
      </div>

      {/* KPI Cards Summary Banner */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon bg-indigo-subtle">
            <Timer className="text-primary" size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Avg Waiting Time</span>
            <div className="kpi-value">{metrics.avgWT} <span className="unit">units</span></div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-emerald-subtle">
            <Award className="text-success" size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Avg Turnaround Time</span>
            <div className="kpi-value">{metrics.avgTAT} <span className="unit">units</span></div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-sky-subtle">
            <Cpu className="text-info" size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">CPU Utilization</span>
            <div className="kpi-value">{metrics.cpuUtilization}%</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-amber-subtle">
            <Zap className="text-warning" size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Throughput</span>
            <div className="kpi-value">{metrics.throughput}</div>
          </div>
        </div>
      </div>

      {/* Process-by-Process Metrics Table */}
      <div className="table-responsive margin-top-md">
        <table className="custom-table metrics-table-content">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>PID</th>
              <th style={{ width: '15%' }}>Arrival (AT)</th>
              <th style={{ width: '15%' }}>Burst (BT)</th>
              <th style={{ width: '15%' }}>Completion (CT)</th>
              <th style={{ width: '15%' }}>Turnaround (TAT)</th>
              <th style={{ width: '15%' }}>Waiting (WT)</th>
              <th style={{ width: '15%' }}>Response (RT)</th>
            </tr>
          </thead>
          <tbody>
            {processStats.map((proc) => {
              const pIdx = processIndexMap.get(proc.id) ?? 0;
              const color = getProcessColor(pIdx);

              return (
                <tr key={proc.id} className="table-row">
                  <td>
                    <div className="pid-cell">
                      <span
                        className="color-dot"
                        style={{ backgroundColor: color.bg, borderColor: color.border }}
                      />
                      <strong className="text-primary">{proc.id}</strong>
                    </div>
                  </td>
                  <td>{proc.arrivalTime}</td>
                  <td>{proc.burstTime}</td>
                  <td><span className="cell-badge ct-badge">{proc.ct}</span></td>
                  <td><span className="cell-badge tat-badge">{proc.tat}</span></td>
                  <td><span className="cell-badge wt-badge">{proc.wt}</span></td>
                  <td><span className="cell-badge rt-badge">{proc.rt}</span></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="footer-summary-row">
              <td colSpan="4">
                <strong>Averages ({processStats.length} processes)</strong>
              </td>
              <td>
                <span className="avg-highlight">Avg TAT: {metrics.avgTAT}</span>
              </td>
              <td>
                <span className="avg-highlight">Avg WT: {metrics.avgWT}</span>
              </td>
              <td>
                <span className="avg-highlight">Avg RT: {metrics.avgRT}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
