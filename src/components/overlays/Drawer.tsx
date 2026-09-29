import { type ReactNode } from "react";
import { CloseIcon } from "@/components/icons/utility-icons";

export function Drawer({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <aside
      className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-eo-ivory shadow-[-24px_0_48px_-24px_rgba(0,0,0,0.25)]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex items-center justify-between border-b border-eo-platinum px-6 py-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em]">
          {title}
        </h2>
        <button type="button" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}>
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      {footer && <div className="border-t border-eo-platinum px-6 py-6">{footer}</div>}
    </aside>
  );
}
