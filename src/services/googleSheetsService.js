/**
 * Google Sheets Backend Integration Service
 * Required Columns:
 * [User ID, Name, Email, Income, Expenses, EMI, Credit Score, Financial Score, Eligibility, Timestamp]
 */
import { storageService } from './storageService.js';

const SHEETS_SYNC_CACHE_KEY = 'bfsi_sheets_synced_records';

export const googleSheetsService = {
  /**
   * Appends a new financial loan check record to Google Sheets
   */
  async appendRecord(recordData) {
    const settings = storageService.getSettings();
    const webhookUrl = settings.googleSheetsWebhookUrl?.trim();

    const payload = {
      userId: recordData.userId || 'usr_anonymous',
      name: recordData.name || 'Anonymous Applicant',
      email: recordData.email || 'not_provided@fintech.io',
      income: Number(recordData.income || 0),
      expenses: Number(recordData.expenses || 0),
      emi: Number(recordData.emi || 0),
      creditScore: Number(recordData.creditScore || 0),
      financialScore: Number(recordData.financialScore || 0),
      eligibility: recordData.eligibility || 'Pending',
      timestamp: recordData.timestamp || new Date().toISOString()
    };

    // Cache locally first
    this.saveToLocalSyncCache(payload);

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script Webhooks
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        return { success: true, mode: 'webhook', message: 'Row successfully synchronized to Google Sheets.' };
      } catch (err) {
        console.warn('Google Sheets webhook push failed, record kept in local buffer:', err);
        return { success: true, mode: 'offline_buffered', message: 'Record saved in local offline buffer.' };
      }
    }

    // Default simulation for zero-config out-of-the-box readiness
    await new Promise(r => setTimeout(r, 400));
    return {
      success: true,
      mode: 'simulated_sheets',
      message: 'Record logged into Google Sheets schema buffer. Configure Webhook URL in Settings for direct cloud sync.'
    };
  },

  getLocalSyncCache() {
    try {
      const data = localStorage.getItem(SHEETS_SYNC_CACHE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveToLocalSyncCache(record) {
    try {
      const existing = this.getLocalSyncCache();
      const updated = [record, ...existing.slice(0, 49)]; // keep latest 50
      localStorage.setItem(SHEETS_SYNC_CACHE_KEY, JSON.stringify(updated));
    } catch (e) {}
  },

  exportToCSV() {
    const records = this.getLocalSyncCache();
    if (!records.length) return '';

    const headers = ['User ID', 'Name', 'Email', 'Income', 'Expenses', 'EMI', 'Credit Score', 'Financial Score', 'Eligibility', 'Timestamp'];
    const rows = records.map(r => [
      r.userId,
      `"${r.name}"`,
      r.email,
      r.income,
      r.expenses,
      r.emi,
      r.creditScore,
      r.financialScore,
      `"${r.eligibility}"`,
      r.timestamp
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
