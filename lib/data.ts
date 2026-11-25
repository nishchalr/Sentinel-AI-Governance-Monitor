import type { Action, Agent, AgentId, EventRecord, PolicyWeights } from "./types";

export const agents: Agent[] = [
  { id: "atlas", name: "ATLAS-01", role: "Research Orchestrator", baselineTrust: 1.1 },
  { id: "nexus", name: "NEXUS-04", role: "Customer Operations", baselineTrust: 0.95 },
  { id: "oracle", name: "ORACLE-07", role: "Financial Analyst", baselineTrust: 0.8 },
  { id: "vector", name: "VECTOR-12", role: "Infrastructure Agent", baselineTrust: 0.75 },
  { id: "helios", name: "HELIOS-09", role: "Content Coordinator", baselineTrust: 1.05 }
];
export const actions: Action[] = ["data_export", "financial_transfer", "tool_execution", "database_query", "content_generation", "credential_access"];
export const labelize = (value: string) => value.replaceAll("_", " ").toUpperCase();
export const defaultWeights: PolicyWeights = {
  actions: { data_export: .65, financial_transfer: .92, tool_execution: .72, database_query: .55, content_generation: .2, credential_access: .98 },
  keywords: { "ignore previous": .5, "system prompt": .45, "password": .55, "secret": .4, "delete": .3, "transfer": .35 },
  trust: { atlas: 1.1, nexus: .95, oracle: .8, vector: .75, helios: 1.05 }
};
export const seedEvents: EventRecord[] = [
 { id: "seed-1", timestamp: "2026-11-25T08:13:00.000Z", agentId: "vector", action: "credential_access", payload: '{"target":"production secrets vault","intent":"rotate"}', risk: .94, confidence: .97, outcome: "BLOCKED", reasons: ["credential access risk", "elevated scrutiny"] },
 { id: "seed-2", timestamp: "2026-11-25T08:31:00.000Z", agentId: "oracle", action: "financial_transfer", payload: '{"amount":45000,"destination":"external"}', risk: .81, confidence: .93, outcome: "FLAGGED", reasons: ["financial transfer risk"] },
 { id: "seed-3", timestamp: "2026-11-25T08:49:00.000Z", agentId: "atlas", action: "database_query", payload: '{"query":"SELECT anonymized research data"}', risk: .27, confidence: .88, outcome: "AUTHORIZED", reasons: ["within trusted baseline"] }
];
