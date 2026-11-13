import type { CategoriaAssunto, Foco } from './tipos';
import { MUNICIPIOS } from './municipios';

export const INDICE_ANTERIOR = 12;
export const INDICE_ATUAL = 13;

const FOCOS_CHAVE: Foco[] = [
  {
    id: 'F-001',
    assunto: 'Cobrança indevida em serviço de telefonia',
    categoria: 'Direito do Consumidor',
    parteRe: 'TeleRecife Telecom',
    setorParteRe: 'Telefonia',
    municipio: 'Recife',
    serieMensal: [74, 76, 73, 78, 80, 79, 83, 85, 88, 92, 95, 97, 100, 165],
  },
  {
    id: 'F-002',
    assunto: 'Falha na prestação de serviço de transporte aéreo',
    categoria: 'Direito do Consumidor',
    parteRe: 'AeroNordeste Linhas Aéreas',
    setorParteRe: 'Aviação',
    municipio: 'Jaboatão dos Guararapes',
    serieMensal: [40, 42, 41, 44, 43, 45, 46, 47, 48, 49, 50, 50, 50, 64],
  },
  {
    id: 'F-003',
    assunto: 'Negativa de cobertura de plano de saúde',
    categoria: 'Direito da Saúde',
    parteRe: 'Vida Plena Saúde',
    setorParteRe: 'Plano de saúde',
    municipio: 'Caruaru',
    serieMensal: [30, 31, 32, 31, 33, 34, 35, 35, 36, 37, 38, 38, 38, 50],
  },
  {
    id: 'F-004',
    assunto: 'Cobrança de tarifa não contratada',
    categoria: 'Direito Civil',
    parteRe: 'Banco Mar Azul',
    setorParteRe: 'Financeiro',
    municipio: 'Olinda',
    serieMensal: [38, 39, 41, 40, 42, 44, 45, 46, 47, 48, 49, 50, 50, 61],
  },
  {
    id: 'F-005',
    assunto: 'Cobrança indevida de fatura de energia',
    categoria: 'Direito Civil',
    parteRe: 'Energia do Agreste',
    setorParteRe: 'Energia',
    municipio: 'Belo Jardim',
    serieMensal: [30, 31, 33, 32, 34, 35, 36, 38, 39, 40, 40, 40, 40, 46],
  },
  {
    id: 'F-006',
    assunto: 'Cobrança de serviço financeiro novo',
    categoria: 'Direito Civil',
    parteRe: 'PagaFácil Pagamentos',
    setorParteRe: 'Financeiro',
    municipio: 'Recife',
    serieMensal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24],
  },
  {
    id: 'F-007',
    assunto: 'Vício em produto vendido pela internet',
    categoria: 'Direito Civil',
    parteRe: 'MegaLoja Online',
    setorParteRe: 'Varejo',
    municipio: 'Paulista',
    serieMensal: [28, 29, 29, 30, 30, 31, 30, 31, 32, 32, 32, 32, 32, 33],
  },
  {
    id: 'F-008',
    assunto: 'Negativa de cobertura de plano de saúde',
    categoria: 'Direito da Saúde',
    parteRe: 'Vida Plena Saúde',
    setorParteRe: 'Plano de saúde',
    municipio: 'Petrolina',
    serieMensal: [6, 6, 7, 6, 7, 8, 7, 8, 8, 9, 9, 9, 9, 12],
  },
  {
    id: 'AL-2026-007',
    tema: 'Cobrança abusiva de juros e desconto indevido em consignado',
    assunto: 'Cobrança abusiva de juros e desconto indevido em consignado',
    categoria: 'Direito do Consumidor',
    parteRe: 'Banco Central do Sertão',
    setorParteRe: 'Financeiro',
    municipio: 'Petrolina',
    serieMensal: [80, 82, 85, 88, 90, 93, 96, 98, 100, 103, 105, 108, 110, 198],
  },
  {
    id: 'AL-2026-008',
    tema: 'Corte indevido de fornecimento e cobrança por estimativa',
    assunto: 'Corte indevido de fornecimento e cobrança por estimativa',
    categoria: 'Direito do Consumidor',
    parteRe: 'Águas de Pernambuco',
    setorParteRe: 'Saneamento',
    municipio: 'Garanhuns',
    serieMensal: [62, 64, 65, 68, 70, 72, 74, 76, 78, 80, 82, 84, 85, 148],
  },
  {
    id: 'AL-2026-009',
    tema: 'Não entrega de mercadoria adquirida em canal digital',
    assunto: 'Não entrega de mercadoria adquirida em canal digital',
    categoria: 'Direito do Consumidor',
    parteRe: 'Varejo BomPreço',
    setorParteRe: 'Varejo',
    municipio: 'Serra Talhada',
    serieMensal: [50, 52, 53, 55, 56, 58, 60, 62, 64, 65, 67, 68, 70, 102],
  },
  {
    id: 'AL-2026-010',
    tema: 'Atraso na entrega de obra e cobrança de juros contratuais',
    assunto: 'Atraso na entrega de obra e cobrança de juros contratuais',
    categoria: 'Direito Civil',
    parteRe: 'Construtora Litoral',
    setorParteRe: 'Construção civil',
    municipio: 'Goiana',
    serieMensal: [84, 86, 88, 92, 95, 98, 102, 105, 108, 112, 115, 118, 120, 210],
  },
  {
    id: 'AL-2026-011',
    tema: 'Fidelização indevida e falha reiterada no sinal de internet',
    assunto: 'Fidelização indevida e falha reiterada no sinal de internet',
    categoria: 'Direito do Consumidor',
    parteRe: 'Conecta Mata Sul Telecom',
    setorParteRe: 'Telefonia',
    municipio: 'Palmares',
    serieMensal: [42, 43, 45, 46, 48, 50, 51, 53, 55, 56, 58, 59, 60, 86],
  },
  {
    id: 'AL-2026-012',
    tema: 'Inadimplemento contratual em transporte e armazenagem',
    assunto: 'Inadimplemento contratual em transporte e armazenagem',
    categoria: 'Direito Civil',
    parteRe: 'Logística Atlântico Sul',
    setorParteRe: 'Logística',
    municipio: 'Cabo de Santo Agostinho',
    serieMensal: [92, 95, 98, 102, 105, 108, 112, 115, 118, 122, 125, 128, 130, 188],
  },
  {
    id: 'AL-2026-013',
    tema: 'Recusa de autorização para exame e internação de urgência',
    assunto: 'Recusa de autorização para exame e internação de urgência',
    categoria: 'Direito da Saúde',
    parteRe: 'Saúde Sertão Assistência Médica',
    setorParteRe: 'Plano de saúde',
    municipio: 'Arcoverde',
    serieMensal: [54, 56, 58, 60, 62, 65, 67, 70, 72, 74, 76, 78, 80, 148],
  },
  {
    id: 'AL-2026-014',
    tema: 'Cobrança de seguro prestamista vinculado sem anuência',
    assunto: 'Cobrança de seguro prestamista vinculado sem anuência',
    categoria: 'Direito Civil',
    parteRe: 'CredFácil Financeira Regional',
    setorParteRe: 'Financeiro',
    municipio: 'Vitória de Santo Antão',
    serieMensal: [68, 70, 72, 74, 76, 79, 81, 84, 86, 89, 91, 93, 95, 135],
  },
];

