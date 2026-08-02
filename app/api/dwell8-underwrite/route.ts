import { NextResponse } from 'next/server';

function calculateBRRRR({
  purchasePrice,
  renoCost,
  afterRepairValue,
  monthlyRent,
  propertyTaxesMonthly,
  insuranceMonthly,
  propertyManagementMonthly = 0
}: {
  purchasePrice: number;
  renoCost: number;
  afterRepairValue: number;
  monthlyRent: number;
  propertyTaxesMonthly: number;
  insuranceMonthly: number;
  propertyManagementMonthly: number;
}) {
  const totalInvestment = purchasePrice + renoCost;
  const maxRefinanceLoan = afterRepairValue * 0.75; // 75% LTV cash-out refinance
  const capitalLeftInDeal = Math.max(0, totalInvestment - maxRefinanceLoan);
  
  const operatingExpenses = propertyTaxesMonthly + insuranceMonthly + propertyManagementMonthly;
  const netOperatingIncome = (monthlyRent - operatingExpenses) * 12;
  const estimatedDebtService = (maxRefinanceLoan * 0.07); // Assuming 7% interest approximation
  const annualCashFlow = netOperatingIncome - estimatedDebtService;
  
  const cashOnCashReturn = capitalLeftInDeal > 0 ? (annualCashFlow / capitalLeftInDeal) * 100 : 999;

  return {
    totalInvestment,
    maxRefinanceLoan,
    capitalLeftInDeal,
    annualCashFlow: Math.round(annualCashFlow),
    cashOnCashReturn: Number(cashOnCashReturn.toFixed(2))
  };
}

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
