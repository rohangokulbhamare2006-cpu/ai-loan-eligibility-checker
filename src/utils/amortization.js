/**
 * Generates monthly and yearly amortization schedules for a loan
 */
import { calculateEMI } from './financialMath.js';

export function generateAmortizationSchedule(principal, annualRate, tenureYears) {
  const tenureMonths = Math.max(1, Math.round(tenureYears * 12));
  const monthlyRate = (annualRate / 100) / 12;
  const emi = calculateEMI(principal, annualRate, tenureMonths);

  let balance = principal;
  const monthlySchedule = [];
  const yearlySchedule = [];

  let currentYear = 1;
  let yearPrincipalPaid = 0;
  let yearInterestPaid = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(balance, emi - interest);
    balance = Math.max(0, balance - principalPaid);

    yearPrincipalPaid += principalPaid;
    yearInterestPaid += interest;

    monthlySchedule.push({
      month,
      emi,
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interest),
      balance: Math.round(balance)
    });

    if (month % 12 === 0 || month === tenureMonths) {
      yearlySchedule.push({
        year: currentYear,
        totalEmi: Math.round(yearPrincipalPaid + yearInterestPaid),
        principalPaid: Math.round(yearPrincipalPaid),
        interestPaid: Math.round(yearInterestPaid),
        endingBalance: Math.round(balance)
      });
      currentYear++;
      yearPrincipalPaid = 0;
      yearInterestPaid = 0;
    }
  }

  return {
    emi,
    totalPayment: emi * tenureMonths,
    totalInterest: (emi * tenureMonths) - principal,
    monthlySchedule,
    yearlySchedule
  };
}
