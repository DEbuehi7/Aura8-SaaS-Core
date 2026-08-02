import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { baseYearCam = 12000, currentCamBilled = 15500, capPercentage = 5 } = await req.json();
    const maxAllowedCam = baseYearCam * (1 + capPercentage / 100);
    const overage = Math.max(0, currentCamBilled - maxAllowedCam);

    return NextResponse.json({
      success: true,
      camAudit: {
        baseYearCam,
        currentCamBilled,
        maxAllowedCamWithCap: maxAllowedCam,
        overageDetected: overage,
        status: overage > 0 ? 'AUDIT DISCREPANCY: Landlord over billed CAM charges.' : 'CAM charges within contractual cap limits.'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'CAM audit failed' }, { status: 500 });
  }
}
