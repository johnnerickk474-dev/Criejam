import type { NivelAlerta, ResultadoVariacao } from '../data/tipos';

export const MIN_REGISTROS = 20;
export const LIMIAR_MONITORAMENTO = 10;
export const LIMIAR_ATENCAO = 25;
export const LIMIAR_PRIORITARIO = 50;

const MESES_ABREVIADOS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

/**
 * Calcula a variação percentual entre dois períodos e determina o nível de alerta
 * conforme as regras de volume mínimo e faixas percentuais.
 */
export function calcularVariacao(
  anterior: number,
  atual: number,
): ResultadoVariacao {
  if (atual < MIN_REGISTROS && anterior < MIN_REGISTROS) {
    return { variacaoPercentual: null, nivel: 'sem-alerta' };
  }

  if (anterior === 0 && atual >= MIN_REGISTROS) {
    return { variacaoPercentual: null, nivel: 'sem-base' };
  }

  if (anterior <= 0) {
    return { variacaoPercentual: null, nivel: 'sem-alerta' };
  }

  const variacaoBruta = ((atual - anterior) / anterior) * 100;
  const arredondada = Math.round(variacaoBruta * 10) / 10;
  const variacaoPercentual = Object.is(arredondada, -0) ? 0 : arredondada;

  let nivel: NivelAlerta = 'sem-alerta';

  if (atual >= MIN_REGISTROS) {
    if (variacaoPercentual >= LIMIAR_PRIORITARIO) {
      nivel = 'prioritario';
    } else if (variacaoPercentual >= LIMIAR_ATENCAO) {
      nivel = 'atencao';
    } else if (variacaoPercentual >= LIMIAR_MONITORAMENTO) {
      nivel = 'monitoramento';
    }
  }

  return { variacaoPercentual, nivel };
}

/**
 * Retorna o rótulo do mês no formato "mmm/AAAA" a partir do índice 0 = "set/2025".
 */
export function rotuloMes(indice: number): string {
  const mesBase = 8; // setembro (0-based)
  const anoBase = 2025;
  const totalMeses = mesBase + indice;
  const ano = anoBase + Math.floor(totalMeses / 12);
  const indiceMes = ((totalMeses % 12) + 12) % 12;
  return `${MESES_ABREVIADOS[indiceMes]}/${ano}`;
}

/**
 * Formata o resultado de variação para exibição em pt-BR com sinal tipográfico.
 */
export function formatarVariacao(resultado: ResultadoVariacao): string {
  if (resultado.nivel === 'sem-base') {
    return 'Nova ocorrência no período';
  }

  if (resultado.variacaoPercentual === null) {
    return '—';
  }

  const valorFormatado = Math.abs(resultado.variacaoPercentual)
    .toFixed(1)
    .replace('.', ',');

  if (resultado.variacaoPercentual > 0) {
    return `+${valorFormatado}%`;
  }

  if (resultado.variacaoPercentual < 0) {
    return `\u2212${valorFormatado}%`;
  }

  return '0,0%';
}
