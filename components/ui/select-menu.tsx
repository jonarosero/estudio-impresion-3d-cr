"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

export function SelectMenu({ value, options, onChange, className = "" }: { value: string; options: SelectOption[]; onChange: (value: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return <div ref={ref} className={`relative ${className}`}><button type="button" onClick={() => setOpen((current) => !current)} className="flex w-full items-center justify-between rounded-2xl border border-[#ded0d4] bg-[#faf6f6] px-4 py-3.5 text-left text-sm font-bold transition hover:border-[#c98698] focus:border-[#c98698]"><span>{selected.label}</span><ChevronDown size={16} className={`text-[#9e5f72] transition ${open ? "rotate-180" : ""}`} /></button>{open && <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[#e5d8dc] bg-[#fffdfb] p-1.5 shadow-xl shadow-[#35282d]/10">{options.map((option) => <button type="button" key={option.value} onClick={() => { onChange(option.value); setOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-xs font-semibold transition ${option.value === value ? "bg-[#f3e7e9] text-[#9e5f72]" : "hover:bg-[#faf6f6]"}`}><span>{option.label}</span>{option.value === value && <Check size={14} />}</button>)}</div>}</div>;
}
