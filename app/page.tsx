"use client";

import { useState } from "react";

const ENDPOINTS = [
  { name: "SubBids Engine", path: "/api/sub-bids-engine", defaultPayload: '{\n  "trade": "Electrical",\n  "bids": [\n    { "contractor": "Apex Electric", "amount": 45000 },\n    { "contractor": "BuildCorp", "amount": 48500 }\n  ]\n}' },
  { name: "Escrow Tracker", path: "/api/escrow-tracker", defaultPayload: '{\n  "propertyAddress": "725 S Spring St",\n  "inspectionDaysRemaining": 2,\n  "loanContingencyDaysRemaining": 6\n}' },
  { name: "Lien Watcher", path: "/api/lien-watcher", defaultPayload: '{\n  "projectAddress": "123 Desert View Rd",\n  "daysSinceLastPayment": 42,\n  "preliminaryNoticeFiled": true\n}' },
  { name: "Section 8 Audit", path: "/api/section8-compliance", defaultPayload: '{\n  "unitNumber": "Simone Apts 402",\n  "requestedRent": 2100,\n  "paymentStandard": 2200,\n  "utilityAllowance": 120\n}' },
  { name: "Digital Twin Spec", path: "/api/digital-twin-spec", defaultPayload: '{\n  "facilityName": "Eon Triplex Labs",\n  "squareFootage": 3200,\n  "sensorNodesCount": 16\n}' },
  { name: "InvoiceDiff AI", path: "/api/invoice-diff", defaultPayload: '{\n  "estimateTotal": 50000,\n  "actualInvoiceTotal": 58000\n}' },
  { name: "DesignBrand Kit", path: "/api/design-brand-kit", defaultPayload: '{\n  "brandName": "Eon Triplex Labs",\n  "primaryColor": "#2563eb"\n}' },
  { name: "RFI Automated", path: "/api/rfi-automate", defaultPayload: '{\n  "fieldNotes": "Missing conduit detail on grid line C4.",\n  "contractor": "Apex Electric"\n}' },
  { name: "ZoneSetback Calc", path: "/api/zone-setback", defaultPayload: '{\n  "zoningCode": "R3-1",\n  "lotWidthFt": 60,\n  "lotDepthFt": 120\n}' },
  { name: "CAM Audit", path: "/api/cam-audit", defaultPayload: '{\n  "baseYearCam": 10000,\n  "currentCamBilled": 13200,\n  "capPercentage": 5\n}' },
  { name: "Compliance Vault", path: "/api/compliance-vault", defaultPayload: '{\n  "vendorName": "Apex Roofing LLC",\n  "expirationDate": "2026-08-15"\n}' },
  { name: "Churn Recover", path: "/api/churn-recover", defaultPayload: '{\n  "customerName": "Sarah Jenkins",\n  "failedAmount": 149,\n  "daysPastDue": 5\n}' },
  { name: "Dwell8 Underwrite", path: "/api/dwell8-underwrite", defaultPayload: '{\n  "purchasePrice": 450000,\n  "renoCost": 75000,\n  "afterRepairValue": 650000,\n  "monthlyRent": 4200\n}' },
  { name: "ZoneCheck API", path: "/api/zone-check", defaultPayload: '{\n  "address": "725 S Spring St",\n  "zoningCode": "C2-4D"\n}' },
  { name: "SpecExtract AI", path: "/api/spec-extract", defaultPayload: '{\n  "blueprintText": "Foundation details require 4000 PSI concrete slab."\n}' },
  { name: "PropLease Audit", path: "/api/prop-lease-audit", defaultPayload: '{\n  "leaseText": "Standard NNN lease agreement with CAM charges.",\n  "baseRent": 6500\n}' },
  { name: "Audit Lease API", path: "/api/audit-lease", defaultPayload: '{\n  "tenantName": "John Doe",\n  "monthlyIncome": 2500,\n  "contractRent": 1800\n}' },
  { name: "Parse Sub Bid API", path: "/api/parse-sub-bid", defaultPayload: '{\n  "bidText": "Proposal for framing and drywall. Total cost $45,000.",\n  "trade": "Drywall"\n}' },
  { name: "Permit Flow API", path: "/api/permit-flow", defaultPayload: '{\n  "projectType": "Triplex",\n  "valuation": 450000\n}' },
  { name: "Extract Specs API", path: "/api/extract-specs", defaultPayload: '{\n  "rawText": "Section 03 30 00 Cast-in-Place Concrete."\n}' }
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
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#fff" }}>Aura8 & Dwell8 Command Center</h1>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>Live API Testing Dashboard &bull; 20 Active Micro-SaaS Endpoints (Sweet Spot Ceiling)</p>
        
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.path}
              onClick={() => { setActiveTab(ep); setPayload(ep.defaultPayload); setResponse(null); }}
              style={{
                padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px",
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
            <div style={{ height: "360px", background: "$020617", color: "#38bdf8", padding: "1rem", borderRadius: "8px", border: "1px solid #334155", overflowY: "auto", fontFamily: "monospace", fontSize: "14px", backgroundColor: "#020617" }}>
              {response ? <pre>{JSON.stringify(response, null, 2)}</pre> : <span style={{ color: "#475569" }}>Awaiting execution...</span>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
