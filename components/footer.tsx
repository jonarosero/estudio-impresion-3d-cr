import Link from "next/link";
import { Camera, MessagesSquare } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#e5d8dc] bg-[#efe1e4]">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#786970]">
            Objetos impresos en 3D, disenados y producidos en pequenos lotes para hacer mas bonito lo cotidiano.
          </p>
        </div>
        <div>
          <p className="eyebrow">Explora</p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <Link href="/catalogo">Todos los productos</Link>
            <Link href="/personalizados">Pide algo unico</Link>
            <Link href="/login">Mi cuenta</Link>
            <Link href="/dashboard">Administracion</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Hablemos</p>
          <div className="mt-5 flex gap-3">
            <Link href="/personalizados" className="grid size-10 place-items-center rounded-full border border-[#cdbbc0]" aria-label="Mensajes y cotizaciones">
              <MessagesSquare size={17} />
            </Link>
            <a href="#" className="grid size-10 place-items-center rounded-full border border-[#cdbbc0]" aria-label="Instagram">
              <Camera size={17} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#d9c9cd] py-5 text-center text-[11px] text-[#786970]">
        © 2026 Estudio de Impresion 3D C&R · Hecho con calma en Ecuador
      </div>
    </footer>
  );
}
