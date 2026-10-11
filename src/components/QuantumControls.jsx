import React from 'react';
import { Sliders, Repeat } from 'lucide-react';

/**
 * QuantumControls component for configuring Time Quantum on Round Robin page
 */
export function QuantumControls({ timeQuantum, onChangeTimeQuantum }) {
  return (
    <div className="card quantum-card">
      <div className="card-header">
        <h3>
          <Sliders className="icon text-primary" size={18} />
          Round Robin Parameters
        </h3>
        <span className="badge badge-accent">Preemptive</span>
      </div>

      <div className="quantum-input-container">
        <div className="quantum-label-wrapper">
          <label htmlFor="time-quantum-input" className="quantum-label">
            <Repeat size={16} className="text-accent" />
            Time Quantum (Q)
          </label>
          <span className="quantum-help-text">CPU time slice per cycle</span>
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
    </div>
  );
}
