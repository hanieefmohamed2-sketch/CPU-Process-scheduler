/**
 * CPU Process Scheduling Simulator - Shared Metrics & Utilities
 * 
 * Formulas:
 * - Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)
 * - Waiting Time (WT)     = Turnaround Time (TAT) - Burst Time (BT)
 * - Response Time (RT)    = First Execution Time - Arrival Time (AT)
 * - CPU Utilization (%)   = (Total CPU Busy Time / Total Simulation Time) * 100
 * - Throughput            = Total Processes Completed / Total Simulation Time
 */

// High-Contrast Process Palette (NO RED, NO ORANGE) - Emerald, Azure Blue, Royal Purple, Sunburst Gold, Cyan, Lime, Fuchsia, Indigo
export const PROCESS_COLORS = [
  { bg: 'linear-gradient(135deg, #00b87c 0%, #047857 100%)', border: '#52e0b1', text: '#ffffff', name: 'Emerald Mint', glow: 'rgba(0, 184, 124, 0.45)' },  // P1
  { bg: 'linear-gradient(135deg, #00a8e8 0%, #0284c7 100%)', border: '#66d3ff', text: '#ffffff', name: 'Vivid Azure', glow: 'rgba(0, 168, 232, 0.45)' },  // P2
  { bg: 'linear-gradient(135deg, #8338ec 0%, #6b21a8 100%)', border: '#b982ff', text: '#ffffff', name: 'Royal Purple', glow: 'rgba(131, 56, 236, 0.45)' }, // P3
  { bg: 'linear-gradient(135deg, #ffc700 0%, #ca8a04 100%)', border: '#ffe066', text: '#000000', name: 'Sunburst Gold', glow: 'rgba(255, 199, 0, 0.45)' },// P4
  { bg: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)', border: '#67e8f9', text: '#ffffff', name: 'Electric Cyan', glow: 'rgba(6, 182, 212, 0.45)' }, // P5
  { bg: 'linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)', border: '#bef264', text: '#000000', name: 'Neon Lime', glow: 'rgba(132, 204, 22, 0.45)' },   // P6
  { bg: 'linear-gradient(135deg, #d946ef 0%, #a21caf 100%)', border: '#f0abfc', text: '#ffffff', name: 'Fuchsia Magenta', glow: 'rgba(217, 70, 239, 0.45)' },// P7
  { bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', border: '#a5b4fc', text: '#ffffff', name: 'Deep Indigo', glow: 'rgba(99, 102, 241, 0.45)' },  // P8
];

/**
 * Get color for a process by index
 */
export function getProcessColor(index) {
  return PROCESS_COLORS[index % PROCESS_COLORS.length];
}

/**
 * Calculate overall summary metrics from individual process statistics
 */
export function calculateSummaryMetrics(processStats, timeline) {
  if (!processStats || processStats.length === 0) {
    return {
      avgWT: 0,
      avgTAT: 0,
      avgRT: 0,
      cpuUtilization: 0,
      throughput: 0,
      totalDuration: 0,
      totalIdleTime: 0,
      totalBusyTime: 0,
    };
  }

  const count = processStats.length;
  const totalWT = processStats.reduce((acc, p) => acc + (p.wt || 0), 0);
  const totalTAT = processStats.reduce((acc, p) => acc + (p.tat || 0), 0);
  const totalRT = processStats.reduce((acc, p) => acc + (p.rt || 0), 0);

  const minAT = Math.min(...processStats.map(p => p.arrivalTime));
  const maxCT = Math.max(...processStats.map(p => p.ct));
  const startTime = timeline.length > 0 ? timeline[0].startTime : minAT;
  const endTime = timeline.length > 0 ? timeline[timeline.length - 1].endTime : maxCT;
  const totalDuration = Math.max(0, endTime - startTime);

  const totalIdleTime = timeline
    .filter(block => block.isIdle)
    .reduce((acc, block) => acc + (block.endTime - block.startTime), 0);

  const totalBusyTime = totalDuration - totalIdleTime;
  const cpuUtilization = totalDuration > 0 ? (totalBusyTime / totalDuration) * 100 : 0;
  const throughput = totalDuration > 0 ? count / totalDuration : 0;

  return {
    avgWT: parseFloat((totalWT / count).toFixed(2)),
    avgTAT: parseFloat((totalTAT / count).toFixed(2)),
    avgRT: parseFloat((totalRT / count).toFixed(2)),
    cpuUtilization: parseFloat(cpuUtilization.toFixed(2)),
    throughput: parseFloat(throughput.toFixed(3)),
    totalDuration,
    totalIdleTime,
    totalBusyTime,
  };
}

/**
 * Natural alphabetical tie-breaker comparison for PID strings
 */
export function comparePid(pidA, pidB) {
  return pidA.localeCompare(pidB, undefined, { numeric: true, sensitivity: 'base' });
}
