import React from 'react';
import { Trash2, List, Cpu } from 'lucide-react';
import { getProcessColor } from '../utils/metrics.js';

/**
 * ProcessTable component to list added processes
 */
export function ProcessTable({ processes, onDeleteProcess }) {
  const totalBurstTime = processes.reduce((acc, p) => acc + Number(p.burstTime), 0);

  return (
    <div className="card table-card">
      <div className="card-header">
        <h3>
          <List className="icon text-primary" size={18} />
          Current Process Queue
        </h3>
        <div className="header-badges">
          <span className="badge badge-primary">
            {processes.length} {processes.length === 1 ? 'Process' : 'Processes'}
          </span>
          <span className="badge badge-subtle">
            Total Burst: {totalBurstTime}u
          </span>
        </div>
      </div>

      {processes.length === 0 ? (
        <div className="empty-state">
          <Cpu size={32} className="empty-icon text-muted" />
          <p className="empty-title">Process Queue is Empty</p>
          <p className="empty-subtitle">
            Add processes above or click <strong>"Sample Data"</strong>.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Color</th>
                <th>PID</th>
                <th>Arrival (AT)</th>
                <th>Burst (BT)</th>
                <th className="text-right" style={{ width: '60px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((proc, index) => {
                const color = getProcessColor(index);
                return (
                  <tr key={proc.id} className="table-row">
                    <td>
                      <span
                        className="color-dot"
                        style={{ backgroundColor: color.bg, borderColor: color.border }}
                        title={`Color for ${proc.id}`}
                      />
                    </td>
                    <td className="font-semibold text-primary">{proc.id}</td>
                    <td>{proc.arrivalTime}</td>
                    <td>{proc.burstTime}</td>
                    <td className="text-right">
                      <button
                        className="btn-icon text-danger"
                        onClick={() => onDeleteProcess(proc.id)}
                        title={`Delete process ${proc.id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
