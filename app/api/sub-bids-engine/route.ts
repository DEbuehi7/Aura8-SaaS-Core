import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { trade = 'Electrical', bids = [{ contractor: 'Apex', amount: 45000 }, { contractor: 'BuildCorp', amount: 48500 }] } = await req.json();
    const lowestBid = bids.reduce((min: any, b: any) => b.amount < min.amount ? b : min, bids[0]);

    return NextResponse.json({
      success: true,
      subBidsAnalysis: {
        trade,
        totalBidsReceived: bids.length,
        recommendedAward: lowestBid,
        comparisonMatrix: bids,
        recommendation: `Award contract to ${lowestBid.contractor} at $${lowestBid.amount.toLocaleString()} to optimize project margin.`
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Sub-bids analysis failed' }, { status: 500 });
  }
}
