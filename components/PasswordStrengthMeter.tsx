import React, { useState, useEffect } from 'react';
import { checkPasswordStrength, type PasswordStrength } from '../lib/security';

interface PasswordStrengthMeterProps {
  password: string;
  showFeedback?: boolean;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showFeedback = true,
  className = '',
}) => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Very Weak',
    color: 'text-red-500',
    feedback: [],
  });

  useEffect(() => {
    setStrength(checkPasswordStrength(password));
  }, [password]);

  const getBarColor = (score: number): string => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getBarWidth = (score: number): string => {
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              strength.score >= level ? getBarColor(strength.score) : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>

      {/* Strength label */}
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${strength.color}`}>
          {strength.label}
        </span>
        {password.length > 0 && (
          <span className="text-xs text-zinc-500">
            {password.length} characters
          </span>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && strength.feedback.length > 0 && (
        <ul className="space-y-1">
          {strength.feedback.map((tip, index) => (
            <li
              key={index}
              className="text-xs text-zinc-400 flex items-center gap-1"
            >
              <span className="w-1 h-1 bg-zinc-500 rounded-full" />
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthMeter?: boolean;
  strengthClassName?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showStrengthMeter = true,
  strengthClassName,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(props.value as string || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChange}
          className={`w-full px-4 py-3 pr-12 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {showStrengthMeter && password.length > 0 && (
        <PasswordStrengthMeter
          password={password}
          className={strengthClassName}
        />
      )}
    </div>
  );
};

export default PasswordStrengthMeter;