interface ModeloFundo {
  parteRe: string;
  setorParteRe: string;
  categoria: CategoriaAssunto;
  assunto: string;
  multiplicador: number;
}

const MODELOS_FUNDO: readonly ModeloFundo[] = [
  {
    parteRe: 'NetFibra Pernambuco',
    setorParteRe: 'Telefonia',
    categoria: 'Direito do Consumidor',
    assunto: 'Contestação de cobrança e portabilidade numérica',
    multiplicador: 2.1,
  },
  {
    parteRe: 'Distribuidora Litoral',
    setorParteRe: 'Comércio atacadista',
    categoria: 'Direito Civil',
    assunto: 'Revisão de cláusula de fornecimento comercial',
    multiplicador: 1.5,
  },
  {
    parteRe: 'Particulares — Varas de Família (Simulado)',
    setorParteRe: 'Pessoas físicas',
    categoria: 'Direito de Família',
    assunto: 'Revisão consensual de guarda e alimentos',
    multiplicador: 1.9,
  },
  {
    parteRe: 'Hospital Regional Vida Nova',
    setorParteRe: 'Saúde privada',
    categoria: 'Direito da Saúde',
    assunto: 'Fornecimento de tratamento ambulatorial',
    multiplicador: 1.1,
  },
  {
    parteRe: 'Comercial Sertão Sul',
    setorParteRe: 'Varejo',
    categoria: 'Direito do Consumidor',
    assunto: 'Troca de produto com vício oculto e garantia estendida',
    multiplicador: 2.05,
  },
  {
    parteRe: 'Cooperativa Crédito Capibaribe',
    setorParteRe: 'Financeiro',
    categoria: 'Direito Civil',
    assunto: 'Renegociação de contrato de microcrédito',
    multiplicador: 1.45,
  },
  {
    parteRe: 'Escola Superior Horizonte',
    setorParteRe: 'Ensino superior',
    categoria: 'Direito à Educação',
    assunto: 'Divergência em cobrança de mensalidade acadêmica',
    multiplicador: 1.0,
  },
  {
    parteRe: 'Rede Nova Farma',
    setorParteRe: 'Varejo farmacêutico',
    categoria: 'Direito do Consumidor',
    assunto: 'Cancelamento de programa de fidelidade e cobrança',
    multiplicador: 2.0,
  },
  {
    parteRe: 'Transportadora Agreste Express',
    setorParteRe: 'Logística',
    categoria: 'Direito Civil',
    assunto: 'Extravio e atraso na entrega de encomenda',
    multiplicador: 1.4,
  },
  {
    parteRe: 'MedCare Nordeste',
    setorParteRe: 'Plano de saúde',
    categoria: 'Direito da Saúde',
    assunto: 'Reajuste anual de mensalidade em plano coletivo',
    multiplicador: 1.05,
  },
  {
    parteRe: 'Fazenda Pública Estadual Simulada',
    setorParteRe: 'Setor público',
    categoria: 'Direito Tributário',
    assunto: 'Cobrança de taxa estadual de fiscalização',
    multiplicador: 0.85,
  },
  {
    parteRe: 'Particulares — Sucessões e Família (Simulado)',
    setorParteRe: 'Pessoas físicas',
    categoria: 'Direito de Família',
    assunto: 'Dissolução de união estável e partilha amigável',
    multiplicador: 1.85,
  },
  {
    parteRe: 'Construtora Morada Nova',
    setorParteRe: 'Construção civil',
    categoria: 'Direito Civil',
    assunto: 'Atraso na entrega de unidade habitacional',
    multiplicador: 1.45,
  },
  {
    parteRe: 'Consórcio Imobiliário Recife Sul',
    setorParteRe: 'Consórcios',
    categoria: 'Outros',
    assunto: 'Restituição de valores em grupo de consórcio',
    multiplicador: 0.25,
  },
];

