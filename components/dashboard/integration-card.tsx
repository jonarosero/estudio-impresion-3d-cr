import { cn } from "@/lib/utils";

type IntegrationCardProps = {
  title: string;
  text: string;
  active: boolean;
};

export function IntegrationCard({ title, text, active }: IntegrationCardProps) {
  return (
    <div className="rounded-2xl bg-[#fffdfb] p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl font-semibold">{title}</h3>
        <span
          className={cn(
            "size-2.5 rounded-full",
            active ? "bg-[#6f9265]" : "bg-[#c5b8bc]",
          )}
        />
      </div>
      <p className="mt-3 text-[10px] leading-5 text-[#786970]">{text}</p>
      <button className="mt-5 text-[9px] font-bold text-[#9e5f72]">
        Configurar
      </button>
    </div>
  );
}
