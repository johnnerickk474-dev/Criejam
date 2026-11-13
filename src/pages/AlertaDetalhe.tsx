import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function AlertaDetalhe() {
  const { id } = useParams<{ id: string }>();

  return (
    <section aria-labelledby="titulo-pagina">
      <PageHeader
        rotulo="OBSERVAR E DETECTAR · DETALHE DO ALERTA"
        titulo={id ? `Detalhe do Alerta (${id})` : 'Detalhe do Alerta'}
        subtitulo="Análise detalhada da evolução temporal, concentração por parte ré e distribuição municipal do alerta selecionado."
      />
      <div className="card-base p-8 text-text-secondary">
        <p>Em construção</p>
      </div>
    </section>
  );
}
