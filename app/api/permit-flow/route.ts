import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { projectType = 'Triplex', valuation = 250000, sqFt = 1800 } = await req.json();
    const estimatedPermitFee = Math.round(valuation * 0.022);
    const estimatedSchoolFee = projectType !== 'Commercial' ? Math.round(sqFt * 4.79) : 0;

    return NextResponse.json({
      success: true,
      permitPlan: {
        projectType, valuation, squareFootage: sqFt,
        estimatedFees: { ladbsPlanCheckFee: estimatedPermitFee, lausdSchoolFee: estimatedSchoolFee, total: estimatedPermitFee + estimatedSchoolFee },
        targetTimelineWeeks: projectType === 'ADU' ? 6 : 14
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Permit workflow calculation failed' }, { status: 500 });
  }
}
