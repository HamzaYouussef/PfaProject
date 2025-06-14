import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          id="email"
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          fullWidth
        />
        
        <Input
          label="Password"
          type="password"
          id="password"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          fullWidth
        />
        
        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
            size="lg"
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-indigo-600 hover:text-indigo-500 font-medium focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>
      
      {/* Demo credentials hint */}
      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600 font-medium">Demo credentials:</p>
        <p className="text-xs text-gray-500">Email: demo@example.com</p>
        <p className="text-xs text-gray-500">Password: password</p>
      </div>
    </div>
  );
};

export default LoginForm;