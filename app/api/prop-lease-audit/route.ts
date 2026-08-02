import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { leaseText, baseRent = 5000, camCharges = 800 } = await req.json();

    const hasTripleNet = /triple net|nnn|cam|operating expenses/i.test(leaseText || '');
    const hasDemolitionClause = /demolition clause|early termination|relocation/i.test(leaseText || '');

    const totalMonthlyCost = Number(baseRent) + Number(camCharges);

    return NextResponse.json({
      success: true,
      leaseAudit: {
        financialSummary: {
          monthlyBaseRent: baseRent,
          monthlyCAMCharges: camCharges,
          totalMonthlyObligation: totalMonthlyCost,
          annualizedCommitment: totalMonthlyCost * 12
        },
        riskFlags: {
          isTripleNet: hasTripleNet,
          hasLandlordDemolitionClause: hasDemolitionClause,
          camAuditRightIncluded: /audit right|inspect books/i.test(leaseText || '')
        },
        recommendation: hasDemolitionClause ? 'HIGH RISK: Review relocation/demolition clause with real estate counsel.' : 'STANDARD: Favorable lease structure.',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Lease audit failed' }, { status: 500 });
  }
}
