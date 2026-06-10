import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, Mail, Lock } from "lucide-react";
import { useAuthActions } from "../../features/auth/logic/use-auth-action";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const {
    handleLogin,
    handleRegister,
    clearAuthMessages,
    isLoading,
    error,
    success,
  } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogin({ email, password });
    } else {
      const registered = await handleRegister({
        email,
        password,
        username,
        role: "user",
      });

      if (registered) {
        setIsLogin(true);
        setPassword("");
      }
    }
  };

  return (
    <div className="min-h-screen flex text-zinc-900 font-sans bg-zinc-50">
      <div className="hidden lg:flex w-1/2 relative bg-zinc-100 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-white/15" />
        <div className="absolute bottom-10 left-10 right-10 p-8 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Create Fashion,
            <br />
            Powered by AI
          </h2>
          <p className="text-zinc-600">
            Discover your unique style with our advanced artificial intelligence
            fashion recommendations.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center mb-10">
            <h1 className="text-3xl font-extrabold tracking-tighter flex items-center gap-2">
              <img
                src="/logo.png"
                alt="TrendEngine logo"
                className="h-11 w-11 rounded-xl object-contain shadow-sm"
              />
              TrendEngine
            </h1>
          </div>

          <div className="flex p-1 bg-zinc-100 rounded-lg mb-8 border border-zinc-200">
            <button
              onClick={() => {
                setIsLogin(true);
                clearAuthMessages();
              }}
              disabled={isLoading}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isLogin
                  ? "bg-white shadow-sm text-indigo-700"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                clearAuthMessages();
              }}
              disabled={isLoading}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isLogin
                  ? "bg-white shadow-sm text-indigo-700"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      clearAuthMessages();
                      setUsername(e.target.value);
                    }}
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-11 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-zinc-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    clearAuthMessages();
                    setEmail(e.target.value);
                  }}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  autoComplete="email"
                  className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-11 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700">
                  Password
                </label>
                {isLogin && (
                  <a
                    href="#"
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    clearAuthMessages();
                    setPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-11 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-sm font-medium leading-relaxed">{success}</p>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-50 text-zinc-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            className="mt-8 w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
            onClick={() => navigate("/dashboard")}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
}
