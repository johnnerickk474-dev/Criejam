import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function LaboratorioCausas() {
  const { alertaId } = useParams<{ alertaId?: string }>();

  return (
    <section aria-labelledby="titulo-pagina">
      <PageHeader
        rotulo="INVESTIGAR"
        titulo="Laboratório de Causas"
        subtitulo={
          alertaId
            ? `Investigação exploratória vinculada ao alerta ${alertaId}.`
            : 'Ambiente exploratório de hipóteses, correlações e padrões de litigiosidade recorrente.'
        }
      />
      <div className="card-base p-8 text-text-secondary">
        <p>Em construção</p>
      </div>
    </section>
  );
}
