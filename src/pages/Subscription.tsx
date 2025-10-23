import React, { useState } from 'react';
import { subscriptionPlans } from '../lib/mockData';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';

export const Subscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayPalModal, setShowPayPalModal] = useState(false);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    if (planId !== 'free') {
      setShowPayPalModal(true);
    }
  };

  const handlePayPalCheckout = () => {
    // Mock PayPal integration
    alert('Redirecting to PayPal... (This is a demo)');
    setShowPayPalModal(false);
  };

  return (
    <div className="p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-white mb-4">Choose Your Plan</h1>
          <p className="text-gray-400">Unlock premium features and enjoy unlimited music</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gray-900/30 rounded-2xl p-8 border transition-all duration-300 ${
                plan.recommended
                  ? 'border-[#00FF80] shadow-[0_0_30px_rgba(0,255,128,0.3)] scale-105'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00FF80] text-black px-4 py-1 rounded-full text-sm shadow-[0_0_20px_rgba(0,255,128,0.5)]">
                  Recommended
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-white mb-4">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl text-white" style={{ fontWeight: 'bold' }}>
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400">/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.recommended ? 'text-[#00FF80]' : 'text-gray-400'
                    }`} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full ${
                  plan.recommended
                    ? 'bg-[#00FF80] hover:bg-[#00FF80]/80 text-black shadow-[0_0_20px_rgba(0,255,128,0.5)]'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {plan.price === 0 ? 'Current Plan' : 'Subscribe with PayPal'}
              </Button>
            </div>
          ))}
        </div>

        {/* PayPal Modal */}
        <Dialog open={showPayPalModal} onOpenChange={setShowPayPalModal}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">PayPal Checkout</DialogTitle>
              <DialogDescription className="text-gray-400">
                Complete your subscription with PayPal
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
                <p className="text-gray-300 mb-2">Selected Plan</p>
                <p className="text-white text-xl">
                  {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                </p>
                <p className="text-[#00FF80] text-2xl mt-2">
                  ${subscriptionPlans.find(p => p.id === selectedPlan)?.price}/month
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowPayPalModal(false)}
                  variant="outline"
                  className="flex-1 bg-transparent border-gray-700 text-white hover:bg-gray-800/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayPalCheckout}
                  className="flex-1 bg-[#0070BA] hover:bg-[#003087] text-white"
                >
                  Pay with PayPal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
