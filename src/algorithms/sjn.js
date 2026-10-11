import { calculateSummaryMetrics, comparePid } from '../utils/metrics.js';

/**
 * Shortest Job Next (SJN / Shortest Job First - Non-Preemptive) Scheduling Engine
 * 
 * Rules:
 * 1. Non-preemptive scheduling.
 * 2. At every decision point (when CPU is free), select from processes that have ARRIVED (AT <= currentTime).
 * 3. Tie-breaker hierarchy:
 *    1) Shortest Burst Time (BT)
 *    2) Earliest Arrival Time (AT)
 *    3) Process ID (alphabetical natural order e.g. "P1" vs "P2")
 * 4. If no process has arrived, CPU remains IDLE until the earliest future arrival.
 * 
 * @param {Array} rawProcesses - Array of process objects { id, arrivalTime, burstTime }
 * @returns {Object} { timeline, processStats, metrics }
 */
export function runSJN(rawProcesses) {
  if (!rawProcesses || rawProcesses.length === 0) {
    return { timeline: [], processStats: [], metrics: calculateSummaryMetrics([], []) };
  }

  // Clone processes with numeric AT & BT
  let uncompleted = [...rawProcesses].map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
  }));

  const timeline = [];
  const processStatsMap = new Map();
  let currentTime = 0;

  while (uncompleted.length > 0) {
    // Arrived processes at the current time
    const readyProcesses = uncompleted.filter(p => p.arrivalTime <= currentTime);

    if (readyProcesses.length === 0) {
      // CPU IDLE gap until next process arrives
      const nextArrival = Math.min(...uncompleted.map(p => p.arrivalTime));
      timeline.push({
        processId: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
        duration: nextArrival - currentTime,
        isIdle: true,
      });
      currentTime = nextArrival;
      continue;
    }

    // Sort ready processes using strict 3-tier tie-breaker rule
    readyProcesses.sort((a, b) => {
      // 1. Shortest Burst Time
      if (a.burstTime !== b.burstTime) {
        return a.burstTime - b.burstTime;
      }
      // 2. Earliest Arrival Time
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }
      // 3. Process ID alphabetical order
      return comparePid(a.id, b.id);
    });

    const selected = readyProcesses[0];
    const startTime = currentTime;
    const endTime = currentTime + selected.burstTime;

    timeline.push({
      processId: selected.id,
      startTime,
      endTime,
      duration: selected.burstTime,
      isIdle: false,
    });

    const ct = endTime;
    const tat = ct - selected.arrivalTime;
    const wt = tat - selected.burstTime;
    const rt = startTime - selected.arrivalTime;

    processStatsMap.set(selected.id, {
      ...selected,
      startTime,
      ct,
      tat,
      wt,
      rt,
    });

    currentTime = endTime;
    uncompleted = uncompleted.filter(p => p.id !== selected.id);
  }

  const processStats = rawProcesses.map(p => processStatsMap.get(p.id));
  const metrics = calculateSummaryMetrics(processStats, timeline);

  return {
    timeline,
    processStats,
    metrics,
  };
}
