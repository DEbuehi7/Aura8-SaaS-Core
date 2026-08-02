import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { propertyAddress = '725 S Spring St', openingDate = '2026-06-01', inspectionDaysRemaining = 3, loanContingencyDaysRemaining = 7 } = await req.json();

    let status = 'ACTIVE ESCROW';
    if (inspectionDaysRemaining <= 2 || loanContingencyDaysRemaining <= 3) {
      status = 'URGENT: CONTINGENCY DEADLINE APPROACHING';
    }

    return NextResponse.json({
      success: true,
      escrowTracker: {
        propertyAddress,
        openingDate,
        contingencies: {
          inspectionDaysRemaining,
          loanContingencyDaysRemaining
        },
        status,
        actionItem: inspectionDaysRemaining <= 2 ? 'Sign off or extend physical inspection contingency immediately.' : 'All contingencies within normal timeline.'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Escrow tracking failed' }, { status: 500 });
  }
}
