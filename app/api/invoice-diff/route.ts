import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { estimateTotal = 50000, actualInvoiceTotal = 58000, lineItems = [] } = await req.json();
    const variance = actualInvoiceTotal - estimateTotal;
    const percentVariance = Number(((variance / estimateTotal) * 100).toFixed(2));

    return NextResponse.json({
      success: true,
      invoiceAudit: {
        estimateTotal,
        actualInvoiceTotal,
        varianceAmount: variance,
        percentVariance,
        status: variance > 0 ? 'OVERCHARGE DETECTED - REVIEW LINE ITEMS' : 'WITHIN ESTIMATE VARIANCE',
        recommendation: variance > 5000 ? 'Flag for project manager review before releasing escrow funds.' : 'Approve for routine payment processing.'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Invoice diff failed' }, { status: 500 });
  }
}
