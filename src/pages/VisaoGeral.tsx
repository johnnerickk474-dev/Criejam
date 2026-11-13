import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Building2,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BadgeNivel } from '../components/BadgeNivel';
import { KpiCard } from '../components/KpiCard';
import { PageHeader } from '../components/PageHeader';
import type { Litigante } from '../data/tipos';
import { formatarVariacao } from '../lib/variacao';
import {
  getAssuntosEmAscensao,
  getDashboard,
  getLitigantes,
  type Dashboard,
  type ResumoCategoria,
} from '../services/dataService';

export function VisaoGeral() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [litigantes, setLitigantes] = useState<Litigante[]>([]);
  const [assuntosEmAscensao, setAssuntosEmAscensao] = useState<
    ResumoCategoria[]
  >([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [dadosDashboard, dadosLitigantes, dadosAssuntos] =
        await Promise.all([
          getDashboard(),
          getLitigantes(),
          getAssuntosEmAscensao(),
        ]);

      if (!ativo) return;
      setDashboard(dadosDashboard);
      setLitigantes(dadosLitigantes);
      setAssuntosEmAscensao(dadosAssuntos);
      setCarregando(false);
    }

    void carregar();

    return () => {
      ativo = false;
    };
  }, []);

  const litigantesEmAscensao = litigantes.filter(
    (item) => item.nivel === 'prioritario' || item.nivel === 'atencao',
  );

  return (
    <section aria-labelledby="titulo-pagina" className="space-y-6">
      <PageHeader
        rotulo="OBSERVAR E DETECTAR"
        titulo="Visão Geral"
        subtitulo="Síntese executiva dos sinais de crescimento de demandas por assunto, parte ré e município em Pernambuco (out/2026 vs. set/2026)."
      />

      {carregando || !dashboard ? (
        <div
          role="status"
          className="card-base p-8 text-sm text-text-secondary"
        >
          Carregando indicadores do painel...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              rotulo="Novos casos no período"
              valor={dashboard.totalCasosPeriodoAtual.toLocaleString('pt-BR')}
              detalhe={`Período anterior (set/2026): ${dashboard.totalCasosPeriodoAnterior.toLocaleString('pt-BR')}`}
              icone={Activity}
            />
            <KpiCard
              rotulo="Variação %"
              valor={formatarVariacao(dashboard.variacaoGeral)}
              detalhe="Comparativo global de out/2026 sobre set/2026"
              icone={TrendingUp}
            />
            <KpiCard
              rotulo="Alertas Ativos"
              valor={dashboard.alertasAtivos}
              detalhe="Focos com aumento relevante ou nova ocorrência"
              icone={AlertTriangle}
            />
            <KpiCard
              rotulo="Litigantes em Atenção"
              valor={dashboard.litigantesEmAtencao}
              detalhe="Partes rés com sinal de variação monitorada"
              icone={Building2}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="card-base p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-navy">Evolução Mensal</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Volume mensal consolidado dos focos monitorados (set/2025 a
                  out/2026)
                </p>
              </div>
              <div className="h-72 min-h-[16rem] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboard.evolucaoMensal}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="mes"
                      tick={{ fill: '#475569', fontSize: 12 }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: '#475569', fontSize: 12 }}
                      tickLine={false}
                      width={48}
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
                      stroke="#142D4E"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#0F766E' }}
                      activeDot={{ r: 5, fill: '#0F766E' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="card-base p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-navy">
                  Distribuição por Assunto Jurídico
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Casos registrados no período atual (out/2026) por assunto
                  jurídico
                </p>
              </div>
              <div className="h-72 min-h-[16rem] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboard.porCategoria}
                    layout="vertical"
                    margin={{ top: 8, right: 20, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E2E8F0"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: '#475569', fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="categoria"
                      width={155}
                      tick={{ fill: '#0F172A', fontSize: 12 }}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(valor) => [
                        typeof valor === 'number'
                          ? valor.toLocaleString('pt-BR')
                          : String(valor ?? ''),
                        'Casos no período',
                      ]}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E2E8F0',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                      }}
                    />
                    <Bar
                      dataKey="casosAtual"
                      name="Casos no período"
                      fill="#0F766E"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <article className="card-base overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle">
              <h2 className="text-lg font-bold text-navy">
                Assuntos
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Assuntos jurídicos classificados em nível Atenção ou Prioritário
                em out/2026
              </p>
            </div>

            {assuntosEmAscensao.length === 0 ? (
              <p className="p-6 text-sm text-text-secondary">
                Nenhum assunto jurídico em nível Atenção ou Prioritário no
                período.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left border-collapse">
                  <caption className="sr-only">
                    Lista de assuntos jurídicos em nível Atenção ou Prioritário
                    no período atual
                  </caption>
                  <thead>
                    <tr className="bg-surface-subtle border-b border-border-subtle text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      <th scope="col" className="px-6 py-3">
                        Assunto Jurídico
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Casos no Período
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Variação %
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Nível
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-sm">
                    {assuntosEmAscensao.map((assunto) => (
                      <tr
                        key={assunto.categoria}
                        className="hover:bg-surface-page/70 transition-colors"
                      >
                        <td className="px-6 py-3.5 font-semibold text-text-primary">
                          {assunto.categoria}
                        </td>
                        <td className="px-6 py-3.5 text-right tabular-nums text-text-primary">
                          <span className="font-semibold">
                            {assunto.casosAtual.toLocaleString('pt-BR')}
                          </span>
                          <span className="block text-xs text-text-secondary">
                            anterior:{' '}
                            {assunto.casosAnterior.toLocaleString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right font-semibold tabular-nums text-navy">
                          {formatarVariacao(assunto)}
                        </td>
                        <td className="px-6 py-3.5">
                          <BadgeNivel nivel={assunto.nivel} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="card-base overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle">
              <h2 className="text-lg font-bold text-navy">
                Litigantes
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Partes rés (empresas fictícias) classificadas em nível Atenção
                ou Prioritário em out/2026
              </p>
            </div>

            {litigantesEmAscensao.length === 0 ? (
              <p className="p-6 text-sm text-text-secondary">
                Nenhuma parte ré em nível Atenção ou Prioritário no período.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left border-collapse">
                  <caption className="sr-only">
                    Lista de partes rés fictícias em nível Atenção ou
                    Prioritário no período atual
                  </caption>
                  <thead>
                    <tr className="bg-surface-subtle border-b border-border-subtle text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      <th scope="col" className="px-6 py-3">
                        Empresa
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Setor
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Casos no Período
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Variação %
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Nível
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-sm">
                    {litigantesEmAscensao.map((litigante) => (
                      <tr
                        key={litigante.parteRe}
                        className="hover:bg-surface-page/70 transition-colors"
                      >
                        <td className="px-6 py-3.5 font-semibold text-text-primary">
                          {litigante.parteRe}
                        </td>
                        <td className="px-6 py-3.5 text-text-secondary">
                          {litigante.setor}
                        </td>
                        <td className="px-6 py-3.5 text-right tabular-nums text-text-primary">
                          <span className="font-semibold">
                            {litigante.casosAtual.toLocaleString('pt-BR')}
                          </span>
                          <span className="block text-xs text-text-secondary">
                            anterior:{' '}
                            {litigante.casosAnterior.toLocaleString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right font-semibold tabular-nums text-navy">
                          {formatarVariacao(litigante)}
                        </td>
                        <td className="px-6 py-3.5">
                          <BadgeNivel nivel={litigante.nivel} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </>
      )}
    </section>
  );
}
