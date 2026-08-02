import { NextResponse } from 'next/server';

interface PermitFlowPayload {
  projectType: 'ADU' | 'MultiFamily' | 'Commercial' | 'Triplex';
  valuation: number;
  sqFt: number;
}

export async function POST(req: Request) {
  try {
    const body: PermitFlowPayload = await req.json();
    const { projectType = 'Triplex', valuation = 250000, sqFt = 1800 } = body;

    // Estimate LADBS Plan Check & Plan Review Fees
    const estimatedPermitFee = Math.round(valuation * 0.022); // ~2.2% plan check + permit
    const estimatedSchoolFee = projectType !== 'Commercial' ? Math.round(sqFt * 4.79) : 0; // LAUSD developer fee per sqft

    const reviewMilestones = [
      { step: 1, department: 'LADBS Zoning', requirement: 'Zoning & Setback Verification' },
      { step: 2, department: 'LADBS Building', requirement: 'Structural & Title 24 Energy Compliance' },
      { step: 3, department: 'LA Sanitation', requirement: 'Sewer Capacity Availability Review (SCAR)' }
    ];

    if (projectType === 'MultiFamily' || projectType === 'Triplex') {
      reviewMilestones.push({
        step: 4,
        department: 'LAFD Fire Prevention',
        requirement: 'Hydrant Flow Test & Fire Access Review'
      });
    }

    return NextResponse.json({
      success: true,
      permitPlan: {
        projectType,
        valuation,
        squareFootage: sqFt,
        estimatedFees: {
          ladbsPlanCheckFee: estimatedPermitFee,
          lausdSchoolFee: estimatedSchoolFee,
          totalEstimatedFees: estimatedPermitFee + estimatedSchoolFee
        },
        agencyWorkflow: reviewMilestones,
        targetTimelineWeeks: projectType === 'ADU' ? 6 : 14,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Permit workflow calculation failed' },
      { status: 500 }
    );
  }
}
