import React, { useEffect, useState, useRef } from "react";
import { api, fileUrl, formatErr } from "../../lib/api";
import { toast } from "sonner";
import { Plus, Edit3, Trash2, Copy, X, Upload, GripVertical, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [q, setQ] = useState("");

  const load = () => {
    setLoading(true);
    api.get(`/products?limit=500&status=`).then(({ data }) => {
      setItems(data.items || []); setLoading(false);
    });
  };

  useEffect(() => {
    load();
    Promise.all([api.get("/categories"), api.get("/collections")]).then(([c, cl]) => {
      setCategories(c.data); setCollections(cl.data);
    });
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Deleted"); load();
  };
  const duplicate = async (id) => {
    await api.post(`/products/${id}/duplicate`);
    toast.success("Duplicated"); load();
  };
  const toggleStatus = async (p) => {
    const next = p.status === "published" ? "hidden" : "published";
    await api.put(`/products/${p.id}`, { ...p, status: next });
    toast.success(next === "published" ? "Published" : "Hidden");
    load();
  };

  const filtered = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">Catalog</div>
          <h1 className="font-serif text-4xl mt-2">Products</h1>
        </div>
        <button onClick={() => setEditing({})} className="btn-gold" data-testid="add-product-btn">
          <Plus className="w-4 h-4"/> Add Product
        </button>
      </div>

      <div className="mt-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..."
          className="w-full md:w-96 h-11 rounded-full border border-border px-5 bg-white outline-none focus:border-gold"/>
      </div>

      <div className="mt-6 card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream text-brown-soft">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-6"><div className="skeleton h-16"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-brown-soft">No products yet. Add your first product.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-t border-border" data-testid={`row-product-${p.slug}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? <img src={fileUrl(p.images[0])} alt="" className="w-12 h-14 object-cover rounded"/> : <div className="w-12 h-14 bg-cream rounded"/>}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-brown-soft">{(p.categories || []).slice(0, 2).join(" · ")}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>₹{Number(p.price_inr || 0).toLocaleString("en-IN")}</div>
                    {p.price_gbp ? <div className="text-xs text-brown-soft">£{Number(p.price_gbp).toLocaleString("en-GB")}</div> : null}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                      p.status === "published" ? "bg-green-50 text-green-700" : "bg-gray-100 text-brown-soft"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 justify-end">
                      <IconBtn onClick={() => toggleStatus(p)} title={p.status === "published" ? "Hide" : "Publish"}>
                        {p.status === "published" ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </IconBtn>
                      <IconBtn onClick={() => setEditing(p)} title="Edit" tid={`edit-${p.slug}`}><Edit3 className="w-4 h-4"/></IconBtn>
                      <IconBtn onClick={() => duplicate(p.id)} title="Duplicate"><Copy className="w-4 h-4"/></IconBtn>
                      <IconBtn onClick={() => remove(p.id)} title="Delete" tid={`delete-${p.slug}`} className="hover:text-red-600"><Trash2 className="w-4 h-4"/></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ProductForm
          initial={editing}
          categories={categories}
          collections={collections}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function IconBtn({ children, tid, className = "", ...rest }) {
  return <button data-testid={tid} className={`p-2 rounded-lg hover:bg-cream text-brown-soft hover:text-brown-dark ${className}`} {...rest}>{children}</button>;
}

function ProductForm({ initial, categories, collections, onClose, onSaved }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    fabric: initial?.fabric || "",
    wash: initial?.wash || "",
    price_inr: initial?.price_inr || 0,
    price_gbp: initial?.price_gbp || 0,
    categories: initial?.categories || [],
    collections: initial?.collections || [],
    tags: initial?.tags || [],
    colors: initial?.colors || [],
    images: initial?.images || [],
    status: initial?.status || "published",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const toggle = (k, v) => setForm((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));

  const onFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const f of Array.from(files)) {
        const fd = new FormData(); fd.append("file", f);
        const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" }});
        uploaded.push(data.path);
      }
      set("images", [...form.images, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (e) { toast.error(formatErr(e.response?.data?.detail) || "Upload failed"); }
    setUploading(false);
  };

  const removeImage = (i) => set("images", form.images.filter((_, j) => j !== i));
  const moveImage = (i, dir) => {
    const next = [...form.images];
    const t = i + dir;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    set("images", next);
  };

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, price_inr: Number(form.price_inr), price_gbp: Number(form.price_gbp) };
      if (isEdit) await api.put(`/products/${initial.id}`, payload);
      else await api.post("/products", payload);
      toast.success(isEdit ? "Updated" : "Created");
      onSaved();
    } catch (e) { toast.error(formatErr(e.response?.data?.detail) || "Save failed"); }
    setSaving(false);
  };

  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-floating">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <div className="eyebrow">{isEdit ? "Edit" : "New"}</div>
            <h2 className="font-serif text-2xl">{isEdit ? "Edit product" : "Add product"}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <Field label="Product name">
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} data-testid="pf-name" className="input"/>
            </Field>
            <Field label="Description">
              <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="input py-2"/>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fabric">
                <input value={form.fabric} onChange={(e) => set("fabric", e.target.value)} className="input"/>
              </Field>
              <Field label="Wash instructions">
                <input value={form.wash} onChange={(e) => set("wash", e.target.value)} className="input"/>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price INR">
                <input required type="number" step="0.01" value={form.price_inr} onChange={(e) => set("price_inr", e.target.value)} data-testid="pf-price-inr" className="input"/>
              </Field>
              <Field label="Price GBP">
                <input type="number" step="0.01" value={form.price_gbp} onChange={(e) => set("price_gbp", e.target.value)} className="input"/>
              </Field>
            </div>
            <Field label="Status">
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
              </select>
            </Field>
          </div>

          <div className="space-y-4">
            <Field label={`Categories (${form.categories.length})`}>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto border border-border rounded-lg p-2 bg-cream-light">
                {categories.map((c) => (
                  <button key={c.id} type="button" onClick={() => toggle("categories", c.name)}
                    className={`px-3 py-1 rounded-full text-xs border ${form.categories.includes(c.name) ? "bg-gold text-white border-gold" : "border-border hover:border-gold"}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={`Collections (${form.collections.length})`}>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto border border-border rounded-lg p-2 bg-cream-light">
                {collections.map((c) => (
                  <button key={c.id} type="button" onClick={() => toggle("collections", c.name)}
                    className={`px-3 py-1 rounded-full text-xs border ${form.collections.includes(c.name) ? "bg-gold text-white border-gold" : "border-border hover:border-gold"}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Tags (press Enter)">
              <div className="flex flex-wrap gap-1.5 border border-border rounded-lg p-2 bg-white min-h-[42px]">
                {form.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-gold-soft rounded-full text-xs">
                    {t} <button type="button" onClick={() => set("tags", form.tags.filter(x => x !== t))}><X className="w-3 h-3"/></button>
                  </span>
                ))}
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) { e.preventDefault(); set("tags", [...form.tags, tagInput.trim()]); setTagInput(""); } }}
                  className="flex-1 min-w-[100px] bg-transparent outline-none text-sm"/>
              </div>
            </Field>
            <Field label="Colors (press Enter)">
              <div className="flex flex-wrap gap-1.5 border border-border rounded-lg p-2 bg-white min-h-[42px]">
                {form.colors.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-gold-soft rounded-full text-xs">
                    {t} <button type="button" onClick={() => set("colors", form.colors.filter(x => x !== t))}><X className="w-3 h-3"/></button>
                  </span>
                ))}
                <input value={colorInput} onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && colorInput.trim()) { e.preventDefault(); set("colors", [...form.colors, colorInput.trim()]); setColorInput(""); } }}
                  className="flex-1 min-w-[100px] bg-transparent outline-none text-sm"/>
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label={`Images (${form.images.length})`}>
              <div className="border-2 border-dashed border-border rounded-xl p-6 bg-cream-light"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline-gold" data-testid="pf-upload">
                    <Upload className="w-4 h-4"/> Upload
                  </button>
                  <span className="text-sm text-brown-soft">or drag & drop images here</span>
                  <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)}/>
                </div>
                {uploading && <div className="mt-3 text-xs text-brown-soft">Uploading...</div>}
                <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3">
                  {form.images.map((img, i) => (
                    <div key={img + i} className="relative group aspect-square bg-white rounded-lg overflow-hidden border border-border">
                      <img src={fileUrl(img)} alt="" className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveImage(i, -1)} className="p-1 hover:text-gold" title="Move up"><GripVertical className="w-4 h-4 rotate-90"/></button>
                          <button type="button" onClick={() => moveImage(i, 1)} className="p-1 hover:text-gold" title="Move down"><GripVertical className="w-4 h-4 -rotate-90"/></button>
                        </div>
                        <button type="button" onClick={() => removeImage(i)} className="text-xs hover:text-red-400">Remove</button>
                      </div>
                      {i === 0 && <span className="absolute top-1 left-1 bg-gold text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded">Cover</span>}
                    </div>
                  ))}
                </div>
              </div>
            </Field>
          </div>
        </div>
        <div className="p-6 border-t border-border flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-outline-gold">Cancel</button>
          <button type="submit" disabled={saving} className="btn-gold" data-testid="pf-save">
            {saving ? "Saving..." : isEdit ? "Update product" : "Create product"}
          </button>
        </div>
      </form>
      <style>{`.input{width:100%;height:42px;padding:0 1rem;border-radius:0.75rem;border:1px solid hsl(var(--border));background:white;outline:none;font-size:14px}.input:focus{border-color:#D4AF37}textarea.input{height:auto;padding:.75rem 1rem}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-brown-soft mb-2">{label}</div>
      {children}
    </div>
  );
}
