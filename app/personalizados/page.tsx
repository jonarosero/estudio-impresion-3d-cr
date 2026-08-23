import { CustomQuoteForm } from "@/components/quotes/custom-quote-form";
import { CustomPrintGallery } from "@/components/quotes/custom-print-gallery";
import { QuoteConversations } from "@/components/quotes/quote-conversations";

export const metadata = { title: "Impresiones personalizadas" };

export default async function CustomPage({ searchParams }: { searchParams: Promise<{ vista?: string }> }) {
  const { vista } = await searchParams;
  if (vista === "conversaciones") return <main className="page-shell py-10 sm:py-16"><QuoteConversations /></main>;
  return (
    <main className="page-shell py-10 sm:py-16">
      <div id="solicitud" className="grid overflow-hidden rounded-[30px] bg-[#fffdfb] soft-shadow lg:grid-cols-[.8fr_1.2fr]">
        <div className="relative overflow-hidden bg-[#35282d] p-8 text-white sm:p-12 lg:p-14">
          <div className="absolute -right-24 -top-24 size-72 rounded-full border-[45px] border-[#c98698]/15" />
          <p className="eyebrow !text-[#eccbd3]">Tu idea, nuestra forma</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.9] sm:text-7xl">Hagamos algo solo para ti.</h1>
          <p className="mt-7 max-w-md text-sm leading-7 text-white/60">Cuéntanos que necesitas, sube tus referencias y conversa con el estudio desde un espacio privado dentro de tu cuenta.</p>
          <div className="mt-12 space-y-7">
            {[
              ["01", "Describe tu idea", "Uso, medidas aproximadas, cantidad y color."],
              ["02", "Sube tus referencias", "Se guardan temporalmente mientras atendemos tu solicitud."],
              ["03", "Conversa con el estudio", "Recibe preguntas, propuesta y precio sin salir de la tienda."],
            ].map(([number, title, text]) => (
              <div key={number} className="grid grid-cols-[38px_1fr] gap-4 border-t border-white/10 pt-5"><span className="font-display text-xl text-[#eccbd3]">{number}</span><div><h2 className="font-display text-xl font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-white/50">{text}</p></div></div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5 text-xs leading-5 text-white/60"><strong className="text-white">Archivos temporales.</strong> Las referencias se eliminan si la solicitud se descarta o cuando termina la venta convertida.</div>
        </div>
        <div className="p-6 sm:p-10 lg:p-14"><CustomQuoteForm /></div>
      </div>
      <CustomPrintGallery />
    </main>
  );
}
