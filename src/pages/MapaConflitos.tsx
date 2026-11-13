import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Building, FlaskConical, MapPin } from 'lucide-react';
import { BadgeNivel } from '../components/BadgeNivel';
import { MapaPE } from '../components/MapaPE';
import { PageHeader } from '../components/PageHeader';
import type { CategoriaAssunto, NivelAlerta } from '../data/tipos';
import { formatarVariacao } from '../lib/variacao';
import {
  getResumoMapa,
  type ResumoMapaMunicipio,
} from '../services/dataService';

const CATEGORIAS: readonly CategoriaAssunto[] = [
  'Consumo e serviços',
  'Saúde',
  'Contratos',
  'Educação e inclusão',
  'Execução fiscal',
  'Família',
  'Outros',
];

const PESO_NIVEL: Record<NivelAlerta, number> = {
  prioritario: 4,
  atencao: 3,
  monitoramento: 2,
  'sem-base': 1,
  'sem-alerta': 0,
};

export function MapaConflitos() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    CategoriaAssunto | ''
  >('');
  const [dadosMapa, setDadosMapa] = useState<ResumoMapaMunicipio[]>([]);
  const [municipioSelecionado, setMunicipioSelecionado] = useState<
    string | null
  >(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarMapa() {
      setCarregando(true);
      const resumo = await getResumoMapa(categoriaSelecionada || undefined);
      if (!ativo) return;
      setDadosMapa(resumo);
      setCarregando(false);
    }

    void carregarMapa();

    return () => {
      ativo = false;
    };
  }, [categoriaSelecionada]);

  const municipiosEmDestaque = [...dadosMapa]
    .filter(
      (item) =>
        item.nivel !== 'sem-alerta' ||
        item.alertasVinculados.length > 0 ||
        item.casosAtual > 0,
    )
    .sort((a, b) => {
      const diffNivel = PESO_NIVEL[b.nivel] - PESO_NIVEL[a.nivel];
      if (diffNivel !== 0) return diffNivel;

      const diffAlertas =
        b.alertasVinculados.length - a.alertasVinculados.length;
      if (diffAlertas !== 0) return diffAlertas;

      const varA = a.variacaoPercentual ?? -Infinity;
      const varB = b.variacaoPercentual ?? -Infinity;
      if (varB !== varA) return varB - varA;

      return b.casosAtual - a.casosAtual;
    })
    .slice(0, 8);

  const totalComAlerta = dadosMapa.filter(
    (m) => m.nivel !== 'sem-alerta' || m.alertasVinculados.length > 0,
  ).length;
  const semUnidadeComAlerta = dadosMapa.filter(
    (m) =>
      (m.nivel !== 'sem-alerta' || m.alertasVinculados.length > 0) &&
      !m.temUnidade,
  ).length;

  return (
    <section aria-labelledby="titulo-pagina" className="space-y-6">
      <PageHeader
        rotulo="OBSERVAR E DETECTAR"
        titulo="Mapa de Conflitos"
        subtitulo="Distribuição territorial das variações de processos em Pernambuco, evidenciando municípios em alerta com e sem cobertura física de CEJUSC."
      />

      <div className="card-base p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="w-full sm:w-80">
          <label
            htmlFor="filtro-categoria-mapa"
            className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
          >
            Filtrar por categoria de assunto
          </label>
          <select
            id="filtro-categoria-mapa"
            value={categoriaSelecionada}
            onChange={(evento) => {
              setMunicipioSelecionado(null);
              setCategoriaSelecionada(
                evento.target.value as CategoriaAssunto | '',
              );
            }}
            className="w-full rounded-md border border-border-subtle bg-surface-card px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="">Todas as categorias</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>
              <strong className="text-navy">{totalComAlerta}</strong>{' '}
              {totalComAlerta === 1
                ? 'município em alerta'
                : 'municípios em alerta'}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <AlertCircle
              className="w-4 h-4 text-alerta-atencao-text"
              aria-hidden="true"
            />
            <span>
              <strong className="text-alerta-atencao-text">
                {semUnidadeComAlerta}
              </strong>{' '}
              sem unidade CEJUSC física
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <article className="xl:col-span-2 card-base p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-navy">
                Mapa Coroplético de Pernambuco
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Passe o cursor ou navegue por teclado sobre os municípios para
                inspecionar volume, variação e presença de CEJUSC.
              </p>
            </div>
          </div>

          {carregando ? (
            <div role="status" className="p-8 text-sm text-text-secondary">
              Carregando mapa territorial...
            </div>
          ) : (
            <MapaPE
              dados={dadosMapa}
              municipioSelecionado={municipioSelecionado}
              aoSelecionarMunicipio={(nome) =>
                setMunicipioSelecionado((atual) =>
                  atual === nome ? null : nome,
                )
              }
            />
          )}

          {/* Legenda coroplética e de marcadores */}
          <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm bg-[#DC2626] border border-[#7F1D1D]"
                aria-hidden="true"
              />
              <span>Prioritário (≥ 50%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm bg-[#EA580C] border border-[#7C2D12]"
                aria-hidden="true"
              />
              <span>Atenção (25% a &lt; 50%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm bg-[#F59E0B] border border-[#78350F]"
                aria-hidden="true"
              />
              <span>Monitoramento (10% a &lt; 25%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm bg-[#64748B] border border-[#1E293B]"
                aria-hidden="true"
              />
              <span>Sem base comparável</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm bg-[#E2E8F0] border border-[#94A3B8]"
                aria-hidden="true"
              />
              <span>Sem alerta</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full bg-navy border-2 border-white ring-1 ring-navy"
                aria-hidden="true"
              />
              <span>Possui CEJUSC físico</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full border-2 border-dashed border-amber-900"
                aria-hidden="true"
              />
              <span>Alerta sem CEJUSC (itinerante)</span>
            </span>
          </div>
        </article>

        <aside
          aria-label="Municípios em destaque"
          className="card-base overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border-subtle">
            <h2 className="text-lg font-bold text-navy">
              Municípios em Destaque
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Priorização por nível de alerta e necessidade de mutirão
              itinerante onde não há CEJUSC físico.
            </p>
          </div>

          {carregando ? (
            <div role="status" className="p-5 text-sm text-text-secondary">
              Carregando destaques...
            </div>
          ) : municipiosEmDestaque.length === 0 ? (
            <p className="p-5 text-sm text-text-secondary">
              Nenhum registro encontrado para esta categoria.
            </p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {municipiosEmDestaque.map((item) => {
                const selecionado = municipioSelecionado === item.municipio;
                return (
                  <li
                    key={item.municipio}
                    className={`p-4 transition-colors ${
                      selecionado ? 'bg-surface-subtle' : 'hover:bg-surface-page'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setMunicipioSelecionado((atual) =>
                              atual === item.municipio ? null : item.municipio,
                            )
                          }
                          className="text-left font-bold text-sm text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                        >
                          {item.municipio}
                        </button>
                        <p className="text-xs text-text-secondary mt-0.5 tabular-nums">
                          {item.casosAtual.toLocaleString('pt-BR')} casos
                          atuais ·{' '}
                          <span className="font-semibold text-navy">
                            {formatarVariacao(item)}
                          </span>
                        </p>
                      </div>
                      <BadgeNivel nivel={item.nivel} />
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      {item.temUnidade ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-navy">
                          <Building
                            className="w-3.5 h-3.5 text-accent"
                            aria-hidden="true"
                          />
                          <span>CEJUSC instalado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-alerta-atencao-bg text-alerta-atencao-text border border-alerta-atencao-border text-xs font-semibold">
                          <AlertCircle
                            className="w-3.5 h-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>Sem unidade CEJUSC · Mutirão itinerante</span>
                        </span>
                      )}

                      {item.alertasVinculados.length > 0 && (
                        <Link
                          to={`/laboratorio/${item.alertasVinculados[0]}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                        >
                          <FlaskConical
                            className="w-3.5 h-3.5"
                            aria-hidden="true"
                          />
                          <span>Analisar ({item.alertasVinculados[0]})</span>
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </section>
  );
}
