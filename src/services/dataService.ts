import { DEFINICOES_ALERTAS } from '../data/alertas';
import { FOCOS, INDICE_ANTERIOR, INDICE_ATUAL } from '../data/focos';
import { MUNICIPIOS } from '../data/municipios';
import type {
  AlertaCalculado,
  CategoriaAssunto,
  Foco,
  Litigante,
  Municipio,
  NivelAlerta,
  ResultadoVariacao,
  SituacaoAlerta,
} from '../data/tipos';
import { calcularVariacao, rotuloMes } from '../lib/variacao';

export interface FiltrosAlertas {
  nivel?: NivelAlerta;
  municipio?: string;
  categoria?: CategoriaAssunto;
  parteRe?: string;
  situacao?: SituacaoAlerta;
}

export interface FiltrosDashboard {
  categoria?: CategoriaAssunto;
  municipio?: string;
}

export interface PontoEvolucaoMensal {
  mes: string;
  casos: number;
}

export interface ResumoCategoria {
  categoria: CategoriaAssunto;
  casosAtual: number;
  casosAnterior: number;
  variacaoPercentual: number | null;
  nivel: NivelAlerta;
}

export interface ResumoMunicipioDashboard {
  municipio: string;
  casosAtual: number;
  casosAnterior: number;
  variacaoPercentual: number | null;
  nivel: NivelAlerta;
  temUnidade: boolean;
}

export interface Dashboard {
  totalCasosPeriodoAtual: number;
  totalCasosPeriodoAnterior: number;
  variacaoGeral: ResultadoVariacao;
  evolucaoMensal: PontoEvolucaoMensal[];
  porCategoria: ResumoCategoria[];
  porMunicipio: ResumoMunicipioDashboard[];
  alertasAtivos: number;
  litigantesEmAtencao: number;
}

export interface ResumoMapaMunicipio {
  municipio: string;
  casosAtual: number;
  casosAnterior: number;
  variacaoPercentual: number | null;
  nivel: NivelAlerta;
  temUnidade: boolean;
  alertasVinculados: string[];
}

const PRIORIDADE_NIVEL: Record<NivelAlerta, number> = {
  prioritario: 4,
  atencao: 3,
  monitoramento: 2,
  'sem-base': 1,
  'sem-alerta': 0,
};

function construirAlertasCalculados(): AlertaCalculado[] {
  const focosPorId = new Map<string, Foco>(
    FOCOS.map((foco) => [foco.id, foco]),
  );
  const definicoesPorFocoId = new Map(
    DEFINICOES_ALERTAS.map((definicao) => [definicao.focoId, definicao]),
  );

  const lista: AlertaCalculado[] = [];

  for (const definicao of DEFINICOES_ALERTAS) {
    const foco = focosPorId.get(definicao.focoId);
    if (!foco) continue;

    const periodoAnterior = foco.serieMensal[INDICE_ANTERIOR] ?? 0;
    const periodoAtual = foco.serieMensal[INDICE_ATUAL] ?? 0;
    const resultado = calcularVariacao(periodoAnterior, periodoAtual);

    if (resultado.nivel === 'sem-alerta') continue;

    lista.push({
      id: definicao.id,
      focoId: foco.id,
      assunto: foco.tema ?? foco.assunto,
      categoria: foco.categoria,
      parteRe: foco.parteRe,
      setorParteRe: foco.setorParteRe,
      municipio: foco.municipio,
      periodoAnterior,
      periodoAtual,
      serieMensal: [...foco.serieMensal],
      situacao: definicao.situacao,
      geradoEm: definicao.geradoEm,
      hipoteses: definicao.hipoteses,
      oportunidade: definicao.oportunidade,
      variacaoPercentual: resultado.variacaoPercentual,
      nivel: resultado.nivel,
    });
  }

  for (const foco of FOCOS) {
    if (definicoesPorFocoId.has(foco.id)) continue;

    const periodoAnterior = foco.serieMensal[INDICE_ANTERIOR] ?? 0;
    const periodoAtual = foco.serieMensal[INDICE_ATUAL] ?? 0;
    const resultado = calcularVariacao(periodoAnterior, periodoAtual);

    if (resultado.nivel === 'sem-alerta') continue;

    lista.push({
      id: foco.id,
      focoId: foco.id,
      assunto: foco.tema ?? foco.assunto,
      categoria: foco.categoria,
      parteRe: foco.parteRe,
      setorParteRe: foco.setorParteRe,
      municipio: foco.municipio,
      periodoAnterior,
      periodoAtual,
      serieMensal: [...foco.serieMensal],
      situacao: 'Novo',
      geradoEm: '2026-11-06',
      variacaoPercentual: resultado.variacaoPercentual,
      nivel: resultado.nivel,
    });
  }

  return lista.sort((a, b) => {
    const diffNivel = PRIORIDADE_NIVEL[b.nivel] - PRIORIDADE_NIVEL[a.nivel];
    if (diffNivel !== 0) return diffNivel;

    const varA = a.variacaoPercentual ?? -Infinity;
    const varB = b.variacaoPercentual ?? -Infinity;
    return varB - varA;
  });
}

