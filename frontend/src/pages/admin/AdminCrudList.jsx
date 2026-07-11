import React, { useEffect, useState } from "react";
import { api, formatErr } from "../../lib/api";
import { toast } from "sonner";
import { Plus, Edit3, Trash2, X } from "lucide-react";

export default function AdminCrudList({ endpoint, title, eyebrow, fields, testIdPrefix }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get(`/${endpoint}`).then(({ data }) => { setItems(data); setLoading(false); });
  };
  useEffect(() => { load(); }, [endpoint]);

  const remove = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/${endpoint}/${id}`);
    toast.success("Deleted"); load();
  };

  const save = async (data, id) => {
    try {
      if (id) await api.put(`/${endpoint}/${id}`, data);
      else await api.post(`/${endpoint}`, data);
      toast.success(id ? "Updated" : "Created");
      setEditing(null); load();
    } catch (e) { toast.error(formatErr(e.response?.data?.detail) || "Save failed"); }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="font-serif text-4xl mt-2">{title}</h1>
        </div>
        <button onClick={() => setEditing({})} className="btn-gold" data-testid={`add-${testIdPrefix}`}>
          <Plus className="w-4 h-4"/> Add {title.slice(0, -1)}
        </button>
      </div>

      <div className="mt-6 card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream text-brown-soft">
              <tr>
                {fields.map((f) => <th key={f.key} className="text-left p-4 font-medium">{f.label}</th>)}
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={fields.length + 1} className="p-6"><div className="skeleton h-12"/></td></tr>
              : items.length === 0 ? <tr><td colSpan={fields.length + 1} className="p-10 text-center text-brown-soft">Nothing here yet.</td></tr>
              : items.map((it) => (
                <tr key={it.id} className="border-t border-border" data-testid={`row-${testIdPrefix}-${it.id}`}>
                  {fields.map((f) => <td key={f.key} className="p-4">{f.render ? f.render(it) : (it[f.key] || "—")}</td>)}
                  <td className="p-4">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditing(it)} className="p-2 rounded-lg hover:bg-cream text-brown-soft" data-testid={`edit-${testIdPrefix}-${it.id}`}><Edit3 className="w-4 h-4"/></button>
                      <button onClick={() => remove(it.id)} className="p-2 rounded-lg hover:bg-cream text-brown-soft hover:text-red-600" data-testid={`delete-${testIdPrefix}-${it.id}`}><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <CrudForm initial={editing} fields={fields} onClose={() => setEditing(null)} onSave={(d) => save(d, editing.id)} title={title} />
      )}
    </div>
  );
}

function CrudForm({ initial, fields, onClose, onSave, title }) {
  const [form, setForm] = useState(() => {
    const f = {};
    fields.forEach((fld) => { f[fld.key] = initial?.[fld.key] ?? (fld.type === "number" ? 0 : ""); });
    return f;
  });
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    await onSave(form); setSaving(false);
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-2xl w-full max-w-lg shadow-floating">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-serif text-2xl">{initial?.id ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}</h2>
          <button type="button" onClick={onClose} className="p-2"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 space-y-4">
          {fields.filter((f) => f.editable !== false).map((f) => (
            <div key={f.key}>
              <div className="text-xs uppercase tracking-[0.18em] text-brown-soft mb-2">{f.label}</div>
              {f.type === "textarea" ? (
                <textarea rows={3} value={form[f.key] || ""} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} className="input py-2"/>
              ) : f.type === "select" ? (
                <select value={form[f.key] || ""} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} className="input">
                  {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || "text"} value={form[f.key] || ""} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} className="input"/>
              )}
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-outline-gold">Cancel</button>
          <button type="submit" disabled={saving} className="btn-gold">{saving ? "Saving..." : "Save"}</button>
        </div>
        <style>{`.input{width:100%;height:42px;padding:0 1rem;border-radius:0.75rem;border:1px solid hsl(var(--border));background:white;outline:none;font-size:14px}.input:focus{border-color:#D4AF37}textarea.input{height:auto;padding:.75rem 1rem}`}</style>
      </form>
    </div>
  );
}
