import React, { useEffect, useState } from "react";
import { api, formatErr } from "../../lib/api";
import { toast } from "sonner";

export default function AdminSettings() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then(({ data }) => { setForm(data); setLoading(false); });
  }, []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.admin_password) delete payload.admin_password;
      if (!payload.admin_email) delete payload.admin_email;
      const { data } = await api.put("/settings", payload);
      setForm({ ...data, admin_password: "" });
      toast.success("Settings saved");
      // Reload page-level settings via reload
      setTimeout(() => window.location.reload(), 600);
    } catch (e) { toast.error(formatErr(e.response?.data?.detail) || "Save failed"); }
    setSaving(false);
  };

  if (loading) return <div className="skeleton h-96"/>;

  const groups = [
    { title: "Business", fields: [
      ["business_name", "Business name"],
      ["logo", "Logo URL (or upload path)"],
      ["business_email", "Business email"],
      ["whatsapp_number", "WhatsApp number (with country code, digits only)"],
      ["business_address", "Business address", "textarea"],
      ["business_hours", "Business hours"],
    ]},
    { title: "Social", fields: [
      ["instagram_url", "Instagram URL"],
      ["facebook_url", "Facebook URL"],
      ["youtube_url", "YouTube URL"],
    ]},
    { title: "Homepage & SEO", fields: [
      ["homepage_title", "Homepage title"],
      ["about_text", "About text", "textarea"],
      ["footer_text", "Footer text"],
      ["seo_description", "SEO description", "textarea"],
      ["seo_keywords", "SEO keywords"],
      ["currency", "Default currency", "select", ["INR","GBP","USD"]],
    ]},
    { title: "Admin Credentials", fields: [
      ["admin_email", "New admin email (leave blank to keep)"],
      ["admin_password", "New admin password (leave blank to keep)", "password"],
    ]},
  ];

  return (
    <form onSubmit={submit}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">Configuration</div>
          <h1 className="font-serif text-4xl mt-2">Settings</h1>
          <p className="text-brown-soft mt-2">Manage your entire website without touching code.</p>
        </div>
        <button disabled={saving} className="btn-gold" data-testid="settings-save">{saving ? "Saving..." : "Save changes"}</button>
      </div>

      <div className="mt-8 space-y-8">
        {groups.map((g) => (
          <div key={g.title} className="card-luxe p-6 md:p-8">
            <div className="eyebrow">{g.title}</div>
            <div className="mt-5 grid md:grid-cols-2 gap-5">
              {g.fields.map(([key, label, type, opts]) => (
                <div key={key} className={type === "textarea" ? "md:col-span-2" : ""}>
                  <div className="text-xs uppercase tracking-[0.18em] text-brown-soft mb-2">{label}</div>
                  {type === "textarea" ? (
                    <textarea rows={3} value={form[key] || ""} onChange={(e) => set(key, e.target.value)} className="input py-2"/>
                  ) : type === "select" ? (
                    <select value={form[key] || ""} onChange={(e) => set(key, e.target.value)} className="input">
                      {(opts || []).map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type || "text"} value={form[key] || ""} onChange={(e) => set(key, e.target.value)} className="input" data-testid={`settings-${key}`}/>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`.input{width:100%;height:42px;padding:0 1rem;border-radius:0.75rem;border:1px solid hsl(var(--border));background:white;outline:none;font-size:14px}.input:focus{border-color:#D4AF37}textarea.input{height:auto;padding:.75rem 1rem}`}</style>
    </form>
  );
}
