import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { tenantName = 'Resident', monthlyIncome, contractRent, utilityAllowance = 0, isHACLAPBV = true } = await req.json();
    if (monthlyIncome === undefined || contractRent === undefined) return NextResponse.json({ success: false, error: 'monthlyIncome and contractRent required.' }, { status: 400 });

    const targetTenantShare = Math.round(monthlyIncome * 0.30);
    const calculatedTenantRent = Math.max(50, targetTenantShare - utilityAllowance);
    const calculatedHAPSubsidy = Math.max(0, contractRent - calculatedTenantRent);

    return NextResponse.json({
      success: true,
      audit: {
        tenantName, isHACLAPBV,
        financials: { monthlyIncome, contractRent, calculatedTenantShare: calculatedTenantRent, calculatedHAPSubsidy },
        complianceStatus: calculatedTenantRent < 50 ? 'REVIEW_REQUIRED' : 'COMPLIANT'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Lease audit failed' }, { status: 500 });
  }
}
