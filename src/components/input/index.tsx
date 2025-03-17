'use client';
/*----Next---*/
import React from 'react';

/*----React Icons---*/
import { IconType } from 'react-icons';
import { FaRegEye } from 'react-icons/fa';
import { FaRegEyeSlash } from 'react-icons/fa6';

type InputProps = {
  icon: IconType;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ icon: Icon, error, ...props }) => {
  const { type } = props;
  const [inputType, setInputType] = React.useState(type);

  const handleTogglePassword = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };
  return (
    <div className="relative w-full rounded-lg mb-9">
      <Icon className="absolute top-1/2 translate-y-[-50%] left-3 text-white" />
      <input
        {...props}
        className={`w-full pl-16 pr-3 py-3 bg-gray-800 bg-opacity-50 rounded-lg border  focus:ring-2   placeholder-gray-400 transition duration-200 ${
          error
            ? 'border-red-500 placeholder-red-500 text-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-700 placeholder-gray-400 text-white focus:ring-green-500 focus:border-green-500'
        }`}
        type={inputType}
      />
      {type === 'password' && (
        <button
          onClick={handleTogglePassword}
          className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center"
          type="button"
        >
          {inputType === 'password' ? <FaRegEye className=" text-white" /> : <FaRegEyeSlash className=" text-white" />}
        </button>
      )}

      {error && <p className="text-sm mt-3 text-red-400 absolute left-0 -bottom-6">{error}</p>}
    </div>
  );
};

export default Input;
