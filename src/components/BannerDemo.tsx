import { Info } from 'lucide-react';

export function BannerDemo() {
  return (
    <div
      role="status"
      aria-label="Aviso de ambiente de demonstração"
      className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs sm:text-sm text-amber-950"
    >
      <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-2.5">
        <Info
          className="w-4 h-4 shrink-0 text-amber-800 mt-0.5 sm:mt-0"
          aria-hidden="true"
        />
        <p className="font-medium leading-snug">
          Ambiente de demonstração — dados fictícios. Protótipo independente,
          sem vínculo oficial com TJPE, CNJ ou ESMAPE e sem acesso a bases
          judiciais reais.
        </p>
      </div>
    </div>
  );
}
