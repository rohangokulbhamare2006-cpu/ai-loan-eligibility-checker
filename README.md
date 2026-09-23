# AI Loan Eligibility Checker 💳✨

> **"Check your eligibility. Understand the reason. Improve your financial future."**

A production-grade, explainable AI-powered BFSI web application designed with minimal glassmorphic aesthetics inspired by CRED, OneScore, Jupiter Money, and Stripe.

🔗 **Live Deployment**: [https://rohangokulbhamare2006-cpu.github.io/ai-loan-eligibility-checker/](https://rohangokulbhamare2006-cpu.github.io/ai-loan-eligibility-checker/)

---

## 🌟 Key Features

1. **Intelligent Banking Form & Underwriting Engine**:
   - Reduces-balance amortization mathematical formulas.
   - Dynamic FOIR (Fixed Obligation to Income Ratio) ceilings between 45% and 60% based on disposable surplus.
   - Post-loan DTI (Debt-to-Income) ratio analysis and reverse max borrowing power calculation.
   - Zero mocked or arbitrary random numbers.

2. **Proprietary 100-Point Financial Health Score**:
   - **Savings Habit (25 pts)**: Liquid savings vs. monthly expense runway.
   - **Debt Management (25 pts)**: DTI efficiency index.
   - **Credit Behaviour (25 pts)**: CIBIL / Experian credit tier weighting.
   - **EMI Burden (25 pts)**: Monthly obligation load vs. disposable surplus.
   - Interactive What-If Scenario simulator.

3. **Explainable Gemini AI Reasoning**:
   - Natural language loan underwriting breakdown with strengths, risk flags, debt consolidation suggestions, and a customized 30-day action plan.
   - ChatGPT-style AI Advisor with conversation history, suggested prompts, and financial guidance.

4. **Interactive Chart.js Analytics**:
   - Spending doughnut, Income vs. Expense comparative bar chart, Savings growth trendline, and EMI burden area chart.
   - Full dark and light theme responsiveness.

5. **Deloitte / EY-Grade Executive PDF Report**:
   - One-click PDF report generation using `jsPDF` and `html2canvas` complete with cryptographic Report ID, timestamps, borrower risk profile, and audit tables.

6. **Full-Stack Data Synchronization**:
   - 10-column Google Sheets integration schema (`userId`, `name`, `email`, `income`, `expenses`, `emi`, `creditScore`, `financialScore`, `eligibility`, `timestamp`).
   - One-click CSV export and Google Sheets Webhook push.
   - Firebase Authentication with demo auto-fill for instant evaluation.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, Vite 6
- **Styling**: Pure CSS Design Tokens, Glassmorphism, Responsive Grid (Poppins, Inter, JetBrains Mono)
- **Charts**: Chart.js 4.4 & `react-chartjs-2`
- **PDF Generation**: `jspdf` & `html2canvas`
- **Icons & Micro-interactions**: `lucide-react`, `canvas-confetti`
- **Deployment**: GitHub Pages & GitHub Actions CI/CD

---

## 🚀 Running Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/rohangokulbhamare2006-cpu/ai-loan-eligibility-checker.git
   cd ai-loan-eligibility-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License

MIT License. Crafted with precision for high-trust BFSI applications.
