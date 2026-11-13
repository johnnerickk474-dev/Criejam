export interface PageHeaderProps {
  rotulo: string;
  titulo: string;
  subtitulo?: string;
}

export function PageHeader({ rotulo, titulo, subtitulo }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        {rotulo}
      </p>
      <h1
        id="titulo-pagina"
        className="text-2xl sm:text-3xl font-bold text-navy mt-1 tracking-tight"
      >
        {titulo}
      </h1>
      {subtitulo && (
        <p className="text-sm sm:text-base text-text-secondary mt-2 max-w-3xl">
          {subtitulo}
        </p>
      )}
    </div>
  );
}