const MUNICIPIOS_ALERTA_ATIVO = new Set<string>([
  'Recife',
  'Jaboatão dos Guararapes',
  'Caruaru',
  'Olinda',
  'Belo Jardim',
  'Petrolina',
  'Garanhuns',
  'Serra Talhada',
  'Goiana',
  'Palmares',
  'Cabo de Santo Agostinho',
  'Arcoverde',
  'Vitória de Santo Antão',
]);

const MUNICIPIOS_FUNDO = MUNICIPIOS.filter(
  (m) => !MUNICIPIOS_ALERTA_ATIVO.has(m.nome),
);

function criarGeradorMulberry32(semente: number): () => number {
  let estado = semente >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(maximo, valor));
}

function gerarFocosDeFundo(quantidade: number): Foco[] {
  const rand = criarGeradorMulberry32(20260513);
  const focos: Foco[] = [];

  for (let i = 0; i < quantidade; i++) {
    const idNumero = String(i + FOCOS_CHAVE.length + 1).padStart(3, '0');
    const modelo = MODELOS_FUNDO[i % MODELOS_FUNDO.length];
    const municipio =
      MUNICIPIOS_FUNDO[(i * 3 + Math.floor(rand() * 5)) % MUNICIPIOS_FUNDO.length]
        .nome;

    const minimo = Math.max(5, Math.round(15 * modelo.multiplicador));
    const maximo = Math.max(minimo + 10, Math.round(220 * modelo.multiplicador));
    const base = Math.round((25 + rand() * 170) * modelo.multiplicador);
    const serieMensal: number[] = [];

    let corrente = base;
    for (let mes = 0; mes <= INDICE_ANTERIOR; mes++) {
      const oscilacao = (rand() - 0.5) * 0.1; // -5% a +5%
      corrente = limitar(Math.round(corrente * (1 + oscilacao)), minimo, maximo);
      serieMensal.push(corrente);
    }

    const anterior = serieMensal[INDICE_ANTERIOR];
    // Crescimento do último mês estritamente entre -8% e +8% (nunca gera alerta)
    const taxaFinal = -0.08 + rand() * 0.16;
    let atual = limitar(Math.round(anterior * (1 + taxaFinal)), minimo, maximo);

    // Garantia adicional de permanência dentro de [-8%, +8%] após arredondamento
    if (((atual - anterior) / anterior) * 100 > 8) {
      atual = Math.floor(anterior * 1.08);
    } else if (((atual - anterior) / anterior) * 100 < -8) {
      atual = Math.ceil(anterior * 0.92);
    }

    serieMensal.push(atual);

    focos.push({
      id: `F-${idNumero}`,
      assunto: modelo.assunto,
      categoria: modelo.categoria,
      parteRe: modelo.parteRe,
      setorParteRe: modelo.setorParteRe,
      municipio,
      serieMensal,
    });
  }

  return focos;
}

export const FOCOS: Foco[] = [...FOCOS_CHAVE, ...gerarFocosDeFundo(42)];
