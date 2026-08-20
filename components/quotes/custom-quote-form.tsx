"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Info, MessageCircle, Ruler, Send, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useQuoteStore, type QuoteImage } from "@/stores/quote-store";
import { SelectMenu } from "@/components/ui/select-menu";

const quoteSchema = z.object({
  name: z.string().min(2, "Escribe tu nombre"),
  phone: z.string().min(8, "Escribe un número válido"),
  description: z.string().min(12, "Cuéntanos un poco más sobre tu idea"),
  height: z.number().positive("Indica la altura"),
  width: z.number().positive("Indica el ancho"),
  depth: z.number().positive("Indica la profundidad"),
  quantity: z.number().int().min(1).max(100),
  color: z.string().min(1),
});

type QuoteValues = z.infer<typeof quoteSchema>;
type LocalImage = { file: File; url: string };

const fieldClass = "mt-2 w-full rounded-2xl border border-[#ded0d4] bg-[#faf6f6] px-4 py-3.5 text-sm placeholder:text-[#a99ca1] focus:border-[#c98698] focus:bg-white";

export function CustomQuoteForm() {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [imageError, setImageError] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const addQuote = useQuoteStore((state) => state.addQuote);
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { quantity: 1, color: "Rosa pastel" },
  });
  const color = useWatch({ control, name: "color" });

  function addImages(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter((file) => file.type.startsWith("image/") && file.size <= 8 * 1024 * 1024);
    setImageError(valid.length !== files.length ? "Solo se aceptan imágenes de hasta 8 MB cada una." : "");
    setImages((current) => {
      const next = valid.slice(0, Math.max(0, 4 - current.length)).map((file) => ({ file, url: URL.createObjectURL(file) }));
      return [...current, ...next];
    });
  }

  function removeImage(index: number) {
    setImages((current) => {
      URL.revokeObjectURL(current[index].url);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  function onSubmit(values: QuoteValues) {
    const uploadBatch = crypto.randomUUID();
    const quoteImages: QuoteImage[] = images.map((image) => ({
      id: crypto.randomUUID(),
      name: image.file.name,
      url: image.url,
      storagePath: `quotes/demo-user/${uploadBatch}/${image.file.name}`,
    }));
    const quoteId = addQuote({
      customer: values.name,
      phone: values.phone,
      description: values.description,
      dimensions: `${values.height} alto x ${values.width} ancho x ${values.depth} profundidad cm`,
      quantity: values.quantity,
      color: values.color,
      images: quoteImages,
    });
    setSubmittedId(quoteId);
  }

  if (submittedId) return <QuoteConversation quoteId={submittedId} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
       <div><p className="eyebrow">Solicitud de cotización</p><h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Cuéntanos tu idea</h2><p className="mt-3 text-sm leading-6 text-[#786970]">Crea una conversación privada con el estudio y recibe tu propuesta dentro de tu cuenta.</p></div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        <label className="text-xs font-bold">Nombre completo<input {...register("name")} placeholder="Cómo te llamas" className={fieldClass} />{errors.name && <span className="mt-1 block text-[10px] text-red-700">{errors.name.message}</span>}</label>
        <label className="text-xs font-bold">Teléfono de contacto<input {...register("phone")} type="tel" placeholder="099 000 0000" className={fieldClass} />{errors.phone && <span className="mt-1 block text-[10px] text-red-700">{errors.phone.message}</span>}</label>
      </div>
      <label className="mt-5 block text-xs font-bold">¿Que te gustaria crear?<textarea {...register("description")} rows={4} placeholder="Ejemplo: un letrero con el nombre de mi emprendimiento..." className={`${fieldClass} resize-none`} />{errors.description && <span className="mt-1 block text-[10px] text-red-700">{errors.description.message}</span>}</label>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-2"><p className="text-xs font-bold">Medidas aproximadas (cm)</p><div className="mt-2 grid grid-cols-3 gap-2"><label className="relative"><Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]" size={13} /><input {...register("height", { valueAsNumber: true })} type="number" min="0.1" step="0.1" placeholder="Alto" className={`${fieldClass} mt-0 pl-8`} /></label><label><input {...register("width", { valueAsNumber: true })} type="number" min="0.1" step="0.1" placeholder="Ancho" className={`${fieldClass} mt-0`} /></label><label><input {...register("depth", { valueAsNumber: true })} type="number" min="0.1" step="0.1" placeholder="Profundidad" className={`${fieldClass} mt-0`} /></label></div>{(errors.height || errors.width || errors.depth) && <span className="mt-1 block text-[10px] text-red-700">Ingresa alto, ancho y profundidad.</span>}</div>
        <label className="text-xs font-bold">Cantidad<input {...register("quantity", { valueAsNumber: true })} type="number" min="1" className={fieldClass} /></label>
        <label className="text-xs font-bold sm:col-span-2">Color<SelectMenu value={color} onChange={(color) => setValue("color", color, { shouldValidate: true })} options={["Rosa pastel", "Blanco", "Negro", "Verde salvia", "Por definir"].map((color) => ({ value: color, label: color }))} className="mt-2" /></label>
      </div>
      <div className="mt-7">
        <div className="flex items-center justify-between"><span className="text-xs font-bold">Imágenes de referencia</span><span className="text-[10px] text-[#786970]">Máx. 4 imágenes · 8 MB</span></div>
        {images.length < 4 && <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#c9adb5] bg-[#faf6f6] px-5 py-8 text-center transition hover:bg-[#f3e7e9]"><ImagePlus size={24} className="text-[#9e5f72]" /><span className="mt-2 text-xs font-bold">Subir imágenes</span><span className="mt-1 text-[10px] text-[#786970]">JPG, PNG o WEBP</span><input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => addImages(event.target.files)} /></label>}
        {images.length > 0 && <div className="mt-3 grid grid-cols-4 gap-2">{images.map((image, index) => <div key={image.url} className="group relative aspect-square overflow-hidden rounded-xl bg-[#f3e7e9]"><Image src={image.url} alt={`Referencia ${index + 1}`} fill unoptimized className="object-cover" /><button type="button" onClick={() => removeImage(index)} className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-white/90 text-[#9e5f72]" aria-label="Quitar imagen"><Trash2 size={13} /></button></div>)}</div>}
        {imageError && <p className="mt-2 text-[10px] text-red-700">{imageError}</p>}
      </div>
       <div className="mt-6 flex gap-3 rounded-2xl bg-[#f3e7e9] p-4"><Info className="mt-0.5 shrink-0 text-[#9e5f72]" size={16} /><p className="text-[11px] leading-5 text-[#66575d]">Las imágenes son temporales. Se eliminan al descartar la cotización o al finalizar el pedido convertido; una limpieza automática elimina archivos vencidos.</p></div>
      <button disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#35282d] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#9e5f72] disabled:opacity-60"><Send size={17} /> Enviar solicitud privada</button>
       <p className="mt-3 text-center text-[10px] text-[#91848a]">Podrás continuar la conversación sin salir de la tienda.</p>
    </form>
  );
}

function QuoteConversation({ quoteId }: { quoteId: string }) {
  const [message, setMessage] = useState("");
  const quote = useQuoteStore((state) => state.quotes.find((item) => item.id === quoteId));
  const addMessage = useQuoteStore((state) => state.addMessage);
  if (!quote) return null;

  function sendMessage() {
    if (!message.trim()) return;
    addMessage(quoteId, "customer", message.trim());
    setMessage("");
  }

  return (
    <div>
      <p className="eyebrow">Solicitud {quote.id}</p>
       <h2 className="mt-2 font-display text-4xl font-semibold">Conversación iniciada</h2>
       <p className="mt-3 text-sm leading-6 text-[#786970]">El estudio responderá aquí. Tus referencias permanecerán disponibles mientras la cotización o el pedido estén activos.</p>
      {quote.images.length > 0 && <div className="mt-6 grid grid-cols-4 gap-2">{quote.images.map((image) => <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl"><Image src={image.url} alt={image.name} fill unoptimized className="object-cover" /></div>)}</div>}
      <div className="mt-6 max-h-64 space-y-3 overflow-y-auto rounded-2xl bg-[#faf6f6] p-4">{quote.messages.map((item) => <div key={item.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-5 ${item.sender === "customer" ? "ml-auto bg-[#35282d] text-white" : "bg-white"}`}><p>{item.text}</p><span className={`mt-1 block text-[8px] ${item.sender === "customer" ? "text-white/45" : "text-[#91848a]"}`}>{item.createdAt}</span></div>)}</div>
      <div className="mt-4 flex gap-2"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder="Escribe un mensaje" className="min-w-0 flex-1 rounded-full border border-[#ded0d4] px-4 py-3 text-sm" /><button onClick={sendMessage} className="grid size-11 place-items-center rounded-full bg-[#35282d] text-white" aria-label="Enviar mensaje"><MessageCircle size={17} /></button></div>
    </div>
  );
}
