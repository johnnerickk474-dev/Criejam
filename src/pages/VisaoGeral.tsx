import { PageHeader } from '../components/PageHeader';

export function VisaoGeral() {
  return (
    <section aria-labelledby="titulo-pagina">
      <PageHeader
        rotulo="OBSERVAR E DETECTAR"
        titulo="Visão Geral"
        subtitulo="Síntese executiva dos sinais de crescimento de demandas por assunto, parte ré e município em Pernambuco."
      />
      <div className="card-base p-8 text-text-secondary">
        <p>Em construção</p>
      </div>
    </section>
  );
}
