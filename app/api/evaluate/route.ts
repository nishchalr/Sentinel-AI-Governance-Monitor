import { NextResponse } from "next/server";
import { evaluate } from "@/lib/scoring";
import type { EvaluateRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json() as EvaluateRequest;
    if (!body.agentId || !body.action || typeof body.payload !== "string") return NextResponse.json({ error: "agentId, action, and payload are required" }, { status: 400 });
    const external = process.env.EXTERNAL_FASTAPI_URL;
    if (external && body.settings?.simulation === false) {
      const upstream = await fetch(external, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
      if (upstream.ok) return NextResponse.json(await upstream.json());
    }
    return NextResponse.json(evaluate(body));
  } catch { return NextResponse.json({ error: "Unable to evaluate payload" }, { status: 400 }); }
}
