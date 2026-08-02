import { NextResponse } from 'next/server';

interface AuditLeasePayload {
  tenantName?: string;
  monthlyIncome: number;
  contractRent: number;
  tenantShare?: number;
  utilityAllowance?: number;
  isHACLAPBV?: boolean;
}

export async function POST(req: Request) {
  try {
    const body: AuditLeasePayload = await req.json();
    const {
      tenantName = 'Resident',
      monthlyIncome,
      contractRent,
      utilityAllowance = 0,
      isHACLAPBV = true
    } = body;

    if (monthlyIncome === undefined || contractRent === undefined) {
      return NextResponse.json(
        { success: false, error: 'monthlyIncome and contractRent are required.' },
        { status: 400 }
      );
    }

    // HACLA PBV Standard: Participant portion capped at 30% adjusted monthly income
    const targetTenantShare = Math.round(monthlyIncome * 0.30);
    // HACLA establishes a minimum rent of $50
    const calculatedTenantRent = Math.max(50, targetTenantShare - utilityAllowance);
    const calculatedHAPSubsidy = Math.max(0, contractRent - calculatedTenantRent);

    const auditFindings = [];
    if (calculatedTenantRent < 50) {
      auditFindings.push('Tenant portion falls below HACLA $50 minimum rent threshold.');
    }
    if (contractRent > 3500) {
      auditFindings.push('Contract rent exceeds Standard Payment Standard. Requires rent reasonableness review.');
    }

    return NextResponse.json({
      success: true,
      audit: {
        tenantName,
        isHACLAPBV,
        financials: {
          adjustedMonthlyIncome: monthlyIncome,
          contractRent,
          utilityAllowance,
          calculatedTenantShare: calculatedTenantRent,
          calculatedHAPSubsidy
        },
        complianceStatus: auditFindings.length === 0 ? 'COMPLIANT' : 'REVIEW_REQUIRED',
        findings: auditFindings,
        requiredForms: [
          'HACLA Move-In Authorization (MIA)',
          'Certificate of Eligibility (COE)',
          'HQS Inspection Approval Document'
        ],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lease audit failed' },
      { status: 500 }
    );
  }
}
