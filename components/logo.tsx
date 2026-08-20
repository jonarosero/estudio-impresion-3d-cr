import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-md" aria-label="C&R Inicio">
      <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[#c98698] bg-[#f3e7e9] font-display text-[15px] font-bold leading-none tracking-[-0.06em] text-[#9e5f72]">
        C&R
      </span>
      {!compact && (
        <span className="block min-w-0 whitespace-nowrap leading-none">
          <span className="block font-display text-[16px] font-bold tracking-[0.08em]">ESTUDIO</span>
          <span className="mt-1.5 block text-[7px] font-bold tracking-[0.24em] text-[#9e5f72]">
            IMPRESION 3D
          </span>
        </span>
      )}
    </Link>
  );
}
