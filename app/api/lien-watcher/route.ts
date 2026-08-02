import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { projectAddress = '123 Desert View Rd', daysSinceLastPayment = 45, preliminaryNoticeFiled = true } = await req.json();

    const riskLevel = daysSinceLastPayment > 30 && preliminaryNoticeFiled ? 'HIGH - LIEN FILING WINDOW OPEN' : 'LOW - COMPLIANT';

    return NextResponse.json({
      success: true,
      lienWatcher: {
        projectAddress,
        daysSinceLastPayment,
        preliminaryNoticeFiled,
        riskLevel,
        recommendation: riskLevel.includes('HIGH') ? 'Issue joint check or obtain conditional lien waiver immediately to avoid mechanic lien.' : 'No immediate lien risk detected.'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Lien check failed' }, { status: 500 });
  }
}
