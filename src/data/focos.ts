import type { CategoriaAssunto, Foco } from './tipos';
import { MUNICIPIOS } from './municipios';

export const INDICE_ANTERIOR = 12;
export const INDICE_ATUAL = 13;

const FOCOS_CHAVE: Foco[] = [
  {
    id: 'F-001',
    assunto: 'Cobrança indevida em serviço de telefonia',
    categoria: 'Consumo e serviços',
    parteRe: 'TeleRecife Telecom',
    setorParteRe: 'Telefonia',
    municipio: 'Recife',
    serieMensal: [74, 76, 73, 78, 80, 79, 83, 85, 88, 92, 95, 97, 100, 165],
  },
  {
    id: 'F-002',
    assunto: 'Falha na prestação de serviço de transporte aéreo',
    categoria: 'Consumo e serviços',
    parteRe: 'AeroNordeste Linhas Aéreas',
    setorParteRe: 'Aviação',
    municipio: 'Jaboatão dos Guararapes',
    serieMensal: [40, 42, 41, 44, 43, 45, 46, 47, 48, 49, 50, 50, 50, 64],
  },
  {
    id: 'F-003',
    assunto: 'Negativa de cobertura de plano de saúde',
    categoria: 'Saúde',
    parteRe: 'Vida Plena Saúde',
    setorParteRe: 'Plano de saúde',
    municipio: 'Caruaru',
    serieMensal: [30, 31, 32, 31, 33, 34, 35, 35, 36, 37, 38, 38, 38, 50],
  },
  {
    id: 'F-004',
    assunto: 'Cobrança de tarifa não contratada',
    categoria: 'Consumo e serviços',
    parteRe: 'Banco Mar Azul',
    setorParteRe: 'Financeiro',
    municipio: 'Olinda',
    serieMensal: [38, 39, 41, 40, 42, 44, 45, 46, 47, 48, 49, 50, 50, 61],
  },
  {
    id: 'F-005',
    assunto: 'Cobrança indevida de fatura de energia',
    categoria: 'Consumo e serviços',
    parteRe: 'Energia do Agreste',
    setorParteRe: 'Energia',
    municipio: 'Belo Jardim',
    serieMensal: [30, 31, 33, 32, 34, 35, 36, 38, 39, 40, 40, 40, 40, 46],
  },
  {
    id: 'F-006',
    assunto: 'Cobrança de serviço financeiro novo',
    categoria: 'Contratos',
    parteRe: 'PagaFácil Pagamentos',
    setorParteRe: 'Financeiro',
    municipio: 'Recife',
    serieMensal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24],
  },
  {
    id: 'F-007',
    assunto: 'Vício em produto vendido pela internet',
    categoria: 'Consumo e serviços',
    parteRe: 'MegaLoja Online',
    setorParteRe: 'Varejo',
    municipio: 'Paulista',
    serieMensal: [28, 29, 29, 30, 30, 31, 30, 31, 32, 32, 32, 32, 32, 33],
  },
  {
    id: 'F-008',
    assunto: 'Negativa de cobertura de plano de saúde',
    categoria: 'Saúde',
    parteRe: 'Vida Plena Saúde',
    setorParteRe: 'Plano de saúde',
    municipio: 'Petrolina',
    serieMensal: [6, 6, 7, 6, 7, 8, 7, 8, 8, 9, 9, 9, 9, 12],
  },
];

interface ModeloFundo {
  parteRe: string;
  setorParteRe: string;
  categoria: CategoriaAssunto;
  assunto: string;
}

