import React from 'react';
import { Sliders, Layers, FastForward, Repeat } from 'lucide-react';

export const ALGORITHM_INFO = {
  fcfs: {
    name: 'First Come First Served (FCFS)',
    shortName: 'FCFS',
    type: 'Non-preemptive',
    icon: FastForward,
  },
  sjn: {
    name: 'Shortest Job Next (SJN)',
    shortName: 'SJN',
    type: 'Non-preemptive',
    icon: Layers,
  },
  rr: {
    name: 'Round Robin (RR)',
    shortName: 'Round Robin',
    type: 'Preemptive',
    icon: Repeat,
  }
};

/**
 * AlgorithmSelector component with Radio Tabs & Quantum input
 */
export function AlgorithmSelector({
  selectedAlgorithm,
  onSelectAlgorithm,
  timeQuantum,
  onChangeTimeQuantum
}) {
  return (
    <div className="card selector-card">
      <div className="card-header">
        <h3>
          <Sliders className="icon text-primary" size={18} />
          Algorithm Selection
        </h3>
        <span className="badge badge-accent">
          {ALGORITHM_INFO[selectedAlgorithm].type}
        </span>
      </div>

      <div className="algorithm-tabs">
        {Object.entries(ALGORITHM_INFO).map(([key, info]) => {
          const IconComponent = info.icon;
          const isSelected = selectedAlgorithm === key;

          return (
            <button
              key={key}
              type="button"
              className={`algo-tab-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectAlgorithm(key)}
            >
              <IconComponent className="tab-icon" size={18} />
              <div className="tab-info">
                <span className="tab-title">{info.shortName}</span>
                <span className="tab-type-tag">{info.type}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAlgorithm === 'rr' && (
        <div className="quantum-input-container">
          <div className="quantum-label-wrapper">
            <label htmlFor="time-quantum-input" className="quantum-label">
              <Repeat size={15} className="text-accent" />
              Time Quantum (Q)
            </label>
            <span className="quantum-help-text">CPU time slice duration</span>
          </div>

          <div className="quantum-input-box">
            <input
              id="time-quantum-input"
              type="number"
              min="1"
              max="100"
              value={timeQuantum}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                onChangeTimeQuantum(val);
              }}
              className="input-field quantum-field"
            />
            <span className="input-unit">units</span>
          </div>
        </div>
      )}
    </div>
  );
}
