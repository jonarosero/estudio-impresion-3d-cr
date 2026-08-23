import { Plus } from "lucide-react";

type PanelHeadingProps = {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
};

export function PanelHeading({
  title,
  subtitle,
  action,
  onAction,
}: PanelHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="font-display text-4xl font-semibold">{title}</h2>
        <p className="mt-1 text-[10px] text-[#786970]">{subtitle}</p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 rounded-full bg-[#35282d] px-4 py-2.5 text-[10px] font-bold text-white"
        >
          <Plus size={13} /> {action}
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className="shrink-0 rounded-full bg-[#f3e7e9] px-3 py-1.5 text-[9px] font-bold text-[#9e5f72]">
      {value}
    </span>
  );
}
