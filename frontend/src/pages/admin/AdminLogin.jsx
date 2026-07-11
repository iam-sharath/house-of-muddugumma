import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../lib/store";
import { formatErr } from "../../lib/api";
import { toast } from "sonner";

export default function AdminLogin() {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  if (loading) return null;
  if (user?.role === "admin") return <Navigate to="/admin" replace/>;

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      await login(email, password);
      toast.success("Welcome back");
      nav("/admin");
    } catch (e) {
      setErr(formatErr(e.response?.data?.detail) || e.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-16">
      <form onSubmit={onSubmit} className="card-luxe w-full max-w-md p-10">
        <img src="/brand/logo.png" className="h-16 w-16 mx-auto rounded-full object-cover" alt="logo"/>
        <div className="text-center mt-5">
          <div className="eyebrow">Admin</div>
          <h1 className="font-serif text-3xl mt-2">Sign in</h1>
          <p className="text-sm text-brown-soft mt-2">Access your dashboard.</p>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-brown-soft">Email</label>
            <input data-testid="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-11 rounded-full border border-border px-5 bg-white outline-none focus:border-gold"/>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-brown-soft">Password</label>
            <input data-testid="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-11 rounded-full border border-border px-5 bg-white outline-none focus:border-gold"/>
          </div>
          {err && <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3" data-testid="login-error">{err}</div>}
          <button data-testid="admin-login-submit" disabled={busy} className="btn-gold w-full">{busy ? "Signing in..." : "Sign in"}</button>
        </div>
      </form>
    </div>
  );
}
