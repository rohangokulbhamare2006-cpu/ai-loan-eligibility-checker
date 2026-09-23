/**
 * Client Storage & Persistence Service
 */

const STORAGE_KEYS = {
  USER_PROFILE: 'bfsi_user_profile',
  ELIGIBILITY_HISTORY: 'bfsi_eligibility_history',
  REPORTS: 'bfsi_saved_reports',
  SETTINGS: 'bfsi_app_settings',
  AUTH_SESSION: 'bfsi_auth_session'
};

const DEFAULT_PROFILE = {
  id: 'usr_' + Math.random().toString(36).substr(2, 9),
  name: 'Aryaman Sharma',
  email: 'aryaman.sharma@fintech.io',
  age: 29,
  occupation: 'Lead Systems Engineer',
  employmentType: 'Salaried',
  monthlyIncome: 135000,
  monthlyExpenses: 42000,
  existingEmi: 18500,
  otherLoans: 1,
  savings: 650000,
  creditScore: 782,
  defaultLoanAmount: 1500000,
  defaultInterestRate: 9.8,
  defaultTenureYears: 5,
  defaultLoanType: 'Personal Loan'
};

const DEFAULT_SETTINGS = {
  theme: 'dark',
  geminiApiKey: '',
  googleSheetsWebhookUrl: '',
  enableSound: true,
  autoSaveToSheets: true
};

export const storageService = {
  getUserProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  },

  saveUserProfile(profile) {
    try {
      const current = this.getUserProfile();
      const updated = { ...current, ...profile };
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save profile', e);
      return profile;
    }
  },

  getSavedReports() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    
    // Seed with 2 realistic initial reports
    return [
      {
        id: 'REP-2026-9812',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        userName: 'Aryaman Sharma',
        loanAmount: 1200000,
        loanType: 'Personal Loan',
        interestRate: 10.2,
        tenureYears: 4,
        eligibilityScore: 88,
        status: 'Eligible',
        riskLevel: 'Low Risk',
        healthScore: 86,
        proposedEmi: 30580,
        dti: 36.4
      },
      {
        id: 'REP-2026-8401',
        timestamp: new Date(Date.now() - 86400000 * 12).toISOString(),
        userName: 'Aryaman Sharma',
        loanAmount: 2500000,
        loanType: 'Home Renovation',
        interestRate: 9.5,
        tenureYears: 7,
        eligibilityScore: 79,
        status: 'Eligible',
        riskLevel: 'Low Risk',
        healthScore: 84,
        proposedEmi: 40912,
        dti: 44.0
      }
    ];
  },

  saveReport(report) {
    try {
      const reports = this.getSavedReports();
      const updated = [report, ...reports.filter(r => r.id !== report.id)];
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save report', e);
      return [];
    }
  },

  deleteReport(id) {
    try {
      const reports = this.getSavedReports().filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      return reports;
    } catch (e) {
      return [];
    }
  },

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return settings;
    }
  },

  getAuthSession() {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (session) return JSON.parse(session);
    } catch (e) {}
    // Default active session for seamless fintech preview
    return {
      isAuthenticated: true,
      user: {
        uid: 'demo-aryaman-2026',
        email: 'aryaman.sharma@fintech.io',
        displayName: 'Aryaman Sharma',
        photoURL: null
      }
    };
  },

  saveAuthSession(session) {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    } catch (e) {}
  },

  clearAuthSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch (e) {}
  }
};
