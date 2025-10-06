
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AcmeLogo from '../components/AcmeLogo';
import { useAuth } from '../App';
import { ArrowRightIcon, AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '../components/Icons';

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    // Simple validation
    if (email === 'user@nextmail.com' && password === '123456') {
      setErrorMessage('');
      login();
      navigate('/');
    } else {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className="mb-3 text-2xl">
              Please log in to continue.
            </h1>
            <div className="w-full">
              <div>
                <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    defaultValue="user@nextmail.com"
                    required
                  />
                  <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    defaultValue="123456"
                    required
                    minLength={6}
                  />
                  <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>
            <button type="submit" className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </button>
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
              {errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-4">
              <p>Use email: <strong>user@nextmail.com</strong></p>
              <p>Use password: <strong>123456</strong></p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
