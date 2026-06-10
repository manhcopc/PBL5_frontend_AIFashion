import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Edit2, Loader2, Plus, Trash2, X } from "lucide-react";
import { subscriptionService } from "@/features/subscription/api";
import type {
  CreateSubscriptionPlanPayload,
  SubscriptionPlan,
} from "@/features/subscription/subscription.types";

const emptyForm: CreateSubscriptionPlanPayload = {
  plan_name: "",
  price_per_month: 0,
  credits_per_month: 0,
  description: "",
  is_popular: false,
  features: [],
};

function parseFeatures(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [form, setForm] = useState<CreateSubscriptionPlanPayload>(emptyForm);
  const [featuresText, setFeaturesText] = useState("");
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(editingPlanId);

  const sortedPlans = useMemo(
    () =>
      [...plans].sort((a, b) => a.price_per_month - b.price_per_month),
    [plans]
  );

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionService.getPlans();
      setPlans(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subscription plans."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPlans();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setFeaturesText("");
    setEditingPlanId(null);
    setError(null);
  };

  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan._id);
    setForm({
      plan_name: plan.plan_name,
      price_per_month: plan.price_per_month,
      credits_per_month: plan.credits_per_month,
      description: plan.description,
      is_popular: plan.is_popular,
      features: plan.features,
    });
    setFeaturesText(plan.features.join("\n"));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: CreateSubscriptionPlanPayload = {
      ...form,
      plan_name: form.plan_name.trim(),
      description: form.description.trim(),
      features: parseFeatures(featuresText),
      price_per_month: Number(form.price_per_month),
      credits_per_month: Number(form.credits_per_month),
    };

    if (!payload.plan_name) {
      setSaving(false);
      setError("Plan name is required.");
      return;
    }

    try {
      if (editingPlanId) {
        const updated = await subscriptionService.updatePlan(
          editingPlanId,
          payload
        );
        setPlans((prev) =>
          prev.map((plan) => (plan._id === editingPlanId ? updated : plan))
        );
      } else {
        const created = await subscriptionService.createPlan(payload);
        setPlans((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save subscription plan."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    const confirmed = window.confirm(
      `Delete subscription plan "${plan.plan_name}"?`
    );
    if (!confirmed) return;

    setError(null);
    try {
      await subscriptionService.deletePlan(plan._id);
      setPlans((prev) => prev.filter((item) => item._id !== plan._id));
      if (editingPlanId === plan._id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete subscription plan."
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="border-b border-zinc-200 bg-white px-8 py-6">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Subscription Plans
        </h1>
        <p className="text-zinc-500">
          Create, update, and remove plans used by the billing page.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
          <section className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-10 text-zinc-500 shadow-sm">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-indigo-600" />
                Loading subscription plans...
              </div>
            ) : sortedPlans.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-zinc-500 shadow-sm">
                No subscription plans found.
              </div>
            ) : (
              sortedPlans.map((plan) => (
                <article
                  key={plan._id}
                  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-zinc-900">
                          {plan.plan_name}
                        </h2>
                        {plan.is_popular && (
                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                        {plan.description || "No description"}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-3xl font-black text-zinc-900">
                        ${plan.price_per_month}
                      </p>
                      <p className="text-sm font-medium text-zinc-500">
                        {plan.credits_per_month.toLocaleString("en-US")} credits/month
                      </p>
                    </div>
                  </div>

                  {plan.features.length > 0 && (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-zinc-600"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6 flex justify-end gap-2 border-t border-zinc-100 pt-4">
                    <button
                      onClick={() => startEdit(plan)}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => void handleDelete(plan)}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm xl:sticky xl:top-8 xl:self-start">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">
                  {isEditing ? "Edit plan" : "Create plan"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Features are entered one per line.
                </p>
              </div>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                  title="Cancel editing"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Plan name
                </label>
                <input
                  value={form.plan_name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      plan_name: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                  placeholder="Pro"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                    Price/month
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price_per_month}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        price_per_month: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                    Credits/month
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.credits_per_month}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        credits_per_month: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                  placeholder="Best for growing fashion teams..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Features
                </label>
                <textarea
                  rows={5}
                  value={featuresText}
                  onChange={(event) => setFeaturesText(event.target.value)}
                  className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                  placeholder={"1000 monthly credits\nPriority generation\nAdvanced trend reports"}
                />
              </div>

              <label className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-zinc-700">
                <input
                  type="checkbox"
                  checked={form.is_popular}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      is_popular: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                Mark as popular
              </label>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {isEditing ? "Update plan" : "Create plan"}
                  </>
                )}
              </button>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
};
