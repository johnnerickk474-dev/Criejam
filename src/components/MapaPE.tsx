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
  Araripina: { cx: 78, cy: 118, d: poligonoMunicipio(78, 118, 26, 20, 3) },
  Ouricuri: { cx: 132, cy: 152, d: poligonoMunicipio(132, 152, 26, 20, -2) },
  Petrolina: { cx: 112, cy: 318, d: poligonoMunicipio(112, 318, 34, 26, 4) },
  Salgueiro: { cx: 218, cy: 162, d: poligonoMunicipio(218, 162, 26, 20, -2) },
  Floresta: { cx: 278, cy: 252, d: poligonoMunicipio(278, 252, 28, 22, 3) },
  'Serra Talhada': {
    cx: 302,
    cy: 146,
    d: poligonoMunicipio(302, 146, 25, 19, -2),
  },
  'Afogados da Ingazeira': {
    cx: 356,
    cy: 108,
    d: poligonoMunicipio(356, 108, 22, 17, 2),
  },
  Custódia: { cx: 368, cy: 184, d: poligonoMunicipio(368, 184, 22, 18, -2) },
  Arcoverde: { cx: 416, cy: 202, d: poligonoMunicipio(416, 202, 20, 17, 2) },

  // Agreste
  Pesqueira: { cx: 458, cy: 192, d: poligonoMunicipio(458, 192, 19, 16, -2) },
  'Belo Jardim': {
    cx: 496,
    cy: 202,
    d: poligonoMunicipio(496, 202, 18, 15, 2),
  },
  'São Bento do Una': {
    cx: 496,
    cy: 242,
    d: poligonoMunicipio(496, 242, 19, 16, -1),
  },
  'Bom Conselho': {
    cx: 446,
    cy: 288,
    d: poligonoMunicipio(446, 288, 20, 17, 2),
  },
  Garanhuns: { cx: 494, cy: 288, d: poligonoMunicipio(494, 288, 21, 17, -2) },
  Altinho: { cx: 538, cy: 240, d: poligonoMunicipio(538, 240, 18, 15, 1) },
  'Santa Cruz do Capibaribe': {
    cx: 518,
    cy: 146,
    d: poligonoMunicipio(518, 146, 18, 15, 2),
  },
  Toritama: { cx: 554, cy: 154, d: poligonoMunicipio(554, 154, 15, 13, -2) },
  Caruaru: { cx: 556, cy: 198, d: poligonoMunicipio(556, 198, 21, 17, 2) },
  Surubim: { cx: 588, cy: 136, d: poligonoMunicipio(588, 136, 17, 14, -1) },
  Bezerros: { cx: 592, cy: 202, d: poligonoMunicipio(592, 202, 16, 14, 1) },
  Limoeiro: { cx: 626, cy: 152, d: poligonoMunicipio(626, 152, 16, 14, -2) },
  Gravatá: { cx: 624, cy: 206, d: poligonoMunicipio(624, 206, 16, 14, 2) },

  // Zona da Mata e Região Metropolitana do Recife
  Palmares: { cx: 608, cy: 266, d: poligonoMunicipio(608, 266, 20, 16, -2) },
  Escada: { cx: 668, cy: 244, d: poligonoMunicipio(668, 244, 17, 14, 2) },
  'Vitória de Santo Antão': {
    cx: 662,
    cy: 204,
    d: poligonoMunicipio(662, 204, 16, 14, -1),
  },
  Timbaúba: { cx: 668, cy: 96, d: poligonoMunicipio(668, 96, 16, 13, 2) },
  'Nazaré da Mata': {
    cx: 678,
    cy: 126,
    d: poligonoMunicipio(678, 126, 15, 13, -1),
  },
  Carpina: { cx: 672, cy: 156, d: poligonoMunicipio(672, 156, 15, 13, 1) },
  Goiana: { cx: 728, cy: 96, d: poligonoMunicipio(728, 96, 18, 14, -2) },
  Igarassu: { cx: 734, cy: 132, d: poligonoMunicipio(734, 132, 15, 12, 1) },
  'Abreu e Lima': {
    cx: 726,
    cy: 154,
    d: poligonoMunicipio(726, 154, 13, 10, -1),
  },
  Paulista: { cx: 748, cy: 158, d: poligonoMunicipio(748, 158, 13, 10, 1) },
  Camaragibe: { cx: 714, cy: 182, d: poligonoMunicipio(714, 182, 12, 10, -1) },
  'São Lourenço da Mata': {
    cx: 694,
    cy: 194,
    d: poligonoMunicipio(694, 194, 14, 11, 1),
  },
  Olinda: { cx: 754, cy: 176, d: poligonoMunicipio(754, 176, 12, 10, -1) },
  Recife: { cx: 746, cy: 196, d: poligonoMunicipio(746, 196, 15, 12, 1) },
  'Jaboatão dos Guararapes': {
    cx: 730,
    cy: 218,
    d: poligonoMunicipio(730, 218, 16, 12, -1),
  },
  'Cabo de Santo Agostinho': {
    cx: 718,
    cy: 242,
    d: poligonoMunicipio(718, 242, 16, 13, 1),
  },
  Ipojuca: { cx: 706, cy: 268, d: poligonoMunicipio(706, 268, 16, 13, -1) },
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

/** Contorno geográfico estilizado do Estado de Pernambuco dentro de 800x400. */
const CONTORNO_PERNAMBUCO =
  'M 36 108 L 68 82 L 124 92 L 172 118 L 234 114 L 286 96 L 344 74 L 396 82 L 414 148 L 468 154 L 504 116 L 566 108 L 622 92 L 666 68 L 750 70 L 764 118 L 772 168 L 766 206 L 748 248 L 728 292 L 668 286 L 604 298 L 546 286 L 496 324 L 432 326 L 396 276 L 344 286 L 278 302 L 218 292 L 168 338 L 106 368 L 64 334 L 48 258 L 28 176 Z';

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
        {/* Fundo geográfico de Pernambuco */}
        <path
          d={CONTORNO_PERNAMBUCO}
          fill="#F1F5F9"
          stroke="#CBD5E1"
          strokeWidth={2}
        />

        {/* Divisores sutis de mesorregiões para leitura geográfica */}
        <g stroke="#CBD5E1" strokeDasharray="4 4" strokeWidth={1} opacity={0.7}>
          <line x1="414" y1="148" x2="396" y2="276" />
          <line x1="622" y1="92" x2="585" y2="292" />
          <line x1="704" y1="70" x2="686" y2="288" />
        </g>

        <g
          fill="#64748B"
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.06em"
        >
          <text x="205" y="52" textAnchor="middle">
            SERTÃO
          </text>
          <text x="515" y="52" textAnchor="middle">
            AGRESTE
          </text>
          <text x="656" y="52" textAnchor="middle">
            MATA
          </text>
          <text x="742" y="52" textAnchor="middle">
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
