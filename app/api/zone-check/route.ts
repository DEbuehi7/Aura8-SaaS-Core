import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { address, zoningCode, lotSizeSqFt = 7500 } = await req.json();
    if (!zoningCode) return NextResponse.json({ success: false, error: 'zoningCode is required.' }, { status: 400 });

    const codeUpper = zoningCode.toUpperCase();
    const isCommercialC2 = codeUpper.includes('C2');
    const densitySqFtPerUnit = isCommercialC2 ? 400 : 800;
    const baseAllowedUnits = Math.floor(lotSizeSqFt / densitySqFtPerUnit);
    const baseFAR = codeUpper.includes('2D') || codeUpper.includes('4D') ? 3.0 : 1.5;
    
    return NextResponse.json({
      success: true,
      data: {
        address: address || 'Los Angeles, CA',
        zoningCode: codeUpper,
        lotSizeSqFt,
        baseFAR,
        maxBuildableSqFt: lotSizeSqFt * baseFAR,
        baseAllowedUnits,
        tocTier3Potential: { maxUnitsWithTOC: Math.floor(baseAllowedUnits * 1.70) }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to process zone check' }, { status: 500 });
  }
}
