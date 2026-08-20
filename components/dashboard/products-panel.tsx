"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Edit3,
  ImagePlus,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { categories, formatPrice } from "@/lib/data";
import type {
  CategoryId,
  Product,
  ProductColor,
  ProductFinish,
  ProductFinishOption,
} from "@/lib/types";
import { useProductStore } from "@/stores/product-store";
import { SelectMenu } from "@/components/ui/select-menu";

const defaultImage =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85";
const emptyProduct: Omit<Product, "id"> = {
  slug: "",
  name: "",
  shortName: "",
  description: "",
  category: "hogar",
  price: 0,
  image: defaultImage,
  colors: ["Rosa nube"],
  colorVariants: [
    { name: "Rosa nube", type: "matte", price: 0, image: defaultImage },
  ],
  colorPresentation: "single",
  availableFinishes: ["standard"],
  stock: 0,
  weightGrams: 100,
  featured: false,
};
const inputClass =
  "mt-2 w-full rounded-xl border border-[#e5d8dc] bg-white px-4 py-3 text-xs";
const labelClass = "text-[10px] font-bold";
const finishDetails: Record<
  ProductFinish,
  Omit<ProductFinishOption, "id" | "image">
> = {
  standard: {
    title: "Impreso a colores",
    description: "Color aplicado durante la impresión.",
    priceAdjustment: 0,
  },
  "hand-painted": {
    title: "Pintado a mano",
    description: "Detalles terminados manualmente.",
    priceAdjustment: 4.5,
  },
  "ready-to-paint": {
    title: "Diviertete pintando",
    description: "Base lista para personalizar en casa.",
    priceAdjustment: 0,
  },
};

