import React, { useState } from 'react';
import { BarChart3, Clock, Activity } from 'lucide-react';
import { getProcessColor } from '../utils/metrics.js';

/**
 * GanttChart component for rendering visual CPU execution timeline
 */
export function GanttChart({ timeline, processes }) {
  const [activeHoverIndex, setActiveHoverIndex] = useState(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="card gantt-card">
        <div className="card-header">
          <h3>
            <BarChart3 className="icon text-primary" size={18} />
            Execution Gantt Chart
          </h3>
        </div>
        <div className="empty-state">
          <Activity size={32} className="empty-icon text-muted" />
          <p className="empty-title">No Timeline Available</p>
          <p className="empty-subtitle">Add processes to generate the Gantt chart.</p>
        </div>
      </div>
    );
  }

  const startOffset = timeline[0].startTime;
  const maxTime = timeline[timeline.length - 1].endTime;
  const totalSpan = maxTime - startOffset;

  const processIndexMap = new Map();
  processes.forEach((p, idx) => processIndexMap.set(p.id, idx));

  return (
    <div className="card gantt-card">
      <div className="card-header">
        <h3>
          <BarChart3 className="icon text-primary" size={18} />
          Execution Gantt Chart
        </h3>
        <div className="header-badges">
          <span className="badge badge-accent">
            Total Duration: {totalSpan} units ({startOffset} → {maxTime})
          </span>
        </div>
      </div>

      <div className="gantt-wrapper">
        {/* Legend */}
        <div className="gantt-legend">
          {processes.map((p, idx) => {
            const color = getProcessColor(idx);
            return (
              <div key={p.id} className="legend-item">
                <span
                  className="legend-badge"
                  style={{ background: color.bg, borderColor: color.border, boxShadow: `0 0 8px ${color.border}66` }}
                />
                <span className="legend-label font-semibold">{p.id} (BT: {p.burstTime})</span>
              </div>
            );
          })}
          <div className="legend-item">
            <span className="legend-badge legend-idle" />
            <span className="legend-label">IDLE</span>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="gantt-container">
          <div className="gantt-timeline-blocks">
            {timeline.map((block, index) => {
              const duration = block.endTime - block.startTime;
              const widthPct = totalSpan > 0 ? (duration / totalSpan) * 100 : 0;
              const pIndex = processIndexMap.get(block.processId) ?? index;
              const color = block.isIdle ? null : getProcessColor(pIndex);
              const isHovered = activeHoverIndex === index;

              return (
                <div
                  key={`${block.processId}-${block.startTime}-${index}`}
                  className={`gantt-block ${block.isIdle ? 'block-idle' : ''} ${isHovered ? 'hovered' : ''}`}
                  style={{
                    width: `${Math.max(widthPct, 4)}%`,
                    background: block.isIdle ? undefined : color.bg,
                    borderColor: block.isIdle ? undefined : color.border,
                    boxShadow: block.isIdle ? undefined : `0 4px 16px ${color.glow || 'rgba(0,0,0,0.5)'}`,
                  }}
                  onMouseEnter={() => setActiveHoverIndex(index)}
                  onMouseLeave={() => setActiveHoverIndex(null)}
                >
                  <div className="block-content">
                    <span className="block-pid" style={{ color: block.isIdle ? '#94a3b8' : (color.text || '#ffffff'), textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                      {block.processId}
                    </span>
                    <span className="block-duration" style={{ color: block.isIdle ? '#94a3b8' : (color.text === '#000000' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)') }}>
                      ({block.startTime}–{block.endTime})
                    </span>
                  </div>

                  {isHovered && (
                    <div className="gantt-tooltip">
                      <div className="tooltip-title" style={{ color: block.isIdle ? '#94a3b8' : color.border }}>
                        {block.isIdle ? 'CPU IDLE' : `Process ${block.processId}`}
                      </div>
                      <div className="tooltip-detail">
                        <span>Interval:</span>
                        <strong>{block.startTime} → {block.endTime}</strong>
                      </div>
                      <div className="tooltip-detail">
                        <span>Duration:</span>
                        <strong>{duration} units</strong>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Axis Scale */}
          <div className="gantt-axis">
            {timeline.map((block, index) => {
              const duration = block.endTime - block.startTime;
              const widthPct = totalSpan > 0 ? (duration / totalSpan) * 100 : 0;
              return (
                <div
                  key={`axis-${index}`}
                  className="axis-marker-wrapper"
                  style={{ width: `${Math.max(widthPct, 4)}%` }}
                >
                  {index === 0 && (
                    <span className="axis-time axis-start">{block.startTime}</span>
                  )}
                  <span className="axis-time axis-end">{block.endTime}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Breakdown */}
        <div className="execution-log">
          <div className="log-header">
            <Clock size={15} className="text-primary" />
            <span>Execution Sequence</span>
          </div>
          <div className="log-pills">
            {timeline.map((block, i) => {
              const pIndex = processIndexMap.get(block.processId) ?? i;
              const color = block.isIdle ? null : getProcessColor(pIndex);

              return (
                <div
                  key={i}
                  className={`log-pill ${block.isIdle ? 'idle-pill' : ''}`}
                  style={{
                    borderLeftColor: block.isIdle ? '#94a3b8' : color.border,
                    background: block.isIdle ? 'rgba(255,255,255,0.03)' : `rgba(255, 255, 255, 0.05)`,
                    boxShadow: block.isIdle ? 'none' : `inset 3px 0 0 ${color.border}`,
                  }}
                >
                  <span className="pill-step">#{i + 1}</span>
                  <strong style={{ color: block.isIdle ? '#94a3b8' : color.border, fontWeight: 800 }}>
                    {block.processId}
                  </strong>
                  <span className="pill-time">
                    {block.startTime} → {block.endTime} ({block.endTime - block.startTime}u)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
