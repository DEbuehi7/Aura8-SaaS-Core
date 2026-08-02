import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { bidText, trade = 'General Construction' } = await req.json();
    if (!bidText) return NextResponse.json({ success: false, error: 'bidText string is required.' }, { status: 400 });

    const prices = bidText.match(/\$\s?[0-9,]+(\.[0-9]{2})?/g) || [];
    const numericPrices = prices.map((p: string) => parseFloat(p.replace(/[\$,\s]/g, '')));
    const totalBidAmount = numericPrices.length > 0 ? Math.max(...numericPrices) : 0;

    return NextResponse.json({
      success: true,
      parsedBid: {
        tradeCategory: trade, totalBidAmount,
        complianceCheck: { hasCSLBLicenseMention: /CSLB|License|#\s?[0-9]+/i.test(bidText) }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Subcontractor bid parsing failed' }, { status: 500 });
  }
}
