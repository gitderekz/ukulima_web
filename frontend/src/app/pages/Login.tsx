import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../../services/api';
import { LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FadeIn, ScaleIn } from '../components/animations';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password); // ✅ USE STORE

      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <FadeIn>
        <ScaleIn>
          <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ukulima</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{t('welcomeBack')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="admin@ukulima.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <span>{t('login')}</span>
                )}
              </button>

              <div className="flex items-center justify-between mt-4 text-sm">
                <Link 
                  to="/forgot-password" 
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
                <Link 
                  to="/signup" 
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors hover:underline"
                >
                  Create account
                </Link>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">Demo Credentials:</p>
              <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <p>Admin: admin@ukulima.com / admin123</p>
                <p>Buyer: john.mwangi@ukulima.com / buyer123</p>
                <p>Manager: grace.njeri@ukulima.com / manager123</p>
              </div>
            </div>
          </div>
        </ScaleIn>
      </FadeIn>
    </div>
  );
}