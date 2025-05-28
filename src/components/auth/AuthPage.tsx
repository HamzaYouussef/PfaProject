import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { FileText } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('IMG/sivobg2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Optional overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>
      
      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {showLogin ? (
              <LoginForm onSwitchToSignUp={() => setShowLogin(false)} />
            ) : (
              <SignUpForm onSwitchToLogin={() => setShowLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;