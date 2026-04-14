import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../db/database';
import type { Settings as SettingsType } from '../types';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [formData, setFormData] = useState({
    deductionPercentage: '',
    primaryColor: '',
    secondaryColor: '',
    language: '',
    currency: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await db.settings.get();
    setSettings(data);
    setFormData({
      deductionPercentage: data.deductionPercentage.toString(),
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      language: data.language,
      currency: data.currency,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const percentage = parseFloat(formData.deductionPercentage);
    if (percentage < 0 || percentage > 100) {
      toast.error('Deduction percentage must be between 0 and 100');
      return;
    }

    const updatedSettings = {
      deductionPercentage: percentage,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      language: formData.language,
      currency: formData.currency,
    };

    await db.settings.update(updatedSettings);

    // Update i18n language
    i18n.changeLanguage(formData.language);

    toast.success('Settings updated successfully');
    loadSettings();
  };

  const resetToDefaults = async () => {
    if (window.confirm('Reset all settings to default values?')) {
      const defaults = {
        deductionPercentage: 70,
        primaryColor: '#16a34a',
        secondaryColor: '#0284c7',
        language: 'en',
        currency: 'TZS',
      };

      await db.settings.update(defaults);
      i18n.changeLanguage('en');
      toast.success('Settings reset to defaults');
      loadSettings();
    }
  };

  if (!settings) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configure system preferences</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Loan Settings
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loan Deduction Percentage (%)
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                When a farmer's crop sale amount is less than their total debt, this percentage of the sale amount will be deducted as partial loan repayment.
              </p>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.deductionPercentage}
                onChange={(e) => setFormData({ ...formData, deductionPercentage: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Current: {formData.deductionPercentage}% | Default: 70%
              </p>
            </div>
          </div>

          {/* Language Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language Settings</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="en">English</option>
                <option value="sw">Swahili (Kiswahili)</option>
                <option value="fr">French (Français)</option>
                <option value="es">Spanish (Español)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="pt">Portuguese (Português)</option>
                <option value="ru">Russian (Русский)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="th">Thai (ไทย)</option>
                <option value="ms">Malay (Bahasa Melayu)</option>
                <option value="id">Indonesian (Bahasa Indonesia)</option>
                <option value="fa">Persian (فارسی)</option>
              </select>
            </div>
          </div>

          {/* Currency Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Currency Settings</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency Code
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="TZS">TZS - Tanzanian Shilling</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="UGX">UGX - Ugandan Shilling</option>
              </select>
            </div>
          </div>

          {/* Theme Colors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-20 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg"
                    placeholder="#16a34a"
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-20 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg"
                    placeholder="#0284c7"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
            <button
              type="button"
              onClick={resetToDefaults}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </form>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">System Information</h3>
        <div className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
          <p>Version: 1.0.0</p>
          <p>Last Updated: {settings.updatedAt}</p>
          <p>Environment: Development</p>
        </div>
      </div>
    </div>
  );
}
