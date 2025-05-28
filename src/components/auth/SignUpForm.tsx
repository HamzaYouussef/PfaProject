import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin }) => {
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signUp(email, password, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  return (
   <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="IMG/sivo.png"
              alt="Logo"
              className="mx-auto w-40 h-auto object-contain"
            />
          </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          id="name"
          icon={<User className="h-5 w-5 text-gray-400" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          fullWidth
        />
        
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
            Create account
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-500 font-medium focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;