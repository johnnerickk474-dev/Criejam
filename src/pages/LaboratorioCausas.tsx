import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  FlaskConical,
  Handshake,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BadgeNivel } from '../components/BadgeNivel';
import { PageHeader } from '../components/PageHeader';
import type { AlertaCalculado } from '../data/tipos';
import { formatarVariacao, rotuloMes } from '../lib/variacao';
import { getAlerta } from '../services/dataService';

export function LaboratorioCausas() {
  const { alertaId } = useParams<{ alertaId?: string }>();
  const [alerta, setAlerta] = useState<AlertaCalculado | null>(null);
  const [carregando, setCarregando] = useState(Boolean(alertaId));
  const [avisoMvp, setAvisoMvp] = useState(false);

  useEffect(() => {
    setAvisoMvp(false);

    if (!alertaId) {
      setAlerta(null);
      setCarregando(false);
      return;
    }

    let ativo = true;
    const idBuscado = alertaId;

    async function carregarAlerta() {
      setCarregando(true);
      const encontrado = await getAlerta(idBuscado);
      if (!ativo) return;
      setAlerta(encontrado ?? null);
      setCarregando(false);
    }

    void carregarAlerta();

    return () => {
      ativo = false;
    };
  }, [alertaId]);

  useEffect(() => {
    if (!avisoMvp) return;
    const temporizador = window.setTimeout(() => setAvisoMvp(false), 4000);
    return () => window.clearTimeout(temporizador);
  }, [avisoMvp]);

  if (carregando) {
    return (
      <section aria-labelledby="titulo-pagina" className="space-y-6">
        <PageHeader
          rotulo="INVESTIGAR"
          titulo="Laboratório de Causas"
          subtitulo="Carregando informações do alerta selecionado..."
        />
        <div role="status" className="card-base p-8 text-sm text-text-secondary">
          Carregando evidências e hipóteses...
        </div>
      </section>
    );
  }

  if (!alertaId || !alerta) {
    return (
      <section aria-labelledby="titulo-pagina" className="space-y-6">
        <PageHeader
          rotulo="INVESTIGAR"
          titulo="Laboratório de Causas"
          subtitulo="Análise de causa raiz e avaliação de oportunidades de atuação preventiva a partir dos alertas detectados."
        />
        <div className="card-base p-8 space-y-4">
          <div className="flex items-start gap-3">
            <FlaskConical
              className="w-6 h-6 text-accent shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-navy">
                {alertaId
                  ? `Alerta "${alertaId}" não encontrado`
                  : 'Nenhum alerta selecionado'}
              </h2>
              <p className="text-sm text-text-secondary max-w-2xl">
                Selecione um alerta na aba de Alertas Preventivos para iniciar
                a análise de evidências, hipóteses e oportunidade de atuação.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/alertas"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Ir para Alertas Preventivos
            </Link>
            <Link
              to="/laboratorio/AL-2026-001"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border-subtle bg-surface-card text-navy text-sm font-semibold hover:bg-surface-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Abrir exemplo (AL-2026-001)
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const dadosSerie = alerta.serieMensal.map((casos, indice) => ({
    mes: rotuloMes(indice),
    casos,
  }));

  return (
    <section aria-labelledby="titulo-pagina" className="space-y-6">
      <div>
        <Link
          to="/alertas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Voltar para Alertas Preventivos</span>
        </Link>

        <PageHeader
          rotulo={`INVESTIGAR · LABORATÓRIO DE CAUSAS · ${alerta.id}`}
          titulo={`Por que "${alerta.assunto}" cresceu em ${alerta.municipio}?`}
          subtitulo={`Leitura de evidências, hipóteses de apoio e oportunidade de atuação preventiva envolvendo ${alerta.parteRe} (${alerta.setorParteRe}).`}
        />
      </div>

      {/* Seção 1: A Evidência (Leitura do Indicador) */}
      <article className="card-base p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Seção 1 · A Evidência
            </p>
            <h2 className="text-lg font-bold text-navy mt-0.5">
              Leitura do Indicador ({alerta.categoria})
            </h2>
          </div>
          <BadgeNivel nivel={alerta.nivel} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 bg-surface-page border border-border-subtle rounded-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Variação no período (out/2026 vs. set/2026)
            </p>
            <p className="text-2xl font-bold text-navy tabular-nums">
              {formatarVariacao(alerta)}
            </p>
            <p className="text-sm text-text-secondary tabular-nums">
              De{' '}
              <strong className="text-text-primary">
                {alerta.periodoAnterior.toLocaleString('pt-BR')}
              </strong>{' '}
              para{' '}
              <strong className="text-text-primary">
                {alerta.periodoAtual.toLocaleString('pt-BR')}
              </strong>{' '}
              casos no mês.
            </p>
            <p className="text-xs text-text-secondary">
              Situação atual: <span className="font-medium">{alerta.situacao}</span>
            </p>
          </div>

          <div className="lg:col-span-2 h-64 min-h-[16rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dadosSerie}
                margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: '#475569', fontSize: 11 }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 11 }}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  formatter={(valor) => [
                    typeof valor === 'number'
                      ? valor.toLocaleString('pt-BR')
                      : String(valor ?? ''),
                    'Casos',
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="casos"
                  name="Casos"
                  stroke="#0F766E"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#142D4E' }}
                  activeDot={{ r: 5, fill: '#142D4E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </article>

      {/* Seção 2: Investigação (As Hipóteses / 5 Porquês) */}
      <article className="card-base p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Seção 2 · Investigação (5 Porquês)
            </p>
            <h2 className="text-lg font-bold text-navy mt-0.5">
              Hipóteses de Causa Raiz
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-300 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-sky-800" aria-hidden="true" />
            <span>Texto gerado por IA para validação do servidor</span>
          </span>
        </div>

        {alerta.hipoteses && alerta.hipoteses.length > 0 ? (
          <div className="space-y-3">
            {alerta.hipoteses.map((hipotese, indice) => (
              <div
                key={indice}
                className="bg-sky-50 border border-sky-200 rounded-card p-5 space-y-2"
              >
                <p className="text-sm sm:text-base text-slate-900 leading-relaxed">
                  {hipotese.texto}
                </p>
                {hipotese.geradaPorIA && (
                  <p className="text-xs font-medium text-sky-900">
                    Sinalização assistida por IA — uso exclusivo como apoio à
                    análise humana, sem caráter decisório ou vinculante.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-subtle border border-border-subtle rounded-card p-5 text-sm text-text-secondary">
            Ainda não há hipóteses preliminares registradas para este alerta
            nesta demonstração. Consulte o alerta{' '}
            <Link
              to="/laboratorio/AL-2026-001"
              className="font-semibold text-accent hover:text-accent-hover underline underline-offset-2"
            >
              AL-2026-001
            </Link>{' '}
            para visualizar o exemplo completo de investigação assistida por IA.
          </div>
        )}
      </article>

      {/* Seção 3: Atores e Oportunidade de Atuação */}
      <article className="card-base p-6 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Seção 3 · Encaminhamento Preventivo
          </p>
          <h2 className="text-lg font-bold text-navy mt-0.5">
            Atores e Oportunidade de Atuação
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-page border border-border-subtle rounded-card p-4 flex items-start gap-3">
            <Building2
              className="w-5 h-5 text-navy shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Parte Ré em Destaque (Fictícia)
              </p>
              <p className="text-base font-bold text-navy mt-0.5">
                {alerta.parteRe}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Setor: {alerta.setorParteRe}
              </p>
            </div>
          </div>

          <div className="bg-surface-page border border-border-subtle rounded-card p-4 flex items-start gap-3">
            <MapPin
              className="w-5 h-5 text-accent shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Município / Comarca Afetada
              </p>
              <p className="text-base font-bold text-navy mt-0.5">
                {alerta.municipio}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Assunto: {alerta.assunto}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-teal-50/70 border border-teal-200 rounded-card p-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Oportunidade de Atuação Sugerida
          </p>
          <p className="text-sm sm:text-base text-text-primary leading-relaxed">
            {alerta.oportunidade ??
              `Avaliar diálogo pré-processual entre o CEJUSC responsável e ${alerta.parteRe} para tratamento preventivo das demandas em ${alerta.municipio}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="button"
            onClick={() => setAvisoMvp(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Handshake className="w-4 h-4" aria-hidden="true" />
            <span>Iniciar Contato Institucional</span>
          </button>

          {avisoMvp && (
            <div
              role="status"
              aria-live="polite"
              className="px-3.5 py-2 rounded-md bg-navy text-white text-xs font-medium shadow-sm"
            >
              Em desenvolvimento (MVP)
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
