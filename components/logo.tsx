import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex items-center gap-2 rounded-md" aria-label="C&R Inicio">
      <span className="grid size-9 place-items-center rounded-full border border-[#c98698] bg-[#f3e7e9] font-display text-lg font-bold text-[#9e5f72]">
        C&R
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[17px] font-bold tracking-wide">ESTUDIO</span>
          <span className="mt-1 block text-[8px] font-bold tracking-[0.22em] text-[#9e5f72]">
            IMPRESION 3D
          </span>
        </span>
      )}
    </Link>
  );
}
