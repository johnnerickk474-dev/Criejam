import { useState } from 'react';
import { BadgeNivel } from './BadgeNivel';
import type { NivelAlerta } from '../data/tipos';
import { formatarVariacao } from '../lib/variacao';
import type { ResumoMapaMunicipio } from '../services/dataService';

export interface MapaPEProps {
  dados: ResumoMapaMunicipio[];
  municipioSelecionado?: string | null;
  aoSelecionarMunicipio?: (municipio: string) => void;
}

interface GeometriaMunicipio {
  cx: number;
  cy: number;
  d: string;
}

/**
 * Gera um polígono facetado determinístico em torno do centroide (cx, cy)
 * para representar cada município como área coroplética dentro do viewBox 800x400,
 * mantendo a estrutura pronta para substituição por paths de pe-municipios.svg.
 */
function poligonoMunicipio(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  inclinacao = 0,
): string {
  const pontos = [
    [cx - rx * 0.85, cy - ry * 0.55 + inclinacao],
    [cx - rx * 0.1, cy - ry],
    [cx + rx * 0.85, cy - ry * 0.45 - inclinacao],
    [cx + rx, cy + ry * 0.2],
    [cx + rx * 0.55, cy + ry * 0.9],
    [cx - rx * 0.35, cy + ry * 0.95],
    [cx - rx, cy + ry * 0.3],
  ];
  return (
    pontos
      .map(
        ([x, y], indice) =>
          `${indice === 0 ? 'M' : 'L'} ${Math.round(x)} ${Math.round(y)}`,
      )
      .join(' ') + ' Z'
  );
}

const GEOMETRIA_MUNICIPIOS: Record<string, GeometriaMunicipio> = {
  // Sertão
  Araripina: { cx: 88, cy: 112, d: poligonoMunicipio(88, 112, 30, 22, 3) },
  Ouricuri: { cx: 145, cy: 145, d: poligonoMunicipio(145, 145, 28, 22, -2) },
  Petrolina: { cx: 120, cy: 255, d: poligonoMunicipio(120, 255, 38, 28, 4) },
  Salgueiro: { cx: 215, cy: 175, d: poligonoMunicipio(215, 175, 28, 22, -2) },
  Floresta: { cx: 258, cy: 255, d: poligonoMunicipio(258, 255, 32, 24, 3) },
  'Serra Talhada': {
    cx: 300,
    cy: 152,
    d: poligonoMunicipio(300, 152, 27, 21, -3),
  },
  'Afogados da Ingazeira': {
    cx: 362,
    cy: 126,
    d: poligonoMunicipio(362, 126, 24, 18, 2),
  },
  Custódia: { cx: 352, cy: 196, d: poligonoMunicipio(352, 196, 24, 20, -2) },
  Arcoverde: { cx: 404, cy: 212, d: poligonoMunicipio(404, 212, 21, 18, 2) },

  // Agreste
  Pesqueira: { cx: 446, cy: 194, d: poligonoMunicipio(446, 194, 20, 18, -2) },
  'Belo Jardim': {
    cx: 486,
    cy: 216,
    d: poligonoMunicipio(486, 216, 20, 18, 2),
  },
  'São Bento do Una': {
    cx: 462,
    cy: 262,
    d: poligonoMunicipio(462, 262, 21, 18, -1),
  },
  'Bom Conselho': {
    cx: 422,
    cy: 302,
    d: poligonoMunicipio(422, 302, 21, 18, 2),
  },
  Garanhuns: { cx: 472, cy: 308, d: poligonoMunicipio(472, 308, 22, 18, -2) },
  Altinho: { cx: 518, cy: 258, d: poligonoMunicipio(518, 258, 19, 17, 1) },
  'Santa Cruz do Capibaribe': {
    cx: 508,
    cy: 146,
    d: poligonoMunicipio(508, 146, 19, 16, 2),
  },
  Toritama: { cx: 546, cy: 156, d: poligonoMunicipio(546, 156, 16, 14, -2) },
  Caruaru: { cx: 544, cy: 204, d: poligonoMunicipio(544, 204, 22, 18, 2) },
  Surubim: { cx: 582, cy: 142, d: poligonoMunicipio(582, 142, 18, 15, -1) },
  Bezerros: { cx: 586, cy: 216, d: poligonoMunicipio(586, 216, 17, 15, 1) },
  Limoeiro: { cx: 620, cy: 162, d: poligonoMunicipio(620, 162, 17, 15, -2) },
  Gravatá: { cx: 620, cy: 222, d: poligonoMunicipio(620, 222, 17, 15, 2) },

  // Zona da Mata e Região Metropolitana do Recife
  Palmares: { cx: 582, cy: 294, d: poligonoMunicipio(582, 294, 21, 17, -2) },
  Escada: { cx: 642, cy: 272, d: poligonoMunicipio(642, 272, 18, 15, 2) },
  'Vitória de Santo Antão': {
    cx: 656,
    cy: 224,
    d: poligonoMunicipio(656, 224, 17, 15, -1),
  },
  Timbaúba: { cx: 652, cy: 96, d: poligonoMunicipio(652, 96, 17, 14, 2) },
  'Nazaré da Mata': {
    cx: 666,
    cy: 130,
    d: poligonoMunicipio(666, 130, 16, 14, -1),
  },
  Carpina: { cx: 660, cy: 166, d: poligonoMunicipio(660, 166, 16, 14, 1) },
  Goiana: { cx: 716, cy: 100, d: poligonoMunicipio(716, 100, 19, 15, -2) },
  Igarassu: { cx: 726, cy: 142, d: poligonoMunicipio(726, 142, 16, 13, 1) },
  'Abreu e Lima': {
    cx: 718,
    cy: 174,
    d: poligonoMunicipio(718, 174, 14, 12, -1),
  },
  Paulista: { cx: 748, cy: 174, d: poligonoMunicipio(748, 174, 14, 12, 1) },
  Camaragibe: { cx: 696, cy: 196, d: poligonoMunicipio(696, 196, 13, 11, -1) },
  'São Lourenço da Mata': {
    cx: 678,
    cy: 206,
    d: poligonoMunicipio(678, 206, 14, 12, 1),
  },
  Olinda: { cx: 752, cy: 202, d: poligonoMunicipio(752, 202, 13, 11, -1) },
  Recife: { cx: 744, cy: 230, d: poligonoMunicipio(744, 230, 16, 14, 1) },
  'Jaboatão dos Guararapes': {
    cx: 714,
    cy: 252,
    d: poligonoMunicipio(714, 252, 17, 14, -1),
  },
  'Cabo de Santo Agostinho': {
    cx: 702,
    cy: 286,
    d: poligonoMunicipio(702, 286, 17, 14, 1),
  },
  Ipojuca: { cx: 702, cy: 320, d: poligonoMunicipio(702, 320, 17, 14, -1) },
};

