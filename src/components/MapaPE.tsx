import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import { BadgeNivel } from './BadgeNivel';
import type { NivelAlerta } from '../data/tipos';
import { formatarVariacao } from '../lib/variacao';
import type { ResumoMapaMunicipio } from '../services/dataService';

export interface MapaPEProps {
  dados: ResumoMapaMunicipio[];
  municipioSelecionado?: string | null;
  aoSelecionarMunicipio?: (municipio: string) => void;
}

const COORDENADAS_PERNAMBUCO: [number, number] = [-8.38, -37.8];

/** Coordenadas geográficas [latitude, longitude] dos municípios mapeados em PE. */
const COORDENADAS_MUNICIPIOS: Record<string, [number, number]> = {
  'Abreu e Lima': [-7.9117, -34.9028],
  'Afogados da Ingazeira': [-7.7508, -37.6392],
  Altinho: [-8.4897, -36.0594],
  Araripina: [-7.5761, -40.4983],
  Arcoverde: [-8.4189, -37.0539],
  'Belo Jardim': [-8.3356, -36.4242],
  Bezerros: [-8.2333, -35.7569],
  'Bom Conselho': [-9.1697, -36.6797],
  'Cabo de Santo Agostinho': [-8.2869, -35.035],
  Camaragibe: [-8.0236, -34.9781],
  Carpina: [-7.8508, -35.2547],
  Caruaru: [-8.2833, -35.9761],
  Custódia: [-8.0875, -37.6431],
  Escada: [-8.3592, -35.2236],
  Floresta: [-8.6011, -38.5686],
  Garanhuns: [-8.8903, -36.4928],
  Goiana: [-7.5606, -35.0025],
  Gravatá: [-8.2011, -35.5647],
  Igarassu: [-7.8342, -34.9064],
  Ipojuca: [-8.3989, -35.0639],
  'Jaboatão dos Guararapes': [-8.1128, -35.0147],
  Limoeiro: [-7.8747, -35.4503],
  'Nazaré da Mata': [-7.7419, -35.2278],
  Olinda: [-8.0089, -34.8553],
  Ouricuri: [-7.8825, -40.0817],
  Palmares: [-8.6833, -35.5919],
  Paulista: [-7.9408, -34.8731],
  Pesqueira: [-8.3578, -36.6964],
  Petrolina: [-9.3892, -40.5031],
  Recife: [-8.0476, -34.877],
  Salgueiro: [-8.0742, -39.1192],
  'Santa Cruz do Capibaribe': [-7.9575, -36.2047],
  'São Bento do Una': [-8.5222, -36.4439],
  'São Lourenço da Mata': [-8.0022, -35.0183],
  'Serra Talhada': [-7.9919, -38.2983],
  Surubim: [-7.8331, -35.7547],
  Timbaúba: [-7.5053, -35.3183],
  Toritama: [-8.0067, -36.0567],
  'Vitória de Santo Antão': [-8.1181, -35.2914],
};

interface EstiloMarcadorNivel {
  fillColor: string;
  strokeColor: string;
  raio: number;
}

const ESTILO_POR_NIVEL: Record<NivelAlerta, EstiloMarcadorNivel> = {
  prioritario: { fillColor: '#DC2626', strokeColor: '#7F1D1D', raio: 11 },
  atencao: { fillColor: '#EA580C', strokeColor: '#7C2D12', raio: 10 },
  monitoramento: { fillColor: '#F59E0B', strokeColor: '#78350F', raio: 9 },
  'sem-base': { fillColor: '#64748B', strokeColor: '#1E293B', raio: 8 },
  'sem-alerta': { fillColor: '#94A3B8', strokeColor: '#475569', raio: 7 },
};

export function MapaPE({
  dados,
  municipioSelecionado,
  aoSelecionarMunicipio,
}: MapaPEProps) {
  return (
    <div className="relative z-0 w-full h-[440px] rounded-card overflow-hidden border border-border-subtle">
      <MapContainer
        center={COORDENADAS_PERNAMBUCO}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {dados.map((item) => {
          const coordenadas =
            COORDENADAS_MUNICIPIOS[item.municipio] ?? COORDENADAS_PERNAMBUCO;
          const estilo = ESTILO_POR_NIVEL[item.nivel];
          const estaSelecionado = municipioSelecionado === item.municipio;

          return (
            <CircleMarker
              key={item.municipio}
              center={coordenadas}
              radius={estaSelecionado ? estilo.raio + 3 : estilo.raio}
              pathOptions={{
                fillColor: estilo.fillColor,
                fillOpacity: estaSelecionado ? 0.95 : 0.85,
                color: item.temUnidade ? '#1D4ED8' : estilo.strokeColor,
                weight: item.temUnidade ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => aoSelecionarMunicipio?.(item.municipio),
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.98}>
                <div className="min-w-[210px] text-xs font-sans">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm text-navy">
                      {item.municipio}
                    </p>
                    <BadgeNivel nivel={item.nivel} />
                  </div>

                  <dl className="mt-2 space-y-1 text-text-secondary">
                    <div className="flex justify-between gap-3">
                      <dt>Casos atuais (nov/2026):</dt>
                      <dd className="font-semibold text-text-primary tabular-nums">
                        {item.casosAtual.toLocaleString('pt-BR')}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Variação %:</dt>
                      <dd className="font-semibold text-navy tabular-nums">
                        {formatarVariacao(item)}
                      </dd>
                    </div>
                  </dl>

                  <p
                    className={`mt-2 pt-2 border-t border-border-subtle font-semibold whitespace-normal ${
                      item.temUnidade
                        ? 'text-navy'
                        : 'text-alerta-atencao-text'
                    }`}
                  >
                    {item.temUnidade
                      ? 'Possui unidade CEJUSC instalada'
                      : 'Sem unidade física CEJUSC/NUPEMEC — indicado para mutirão itinerante'}
                  </p>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
