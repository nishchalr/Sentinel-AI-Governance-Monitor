"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { actions, defaultWeights, seedEvents } from "@/lib/data";
import type { Action, AgentId, Alert, EvaluateResponse, EventRecord, PolicyWeights, Settings } from "@/lib/types";

interface SentinelState { events: EventRecord[]; alerts: Alert[]; settings: Settings; weights: PolicyWeights; evaluate: (agentId: AgentId, action: Action, payload: string) => Promise<EventRecord | null>; acknowledge: (id: string) => void; acknowledgeAll: () => void; wipe: () => void; setSettings: (next: Partial<Settings>) => void; setWeights: (next: PolicyWeights) => void; }
const Context = createContext<SentinelState | null>(null);
const key = "sentinel-governance-state-v1";
const initialSettings: Settings = { threshold: .85, protocol: "Strict (Zero Trust)", simulation: true, autoGenerate: false };

export function SentinelProvider({ children }: { children: React.ReactNode }) {
 const [events, setEvents] = useState<EventRecord[]>(seedEvents);
 const [alerts, setAlerts] = useState<Alert[]>([]);
 const [settings, setSettingsState] = useState<Settings>(initialSettings);
 const [weights, setWeights] = useState<PolicyWeights>(defaultWeights);
 const [ready, setReady] = useState(false);
 useEffect(() => { const stored = localStorage.getItem(key); if (stored) { try { const saved = JSON.parse(stored) as { events: EventRecord[]; alerts: Alert[]; settings: Settings; weights: PolicyWeights }; setEvents(saved.events ?? seedEvents); setAlerts(saved.alerts ?? []); setSettingsState(saved.settings ?? initialSettings); setWeights(saved.weights ?? defaultWeights); } catch { /* retain safe defaults */ } } setReady(true); }, []);
 useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify({ events, alerts, settings, weights })); }, [events, alerts, settings, weights, ready]);
 const setSettings = useCallback((next: Partial<Settings>) => setSettingsState(current => ({ ...current, ...next })), []);
 const evaluate = useCallback(async (agentId: AgentId, action: Action, payload: string) => {
  try { const response = await fetch("/api/evaluate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ agentId, action, payload, settings, weights }) }); if (!response.ok) return null;
   const result = await response.json() as EvaluateResponse;
   const event: EventRecord = { id: crypto.randomUUID(), timestamp: new Date().toISOString(), agentId, action, payload, ...result };
   setEvents(current => [event, ...current].slice(0, 250));
   if (event.outcome !== "AUTHORIZED") setAlerts(current => [{ id: crypto.randomUUID(), eventId: event.id, timestamp: event.timestamp, agentId, action, risk: event.risk, acknowledged: false, message: `${event.outcome}: ${event.reasons[0]}` }, ...current].slice(0, 100));
   return event;
  } catch { return null; }
 }, [settings, weights]);
 useEffect(() => { if (!settings.autoGenerate) return; const timer = window.setInterval(() => { const ids: AgentId[] = ["atlas", "nexus", "oracle", "vector", "helios"]; const action = actions[Math.floor(Math.random() * actions.length)]; const agent = ids[Math.floor(Math.random() * ids.length)]; void evaluate(agent, action, JSON.stringify({ source: "synthetic-telemetry", sequence: Date.now(), request: "routine operational task" })); }, 4000); return () => clearInterval(timer); }, [settings.autoGenerate, evaluate]);
 const value = useMemo(() => ({ events, alerts, settings, weights, evaluate, acknowledge: (id: string) => setAlerts(a => a.map(x => x.id === id ? { ...x, acknowledged: true } : x)), acknowledgeAll: () => setAlerts(a => a.map(x => ({ ...x, acknowledged: true }))), wipe: () => { setEvents([]); setAlerts([]); }, setSettings, setWeights }), [events, alerts, settings, weights, evaluate, setSettings]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useSentinel = () => { const context = useContext(Context); if (!context) throw new Error("useSentinel must be used inside SentinelProvider"); return context; };
