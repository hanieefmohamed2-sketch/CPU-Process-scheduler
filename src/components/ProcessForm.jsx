import React, { useState } from 'react';
import { Plus, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

/**
 * ProcessForm component for adding new processes and loading sample data
 */
export function ProcessForm({ onAddProcess, onLoadSampleData, onClearAll, existingPids }) {
  const [pid, setPid] = useState('');
  const [arrivalTime, setArrivalTime] = useState('0');
  const [burstTime, setBurstTime] = useState('5');
  const [error, setError] = useState('');

  // Auto-generate next available PID (e.g. P1, P2, P3...)
  const getNextPid = () => {
    let index = 1;
    while (existingPids.includes(`P${index}`)) {
      index++;
    }
    return `P${index}`;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');

    const trimmedPid = (pid.trim() || getNextPid()).toUpperCase();
    const parsedAT = Number(arrivalTime);
    const parsedBT = Number(burstTime);

    if (!trimmedPid) {
      setError('Process ID cannot be empty.');
      return;
    }

    if (existingPids.some(p => p.toUpperCase() === trimmedPid)) {
      setError(`PID "${trimmedPid}" already exists.`);
      return;
    }

    if (isNaN(parsedAT) || arrivalTime === '' || parsedAT < 0) {
      setError('Arrival Time must be ≥ 0.');
      return;
    }

    if (isNaN(parsedBT) || burstTime === '' || parsedBT <= 0) {
      setError('Burst Time must be > 0.');
      return;
    }

    onAddProcess({
      id: trimmedPid,
      arrivalTime: parsedAT,
      burstTime: parsedBT,
    });

    setPid('');
    setArrivalTime('0');
    setBurstTime('3');
    setError('');
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h3>
          <Plus className="icon text-primary" size={18} />
          Process Input
        </h3>
        <span className="badge badge-subtle">Configure Workload</span>
      </div>

      <form onSubmit={handleAdd} className="process-form">
        {error && (
          <div className="form-error-toast" role="alert">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="pid-input">PID</label>
            <input
              id="pid-input"
              type="text"
              placeholder={`e.g. ${getNextPid()}`}
              value={pid}
              onChange={(e) => setPid(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="at-input">Arrival (AT)</label>
            <input
              id="at-input"
              type="number"
              min="0"
              placeholder="0"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bt-input">Burst (BT)</label>
            <input
              id="bt-input"
              type="number"
              min="1"
              placeholder="1"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          <Plus size={16} />
          Add Process to Queue
        </button>

        <div className="form-quick-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onLoadSampleData}
          >
            <Sparkles size={14} />
            Sample Data
          </button>

          <button
            type="button"
            className="btn btn-subtle btn-sm text-danger-hover"
            onClick={onClearAll}
            disabled={existingPids.length === 0}
          >
            <RotateCcw size={14} />
            Clear Queue
          </button>
        </div>
      </form>
    </div>
  );
}
