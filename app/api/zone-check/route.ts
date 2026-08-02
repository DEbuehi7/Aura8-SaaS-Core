import { NextResponse } from 'next/server';

interface ZoneCheckPayload {
  address: string;
  zoningCode: string;
  lotSizeSqFt?: number;
}

export async function POST(req: Request) {
  try {
    const body: ZoneCheckPayload = await req.json();
    const { address, zoningCode, lotSizeSqFt = 7500 } = body;

    if (!zoningCode) {
      return NextResponse.json(
        { success: false, error: 'zoningCode is required.' },
        { status: 400 }
      );
    }

    const codeUpper = zoningCode.toUpperCase();
    const isCommercialC2 = codeUpper.includes('C2');
    
    // Default C2 zone in LA permits R4 residential density (400 sq ft per unit)
    const densitySqFtPerUnit = isCommercialC2 ? 400 : 800;
    const baseAllowedUnits = Math.floor(lotSizeSqFt / densitySqFtPerUnit);
    
    // Floor Area Ratio (FAR) evaluation (e.g. Height District 1 vs 2)
    const baseFAR = codeUpper.includes('2D') || codeUpper.includes('4D') ? 3.0 : 1.5;
    const maxBuildableSqFt = lotSizeSqFt * baseFAR;

    // Transit Oriented Communities (TOC) Incentive tier simulation
    const tocTier3BonusPercent = 0.70; // 70% density bonus
    const tocMaxUnits = Math.floor(baseAllowedUnits * (1 + tocTier3BonusPercent));

    return NextResponse.json({
      success: true,
      data: {
        address: address || 'Los Angeles, CA',
        zoningCode: codeUpper,
        lotSizeSqFt,
        baseFAR,
        maxBuildableSqFt,
        baseAllowedUnits,
        tocTier3Potential: {
          densityBonusPercent: '70%',
          maxUnitsWithTOC: tocMaxUnits,
          incentives: ['Height increase (+11 ft)', 'Reduced side setbacks', '0.5 parking spaces/unit']
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process zone check' },
      { status: 500 }
    );
  }
}