function agregarLitigantes(focos: readonly Foco[]): Litigante[] {
  const mapa = new Map<
    string,
    { setor: string; casosAtual: number; casosAnterior: number }
  >();

  for (const foco of focos) {
    const atual = foco.serieMensal[INDICE_ATUAL] ?? 0;
    const anterior = foco.serieMensal[INDICE_ANTERIOR] ?? 0;
    const acumulado = mapa.get(foco.parteRe);

    if (acumulado) {
      acumulado.casosAtual += atual;
      acumulado.casosAnterior += anterior;
    } else {
      mapa.set(foco.parteRe, {
        setor: foco.setorParteRe,
        casosAtual: atual,
        casosAnterior: anterior,
      });
    }
  }

  const litigantes: Litigante[] = [];
  for (const [parteRe, dados] of mapa.entries()) {
    const resultado = calcularVariacao(dados.casosAnterior, dados.casosAtual);
    litigantes.push({
      parteRe,
      setor: dados.setor,
      casosAtual: dados.casosAtual,
      casosAnterior: dados.casosAnterior,
      variacaoPercentual: resultado.variacaoPercentual,
      nivel: resultado.nivel,
    });
  }

  return litigantes.sort((a, b) => b.casosAtual - a.casosAtual);
}

function agregarAssuntos(focos: readonly Foco[]): ResumoCategoria[] {
  const mapaCategorias = new Map<
    CategoriaAssunto,
    { atual: number; anterior: number }
  >();

  for (const foco of focos) {
    const atual = foco.serieMensal[INDICE_ATUAL] ?? 0;
    const anterior = foco.serieMensal[INDICE_ANTERIOR] ?? 0;
    const cat = mapaCategorias.get(foco.categoria) ?? { atual: 0, anterior: 0 };
    cat.atual += atual;
    cat.anterior += anterior;
    mapaCategorias.set(foco.categoria, cat);
  }

  return Array.from(mapaCategorias.entries())
    .map(([categoria, valores]) => ({
      categoria,
      casosAtual: valores.atual,
      casosAnterior: valores.anterior,
      ...calcularVariacao(valores.anterior, valores.atual),
    }))
    .sort((a, b) => b.casosAtual - a.casosAtual);
}

export async function getAlertas(
  filtros?: FiltrosAlertas,
): Promise<AlertaCalculado[]> {
  const todos = construirAlertasCalculados();

  if (!filtros) return todos;

  return todos.filter((alerta) => {
    if (filtros.nivel && alerta.nivel !== filtros.nivel) return false;
    if (filtros.municipio && alerta.municipio !== filtros.municipio) {
      return false;
    }
    if (filtros.categoria && alerta.categoria !== filtros.categoria) {
      return false;
    }
    if (
      filtros.parteRe &&
      !alerta.parteRe.toLowerCase().includes(filtros.parteRe.toLowerCase())
    ) {
      return false;
    }
    if (filtros.situacao && alerta.situacao !== filtros.situacao) {
      return false;
    }
    return true;
  });
}

export async function getAlerta(
  id: string,
): Promise<AlertaCalculado | undefined> {
  const todos = await getAlertas();
  return todos.find((alerta) => alerta.id === id);
}

