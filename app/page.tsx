"use client";

import { useState } from "react";

const ENDPOINTS = [
  { name: "ZoneCheck API", path: "/api/zone-check", defaultPayload: '{\n  "address": "725 S Spring St",\n  "zoningCode": "C2-4D",\n  "lotSizeSqFt": 10000\n}' },
  { name: "Extract Specs API", path: "/api/extract-specs", defaultPayload: '{\n  "rawText": "Section 03 30 00 Cast-in-Place Concrete. Provide 4000 PSI concrete for spread footings, total 120 CY."\n}' },
  { name: "SpecExtract AI", path: "/api/spec-extract", defaultPayload: '{\n  "blueprintText": "Foundation details require 4000 PSI concrete slab and heavy wood framing studs."\n}' },
  { name: "PropLease Audit", path: "/api/prop-lease-audit", defaultPayload: '{\n  "leaseText": "Standard NNN lease agreement with CAM charges and landlord demolition clause.",\n  "baseRent": 6500,\n  "camCharges": 1200\n}' },
  { name: "Audit Lease API", path: "/api/audit-lease", defaultPayload: '{\n  "tenantName": "John Doe",\n  "monthlyIncome": 2500,\n  "contractRent": 1800,\n  "utilityAllowance": 75\n}' },
  { name: "Parse Sub Bid API", path: "/api/parse-sub-bid", defaultPayload: '{\n  "bidText": "Proposal for framing and drywall. Total cost $45,000. CSLB #987654. Includes workers comp.",\n  "trade": "Drywall & Framing"\n}' },
  { name: "Permit Flow API", path: "/api/permit-flow", defaultPayload: '{\n  "projectType": "Triplex",\n  "valuation": 450000,\n  "sqFt": 3200\n}' }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(ENDPOINTS[0]);
  const [payload, setPayload] = useState(ENDPOINTS[0].defaultPayload);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(activeTab.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", background: "#0f172a", color: "#e2e8f0", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#fff" }}>Aura8 Command Center</h1>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>Live API Testing Dashboard &bull; 7 Active Endpoints</p>
        
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.path}
              onClick={() => { setActiveTab(ep); setPayload(ep.defaultPayload); setResponse(null); }}
              style={{
                padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "bold",
                background: activeTab.path === ep.path ? "#3b82f6" : "#1e293b",
                color: activeTab.path === ep.path ? "#fff" : "#94a3b8",
                border: "1px solid #334155"
              }}
            >
              {ep.name}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>Request: {activeTab.path}</h2>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              style={{ width: "100%", height: "300px", background: "#1e293b", color: "#10b981", padding: "1rem", borderRadius: "8px", border: "1px solid #334155", fontFamily: "monospace", fontSize: "14px" }}
            />
            <button
              onClick={handleTest}
              disabled={loading}
              style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", width: "100%" }}
            >
              {loading ? "Running..." : "Execute API Call"}
            </button>
          </div>

          <div>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#fff" }}>Response</h2>
            <div style={{ height: "360px", background: "#020617", color: "#38bdf8", padding: "1rem", borderRadius: "8px", border: "1px solid #334155", overflowY: "auto", fontFamily: "monospace", fontSize: "14px" }}>
              {response ? <pre>{JSON.stringify(response, null, 2)}</pre> : <span style={{ color: "#475569" }}>Awaiting execution...</span>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}