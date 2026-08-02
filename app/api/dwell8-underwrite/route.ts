import { NextResponse } from 'next/server';
import { calculateBRRRR } from '@/dwell8-engine/api/underwrite';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      purchasePrice = 450000,
      renoCost = 75000,
      afterRepairValue = 650000,
      monthlyRent = 4200,
      propertyTaxesMonthly = 450,
      insuranceMonthly = 150,
      propertyManagementMonthly = 210
    } = body;

    const metrics = calculateBRRRR({
      purchasePrice,
      renoCost,
      afterRepairValue,
      monthlyRent,
      propertyTaxesMonthly,
      insuranceMonthly,
      propertyManagementMonthly
    });

    return NextResponse.json({
      success: true,
      dwell8Analysis: {
        propertyDetails: { purchasePrice, renoCost, afterRepairValue, monthlyRent },
        financialMetrics: metrics,
        strategy: metrics.cashOnCashReturn > 15 ? 'STRONG BRRRR: High cash-on-cash return with strong equity capture.' : 'REVIEW REQUIRED: Margin tight under current financing terms.',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Underwriting failed' }, { status: 500 });
  }
}