const MODELOS_FUNDO: readonly ModeloFundo[] = [
  {
    parteRe: 'Distribuidora Litoral',
    setorParteRe: 'Comércio atacadista',
    categoria: 'Contratos',
    assunto: 'Revisão de cláusula de fornecimento comercial',
  },
  {
    parteRe: 'Escola Superior Horizonte',
    setorParteRe: 'Ensino superior',
    categoria: 'Educação e inclusão',
    assunto: 'Divergência em cobrança de mensalidade acadêmica',
  },
  {
    parteRe: 'Rede Nova Farma',
    setorParteRe: 'Varejo farmacêutico',
    categoria: 'Consumo e serviços',
    assunto: 'Cancelamento de programa de fidelidade e cobrança',
  },
  {
    parteRe: 'Clínica Bem Estar Sertão',
    setorParteRe: 'Serviços médicos',
    categoria: 'Saúde',
    assunto: 'Atraso em autorização de exame diagnóstico',
  },
  {
    parteRe: 'Cooperativa Crédito Capibaribe',
    setorParteRe: 'Financeiro',
    categoria: 'Contratos',
    assunto: 'Renegociação de contrato de microcrédito',
  },
  {
    parteRe: 'Fazenda Pública Estadual Simulada',
    setorParteRe: 'Setor público',
    categoria: 'Execução fiscal',
    assunto: 'Cobrança de taxa estadual de fiscalização',
  },
  {
    parteRe: 'Município Simulado de Gestão Tributária',
    setorParteRe: 'Setor público',
    categoria: 'Execução fiscal',
    assunto: 'Lançamento de tributo predial urbano',
  },
  {
    parteRe: 'Instituto Educar Pernambuco',
    setorParteRe: 'Educação básica',
    categoria: 'Educação e inclusão',
    assunto: 'Atendimento educacional especializado e matrícula',
  },
  {
    parteRe: 'Particulares — Varas de Família (Simulado)',
    setorParteRe: 'Pessoas físicas',
    categoria: 'Família',
    assunto: 'Revisão consensual de guarda e alimentos',
  },
  {
    parteRe: 'Transportadora Agreste Express',
    setorParteRe: 'Logística',
    categoria: 'Consumo e serviços',
    assunto: 'Extravio e atraso na entrega de encomenda',
  },
  {
    parteRe: 'Construtora Morada Nova',
    setorParteRe: 'Construção civil',
    categoria: 'Contratos',
    assunto: 'Atraso na entrega de unidade habitacional',
  },
  {
    parteRe: 'Operadora Sertão Conecta',
    setorParteRe: 'Telecomunicações',
    categoria: 'Consumo e serviços',
    assunto: 'Interrupção recorrente de banda larga fixa',
  },
  {
    parteRe: 'Hospital Regional Vida Nova',
    setorParteRe: 'Saúde privada',
    categoria: 'Saúde',
    assunto: 'Fornecimento de tratamento ambulatorial',
  },
  {
    parteRe: 'Consórcio Imobiliário Recife Sul',
    setorParteRe: 'Consórcios',
    categoria: 'Outros',
    assunto: 'Restituição de valores em grupo de consórcio',
  },
];

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
    const idNumero = String(i + 9).padStart(3, '0');
    const modelo = MODELOS_FUNDO[i % MODELOS_FUNDO.length];
    const municipio = MUNICIPIOS[(i * 3 + Math.floor(rand() * 5)) % MUNICIPIOS.length].nome;

    const base = Math.round(25 + rand() * 170); // entre 25 e 195
    const serieMensal: number[] = [];

    let corrente = base;
    for (let mes = 0; mes <= INDICE_ANTERIOR; mes++) {
      const oscilacao = (rand() - 0.5) * 0.1; // -5% a +5%
      corrente = limitar(Math.round(corrente * (1 + oscilacao)), 15, 220);
      serieMensal.push(corrente);
    }

    const anterior = serieMensal[INDICE_ANTERIOR];
    // Crescimento do último mês estritamente entre -8% e +8% (nunca gera alerta)
    const taxaFinal = -0.08 + rand() * 0.16;
    let atual = limitar(Math.round(anterior * (1 + taxaFinal)), 15, 220);

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

export const FOCOS: Foco[] = [...FOCOS_CHAVE, ...gerarFocosDeFundo(40)];
