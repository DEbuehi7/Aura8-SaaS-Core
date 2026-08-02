// dwell8-engine/api/underwrite.ts
export function calculateBRRRR({
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
  const estimatedDebtService = (maxRefinanceLoan * 0.07) / 12 * 12; // Assuming 7% interest-only or P&I approximation
  const annualCashFlow = netOperatingIncome - estimatedDebtService;
  
  const cashOnCashReturn = capitalLeftInDeal > 0 ? (annualCashFlow / capitalLeftInDeal) * 100 : 999; // Infinite return if all cash pulled out

  return {
    totalInvestment,
    maxRefinanceLoan,
    capitalLeftInDeal,
    annualCashFlow,
    cashOnCashReturn: Number(cashOnCashReturn.toFixed(2))
  };
}