interface EstiloMapaNivel {
  fill: string;
  stroke: string;
}

const ESTILO_POR_NIVEL: Record<NivelAlerta, EstiloMapaNivel> = {
  prioritario: { fill: '#DC2626', stroke: '#7F1D1D' },
  atencao: { fill: '#EA580C', stroke: '#7C2D12' },
  monitoramento: { fill: '#F59E0B', stroke: '#78350F' },
  'sem-base': { fill: '#64748B', stroke: '#1E293B' },
  'sem-alerta': { fill: '#E2E8F0', stroke: '#94A3B8' },
};

/** Contorno macro esquemático do Estado de Pernambuco dentro de 800x400. */
const CONTORNO_PERNAMBUCO =
  'M 48 112 L 105 78 L 235 104 L 315 92 L 420 96 L 520 108 L 620 68 L 745 72 L 774 176 L 764 252 L 728 344 L 635 338 L 545 332 L 440 342 L 350 296 L 230 298 L 125 304 L 62 260 L 42 182 Z';

export function MapaPE({
  dados,
  municipioSelecionado,
  aoSelecionarMunicipio,
}: MapaPEProps) {
  const [municipioAtivo, setMunicipioAtivo] = useState<string | null>(null);

  const dadosPorMunicipio = new Map<string, ResumoMapaMunicipio>(
    dados.map((item) => [item.municipio, item]),
  );

  const municipioTooltip = municipioAtivo
    ? dadosPorMunicipio.get(municipioAtivo)
    : undefined;
  const geomTooltip = municipioAtivo
    ? GEOMETRIA_MUNICIPIOS[municipioAtivo]
    : undefined;

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="0 0 800 400"
        role="img"
        aria-label="Mapa coroplético de conflitos por município em Pernambuco"
        className="w-full h-auto rounded-card bg-slate-50 border border-border-subtle"
      >
        {/* Fundo macrorregional estilizado de Pernambuco */}
        <path
          d={CONTORNO_PERNAMBUCO}
          fill="#F1F5F9"
          stroke="#CBD5E1"
          strokeWidth={2}
        />

        {/* Divisores sutis de mesorregiões para leitura geográfica */}
        <g stroke="#CBD5E1" strokeDasharray="4 4" strokeWidth={1} opacity={0.7}>
          <line x1="382" y1="95" x2="365" y2="302" />
          <line x1="600" y1="74" x2="560" y2="332" />
          <line x1="680" y1="72" x2="665" y2="340" />
        </g>

        <g
          fill="#64748B"
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.06em"
        >
          <text x="175" y="54" textAnchor="middle">
            SERTÃO
          </text>
          <text x="488" y="54" textAnchor="middle">
            AGRESTE
          </text>
          <text x="635" y="54" textAnchor="middle">
            MATA
          </text>
          <text x="735" y="54" textAnchor="middle">
            RMR
          </text>
        </g>

        {/* Polígonos dos municípios */}
        {dados.map((item) => {
          const geom = GEOMETRIA_MUNICIPIOS[item.municipio];
          if (!geom) return null;

          const estilo = ESTILO_POR_NIVEL[item.nivel];
          const estaDestacado =
            municipioAtivo === item.municipio ||
            municipioSelecionado === item.municipio;
          const semUnidadeComAlerta =
            !item.temUnidade &&
            (item.nivel !== 'sem-alerta' || item.alertasVinculados.length > 0);

          return (
            <g
              key={item.municipio}
              data-municipio={item.municipio}
              tabIndex={0}
              role="button"
              aria-label={`${item.municipio}: ${item.casosAtual} casos atuais, ${formatarVariacao(item)}, ${
                item.temUnidade
                  ? 'possui unidade CEJUSC'
                  : 'sem unidade CEJUSC'
              }`}
              onMouseEnter={() => setMunicipioAtivo(item.municipio)}
              onMouseLeave={() => setMunicipioAtivo(null)}
              onFocus={() => setMunicipioAtivo(item.municipio)}
              onBlur={() => setMunicipioAtivo(null)}
              onClick={() => aoSelecionarMunicipio?.(item.municipio)}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter' || evento.key === ' ') {
                  evento.preventDefault();
                  aoSelecionarMunicipio?.(item.municipio);
                }
              }}
              className="mapa-municipio-interativo cursor-pointer"
            >
              <path
                d={geom.d}
                fill={estilo.fill}
                stroke={estaDestacado ? '#0F172A' : estilo.stroke}
                strokeWidth={estaDestacado ? 2.5 : 1.2}
                strokeDasharray={semUnidadeComAlerta ? '3 2' : undefined}
                opacity={estaDestacado ? 1 : 0.92}
              />

              {municipioAtivo === item.municipio && (
                <path
                  d={geom.d}
                  fill="none"
                  stroke="#0F766E"
                  strokeWidth={3}
                  pointerEvents="none"
                />
              )}

              {/* Marcador visual fixo para municípios com unidade física CEJUSC */}
              {item.temUnidade && (
                <circle
                  cx={geom.cx}
                  cy={geom.cy}
                  r={4}
                  fill="#142D4E"
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  pointerEvents="none"
                />
              )}

              {/* Destaque adicional para município em alerta sem unidade CEJUSC */}
              {semUnidadeComAlerta && (
                <circle
                  cx={geom.cx}
                  cy={geom.cy}
                  r={6}
                  fill="none"
                  stroke="#78350F"
                  strokeWidth={1.8}
                  strokeDasharray="2 2"
                  pointerEvents="none"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip flutuante sobre o município ativo */}
      {municipioTooltip && geomTooltip && (
        <div
          role="tooltip"
          style={{
            left: `${(geomTooltip.cx / 800) * 100}%`,
            top: `${(geomTooltip.cy / 400) * 100}%`,
          }}
          className={`pointer-events-none absolute z-20 w-64 rounded-card border border-border-subtle bg-surface-card p-3 shadow-lg text-xs transition-opacity ${
            geomTooltip.cx > 480 ? '-translate-x-full -ml-3' : 'ml-3'
          } ${geomTooltip.cy > 230 ? '-translate-y-full -mt-2' : 'mt-2'}`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-sm text-navy">
              {municipioTooltip.municipio}
            </p>
            <BadgeNivel nivel={municipioTooltip.nivel} />
          </div>

          <dl className="mt-2 space-y-1 text-text-secondary">
            <div className="flex justify-between gap-2">
              <dt>Casos atuais (out/2026):</dt>
              <dd className="font-semibold text-text-primary tabular-nums">
                {municipioTooltip.casosAtual.toLocaleString('pt-BR')}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Variação %:</dt>
              <dd className="font-semibold text-navy tabular-nums">
                {formatarVariacao(municipioTooltip)}
              </dd>
            </div>
          </dl>

          <p
            className={`mt-2 pt-2 border-t border-border-subtle font-semibold ${
              municipioTooltip.temUnidade
                ? 'text-navy'
                : 'text-alerta-atencao-text'
            }`}
          >
            {municipioTooltip.temUnidade
              ? 'Possui unidade CEJUSC instalada'
              : 'Sem unidade física CEJUSC/NUPEMEC — indicado para mutirão itinerante'}
          </p>
        </div>
      )}
    </div>
  );
}
