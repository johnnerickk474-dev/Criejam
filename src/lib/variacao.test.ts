import { describe, expect, it } from 'vitest';
import { FOCOS, INDICE_ANTERIOR, INDICE_ATUAL } from '../data/focos';
import { MUNICIPIOS } from '../data/municipios';
import {
  calcularVariacao,
  formatarVariacao,
  rotuloMes,
} from './variacao';
import {
  getAlerta,
  getAlertas,
  getAssuntosEmAscensao,
  getDashboard,
  getLitigantes,
  getMunicipios,
  getResumoMapa,
} from '../services/dataService';

describe('calcularVariacao', () => {
  it('classifica aumento prioritário (100 -> 165 = +65,0%)', () => {
    expect(calcularVariacao(100, 165)).toEqual({
      variacaoPercentual: 65,
      nivel: 'prioritario',
    });
  });

  it('classifica nível atenção (50 -> 64 = +28,0%)', () => {
    expect(calcularVariacao(50, 64)).toEqual({
      variacaoPercentual: 28,
      nivel: 'atencao',
    });
  });

  it('arredonda corretamente para 1 casa decimal no nível atenção (38 -> 50 = +31,6%)', () => {
    expect(calcularVariacao(38, 50)).toEqual({
      variacaoPercentual: 31.6,
      nivel: 'atencao',
    });
  });

  it('classifica nível monitoramento (50 -> 61 = +22,0%)', () => {
    expect(calcularVariacao(50, 61)).toEqual({
      variacaoPercentual: 22,
      nivel: 'monitoramento',
    });
  });

  it('respeita os limites exatos de 10%, 25% e 50%', () => {
    expect(calcularVariacao(100, 110)).toEqual({
      variacaoPercentual: 10,
      nivel: 'monitoramento',
    });
    expect(calcularVariacao(100, 125)).toEqual({
      variacaoPercentual: 25,
      nivel: 'atencao',
    });
    expect(calcularVariacao(100, 150)).toEqual({
      variacaoPercentual: 50,
      nivel: 'prioritario',
    });
  });

  it('retorna sem-base quando anterior é zero e atual >= 20', () => {
    expect(calcularVariacao(0, 24)).toEqual({
      variacaoPercentual: null,
      nivel: 'sem-base',
    });
    expect(calcularVariacao(0, 20)).toEqual({
      variacaoPercentual: null,
      nivel: 'sem-base',
    });
  });

  it('retorna sem-alerta quando volume está abaixo do mínimo (6 -> 12 e 30 -> 19)', () => {
    expect(calcularVariacao(6, 12)).toEqual({
      variacaoPercentual: null,
      nivel: 'sem-alerta',
    });
    expect(calcularVariacao(15, 30)).toEqual({
      variacaoPercentual: 100,
      nivel: 'prioritario',
    });
    expect(calcularVariacao(30, 19)).toEqual({
      variacaoPercentual: -36.7,
      nivel: 'sem-alerta',
    });
  });

  it('classifica queda como sem-alerta mantendo variação negativa', () => {
    expect(calcularVariacao(100, 85)).toEqual({
      variacaoPercentual: -15,
      nivel: 'sem-alerta',
    });
  });
});

describe('funções auxiliares de variação e mês', () => {
  it('gera rótulos de mês corretos de set/2025 a out/2026', () => {
    expect(rotuloMes(0)).toBe('set/2025');
    expect(rotuloMes(3)).toBe('dez/2025');
    expect(rotuloMes(4)).toBe('jan/2026');
    expect(rotuloMes(12)).toBe('set/2026');
    expect(rotuloMes(13)).toBe('out/2026');
  });

  it('formata variação em pt-BR com sinal tipográfico e texto sem-base', () => {
    expect(formatarVariacao({ variacaoPercentual: 65, nivel: 'prioritario' })).toBe(
      '+65,0%',
    );
    expect(formatarVariacao({ variacaoPercentual: -3.2, nivel: 'sem-alerta' })).toBe(
      '−3,2%',
    );
    expect(formatarVariacao({ variacaoPercentual: null, nivel: 'sem-base' })).toBe(
      'Nova ocorrência no período',
    );
    expect(formatarVariacao({ variacaoPercentual: null, nivel: 'sem-alerta' })).toBe(
      '—',
    );
  });
});

describe('dados fictícios e dataService', () => {
  it('garante 14 pontos mensais e municípios válidos em todos os focos', () => {
    const nomesMunicipios = new Set(MUNICIPIOS.map((m) => m.nome));

    expect(FOCOS).toHaveLength(48);
    expect(MUNICIPIOS).toHaveLength(39);

    for (const foco of FOCOS) {
      expect(foco.serieMensal).toHaveLength(14);
      expect(nomesMunicipios.has(foco.municipio)).toBe(true);
    }
  });

  it('gera exatamente 6 alertas apenas a partir de F-001..F-006 e nenhum dos focos de fundo', async () => {
    const alertas = await getAlertas();
    expect(alertas).toHaveLength(6);

    expect(alertas[0]).toMatchObject({
      id: 'AL-2026-001',
      focoId: 'F-001',
      municipio: 'Recife',
      parteRe: 'TeleRecife Telecom',
      periodoAnterior: 100,
      periodoAtual: 165,
      variacaoPercentual: 65,
      nivel: 'prioritario',
    });

    const focosNaoAlerta = FOCOS.filter(
      (f) => f.id === 'F-007' || f.id === 'F-008' || Number(f.id.slice(2)) >= 9,
    );
    expect(focosNaoAlerta.length).toBe(42);

    for (const foco of focosNaoAlerta) {
      const res = calcularVariacao(
        foco.serieMensal[INDICE_ANTERIOR],
        foco.serieMensal[INDICE_ATUAL],
      );
      expect(res.nivel).toBe('sem-alerta');
    }
  });

  it('retorna alerta individual, dashboard, litigantes, municípios e resumo do mapa', async () => {
    const detalhe = await getAlerta('AL-2026-005');
    expect(detalhe?.municipio).toBe('Belo Jardim');
    expect(detalhe?.nivel).toBe('monitoramento');

    const dashboard = await getDashboard();
    expect(dashboard.alertasAtivos).toBe(6);
    expect(dashboard.evolucaoMensal).toHaveLength(14);
    expect(dashboard.evolucaoMensal[0].mes).toBe('set/2025');
    expect(dashboard.evolucaoMensal[13].mes).toBe('out/2026');

    const litigantes = await getLitigantes();
    expect(litigantes.length).toBeGreaterThan(0);

    const municipios = await getMunicipios();
    expect(municipios).toHaveLength(39);

    const mapa = await getResumoMapa();
    expect(mapa).toHaveLength(39);
    const beloJardim = mapa.find((m) => m.municipio === 'Belo Jardim');
    expect(beloJardim?.temUnidade).toBe(false);
    expect(beloJardim?.alertasVinculados).toContain('AL-2026-005');

    const assuntosEmAscensao = await getAssuntosEmAscensao();
    expect(assuntosEmAscensao.map((a) => a.categoria)).toEqual([
      'Direito do Consumidor',
      'Direito da Saúde',
    ]);
    expect(assuntosEmAscensao[0].nivel).toBe('prioritario');
    expect(assuntosEmAscensao[1].nivel).toBe('atencao');
  });
});
