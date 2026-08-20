"use client";

import Image from "next/image";
import { ArrowLeft, Edit3, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { categories, formatPrice } from "@/lib/data";
import type { CategoryId, Product } from "@/lib/types";
import { useProductStore } from "@/stores/product-store";

const emptyProduct: Omit<Product, "id"> = {
  slug: "",
  name: "",
  shortName: "",
  description: "",
  category: "hogar",
  price: 0,
  image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
  colors: ["Rosa nube"],
  stock: 0,
  weightGrams: 100,
  featured: false,
};

const inputClass = "w-full rounded-xl border border-[#e5d8dc] bg-white px-4 py-3 text-xs";

export function DashboardProducts() {
  const products = useProductStore((state) => state.products);
  const add = useProductStore((state) => state.add);
  const update = useProductStore((state) => state.update);
  const remove = useProductStore((state) => state.remove);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<Product, "id">>(emptyProduct);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyProduct);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    const { id, ...values } = product;
    setEditingId(id);
    setDraft(values);
    setFormOpen(true);
  }

  function save() {
    if (!draft.name.trim() || draft.price <= 0 || draft.weightGrams <= 0) return;
    const normalized = {
      ...draft,
      shortName: draft.shortName || draft.name,
      slug: draft.slug || draft.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    };
    if (editingId) update(editingId, normalized);
    else add(normalized);
    setFormOpen(false);
  }

  function deleteProduct(product: Product) {
    if (window.confirm(`¿Eliminar ${product.name}? Esta accion no se puede deshacer.`)) remove(product.id);
  }

  if (formOpen) {
    return (
      <div>
        <button onClick={() => setFormOpen(false)} className="inline-flex items-center gap-2 text-[10px] font-bold text-[#786970]"><ArrowLeft size={13} /> Volver a productos</button>
        <div className="mt-5 flex items-end justify-between"><div><p className="eyebrow">Catalogo</p><h2 className="mt-2 font-display text-4xl font-semibold">{editingId ? "Editar producto" : "Nuevo producto"}</h2><p className="mt-1 text-[10px] text-[#786970]">Precio, inventario, peso logistico y contenido comercial.</p></div></div>
        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="rounded-2xl bg-[#fffdfb] p-6"><div className="grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-bold sm:col-span-2">Nombre<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={`${inputClass} mt-2`} /></label><label className="text-[10px] font-bold">Slug<input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="Se genera automaticamente" className={`${inputClass} mt-2`} /></label><label className="text-[10px] font-bold">Categoria<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as CategoryId })} className={`${inputClass} mt-2`}>{categories.filter((item) => item.id !== "personalizadas").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-[10px] font-bold">Precio USD<input value={draft.price || ""} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} type="number" min="0" step="0.01" className={`${inputClass} mt-2`} /></label><label className="text-[10px] font-bold">Stock<input value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} type="number" min="0" className={`${inputClass} mt-2`} /></label><label className="text-[10px] font-bold">Peso empacado (gramos)<input value={draft.weightGrams} onChange={(event) => setDraft({ ...draft, weightGrams: Number(event.target.value) })} type="number" min="1" className={`${inputClass} mt-2`} /></label><label className="text-[10px] font-bold">Colores separados por coma<input value={draft.colors.join(", ")} onChange={(event) => setDraft({ ...draft, colors: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} className={`${inputClass} mt-2`} /></label><label className="text-[10px] font-bold sm:col-span-2">Descripcion<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={5} className={`${inputClass} mt-2 resize-none`} /></label><label className="text-[10px] font-bold sm:col-span-2">URL de imagen<input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} className={`${inputClass} mt-2`} /></label></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setFormOpen(false)} className="rounded-full border border-[#d8c9cd] px-5 py-3 text-[10px] font-bold">Cancelar</button><button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-[#35282d] px-6 py-3 text-[10px] font-bold text-white"><Save size={13} /> Guardar producto</button></div></div>
          <aside className="h-fit rounded-2xl bg-[#ead7dc] p-5"><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Vista previa</p><div className="relative mt-4 aspect-square overflow-hidden rounded-2xl bg-white">{draft.image && <Image src={draft.image} alt="Vista previa" fill sizes="320px" className="object-cover" />}</div><p className="mt-4 font-display text-2xl font-semibold">{draft.name || "Nombre del producto"}</p><div className="mt-2 flex justify-between text-xs"><span>{formatPrice(draft.price)}</span><span>{draft.weightGrams} g</span></div></aside>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-4xl font-semibold">Productos</h2><p className="mt-1 text-[10px] text-[#786970]">{products.length} productos con inventario y peso logistico</p></div><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-[#35282d] px-5 py-3 text-[10px] font-bold text-white"><Plus size={13} /> Nuevo producto</button></div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-[#fffdfb]"><div className="hidden grid-cols-[2fr_1fr_.7fr_.7fr_.7fr_auto] gap-4 border-b border-[#e5d8dc] px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-[#91848a] md:grid"><span>Producto</span><span>Categoria</span><span>Precio</span><span>Peso</span><span>Stock</span><span>Acciones</span></div>{products.map((product) => <div key={product.id} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-[#eee5e7] px-4 py-4 last:border-0 md:grid-cols-[52px_2fr_1fr_.7fr_.7fr_.7fr_auto]"><div className="relative aspect-square overflow-hidden rounded-xl"><Image src={product.image} alt={product.name} fill sizes="52px" className="object-cover" /></div><div><p className="text-xs font-bold">{product.name}</p><p className="mt-1 text-[9px] text-[#91848a]">{product.slug}</p></div><span className="hidden text-[10px] capitalize text-[#786970] md:block">{product.category}</span><span className="hidden text-[11px] font-bold md:block">{formatPrice(product.price)}</span><span className="hidden text-[10px] md:block">{product.weightGrams ?? 250} g</span><span className="hidden text-[10px] md:block">{product.stock}</span><div className="flex gap-1"><button onClick={() => openEdit(product)} className="grid size-8 place-items-center rounded-full border border-[#e5d8dc]" aria-label={`Editar ${product.name}`}><Edit3 size={13} /></button><button onClick={() => deleteProduct(product)} className="grid size-8 place-items-center rounded-full border border-[#e5d8dc] text-[#9e5f72]" aria-label={`Eliminar ${product.name}`}><Trash2 size={13} /></button></div></div>)}</div>
    </div>
  );
}
