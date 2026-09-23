/**
 * Proprietary Financial Health Score Engine (0 - 100)
 * 4 Pillars of 25 Points each:
 * 1. Savings Habit (25)
 * 2. Debt Management (25)
 * 3. Credit Behaviour (25)
 * 4. EMI Burden (25)
 */

export function calculateFinancialHealthScore({
  monthlyIncome = 100000,
  monthlyExpenses = 35000,
  existingEmi = 15000,
  savings = 400000,
  creditScore = 760
}) {
  const income = Math.max(1, Number(monthlyIncome));
  const expenses = Number(monthlyExpenses);
  const emi = Number(existingEmi);
  const totalSavings = Number(savings);
  const score = Number(creditScore);

  // 1. Savings Habit (25 pts max)
  // Target: At least 20-30% savings rate and 3-6 months emergency runway
  const monthlySavingsSurplus = Math.max(0, income - (expenses + emi));
  const savingsRate = (monthlySavingsSurplus / income) * 100;
  const emergencyMonths = expenses > 0 ? totalSavings / expenses : 0;

  let savingsHabitScore = 0;
  if (savingsRate >= 30) savingsHabitScore += 15;
  else if (savingsRate >= 20) savingsHabitScore += 12;
  else if (savingsRate >= 10) savingsHabitScore += 8;
  else if (savingsRate > 0) savingsHabitScore += 4;

  if (emergencyMonths >= 6) savingsHabitScore += 10;
  else if (emergencyMonths >= 3) savingsHabitScore += 7;
  else if (emergencyMonths >= 1) savingsHabitScore += 4;
  else savingsHabitScore += 1;
  savingsHabitScore = Math.min(25, savingsHabitScore);

  // 2. Debt Management (25 pts max)
  // DTI without new loan
  const dti = (emi / income) * 100;
  let debtManagementScore = 0;
  if (dti <= 15) debtManagementScore = 25;
  else if (dti <= 25) debtManagementScore = 21;
  else if (dti <= 35) debtManagementScore = 17;
  else if (dti <= 45) debtManagementScore = 12;
  else if (dti <= 55) debtManagementScore = 6;
  else debtManagementScore = 2;

  // 3. Credit Behaviour (25 pts max)
  let creditBehaviourScore = 0;
  if (score >= 800) creditBehaviourScore = 25;
  else if (score >= 760) creditBehaviourScore = 23;
  else if (score >= 720) creditBehaviourScore = 19;
  else if (score >= 680) creditBehaviourScore = 14;
  else if (score >= 640) creditBehaviourScore = 9;
  else creditBehaviourScore = 4;

  // 4. EMI Burden (25 pts max)
  // Burden = existing EMI as percentage of disposable income before EMI
  const netIncomeBeforeEmi = Math.max(1, income - expenses);
  const emiBurdenPercent = (emi / netIncomeBeforeEmi) * 100;

  let emiBurdenScore = 0;
  if (emi === 0) emiBurdenScore = 25;
  else if (emiBurdenPercent <= 25) emiBurdenScore = 23;
  else if (emiBurdenPercent <= 40) emiBurdenScore = 18;
  else if (emiBurdenPercent <= 55) emiBurdenScore = 13;
  else if (emiBurdenPercent <= 70) emiBurdenScore = 7;
  else emiBurdenScore = 2;

  const totalScore = Math.min(100, Math.max(0, Math.round(
    savingsHabitScore + debtManagementScore + creditBehaviourScore + emiBurdenScore
  )));

  // Determine Level
  let level = 'Needs Improvement';
  let badgeTone = 'danger';
  let summary = 'Immediate financial optimization required to reduce liabilities.';

  if (totalScore >= 90) {
    level = 'Excellent';
    badgeTone = 'success';
    summary = 'Outstanding financial discipline. Prime credit profile with exceptional buffer.';
  } else if (totalScore >= 75) {
    level = 'Good';
    badgeTone = 'success';
    summary = 'Healthy financial standing. Solid savings rate and manageable debt exposure.';
  } else if (totalScore >= 60) {
    level = 'Average';
    badgeTone = 'warning';
    summary = 'Acceptable baseline, but higher debt or lower savings reduces risk margin.';
  } else {
    level = 'Needs Improvement';
    badgeTone = 'danger';
    summary = 'High debt obligations and limited liquidity present vulnerability to shocks.';
  }

  return {
    totalScore,
    level,
    badgeTone,
    summary,
    breakdown: [
      {
        id: 'savings',
        title: 'Savings Habit',
        score: savingsHabitScore,
        maxScore: 25,
        percentage: Math.round((savingsHabitScore / 25) * 100),
        status: savingsHabitScore >= 20 ? 'Optimal' : savingsHabitScore >= 14 ? 'Moderate' : 'Low',
        tip: `Current savings rate is ${savingsRate.toFixed(0)}% with ${emergencyMonths.toFixed(1)} months of emergency buffer.`
      },
      {
        id: 'debt',
        title: 'Debt Management',
        score: debtManagementScore,
        maxScore: 25,
        percentage: Math.round((debtManagementScore / 25) * 100),
        status: debtManagementScore >= 20 ? 'Strong' : debtManagementScore >= 14 ? 'Moderate' : 'Strained',
        tip: `DTI is ${dti.toFixed(1)}% (Conservative threshold is below 35%).`
      },
      {
        id: 'credit',
        title: 'Credit Behaviour',
        score: creditBehaviourScore,
        maxScore: 25,
        percentage: Math.round((creditBehaviourScore / 25) * 100),
        status: creditBehaviourScore >= 20 ? 'Prime' : creditBehaviourScore >= 14 ? 'Fair' : 'Subprime',
        tip: `Credit score is ${score}. Maintain on-time payments and under 30% credit utilization.`
      },
      {
        id: 'emi',
        title: 'EMI Burden',
        score: emiBurdenScore,
        maxScore: 25,
        percentage: Math.round((emiBurdenScore / 25) * 100),
        status: emiBurdenScore >= 20 ? 'Light' : emiBurdenScore >= 14 ? 'Manageable' : 'Heavy',
        tip: `Monthly EMI is consuming ${emiBurdenPercent.toFixed(0)}% of your disposable cash surplus.`
      }
    ]
  };
}
