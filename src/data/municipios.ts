import type { Municipio } from './tipos';

const MUNICIPIOS_COM_CEJUSC: readonly string[] = [
  'Abreu e Lima',
  'Afogados da Ingazeira',
  'Araripina',
  'Arcoverde',
  'Bezerros',
  'Cabo de Santo Agostinho',
  'Camaragibe',
  'Caruaru',
  'Garanhuns',
  'Goiana',
  'Gravatá',
  'Igarassu',
  'Ipojuca',
  'Jaboatão dos Guararapes',
  'Limoeiro',
  'Olinda',
  'Palmares',
  'Paulista',
  'Pesqueira',
  'Petrolina',
  'Recife',
  'Salgueiro',
  'Santa Cruz do Capibaribe',
  'São Lourenço da Mata',
  'Serra Talhada',
  'Surubim',
  'Vitória de Santo Antão',
];

const MUNICIPIOS_SEM_UNIDADE: readonly string[] = [
  'Belo Jardim',
  'Toritama',
  'Carpina',
  'Timbaúba',
  'Escada',
  'Ouricuri',
  'Bom Conselho',
  'Floresta',
  'Nazaré da Mata',
  'Custódia',
  'São Bento do Una',
  'Altinho',
];

export const MUNICIPIOS: Municipio[] = [
  ...MUNICIPIOS_COM_CEJUSC.map(
    (nome): Municipio => ({
      nome,
      temUnidade: true,
      tipoUnidade: 'CEJUSC',
    }),
  ),
  ...MUNICIPIOS_SEM_UNIDADE.map(
    (nome): Municipio => ({
      nome,
      temUnidade: false,
    }),
  ),
];
