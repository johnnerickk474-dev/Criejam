import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface KpiCardProps {
  rotulo: string;
  valor: string | number;
  detalhe?: ReactNode;
  icone?: LucideIcon;
}

export function KpiCard({
  rotulo,
  valor,
  detalhe,
  icone: Icone,
}: KpiCardProps) {
  return (
    <article className="card-base p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {rotulo}
        </p>
        {Icone && (
          <Icone className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-navy mt-2 tabular-nums">
        {valor}
      </p>
      {detalhe && (
        <div className="text-xs text-text-secondary mt-2 leading-relaxed">
          {detalhe}
        </div>
      )}
    </article>
  );
}
