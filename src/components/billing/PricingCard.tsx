import React from "react";
import { Check, Zap } from "lucide-react";
import type { PricingPlan } from "../../constants/billingPlans";

interface PricingCardProps {
  plan: PricingPlan;
  price: number;
  isAnnual: boolean;
  isPopular?: boolean;
}

export function PricingCard({
  plan,
  price,
  isAnnual,
  isPopular,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
        isPopular
          ? "lg:scale-105 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 border-2 border-indigo-600 shadow-xl shadow-indigo-100"
          : "bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm"
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-md">
            Popular
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-8 flex flex-col h-full relative">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-2xl font-extrabold text-zinc-900">
              {plan.name}
            </h3>
            {isPopular && (
              <Zap className="w-6 h-6 text-indigo-600 fill-indigo-600/10" />
            )}
          </div>
          <p
            className={`text-sm font-medium ${
              isPopular ? "text-indigo-950" : "text-zinc-500"
            }`}
          >
            {plan.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          {plan.id === "enterprise" ? (
            <div className="space-y-1">
              <p className="text-5xl font-black text-zinc-900">Custom</p>
              <p className="text-zinc-400 text-sm">Contact us for pricing</p>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-5xl font-black text-zinc-900">
                ${price}
              </span>
              <span className="text-zinc-400 text-sm font-medium">
                / {isAnnual ? "year" : "month"}
              </span>
              {isAnnual && price > 0 && (
                <p className="text-xs text-emerald-600 font-bold mt-2 bg-emerald-50 px-2.5 py-1 rounded-md w-fit border border-emerald-100">
                  Save ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(0)}
                  /year
                </p>
              )}
            </div>
          )}
        </div>

        {/* Credits Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl w-fit">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-zinc-700">
            {plan.credits} Credits/Month
          </span>
        </div>

        {/* CTA Button */}
        <button
          className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 mb-8 active:scale-95 shadow-sm ${
            isPopular
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
              : "bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200"
          }`}
        >
          {plan.buttonLabel}
        </button>

        {/* Features List */}
        <div className="flex-1 space-y-4">
          <p
            className={`text-xs font-bold uppercase tracking-wider ${
              isPopular ? "text-indigo-600" : "text-zinc-400"
            }`}
          >
            What's Included
          </p>
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-600 font-medium leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
