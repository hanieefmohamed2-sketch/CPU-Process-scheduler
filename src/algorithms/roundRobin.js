import { calculateSummaryMetrics, comparePid } from '../utils/metrics.js';

/**
 * Round Robin (RR) Scheduling Engine
 * 
 * Rules:
 * 1. Preemptive scheduling using a FIFO Ready Queue and configurable Time Quantum (Q).
 * 2. Processes execute for at most `quantum` time units per slice.
 * 3. CRITICAL READY QUEUE RULE:
 *    At time `t`, when a process completes its quantum slice, any NEW processes 
 *    arriving at or before time `t` MUST enter the ready queue BEFORE the quantum-expired 
 *    process is re-queued.
 * 4. Response Time (RT) is calculated at the exact moment the process FIRST gets CPU execution.
 * 
 * @param {Array} rawProcesses - Array of process objects { id, arrivalTime, burstTime }
 * @param {number} timeQuantum - Time quantum (positive integer > 0)
 * @returns {Object} { timeline, processStats, metrics }
 */
export function runRoundRobin(rawProcesses, timeQuantum = 2) {
  const quantum = Math.max(1, Math.floor(Number(timeQuantum) || 2));

  if (!rawProcesses || rawProcesses.length === 0) {
    return { timeline: [], processStats: [], metrics: calculateSummaryMetrics([], []) };
  }

  // Clone processes with numeric AT & BT
  const processes = rawProcesses.map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
  }));

  // Track remaining burst time for each process
  const remBT = new Map();
  processes.forEach(p => remBT.set(p.id, p.burstTime));

  // Track first execution time for Response Time (RT)
  const firstExecTime = new Map();

  // Sort initial pool by arrival time and PID tie-breaker
  let unArrived = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return comparePid(a.id, b.id);
  });

  const readyQueue = [];
  const timeline = [];
  const processStatsMap = new Map();
  let currentTime = 0;

  // Helper to enqueue all processes that arrive at or before `time`
  const enqueueNewArrivals = (time) => {
    const newlyArrived = unArrived.filter(p => p.arrivalTime <= time);
    // Sort newly arrived by arrival time and PID
    newlyArrived.sort((a, b) => {
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }
      return comparePid(a.id, b.id);
    });

    for (const p of newlyArrived) {
      readyQueue.push(p);
    }

    // Remove newly arrived from unArrived list
    unArrived = unArrived.filter(p => p.arrivalTime > time);
  };

  // Enqueue processes arriving at t = 0 (or start time)
  enqueueNewArrivals(0);

  // If no process arrives at t = 0, CPU is IDLE until earliest arrival
  if (readyQueue.length === 0 && unArrived.length > 0) {
    const nextArrival = unArrived[0].arrivalTime;
    timeline.push({
      processId: 'IDLE',
      startTime: currentTime,
      endTime: nextArrival,
      duration: nextArrival - currentTime,
      isIdle: true,
    });
    currentTime = nextArrival;
    enqueueNewArrivals(currentTime);
  }

  while (readyQueue.length > 0 || unArrived.length > 0) {
    // If ready queue is empty but there are un-arrived processes, CPU IDLE gap occurs
    if (readyQueue.length === 0 && unArrived.length > 0) {
      const nextArrival = unArrived[0].arrivalTime;
      if (currentTime < nextArrival) {
        timeline.push({
          processId: 'IDLE',
          startTime: currentTime,
          endTime: nextArrival,
          duration: nextArrival - currentTime,
          isIdle: true,
        });
        currentTime = nextArrival;
      }
      enqueueNewArrivals(currentTime);
      continue;
    }

    const currentProcess = readyQueue.shift();

    // Record first time CPU is assigned to this process
    if (!firstExecTime.has(currentProcess.id)) {
      firstExecTime.set(currentProcess.id, currentTime);
    }

    const currentRemBT = remBT.get(currentProcess.id);
    const execTime = Math.min(currentRemBT, quantum);
    const startTime = currentTime;
    const endTime = currentTime + execTime;

    timeline.push({
      processId: currentProcess.id,
      startTime,
      endTime,
      duration: execTime,
      isIdle: false,
    });

    // Update remaining burst time
    const updatedRemBT = currentRemBT - execTime;
    remBT.set(currentProcess.id, updatedRemBT);
    currentTime = endTime;

    // RULE: Enqueue new arrivals at/before `currentTime` FIRST
    enqueueNewArrivals(currentTime);

    // THEN re-enqueue current process if it still has remaining burst time
    if (updatedRemBT > 0) {
      readyQueue.push(currentProcess);
    } else {
      // Process completed execution
      const ct = currentTime;
      const tat = ct - currentProcess.arrivalTime;
      const wt = tat - currentProcess.burstTime;
      const rt = firstExecTime.get(currentProcess.id) - currentProcess.arrivalTime;

      processStatsMap.set(currentProcess.id, {
        ...currentProcess,
        startTime: firstExecTime.get(currentProcess.id),
        ct,
        tat,
        wt,
        rt,
      });
    }
  }

  const processStats = rawProcesses.map(p => processStatsMap.get(p.id));
  const metrics = calculateSummaryMetrics(processStats, timeline);

  return {
    timeline,
    processStats,
    metrics,
  };
}
