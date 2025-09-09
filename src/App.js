import React, { useState } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import PricingPlans from './components/PricingPlans';
import PaymentInterface from './components/PaymentInterface';
import LoginInterface from './components/LoginInterface';
import SignupInterface from './components/SignupInterface';
import ForgotPasswordInterface from './components/ForgotPasswordInterface';
import PlanSwitcher from './components/PlanSwitcher';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe("pk_test_51RwMz05JNHcvuz94sjCN54asKUd4bCLag0loJmElJLyWJwwmgUFlr9J3llxb5GtXV97C3O7sCXty8Tc4M0s3iVi400KRiZl9GM");

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userPlan, setUserPlan] = useState('free');
  const [query, setQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setCurrentPage('chat');
    }
  };

  const handlePlanSelect = (plan) => {
    if (plan.name === 'Free') {
      setUserPlan('free');
      setCurrentPage('chat');
    } else {
      setSelectedPlan(plan);
      setCurrentPage('payment');
    }
  };

  const handlePaymentSuccess = (plan) => {
    setUserPlan(plan.name.toLowerCase());
    setCurrentPage('chat');
  };

  const handleLogin = (loginData) => {
    setIsLoggedIn(true);
    setCurrentPage('home');
    console.log('Login successful:', loginData);
  };

  const handleSignup = (signupData) => {
    setIsLoggedIn(true);
    setCurrentPage('home');
    console.log('Signup successful:', signupData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginInterface
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentPage('signup')}
            onSwitchToForgotPassword={() => setCurrentPage('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignupInterface
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordInterface
            onResetPassword={() => console.log('Password reset requested')}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        );
      case 'chat':
        return <ChatInterface userPlan={userPlan} onUpgradeClick={() => setCurrentPage('pricing')} />;
      case 'upload':
        return <FileUpload userPlan={userPlan} onUpgradeClick={() => setCurrentPage('pricing')} />;
      case 'pricing':
        return <PricingPlans onPlanSelect={handlePlanSelect} />;
      case 'payment':
        return (
          <Elements stripe={stripePromise}>
            <PaymentInterface
              selectedPlan={selectedPlan}
              onPaymentSuccess={handlePaymentSuccess}
              onBackToPricing={() => setCurrentPage('pricing')}
            />
          </Elements>
        );
      default:
        return (
          <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Moe – Your Mozaik Expert
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Expert answers for Mozaik, VCarve, Fusion 360, and more.
              </p>
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative max-w-xl mx-auto">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask Moe anything about your millwork project..."
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Ask Moe
                  </button>
                </div>
              </form>
              <div className="mb-12">
                <p className="text-sm text-gray-500 mb-4">Supported Systems</p>
                <div className="flex justify-center items-center space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-600 font-semibold text-sm">M</span>
                    </div>
                    <span className="text-xs text-gray-500">Mozaik</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-600 font-semibold text-sm">V</span>
                    </div>
                    <span className="text-xs text-gray-500">VCarve</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-600 font-semibold text-sm">F</span>
                    </div>
                    <span className="text-xs text-gray-500">Fusion 360</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Get Started with Moe
                </h3>
                <p className="text-gray-600 mb-4">
                  Free tier includes 5 queries per day. Upgrade to Pro for unlimited access and advanced features.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentPage('chat')}
                    className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => setCurrentPage('pricing')}
                    className="bg-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
                  >
                    View Plans
                  </button>
                </div>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 z-50 flex w-80 flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Content */}
        <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
          <div className="flex h-20 shrink-0 items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-400">M</span>
            </div>
            <span className="text-xl font-semibold text-white">MOE</span>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={() => setCurrentPage('chat')}
            className="flex items-center gap-3 rounded-md bg-primary-500/10 px-4 py-3 text-sm font-semibold text-primary-400 hover:bg-primary-500/20 transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <div className="space-y-1 py-4">
              <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main Menu
              </div>
              <button
                onClick={() => setCurrentPage('chat')}
                className={`flex items-center gap-x-3 rounded-md px-4 py-3 text-sm font-medium w-full transition-colors duration-200 ${
                  currentPage === 'chat'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat
              </button>
              <button
                onClick={() => setCurrentPage('upload')}
                className={`flex items-center gap-x-3 rounded-md px-4 py-3 text-sm font-medium w-full transition-colors duration-200 ${
                  currentPage === 'upload'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                File Upload
              </button>
            </div>

            <div className="mt-auto space-y-1 py-4">
              <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Account
              </div>
                <button
                  onClick={() => setCurrentPage('pricing')}
                className={`flex items-center gap-x-3 rounded-md px-4 py-3 text-sm font-medium w-full transition-colors duration-200 ${
                  currentPage === 'pricing'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Upgrade to Pro
                </button>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-3 rounded-md px-4 py-3 text-sm font-medium w-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="flex items-center gap-x-3 rounded-md px-4 py-3 text-sm font-medium w-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign in
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="rounded-lg p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 items-center justify-between gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {userPlan === 'free' ? 'Free Plan' : `${userPlan} Plan`}
                </span>
                <span className={`inline-block h-2 w-2 rounded-full ${userPlan === 'free' ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`} />
              </div>
              <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                {userPlan === 'free' ? '5 queries remaining today' : 'Unlimited queries'}
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <PlanSwitcher currentPlan={userPlan} onPlanChange={setUserPlan} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="relative flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
