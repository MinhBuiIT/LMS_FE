/*----Next----*/
import React from 'react';

/*----Icons----*/
import { FaCheck } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const PasswordRules = ({ password }: { password: string }) => {
  const rules = [
    {
      title: 'At least 8 characters',
      passed: password.length >= 8
    },
    {
      title: 'Contains a lowercase letter',
      passed: /[a-z]/.test(password)
    },
    {
      title: 'Contains an uppercase letter',
      passed: /[A-Z]/.test(password)
    },
    {
      title: 'Contains a number',
      passed: /[0-9]/.test(password)
    },
    {
      title: 'Contains a special character',
      passed: /[^A-Za-z0-9]/.test(password)
    }
  ];

  return (
    <div className="mt-4">
      {rules.map((rule, i) => {
        return (
          <div key={i} className="flex items-center gap-2">
            {rule.passed ? <FaCheck className="size-4 text-green-500" /> : <FaX className="size-4 text-gray-500" />}
            <span className={`${rule.passed ? 'text-green-500' : 'text-gray-500'}`}>{rule.title}</span>
          </div>
        );
      })}
    </div>
  );
};

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const strengthNum = (password: string) => {
    var strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };
  const strength = strengthNum(password);
  const strengthText = (strength: number) => {
    switch (strength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
    }
  };
  const getColor = (strength: number) => {
    if (strength === 0) return 'bg-red-500';
    if (strength === 1) return 'bg-red-400';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-yellow-400';
    return 'bg-green-500';
  };
  return (
    <div>
      <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
        <span>Password Strength</span>
        <span>{strengthText(strength)}</span>
      </div>

      <div className="w-full flex gap-2">
        {[0, 1, 2, 3].map((i) => {
          return (
            <div
              key={i}
              className={`w-1/4 h-1 ${i < strength ? getColor(strength) : 'bg-gray-500'} rounded-full`}
            ></div>
          );
        })}
      </div>
      <PasswordRules password={password} />
    </div>
  );
};

export default PasswordStrength;
