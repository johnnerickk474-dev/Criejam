import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { BadgeNivel } from '../components/BadgeNivel';
import { PageHeader } from '../components/PageHeader';
import type {
  AlertaCalculado,
  CategoriaAssunto,
  Municipio,
  NivelAlerta,
} from '../data/tipos';
import { formatarVariacao } from '../lib/variacao';
import { getAlertas, getMunicipios } from '../services/dataService';

const ASSUNTOS_JURIDICOS: readonly CategoriaAssunto[] = [
  'Direito do Consumidor',
  'Direito da Saúde',
  'Direito Civil',
  'Direito Tributário',
  'Direito de Família',
  'Direito à Educação',
  'Outros',
];

export function AlertasPreventivos() {
  const [alertas, setAlertas] = useState<AlertaCalculado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [partesRes, setPartesRes] = useState<string[]>([]);
  const [nivelSelecionado, setNivelSelecionado] = useState<NivelAlerta | ''>(
    '',
  );
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    CategoriaAssunto | ''
  >('');
  const [parteReSelecionada, setParteReSelecionada] = useState<string>('');
  const [municipioSelecionado, setMunicipioSelecionado] = useState<string>('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarOpcoesFiltros() {
      const [listaMunicipios, listaAlertas] = await Promise.all([
        getMunicipios(),
        getAlertas(),
      ]);
      if (!ativo) return;

      const municipiosOrdenados = [...listaMunicipios].sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR'),
      );
      const partesResUnicas = Array.from(
        new Set(listaAlertas.map((alerta) => alerta.parteRe)),
      ).sort((a, b) => a.localeCompare(b, 'pt-BR'));

      setMunicipios(municipiosOrdenados);
      setPartesRes(partesResUnicas);
    }

    void carregarOpcoesFiltros();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarAlertas() {
      setCarregando(true);
      const resultado = await getAlertas({
        nivel: nivelSelecionado || undefined,
        categoria: categoriaSelecionada || undefined,
        parteRe: parteReSelecionada || undefined,
        municipio: municipioSelecionado || undefined,
      });

      if (!ativo) return;
      setAlertas(resultado);
      setCarregando(false);
    }

    void carregarAlertas();

    return () => {
      ativo = false;
    };
  }, [
    nivelSelecionado,
    categoriaSelecionada,
    parteReSelecionada,
    municipioSelecionado,
  ]);

  return (
    <section aria-labelledby="titulo-pagina" className="space-y-6">
      <PageHeader
        rotulo="OBSERVAR E DETECTAR"
        titulo="Alertas Preventivos"
        subtitulo="Monitoramento de variações relevantes de processos por assunto, parte ré e município para atuação preventiva de NUPEMEC e CEJUSCs."
      />

      <div className="card-base p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label
              htmlFor="filtro-nivel"
              className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
            >
              Nível de alerta
            </label>
            <select
              id="filtro-nivel"
              value={nivelSelecionado}
              onChange={(evento) =>
                setNivelSelecionado(evento.target.value as NivelAlerta | '')
              }
              className="w-full rounded-md border border-border-subtle bg-surface-card px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="">Todos os níveis</option>
              <option value="prioritario">Prioritário (≥ 50%)</option>
              <option value="atencao">Atenção (25% a &lt; 50%)</option>
              <option value="monitoramento">
                Monitoramento (10% a &lt; 25%)
              </option>
              <option value="sem-base">
                Sem base comparável (nova ocorrência)
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="filtro-assunto-juridico"
              className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
            >
              Assunto Jurídico
            </label>
            <select
              id="filtro-assunto-juridico"
              value={categoriaSelecionada}
              onChange={(evento) =>
                setCategoriaSelecionada(
                  evento.target.value as CategoriaAssunto | '',
                )
              }
              className="w-full rounded-md border border-border-subtle bg-surface-card px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="">Todos os assuntos jurídicos</option>
              {ASSUNTOS_JURIDICOS.map((assunto) => (
                <option key={assunto} value={assunto}>
                  {assunto}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filtro-parte-re"
              className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
            >
              Ré/Réu
            </label>
            <select
              id="filtro-parte-re"
              value={parteReSelecionada}
              onChange={(evento) => setParteReSelecionada(evento.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface-card px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="">Todas as partes rés</option>
              {partesRes.map((parteRe) => (
                <option key={parteRe} value={parteRe}>
                  {parteRe}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filtro-municipio"
              className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
            >
              Município
            </label>
            <select
              id="filtro-municipio"
              value={municipioSelecionado}
              onChange={(evento) =>
                setMunicipioSelecionado(evento.target.value)
              }
              className="w-full rounded-md border border-border-subtle bg-surface-card px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="">Todos os municípios</option>
              {municipios.map((municipio) => (
                <option key={municipio.nome} value={municipio.nome}>
                  {municipio.nome}
                  {municipio.temUnidade ? '' : ' (sem CEJUSC)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-xs text-text-secondary">
            {carregando
              ? 'Atualizando lista...'
              : `${alertas.length} ${
                  alertas.length === 1
                    ? 'alerta encontrado'
                    : 'alertas encontrados'
                }`}
          </p>
          {(nivelSelecionado ||
            categoriaSelecionada ||
            parteReSelecionada ||
            municipioSelecionado) && (
            <button
              type="button"
              onClick={() => {
                setNivelSelecionado('');
                setCategoriaSelecionada('');
                setParteReSelecionada('');
                setMunicipioSelecionado('');
              }}
              className="text-xs font-semibold text-accent hover:text-accent-hover underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      <article className="card-base overflow-hidden">
        {carregando ? (
          <div role="status" className="p-8 text-sm text-text-secondary">
            Carregando alertas preventivos...
          </div>
        ) : alertas.length === 0 ? (
          <div className="p-8 text-sm text-text-secondary">
            Nenhum alerta encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <caption className="sr-only">
                Lista de alertas preventivos calculados por assunto, parte ré e
                município
              </caption>
              <thead>
                <tr className="bg-surface-subtle border-b border-border-subtle text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  <th scope="col" className="px-5 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Assunto Jurídico
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Objeto da Ação
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Ré/Réu
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Município
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Variação %
                  </th>
                  <th scope="col" className="px-5 py-3 text-center">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {alertas.map((alerta) => (
                  <tr
                    key={alerta.id}
                    className="hover:bg-surface-page/70 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-navy whitespace-nowrap">
                      {alerta.id}
                    </td>
                    <td className="px-5 py-4 text-text-secondary whitespace-nowrap">
                      {alerta.categoria}
                    </td>
                    <td className="px-5 py-4 font-semibold text-text-primary">
                      {alerta.assunto}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-text-primary">
                        {alerta.parteRe}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">
                        {alerta.setorParteRe}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-primary whitespace-nowrap">
                      {alerta.municipio}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <BadgeNivel nivel={alerta.nivel} />
                        <span className="text-xs font-semibold text-navy tabular-nums">
                          {formatarVariacao(alerta)}{' '}
                          <span className="font-normal text-text-secondary">
                            ({alerta.periodoAnterior} → {alerta.periodoAtual})
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <Link
                        to={`/laboratorio/${alerta.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <FlaskConical
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                        <span>Analisar Causas</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
