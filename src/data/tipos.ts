export type CategoriaAssunto =
  | 'Direito do Consumidor'
  | 'Direito da Saúde'
  | 'Direito Tributário'
  | 'Direito de Família'
  | 'Direito à Educação'
  | 'Direito Civil'
  | 'Outros';

export type NivelAlerta =
  | 'prioritario'
  | 'atencao'
  | 'monitoramento'
  | 'sem-base'
  | 'sem-alerta';

export type SituacaoAlerta =
  | 'Novo'
  | 'Em análise'
  | 'Hipótese registrada'
  | 'Informação solicitada';

export interface Foco {
  id: string;
  assunto: string;
  tema?: string;
  categoria: CategoriaAssunto;
  parteRe: string;
  setorParteRe: string;
  municipio: string;
  /** Série mensal com 14 pontos: de out/2025 (índice 0) a nov/2026 (índice 13). */
  serieMensal: number[];
}

export interface ResultadoVariacao {
  variacaoPercentual: number | null;
  nivel: NivelAlerta;
}

export interface HipoteseIA {
  texto: string;
  geradaPorIA: true;
}

export interface Alerta {
  id: string;
  focoId: string;
  assunto: string;
  categoria: CategoriaAssunto;
  parteRe: string;
  setorParteRe: string;
  municipio: string;
  periodoAnterior: number;
  periodoAtual: number;
  serieMensal: number[];
  situacao: SituacaoAlerta;
  geradoEm: string;
  hipoteses?: HipoteseIA[];
  oportunidade?: string;
}

export type AlertaCalculado = Alerta & ResultadoVariacao;

export interface Municipio {
  nome: string;
  temUnidade: boolean;
  tipoUnidade?: string;
}

export type Litigante = {
  parteRe: string;
  setor: string;
  casosAtual: number;
  casosAnterior: number;
} & ResultadoVariacao;
