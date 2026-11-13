import type { HipoteseIA, SituacaoAlerta } from './tipos';

export interface DefinicaoAlerta {
  id: string;
  focoId: string;
  situacao: SituacaoAlerta;
  geradoEm: string;
  hipoteses?: HipoteseIA[];
  oportunidade?: string;
}

export const DEFINICOES_ALERTAS: DefinicaoAlerta[] = [
  {
    id: 'AL-2026-001',
    focoId: 'F-001',
    situacao: 'Hipótese registrada',
    geradoEm: '2026-11-05',
  },
  {
    id: 'AL-2026-002',
    focoId: 'F-003',
    situacao: 'Em análise',
    geradoEm: '2026-11-03',
  },
  {
    id: 'AL-2026-003',
    focoId: 'F-002',
    situacao: 'Em análise',
    geradoEm: '2026-11-04',
  },
  {
    id: 'AL-2026-004',
    focoId: 'F-004',
    situacao: 'Informação solicitada',
    geradoEm: '2026-11-06',
  },
  {
    id: 'AL-2026-005',
    focoId: 'F-005',
    situacao: 'Novo',
    geradoEm: '2026-11-04',
  },
  {
    id: 'AL-2026-006',
    focoId: 'F-006',
    situacao: 'Novo',
    geradoEm: '2026-11-05',
  },
];
