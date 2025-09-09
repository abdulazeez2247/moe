import React from 'react';

const PricingPlans = ({ onPlanSelect }) => {
  const [billingCycle, setBillingCycle] = React.useState('monthly');

  const plans = [
    { name: 'Free', description: 'Start free and explore.', price: { monthly: '$0', yearly: '$0' } },
    { name: 'Pro', description: 'Great for professionals.', price: { monthly: '$29', yearly: '$279' } },
    { name: 'Enterprise', description: 'For large teams.', price: { monthly: '$149', yearly: '$1,428' } },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Choose your plan</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">Start free and upgrade as you grow.</p>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              billingCycle === 'monthly'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              billingCycle === 'yearly'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
            }`}
          >
            Annual
          </button>
        </div>

        <div className="mx-auto mt-12 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price[billingCycle]}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <button
                onClick={() => onPlanSelect(plan)}
                className="mt-6 w-full rounded-md bg-primary-600 text-white py-3 text-sm font-semibold hover:bg-primary-500"
              >
                {plan.name === 'Free' ? 'Get started' : 'Start free trial'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
