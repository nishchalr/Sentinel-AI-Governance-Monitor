import { defaultWeights } from "./data";
import type { EvaluateRequest, EvaluateResponse } from "./types";

export function evaluate(request: EvaluateRequest): EvaluateResponse {
 const weights = request.weights ?? defaultWeights;
 const normalized = request.payload.toLowerCase();
 const keywordHits = Object.entries(weights.keywords).filter(([key]) => normalized.includes(key));
 const keywordRisk = keywordHits.reduce((sum, [, weight]) => sum + weight, 0);
 const raw = weights.actions[request.action] * 0.62 + Math.min(keywordRisk, 1) * 0.35 + (request.action === "credential_access" ? .08 : 0);
 const risk = Math.max(0.01, Math.min(.99, raw / Math.max(.5, weights.trust[request.agentId])));
 const confidence = Math.min(.99, .72 + normalized.length / 1200 + keywordHits.length * .05);
 const threshold = request.settings?.threshold ?? .85;
 const protocol = request.settings?.protocol ?? "Strict (Zero Trust)";
 const outcome = risk >= threshold ? "BLOCKED" : risk >= threshold * .66 ? "FLAGGED" : "AUTHORIZED";
 const adjusted = protocol === "Permissive (Audit Only)" && outcome === "BLOCKED" ? "FLAGGED" : outcome;
 const reasons = [ `${request.action.replaceAll("_", " ")} base weight ${weights.actions[request.action].toFixed(2)}`, ...keywordHits.map(([k]) => `keyword match: ${k}`), `trust multiplier ${weights.trust[request.agentId].toFixed(2)}x` ];
 return { risk: Number(risk.toFixed(2)), confidence: Number(confidence.toFixed(2)), outcome: adjusted, reasons, pipeline: ["Ingest", "Tokenize", "Embed", "Classify", "Trust Adjust", "Policy Match", "Enforce", "Persist"] };
}
