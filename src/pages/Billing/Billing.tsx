import { useState } from "react";
// import {
//   Zap,
//   Bell,
//   //   Settings,
//   //   LogOut,
//   //   Grid3x3,
//   //   BarChart3,
//   //   CreditCard,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Sidebar } from "../../components/user/Sidebar";
import { BillingToggle } from "../../components/billing/BillingToggle";
import { PricingCard } from "../../components/billing/PricingCard";
import { billingPlans } from "../../constants/billingPlans";
// import { useUserStore } from "../../store/UserContext";
import Header from "@/components/user/Header";

export default function Billing() {
  //   const navigate = useNavigate();
  //   const { credits } = useUserStore();
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 overflow-hidden font-sans">
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Top Header */}
        <Header />

        {/* Main Content */}
        <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Choose the perfect plan for your AI design needs. Scale as you
              grow with flexible billing options.
            </p>
          </div>

          {/* Billing Toggle */}
          {/* Note: Hãy chắc chắn thiết kế lại component BillingToggle bên trong để hợp với nền sáng */}
          <BillingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />

          {/* Pricing Cards Grid */}
          {/* Note: Hãy truyền thêm thuộc tính sáng nền hoặc tinh chỉnh PricingCard sang màu trắng */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-8">
            {billingPlans.map((plan) => {
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              return (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  price={price}
                  isAnnual={isAnnual}
                  isPopular={plan.isPopular}
                />
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 border-t border-zinc-200 pt-16">
            <h3 className="text-2xl font-bold mb-10 text-center text-zinc-900">
              Frequently Asked Questions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg mb-2 text-zinc-900">
                  Can I change plans anytime?
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Yes! You can upgrade, downgrade, or cancel your subscription
                  at any time. Changes take effect at the next billing cycle.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg mb-2 text-zinc-900">
                  What happens to my credits?
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Credits reset monthly based on your plan. Unused credits do
                  not roll over, but you can purchase additional credits
                  anytime.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg mb-2 text-zinc-900">
                  Do you offer refunds?
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  We offer a 7-day money-back guarantee for new subscriptions.
                  Contact our support team for assistance.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg mb-2 text-zinc-900">
                  Is there a free trial?
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Absolutely! Start with our Free Starter plan (50
                  credits/month) with no credit card required.
                </p>
              </div>
            </div>
          </div>

          {/* Support CTA */}
          <div className="mt-20 text-center flex justify-center">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8 max-w-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                Need a Custom Plan?
              </h3>
              <p className="text-zinc-600 mb-6 leading-relaxed">
                Our enterprise solutions are designed for teams with unique
                requirements. Get in touch with our sales team.
              </p>
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-100 active:scale-95">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
