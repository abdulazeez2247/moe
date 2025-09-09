import React from 'react';

const PlanSwitcher = ({ currentPlan, onPlanChange }) => {
  const plans = [
    { id: 'free', name: 'Free Plan', description: '5 queries/day, gpt-4o-mini' },
    { id: 'hobbyist', name: 'Hobbyist', description: '100 queries/month, gpt-4o' },
    { id: 'occasional', name: 'Occasional', description: '300 queries/month, gpt-4o' },
    { id: 'professional', name: 'Professional', description: '600 queries/month, gpt-4o' },
    { id: 'enterprise', name: 'Enterprise', description: '5,000 queries/month, gpt-4o' }
  ];

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Demo Plan Switcher</h3>
            <p className="text-xs text-gray-500">Switch between user plans to test different experiences</p>
          </div>
          <div className="flex space-x-2">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => onPlanChange(plan.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  currentPlan === plan.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                title={plan.description}
              >
                {plan.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSwitcher;
