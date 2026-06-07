interface BillingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
}

export function BillingToggle({ isAnnual, onToggle }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-6 mb-12">
      <button
        onClick={() => onToggle(false)}
        className={`text-xl font-bold transition-colors ${
          !isAnnual ? "text-white" : "text-zinc-500"
        }`}
      >
        Monthly
      </button>

      <button
        onClick={() => onToggle(!isAnnual)}
        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
          isAnnual ? "bg-purple-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
            isAnnual ? "translate-x-9" : "translate-x-1"
          }`}
        />
      </button>

      <button
        onClick={() => onToggle(true)}
        className={`text-xl font-bold transition-colors ${
          isAnnual ? "text-white" : "text-zinc-500"
        }`}
      >
        Annually
        <span className="ml-2 text-sm text-emerald-400 font-semibold">
          Save 16%
        </span>
      </button>
    </div>
  );
}
