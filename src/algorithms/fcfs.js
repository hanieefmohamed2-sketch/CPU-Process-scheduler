import { calculateSummaryMetrics, comparePid } from '../utils/metrics.js';

/**
 * First Come First Served (FCFS) Scheduling Engine
 * 
 * Rules:
 * 1. Non-preemptive scheduling.
 * 2. Processes are served strictly in order of Arrival Time (AT).
 * 3. Tie-breaker: Earliest Arrival Time, then Process ID (alphabetical).
 * 4. Handles CPU IDLE periods when CPU is waiting for the next process arrival.
 * 
 * @param {Array} rawProcesses - Array of process objects { id, arrivalTime, burstTime }
 * @returns {Object} { timeline, processStats, metrics }
 */
export function runFCFS(rawProcesses) {
  if (!rawProcesses || rawProcesses.length === 0) {
    return { timeline: [], processStats: [], metrics: calculateSummaryMetrics([], []) };
  }

  // Clone and sort processes strictly by Arrival Time (AT), then PID
  const sortedProcesses = [...rawProcesses].map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
  })).sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return comparePid(a.id, b.id);
  });

  const timeline = [];
  const processStatsMap = new Map();
  let currentTime = 0;

  for (const process of sortedProcesses) {
    // If the process has not arrived yet, CPU remains IDLE until arrival
    if (currentTime < process.arrivalTime) {
      timeline.push({
        processId: 'IDLE',
        startTime: currentTime,
        endTime: process.arrivalTime,
        duration: process.arrivalTime - currentTime,
        isIdle: true,
      });
      currentTime = process.arrivalTime;
    }

    const startTime = currentTime;
    const endTime = currentTime + process.burstTime;

    timeline.push({
      processId: process.id,
      startTime,
      endTime,
      duration: process.burstTime,
      isIdle: false,
    });

    const ct = endTime;
    const tat = ct - process.arrivalTime;
    const wt = tat - process.burstTime;
    const rt = startTime - process.arrivalTime;

    processStatsMap.set(process.id, {
      ...process,
      startTime,
      ct,
      tat,
      wt,
      rt,
    });

    currentTime = endTime;
  }

  // Return process stats in original input order
  const processStats = rawProcesses.map(p => processStatsMap.get(p.id));
  const metrics = calculateSummaryMetrics(processStats, timeline);

  return {
    timeline,
    processStats,
    metrics,
  };
}
