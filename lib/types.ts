export type Action = "data_export" | "financial_transfer" | "tool_execution" | "database_query" | "content_generation" | "credential_access";
export type Outcome = "AUTHORIZED" | "FLAGGED" | "BLOCKED";
export type AgentId = "atlas" | "nexus" | "oracle" | "vector" | "helios";
export interface Agent { id: AgentId; name: string; role: string; baselineTrust: number; }
export interface EventRecord { id: string; timestamp: string; agentId: AgentId; action: Action; payload: string; risk: number; confidence: number; outcome: Outcome; reasons: string[]; }
export interface Alert { id: string; eventId: string; timestamp: string; agentId: AgentId; action: Action; risk: number; acknowledged: boolean; message: string; }
export interface PolicyWeights { actions: Record<Action, number>; keywords: Record<string, number>; trust: Record<AgentId, number>; }
export interface Settings { threshold: number; protocol: "Strict (Zero Trust)" | "Moderate (Flag & Log)" | "Permissive (Audit Only)"; simulation: boolean; autoGenerate: boolean; }
export interface EvaluateRequest { agentId: AgentId; action: Action; payload: string; settings?: Pick<Settings, "threshold" | "protocol" | "simulation">; weights?: PolicyWeights; }
export interface EvaluateResponse { risk: number; confidence: number; outcome: Outcome; reasons: string[]; pipeline: string[]; }
