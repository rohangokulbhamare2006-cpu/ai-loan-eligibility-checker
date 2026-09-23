/**
 * Explainable BFSI AI Engine powered by Google Gemini
 * Provides structured loan explainability, risk audits, and conversational financial advisory.
 */
import { storageService } from '../services/storageService.js';

export const geminiService = {
  /**
   * Generates structured explainable analysis for a specific loan evaluation
   */
  async generateExplainableReport(evaluation, userProfile) {
    const settings = storageService.getSettings();
    const apiKey = settings.geminiApiKey?.trim();

    if (apiKey) {
      try {
        const prompt = `You are a Senior BFSI Risk & Underwriting Analyst at a Tier-1 Bank.
Analyze this loan applicant data and return a strictly valid JSON object matching the schema below.
Applicant Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Occupation: ${userProfile.occupation} (${userProfile.employmentType})
- Monthly Income: ₹${userProfile.monthlyIncome}
- Monthly Expenses: ₹${userProfile.monthlyExpenses}
- Existing EMI: ₹${userProfile.existingEmi}
- Credit Score: ${userProfile.creditScore}
- Savings: ₹${userProfile.savings}

Loan Requested:
- Amount: ₹${evaluation.loanAmount}
- Interest Rate: ${evaluation.interestRate}%
- Tenure: ${evaluation.tenureYears} Years (${evaluation.tenureMonths} Months)
- Proposed EMI: ₹${evaluation.proposedEmi}
- Post-Loan DTI: ${evaluation.proposedDti}%
- FOIR Benchmark: ${evaluation.foirLimitPercent}%
- Calculated Eligibility Score: ${evaluation.eligibilityScore}/100
- Initial Status: ${evaluation.status} (${evaluation.riskLevel})

Return ONLY JSON with keys:
{
  "summary": "Concise executive underwriting summary explaining the rationale",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "risk": "Detailed risk assessment analyzing default probability and cash flow volatility",
  "recommendations": ["string", "string", "string"],
  "next30DayPlan": ["Week 1: ...", "Week 2: ...", "Week 3: ...", "Week 4: ..."]
}
Never hallucinate banking approvals. Always explain uncertainty and conditions.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            return JSON.parse(rawText);
          }
        }
      } catch (err) {
        console.warn('Gemini API fetch encountered error, falling back to deterministic BFSI model:', err);
      }
    }

    // High-fidelity deterministic explainable AI engine (simulated Gemini Underwriting Model)
    await new Promise(r => setTimeout(r, 600));

    const isEligible = evaluation.status === 'Eligible';
    const isConditional = evaluation.status === 'Conditionally Eligible';
    const postDti = evaluation.proposedDti;
    const disposable = evaluation.netDisposableAfterLoan;

    let summary = '';
    if (isEligible) {
      summary = `Applicant demonstrates prime-grade creditworthiness with an eligibility score of ${evaluation.eligibilityScore}/100. Post-loan Debt-to-Income is well-buffered at ${postDti}%, well under the ${evaluation.foirLimitPercent}% FOIR regulatory ceiling. Residual cash flow of ₹${Math.round(disposable).toLocaleString('en-IN')}/month offers strong volatility defense.`;
    } else if (isConditional) {
      summary = `Conditional underwriting recommendation. While credit score (${userProfile.creditScore}) meets basic criteria, the proposed EMI of ₹${evaluation.proposedEmi.toLocaleString('en-IN')} pushes total debt obligations to ${postDti}% of monthly income. Approval is viable subject to co-applicant onboarding, down-payment increase, or tenure expansion.`;
    } else {
      summary = `High risk profile detected. Total debt obligations (${postDti}%) exceed prudent underwriting thresholds. The proposed monthly installment puts severe strain on free cash reserves, leaving negative or marginal safety buffers against unforeseen emergencies.`;
    }

    const strengths = [];
    if (userProfile.creditScore >= 750) strengths.push(`Credit Bureau Score of ${userProfile.creditScore} indicates pristine repayment history and low historical delinquency.`);
    if (userProfile.savings >= userProfile.monthlyExpenses * 4) strengths.push(`Liquid reserves of ₹${userProfile.savings.toLocaleString('en-IN')} provide an emergency runway of ${(userProfile.savings / userProfile.monthlyExpenses).toFixed(1)} months.`);
    if (userProfile.employmentType === 'Salaried' || userProfile.employmentType === 'Government') strengths.push(`Stable employment classification (${userProfile.occupation}) mitigates cash flow disruption.`);
    if (postDti <= 40) strengths.push(`Conservative aggregate DTI (${postDti}%) leaves over 60% of gross earnings uncommitted.`);

    const weaknesses = [];
    if (postDti > 45) weaknesses.push(`High Debt-to-Income ratio (${postDti}%) narrows disposable income buffer in case of inflation or unexpected medical costs.`);
    if (userProfile.creditScore < 700) weaknesses.push(`Sub-700 credit score suggests occasional credit utilization spikes or brief delayed payment inquiries.`);
    if (disposable < 20000) weaknesses.push(`Net free monthly cash flow post-EMI is tight at ₹${Math.max(0, Math.round(disposable)).toLocaleString('en-IN')}.`);
    if (userProfile.savings < userProfile.monthlyExpenses * 2) weaknesses.push(`Liquid emergency reserves cover less than 2 months of baseline living expenses.`);

    const risk = isEligible
      ? `Low Default Probability (< 2.1% expected loss index). The borrower's healthy debt-to-income margin and disciplined credit management demonstrate resilient capacity to service the debt across market cycles.`
      : isConditional
      ? `Moderate Volatility Risk (5.4% - 8.2% expected loss band). Vulnerability exists if variable expenses or macroeconomic interest rate shifts increase monthly debt service burden.`
      : `Elevated Default Risk (> 12% probability). High fixed-obligation ratio severely restricts borrower resilience against loss of employment or unforeseen capital demands.`;

    const recommendations = [
      isEligible
        ? `Maintain automated SIPs and autopay for the ₹${evaluation.proposedEmi.toLocaleString('en-IN')} EMI to preserve credit score above 780.`
        : `Consider extending the loan tenure by 1-2 years to reduce monthly commitment from ₹${evaluation.proposedEmi.toLocaleString('en-IN')} to under ₹${Math.round(evaluation.proposedEmi * 0.82).toLocaleString('en-IN')}.`,
      `Optimize non-essential discretionary expenses to maintain a minimum 25% monthly savings rate.`,
      `Keep revolving credit card utilization below 28% of overall sanctioned limits before loan disbursement.`
    ];

    const next30DayPlan = [
      `Days 1–7: Consolidate verified documentation (PAN, Form 16, 6-month bank statements showing ₹${userProfile.monthlyIncome.toLocaleString('en-IN')} credits).`,
      `Days 8–15: Close or settle any minor revolving credit card balances to drop active debt obligations below ${Math.max(20, postDti - 5).toFixed(0)}%.`,
      `Days 16–22: Establish an auto-debit escrow mechanism dedicated exclusively to loan EMI servicing.`,
      `Days 23–30: Re-run eligibility check with updated balances to lock in preferential interest rate brackets.`
    ];

    return {
      summary,
      strengths,
      weaknesses,
      risk,
      recommendations,
      next30DayPlan
    };
  },

  /**
   * Conversational AI Advisor (ChatGPT-like BFSI Assistant)
   */
  async askAdvisor(userMessage, chatHistory, userProfile) {
    const settings = storageService.getSettings();
    const apiKey = settings.geminiApiKey?.trim();

    if (apiKey) {
      try {
        const systemInstruction = `You are an elite, polite, and explainable BFSI Financial Advisor.
Applicant context:
- Name: ${userProfile.name}
- Income: ₹${userProfile.monthlyIncome}/mo, Expenses: ₹${userProfile.monthlyExpenses}/mo, Existing EMI: ₹${userProfile.existingEmi}/mo
- Savings: ₹${userProfile.savings}, Credit Score: ${userProfile.creditScore}

Guidelines:
1. Deliver sharp, actionable, and mathematically grounded financial advice.
2. Format responses with clean Markdown (bold headings, bullet points, numbered steps).
3. Always explain trade-offs and uncertainty. Never guarantee bank sanction or hallucinate interest rates.
4. Keep tone professional yet approachable like CRED or Jupiter Wealth Advisors.`;

        const contents = [
          ...chatHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          })),
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${userMessage}` }] }
        ];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }
      } catch (e) {
        console.warn('Gemini chat API error, falling back to intelligent advisory engine', e);
      }
    }

    // Simulated Smart Banking Advisor
    await new Promise(r => setTimeout(r, 700));
    const lower = userMessage.toLowerCase();

    if (lower.includes('15 lakh') || lower.includes('afford')) {
      const emi5yr = Math.round((1500000 * 0.00875 * Math.pow(1.00875, 60)) / (Math.pow(1.00875, 60) - 1));
      const newDti = (((userProfile.existingEmi + emi5yr) / userProfile.monthlyIncome) * 100).toFixed(1);
      return `### Loan Affordability Analysis: ₹15,00,000

Based on your current monthly income of **₹${userProfile.monthlyIncome.toLocaleString('en-IN')}** and existing EMIs of **₹${userProfile.existingEmi.toLocaleString('en-IN')}**:

1. **Estimated Monthly EMI**: **₹${emi5yr.toLocaleString('en-IN')}** (at ~10.5% p.a. for a 5-year tenure).
2. **Post-Loan DTI Ratio**: **${newDti}%**
   - Standard banking safety threshold is **≤ 50%**.
   ${newDti <= 45 ? '✅ **Affordable**: Your DTI remains comfortably within healthy limits.' : '⚠️ **Borderline Strained**: This will take a significant share of your monthly cash flow.'}
3. **Monthly Free Cash Surplus**:
   - Current Disposable Income: **₹${(userProfile.monthlyIncome - userProfile.monthlyExpenses - userProfile.existingEmi).toLocaleString('en-IN')}**
   - After ₹15L Loan EMI: **₹${Math.max(0, userProfile.monthlyIncome - userProfile.monthlyExpenses - userProfile.existingEmi - emi5yr).toLocaleString('en-IN')}**

**Advisor Recommendation**:
If you choose to borrow ₹15 Lakh, ensure your emergency reserve of **₹${userProfile.savings.toLocaleString('en-IN')}** remains untouched to cushion against unexpected events.`;
    }

    if (lower.includes('credit score') || lower.includes('improve')) {
      return `### Action Plan: Elevating Your Credit Score to 800+

Your current score is **${userProfile.creditScore}**. Here is the proven banking roadmap:

* **1. Maintain Credit Utilization Below 30%**
  If your combined credit card limit is ₹3,00,000, keep total outstanding balance under **₹90,000** on statement generation dates.
* **2. Enable Automated Autopay**
  Payment history accounts for **35%** of your CIBIL/Experian score. A single 30-day default can shave 40-70 points instantly.
* **3. Avoid Multiple Hard Inquiries**
  Do not apply for multiple loans or credit cards simultaneously within a 90-day window.
* **4. Preserve Oldest Credit Lines**
  Length of credit history represents **15%** of your score. Keep your oldest active card open even with minimal usage.
* **5. Rectify Credit Report Errors**
  Download your full annual CRIF/CIBIL credit report and dispute any phantom loans or incorrect delinquency markers.`;
    }

    if (lower.includes('reduce emi') || lower.includes('prepay') || lower.includes('invest')) {
      return `### Prepayment vs. Investment Strategic Framework

Here is how to evaluate whether to prepay existing loans or invest:

1. **Compare Interest vs. Expected Return**:
   - If your loan interest rate is **> 11%** (e.g. personal loan or credit card debt), **prepaying delivers a guaranteed tax-free return of 11%+**.
   - If your loan rate is **< 8.5%** (e.g. subsidized home loan), investing surplus in balanced index funds often outpaces debt servicing in the long run.
2. **Tax Deductions**:
   - Check if your loan qualifies for Section 24(b) or 80C tax rebates, which lowers the effective cost of debt.
3. **Emergency Fund Guardrail**:
   - Never prepay debt using your last ₹${(userProfile.monthlyExpenses * 3).toLocaleString('en-IN')} of liquid emergency funds.`;
    }

    return `### Personalized Financial Advisor Response

Thank you for your question regarding **"${userMessage}"**.

Here is our underwriting assessment based on your current financials:
- **Net Inflow**: ₹${userProfile.monthlyIncome.toLocaleString('en-IN')}/month
- **Obligation Load**: ₹${(userProfile.monthlyExpenses + userProfile.existingEmi).toLocaleString('en-IN')}/month
- **Discipline Index**: Credit score of **${userProfile.creditScore}** with ₹${userProfile.savings.toLocaleString('en-IN')} reserves.

**Key Financial Rules to Follow**:
1. **The 50/30/20 Rule**: Allocate 50% to needs, 30% to debt/wants, and 20% strictly to wealth creation.
2. **Loan Tenure Balance**: Shorter tenures raise monthly EMI but save substantial compounding interest over time.
3. **Prepayment Strategy**: Even 1 additional EMI payment per calendar year can slash a 5-year loan tenure by over 7 months.

Feel free to ask specific numbers, tenure comparisons, or request an evaluation of any loan amount!`;
  }
};
