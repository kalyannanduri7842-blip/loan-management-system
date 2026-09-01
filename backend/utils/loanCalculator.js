// Amortization & EMI Financial Calculator Utility

/**
 * Calculate standard reducing balance EMI
 * Formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 * @param {number} principal - Loan Principal Amount
 * @param {number} annualRate - Annual Interest Rate in % (e.g. 12 for 12%)
 * @param {number} tenureMonths - Tenure in months (e.g. 36)
 * @returns {number} Monthly EMI rounded to nearest integer
 */
export function calculateEmi(principal, annualRate, tenureMonths) {
  const p = Number(principal);
  const r = (Number(annualRate) / 12) / 100;
  const n = Number(tenureMonths);

  if (p <= 0 || n <= 0) return 0;
  if (r === 0) return Math.round(p / n);

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

/**
 * Generate full monthly EMI amortization schedule
 * @param {string} loanId - Associated Loan ID
 * @param {number} principal - Loan Principal
 * @param {number} annualRate - Annual Interest Rate %
 * @param {number} tenureMonths - Total tenure in months
 * @param {string} startDateStr - Loan start date (ISO string)
 * @returns {Array} List of EMI schedule records
 */
export function generateEmiSchedule(loanId, principal, annualRate, tenureMonths, startDateStr = new Date().toISOString()) {
  const p = Number(principal);
  const monthlyRate = (Number(annualRate) / 12) / 100;
  const n = Number(tenureMonths);
  const emi = calculateEmi(p, annualRate, n);

  const schedule = [];
  let remainingBalance = p;
  const baseDate = new Date(startDateStr);

  for (let i = 1; i <= n; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    const interestComponent = Math.round(remainingBalance * monthlyRate);
    let principalComponent = emi - interestComponent;

    // For the last month, reconcile remaining balance
    if (i === n || principalComponent > remainingBalance) {
      principalComponent = remainingBalance;
    }

    remainingBalance = Math.max(0, remainingBalance - principalComponent);

    schedule.push({
      id: `emi-${loanId}-${i}`,
      loanId,
      emiNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      emiAmount: principalComponent + interestComponent,
      principalComponent,
      interestComponent,
      remainingBalance,
      paidAmount: 0,
      paidDate: null,
      paymentMethod: null,
      transactionRef: null,
      status: 'UPCOMING' // 'PAID' | 'UPCOMING' | 'OVERDUE'
    });
  }

  return schedule;
}

/**
 * Evaluate Credit & Debt-to-Income Eligibility Score
 * @param {number} monthlyIncome 
 * @param {number} existingEmi 
 * @param {number} requestedAmount 
 * @param {number} tenureMonths 
 * @param {number} creditScore 
 * @returns {object} Assessment results
 */
export function assessCreditEligibility(monthlyIncome, existingEmi = 0, requestedAmount, tenureMonths, creditScore = 750) {
  const income = Number(monthlyIncome) || 1;
  const existing = Number(existingEmi) || 0;
  const estimatedEmi = calculateEmi(requestedAmount, 12, tenureMonths);

  const totalMonthlyDebt = existing + estimatedEmi;
  const dtiRatio = Math.round((totalMonthlyDebt / income) * 100);

  let status = 'ELIGIBLE'; // 'ELIGIBLE' | 'MANUAL_REVIEW' | 'NOT_ELIGIBLE'
  let reason = 'Strong financial profile and healthy credit score.';

  if (creditScore < 600 || dtiRatio > 65) {
    status = 'NOT_ELIGIBLE';
    reason = dtiRatio > 65 ? 'Debt-to-Income ratio exceeds 65% limit.' : 'Credit score is below minimum threshold (600).';
  } else if (creditScore < 700 || dtiRatio > 45) {
    status = 'MANUAL_REVIEW';
    reason = 'Moderate credit score or high existing debt obligations requires senior officer review.';
  }

  return {
    creditScore,
    monthlyIncome: income,
    existingEmi: existing,
    estimatedNewEmi: estimatedEmi,
    totalMonthlyDebt,
    dtiRatio,
    eligibilityStatus: status,
    assessmentNotes: reason
  };
}
