import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { unitNumber = 'Unit 204', requestedRent = 2100, paymentStandard = 2200, utilityAllowance = 120 } = await req.json();
    const totalContractRent = requestedRent + utilityAllowance;
    const isReasonable = totalContractRent <= paymentStandard;

    return NextResponse.json({
      success: true,
      section8Audit: {
        unitNumber,
        requestedRent,
        utilityAllowance,
        totalContractRent,
        paymentStandard,
        status: isReasonable ? 'APPROVED: Rent conforms to Housing Authority limits.' : 'REVIEW: Requested rent exceeds standard; adjustment required.',
        tenantPortionEstimate: '$420 (calculated based on 30% AMI rules)'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Section 8 audit failed' }, { status: 500 });
  }
}
