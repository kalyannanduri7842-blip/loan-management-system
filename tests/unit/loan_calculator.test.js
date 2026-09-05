import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEmi, generateEmiSchedule, assessCreditEligibility } from '../../backend/utils/loanCalculator.js';

test('Fintech Loan Calculator & Amortization Tests', async (t) => {
  await t.test('1. Calculates accurate monthly EMI for standard loans', () => {
    // Principal: 100,000, Rate: 12% p.a., Tenure: 12 months
    const emi = calculateEmi(100000, 12, 12);
    assert.ok(emi > 8800 && emi < 8900);
    assert.equal(Math.round(emi), 8885);
  });

  await t.test('2. Generates complete month-by-month EMI schedule with balances', () => {
    const schedule = generateEmiSchedule('loan-101', 120000, 10, 12, '2026-01-01');
    assert.equal(schedule.length, 12);
    assert.equal(schedule[0].emiNumber, 1);
    assert.equal(schedule[11].emiNumber, 12);
    assert.ok(schedule[11].remainingBalance <= 1); // Fully amortized
  });

  await t.test('3. Evaluates credit eligibility and debt-to-income ratio (DTI)', () => {
    const result = assessCreditEligibility(80000, 10000, 200000, 24, 750);
    assert.equal(result.eligibilityStatus, 'ELIGIBLE');
    assert.ok(result.dtiRatio < 50);
    assert.equal(result.creditScore, 750);
  });
});