export async function getDashboard(
  filtros?: FiltrosDashboard,
): Promise<Dashboard> {
  const focosFiltrados = FOCOS.filter((foco) => {
    if (filtros?.categoria && foco.categoria !== filtros.categoria) {
      return false;
    }
    if (filtros?.municipio && foco.municipio !== filtros.municipio) {
      return false;
    }
    return true;
  });

  const unidadePorMunicipio = new Map<string, boolean>(
    MUNICIPIOS.map((m) => [m.nome, m.temUnidade]),
  );

  let totalCasosPeriodoAtual = 0;
  let totalCasosPeriodoAnterior = 0;

  const totaisMensais = new Array<number>(INDICE_ATUAL + 1).fill(0);
  const mapaMunicipios = new Map<
    string,
    { atual: number; anterior: number }
  >();

  for (const foco of focosFiltrados) {
    const atual = foco.serieMensal[INDICE_ATUAL] ?? 0;
    const anterior = foco.serieMensal[INDICE_ANTERIOR] ?? 0;

    totalCasosPeriodoAtual += atual;
    totalCasosPeriodoAnterior += anterior;

    for (let i = 0; i <= INDICE_ATUAL; i++) {
      totaisMensais[i] += foco.serieMensal[i] ?? 0;
    }

    const mun = mapaMunicipios.get(foco.municipio) ?? { atual: 0, anterior: 0 };
    mun.atual += atual;
    mun.anterior += anterior;
    mapaMunicipios.set(foco.municipio, mun);
  }

  const variacaoGeral = calcularVariacao(
    totalCasosPeriodoAnterior,
    totalCasosPeriodoAtual,
  );

  const evolucaoMensal: PontoEvolucaoMensal[] = totaisMensais.map(
    (casos, indice) => ({
      mes: rotuloMes(indice),
      casos,
    }),
  );

  const porCategoria: ResumoCategoria[] = agregarAssuntos(focosFiltrados);

  const porMunicipio: ResumoMunicipioDashboard[] = Array.from(
    mapaMunicipios.entries(),
  )
    .map(([municipio, valores]) => ({
      municipio,
      casosAtual: valores.atual,
      casosAnterior: valores.anterior,
      ...calcularVariacao(valores.anterior, valores.atual),
      temUnidade: unidadePorMunicipio.get(municipio) ?? false,
    }))
    .sort((a, b) => b.casosAtual - a.casosAtual);

  const alertasFiltrados = await getAlertas({
    categoria: filtros?.categoria,
    municipio: filtros?.municipio,
  });

  const litigantes = agregarLitigantes(focosFiltrados);
  const litigantesEmAtencao = litigantes.filter(
    (l) => l.nivel !== 'sem-alerta',
  ).length;

  return {
    totalCasosPeriodoAtual,
    totalCasosPeriodoAnterior,
    variacaoGeral,
    evolucaoMensal,
    porCategoria,
    porMunicipio,
    alertasAtivos: alertasFiltrados.length,
    litigantesEmAtencao,
  };
}

export async function getLitigantes(): Promise<Litigante[]> {
  return agregarLitigantes(FOCOS);
}

export async function getAssuntosEmAscensao(): Promise<ResumoCategoria[]> {
  return agregarAssuntos(FOCOS)
    .filter((item) => item.casosAtual > item.casosAnterior)
    .sort((a, b) => {
      const novosA = a.casosAtual - a.casosAnterior;
      const novosB = b.casosAtual - b.casosAnterior;
      if (novosB !== novosA) return novosB - novosA;

      return b.casosAtual - a.casosAtual;
    });
}

export async function getMunicipios(): Promise<Municipio[]> {
  return [...MUNICIPIOS];
}

export async function getResumoMapa(
  categoria?: CategoriaAssunto,
): Promise<ResumoMapaMunicipio[]> {
  const focosFiltrados = categoria
    ? FOCOS.filter((foco) => foco.categoria === categoria)
    : FOCOS;

  const alertas = await getAlertas(categoria ? { categoria } : undefined);

  const alertasPorMunicipio = new Map<string, string[]>();
  for (const alerta of alertas) {
    const lista = alertasPorMunicipio.get(alerta.municipio) ?? [];
    lista.push(alerta.id);
    alertasPorMunicipio.set(alerta.municipio, lista);
  }

  const volumePorMunicipio = new Map<
    string,
    { atual: number; anterior: number }
  >();
  for (const foco of focosFiltrados) {
    const acumulado = volumePorMunicipio.get(foco.municipio) ?? {
      atual: 0,
      anterior: 0,
    };
    acumulado.atual += foco.serieMensal[INDICE_ATUAL] ?? 0;
    acumulado.anterior += foco.serieMensal[INDICE_ANTERIOR] ?? 0;
    volumePorMunicipio.set(foco.municipio, acumulado);
  }

  return MUNICIPIOS.map((municipio) => {
    const volume = volumePorMunicipio.get(municipio.nome) ?? {
      atual: 0,
      anterior: 0,
    };
    const resultado = calcularVariacao(volume.anterior, volume.atual);

    return {
      municipio: municipio.nome,
      casosAtual: volume.atual,
      casosAnterior: volume.anterior,
      variacaoPercentual: resultado.variacaoPercentual,
      nivel: resultado.nivel,
      temUnidade: municipio.temUnidade,
      alertasVinculados: alertasPorMunicipio.get(municipio.nome) ?? [],
    };
  }).sort((a, b) => b.casosAtual - a.casosAtual);
}