export function DashboardProducts() {
  const products = useProductStore((state) => state.products);
  const add = useProductStore((state) => state.add);
  const update = useProductStore((state) => state.update);
  const remove = useProductStore((state) => state.remove);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<Product, "id">>(emptyProduct);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    [product.name, product.slug, product.category].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );

  function openCreate() {
    setEditingId(null);
    setDraft(emptyProduct);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    const { id, ...values } = product;
    const variants = values.colorVariants?.length
      ? values.colorVariants
      : values.colors.map((name) => ({
          name,
          type: "matte" as const,
          price: values.price,
          image: values.image,
        }));
    setEditingId(id);
    const availableFinishes: ProductFinish[] = values.availableFinishes?.length
      ? values.availableFinishes
      : ["standard"];
    setDraft({
      ...emptyProduct,
      ...values,
      colorVariants: variants.map((item) => ({
        ...item,
        price: item.price ?? values.price,
      })),
      colors: variants.map((item) => item.name),
      colorPresentation: values.colorPresentation ?? "single",
      availableFinishes,
      finishOptions:
        values.finishOptions ??
        availableFinishes.map((id) => ({
          id,
          ...finishDetails[id],
          image: values.image,
        })),
    });
    setFormOpen(true);
  }

  function save() {
    if (!draft.name.trim() || draft.price <= 0 || draft.weightGrams <= 0)
      return;
    const product = {
      ...draft,
      shortName: draft.shortName || draft.name,
      slug:
        draft.slug ||
        draft.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    };
    if (editingId) update(editingId, product);
    else add(product);
    setFormOpen(false);
  }

  function setPresentation(colorPresentation: "single" | "multicolor") {
    setDraft((current) => ({
      ...current,
      colorPresentation,
      availableFinishes:
        colorPresentation === "multicolor"
          ? ["standard"]
          : current.availableFinishes,
      colorVariants: (current.colorVariants ?? []).map((item) => ({
        ...item,
        type:
          colorPresentation === "multicolor"
            ? "multicolor"
            : item.type === "multicolor"
              ? "matte"
              : item.type,
      })),
    }));
  }

  function updateVariant(index: number, patch: Partial<ProductColor>) {
    setDraft((current) => {
      const colorVariants = (current.colorVariants ?? []).map(
        (item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
      );
      return {
        ...current,
        colorVariants,
        colors: colorVariants.map((item) => item.name),
      };
    });
  }

  function addVariant() {
    setDraft((current) => {
      const colorVariants = [
        ...(current.colorVariants ?? []),
        {
          name: "Nuevo color",
          type:
            current.colorPresentation === "multicolor"
              ? ("multicolor" as const)
              : ("matte" as const),
          price: current.price,
          image: current.image,
        },
      ];
      return {
        ...current,
        colorVariants,
        colors: colorVariants.map((item) => item.name),
      };
    });
  }

  function removeVariant(index: number) {
    setDraft((current) => {
      const colorVariants = (current.colorVariants ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      );
      return colorVariants.length
        ? {
            ...current,
            colorVariants,
            colors: colorVariants.map((item) => item.name),
          }
        : current;
    });
  }

  function toggleFinish(finish: ProductFinish) {
    if (draft.colorPresentation === "multicolor") return;
    setDraft((current) => {
      const finishes: ProductFinish[] = current.availableFinishes ?? [
        "standard",
      ];
      const availableFinishes = finishes.includes(finish)
        ? finishes.filter((item) => item !== finish)
        : [...finishes, finish];
      const next: ProductFinish[] = availableFinishes.length
        ? availableFinishes
        : ["standard"];
      return {
        ...current,
        availableFinishes: next,
        finishOptions: next.map(
          (id) =>
            current.finishOptions?.find((option) => option.id === id) ?? {
              id,
              ...finishDetails[id],
              image: current.image,
            },
        ),
      };
    });
  }

  function updateFinish(
    id: ProductFinish,
    patch: Partial<ProductFinishOption>,
  ) {
    setDraft((current) => {
      const finishes: ProductFinish[] = current.availableFinishes ?? [
        "standard",
      ];
      const finishOptions = finishes.map((finish) => ({
        id: finish,
        ...finishDetails[finish],
        image: current.image,
        ...current.finishOptions?.find((option) => option.id === finish),
        ...(finish === id ? patch : {}),
      }));
      return { ...current, finishOptions };
    });
  }

  function uploadImage(
    file: File | undefined,
    updateImage: (image: string) => void,
  ) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  if (formOpen)
    return (
      <div>
        <button
          onClick={() => setFormOpen(false)}
          className="inline-flex items-center gap-2 text-[10px] font-bold text-[#786970]"
        >
          <ArrowLeft size={13} /> Volver a productos
        </button>
        <div className="mt-5">
          <p className="eyebrow">Catálogo</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">
            {editingId ? "Editar producto" : "Nuevo producto"}
          </h2>
          <p className="mt-1 text-[10px] text-[#786970]">
            Configura precio, peso, colores y acabados disponibles.
          </p>
        </div>
        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="rounded-2xl bg-[#fffdfb] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>
                Nombre
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Slug
                <input
                  value={draft.slug}
                  onChange={(event) =>
                    setDraft({ ...draft, slug: event.target.value })
                  }
                  placeholder="Se genera automáticamente"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Categoría
                <SelectMenu
                  value={draft.category}
                  onChange={(category) =>
                    setDraft({ ...draft, category: category as CategoryId })
                  }
                  options={categories
                    .filter((item) => item.id !== "personalizadas")
                    .map((item) => ({ value: item.id, label: item.name }))}
                  className="mt-2"
                />
              </label>
              <label className={labelClass}>
                Precio USD
                <input
                  value={draft.price || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, price: Number(event.target.value) })
                  }
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Stock
                <input
                  value={draft.stock}
                  onChange={(event) =>
                    setDraft({ ...draft, stock: Number(event.target.value) })
                  }
                  type="number"
                  min="0"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Peso empacado (gramos)
                <input
                  value={draft.weightGrams}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      weightGrams: Number(event.target.value),
                    })
                  }
                  type="number"
                  min="1"
                  className={inputClass}
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Descripción
                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                  rows={3}
                  className={inputClass}
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Imagen de portada
                <input
                  value={draft.image}
                  onChange={(event) =>
                    setDraft({ ...draft, image: event.target.value })
                  }
                  placeholder="Pega una URL de imagen"
                  className={inputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    uploadImage(event.target.files?.[0], (image) =>
                      setDraft((current) => ({ ...current, image })),
                    )
                  }
                  className="sr-only"
                />
                <span className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c9adb5] bg-[#faf6f6] px-4 py-3 text-xs text-[#786970]">
                  <ImagePlus size={15} /> O sube un archivo desde tu equipo
                </span>
              </label>
            </div>
            <section className="mt-7 border-t border-[#e5d8dc] pt-6">
              <p className="text-xs font-extrabold uppercase tracking-wider">
                Composicion de color
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => setPresentation("single")}
                  className={`rounded-xl border p-3 text-left text-xs font-bold ${draft.colorPresentation !== "multicolor" ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]"}`}
                >
                  Un color por pieza
                </button>
                <button
                  onClick={() => setPresentation("multicolor")}
                  className={`rounded-xl border p-3 text-left text-xs font-bold ${draft.colorPresentation === "multicolor" ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]"}`}
                >
                  Varias versiones de color
                </button>
              </div>
            </section>
            {draft.colorPresentation === "multicolor" && (
              <section className="mt-7 border-t border-[#e5d8dc] pt-6">
                <p className="text-xs font-extrabold uppercase tracking-wider">
                  Varias versiones de color
                </p>
                <p className="mt-2 text-[10px] text-[#786970]">
                  El cliente podrá escoger una de estas versiones. No se
                  muestran acabados para esta modalidad.
                </p>
                <div className="mt-4 space-y-3">
                  {(draft.colorVariants ?? []).map((variant, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-[#e5d8dc] p-4"
                    >
                      <div className="flex justify-between">
                        <p className="text-[10px] font-bold">
                          Versión {index + 1}
                        </p>
                        {(draft.colorVariants?.length ?? 0) > 1 && (
                          <button
                            onClick={() => removeVariant(index)}
                            className="text-[10px] font-bold text-[#9e5f72]"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <input
                          value={variant.name}
                          onChange={(event) =>
                            updateVariant(index, { name: event.target.value })
                          }
                          placeholder="Nombre de la versión"
                          className={inputClass.replace("mt-2 ", "")}
                        />
                        <input
                          value={variant.price || ""}
                          onChange={(event) =>
                            updateVariant(index, {
                              price: Number(event.target.value),
                            })
                          }
                          type="number"
                          step="0.01"
                          placeholder="Precio USD"
                          className={inputClass.replace("mt-2 ", "")}
                        />
                      </div>
                      <label className="mt-3 block text-[10px] font-bold">
                        Imagen de la versión: URL o archivo
                        <input
                          value={variant.image}
                          onChange={(event) =>
                            updateVariant(index, { image: event.target.value })
                          }
                          placeholder="Pega una URL de imagen"
                          className={inputClass}
                        />
                      </label>
                      <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c9adb5] bg-[#faf6f6] px-4 py-3 text-xs text-[#786970]">
                        <ImagePlus size={15} /> O sube un archivo desde tu
                        equipo
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) =>
                            uploadImage(event.target.files?.[0], (image) =>
                              updateVariant(index, { image }),
                            )
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addVariant}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d8c9cd] px-4 py-2 text-[10px] font-bold"
                >
                  <Plus size={12} /> Agregar versión
                </button>
              </section>
            )}
            {draft.colorPresentation !== "multicolor" && (
              <section className="mt-7 border-t border-[#e5d8dc] pt-6">
                <p className="text-xs font-extrabold uppercase tracking-wider">
                  Acabados disponibles
                </p>
                <p className="mt-1 text-[10px] text-[#786970]">
                  Activa cada acabado que quieres ofrecer. El cliente verá su
                  imagen antes de elegirlo.
                </p>
                <div className="mt-4 space-y-4">
                  {(
                    [
                      "standard",
                      "hand-painted",
                      "ready-to-paint",
                    ] as ProductFinish[]
                  ).map((finish) => {
                    const selected = (draft.availableFinishes ?? []).includes(
                      finish,
                    );
                    const option = draft.finishOptions?.find(
                      (item) => item.id === finish,
                    );
                    return (
                      <div
                        key={finish}
                        className={`rounded-2xl border p-5 ${selected ? "border-[#c98698] bg-[#faf6f6]" : "border-[#e5d8dc] bg-white"}`}
                      >
                        <button
                          onClick={() => toggleFinish(finish)}
                          className={`flex w-full items-start justify-between text-left ${selected ? "text-[#9e5f72]" : ""}`}
                        >
                          <span>
                            <span className="block text-xs font-bold">
                              {selected ? "✓ " : "+ "}
                              {finishDetails[finish].title}
                            </span>
                            <span className="mt-1 block text-[10px] leading-5 text-[#786970]">
                              {finishDetails[finish].description}
                            </span>
                          </span>
                          <span className="text-[9px] font-bold">
                            {selected ? "Activo" : "Agregar"}
                          </span>
                        </button>
                        {selected && (
                          <div className="mt-5 grid gap-4 border-t border-[#e5d8dc] pt-4 sm:grid-cols-2">
                            <label className="text-[10px] font-bold">
                              Costo adicional (USD)
                              {finish === "ready-to-paint" && (
                                <span className="ml-1 font-normal text-[#786970]">
                                  Incluido, sin recargo
                                </span>
                              )}
                              <input
                                value={
                                  option?.priceAdjustment ??
                                  finishDetails[finish].priceAdjustment
                                }
                                disabled={finish === "ready-to-paint"}
                                onChange={(event) =>
                                  updateFinish(finish, {
                                    priceAdjustment: Number(event.target.value),
                                  })
                                }
                                type="number"
                                step="0.01"
                                className={inputClass}
                              />
                            </label>
                            <label className="text-[10px] font-bold">
                              Imagen de referencia por URL
                              <input
                                value={option?.image ?? ""}
                                onChange={(event) =>
                                  updateFinish(finish, {
                                    image: event.target.value,
                                  })
                                }
                                placeholder="https://..."
                                className={inputClass}
                              />
                            </label>
                            <label className="cursor-pointer rounded-xl border border-dashed border-[#c9adb5] bg-white px-4 py-3 text-[10px] font-bold text-[#786970] sm:col-span-2">
                              <span className="flex items-center gap-2">
                                <ImagePlus size={15} /> O sube una imagen del
                                acabado
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) =>
                                  uploadImage(
                                    event.target.files?.[0],
                                    (image) => updateFinish(finish, { image }),
                                  )
                                }
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            <button
              onClick={save}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#35282d] px-5 py-3 text-[10px] font-bold text-white"
            >
              <Save size={13} /> Guardar producto
            </button>
          </div>
          <aside className="h-fit rounded-2xl bg-[#ead7dc] p-5">
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">
              Vista previa
            </p>
            <div className="relative mt-4 aspect-square overflow-hidden rounded-2xl bg-white">
              {draft.image && (
                <Image
                  src={draft.image}
                  alt="Vista previa"
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              )}
            </div>
            <p className="mt-4 font-display text-2xl font-semibold">
              {draft.name || "Nombre del producto"}
            </p>
            <div className="mt-2 flex justify-between text-xs">
              <span>{formatPrice(draft.price)}</span>
              <span>{draft.weightGrams} g</span>
            </div>
          </aside>
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-semibold">Productos</h2>
          <p className="mt-1 text-[10px] text-[#786970]">
            {products.length} productos con inventario y peso logistico
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-[#35282d] px-5 py-3 text-[10px] font-bold text-white"
        >
          <Plus size={13} /> Nuevo producto
        </button>
      </div>
      <label className="relative mt-5 block max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]"
          size={14}
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, slug o categoría"
          className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px] outline-none focus:border-[#9e5f72]"
          aria-label="Buscar productos"
        />
      </label>
      <div className="mt-4 overflow-hidden rounded-2xl bg-[#fffdfb]">
        <div className="hidden grid-cols-[2fr_1fr_.7fr_.7fr_.7fr_auto] gap-4 border-b border-[#e5d8dc] px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-[#91848a] md:grid">
          <span>Producto</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Peso</span>
          <span>Stock</span>
          <span>Acciones</span>
        </div>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-[#eee5e7] px-4 py-4 last:border-0 md:grid-cols-[52px_2fr_1fr_.7fr_.7fr_.7fr_auto]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="52px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold">{product.name}</p>
                <p className="mt-1 text-[9px] text-[#91848a]">{product.slug}</p>
              </div>
              <span className="hidden text-[10px] capitalize text-[#786970] md:block">
                {product.category}
              </span>
              <span className="hidden text-[11px] font-bold md:block">
                {formatPrice(product.price)}
              </span>
              <span className="hidden text-[10px] md:block">
                {product.weightGrams ?? 250} g
              </span>
              <span className="hidden text-[10px] md:block">
                {product.stock}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(product)}
                  className="grid size-8 place-items-center rounded-full border border-[#e5d8dc]"
                  aria-label={`Editar ${product.name}`}
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `¿Eliminar ${product.name}? Esta accion no se puede deshacer.`,
                      )
                    )
                      remove(product.id);
                  }}
                  className="grid size-8 place-items-center rounded-full border border-[#e5d8dc] text-[#9e5f72]"
                  aria-label={`Eliminar ${product.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-5 text-center text-[10px] text-[#786970]">
            No se encontraron productos.
          </p>
        )}
      </div>
    </div>
  );
}
