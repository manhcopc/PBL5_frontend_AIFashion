import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Header from "@/components/user/Header";
import { useAuthStore } from "@/features/auth/state/use-auth-store";
import useUserSettings from "@/hooks/useUserSettings";

function Message({
  tone,
  text,
}: {
  tone: "success" | "error";
  text: string | null;
}) {
  if (!text) return null;

  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
        tone === "success"
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-rose-100 bg-rose-50 text-rose-700"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{text}</p>
    </div>
  );
}

export default function UserSettings() {
  const user = useAuthStore((state) => state.user);
  const {
    profileState,
    passwordState,
    submitProfile,
    submitPassword,
    clearProfileMessage,
    clearPasswordMessage,
  } = useUserSettings();

  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitProfile(profileForm);
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await submitPassword(passwordForm);

    if (success) {
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    }
  };

  return (
    <main className="min-h-full bg-zinc-50">
      <Header />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <section>
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-zinc-500">
            Update your account profile and manage your password.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-zinc-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm font-medium text-zinc-500">
                  Keep your display name and email address up to date.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">
                  Username
                </label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={profileForm.username}
                    onChange={(event) => {
                      clearProfileMessage();
                      setProfileForm((prev) => ({
                        ...prev,
                        username: event.target.value,
                      }));
                    }}
                    disabled={profileState.isLoading}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 disabled:bg-zinc-50"
                    placeholder="Your username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(event) => {
                      clearProfileMessage();
                      setProfileForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }));
                    }}
                    disabled={profileState.isLoading}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 disabled:bg-zinc-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <Message tone="success" text={profileState.success} />
              <Message tone="error" text={profileState.error} />

              <button
                type="submit"
                disabled={profileState.isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {profileState.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Profile
              </button>
            </form>
          </section>

          <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-zinc-900">
              Account Summary
            </h2>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                  Email
                </p>
                <p className="mt-1 break-all text-sm font-bold text-zinc-800">
                  {user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                  Role
                </p>
                <p className="mt-1 text-sm font-bold capitalize text-zinc-800">
                  {user?.role || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                  Credits
                </p>
                <p className="mt-1 text-sm font-bold text-indigo-700">
                  {user?.available_credits ?? 0}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900">
                Change Password
              </h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                Use your current password to set a new password.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3"
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">
                Current password
              </label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(event) => {
                  clearPasswordMessage();
                  setPasswordForm((prev) => ({
                    ...prev,
                    current_password: event.target.value,
                  }));
                }}
                disabled={passwordState.isLoading}
                required
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 disabled:bg-zinc-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">
                New password
              </label>
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(event) => {
                  clearPasswordMessage();
                  setPasswordForm((prev) => ({
                    ...prev,
                    new_password: event.target.value,
                  }));
                }}
                disabled={passwordState.isLoading}
                required
                minLength={6}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 disabled:bg-zinc-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">
                Confirm password
              </label>
              <input
                type="password"
                value={passwordForm.confirm_password}
                onChange={(event) => {
                  clearPasswordMessage();
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirm_password: event.target.value,
                  }));
                }}
                disabled={passwordState.isLoading}
                required
                minLength={6}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 disabled:bg-zinc-50"
              />
            </div>

            <div className="lg:col-span-3">
              <Message tone="success" text={passwordState.success} />
              <Message tone="error" text={passwordState.error} />
            </div>

            <div className="lg:col-span-3">
              <button
                type="submit"
                disabled={passwordState.isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {passwordState.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                Change Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
