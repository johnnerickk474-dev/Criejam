import type { NivelAlerta } from '../data/tipos';

export interface BadgeNivelProps {
  nivel: NivelAlerta;
}

interface ConfiguracaoNivel {
  rotulo: string;
  classes: string;
  ponto: string;
}

const CONFIG_NIVEL: Record<NivelAlerta, ConfiguracaoNivel> = {
  prioritario: {
    rotulo: 'Prioritário',
    classes:
      'bg-alerta-prioritario-bg text-alerta-prioritario-text border-alerta-prioritario-border',
    ponto: 'bg-alerta-prioritario-text',
  },
  atencao: {
    rotulo: 'Atenção',
    classes:
      'bg-alerta-atencao-bg text-alerta-atencao-text border-alerta-atencao-border',
    ponto: 'bg-alerta-atencao-text',
  },
  monitoramento: {
    rotulo: 'Monitoramento',
    classes:
      'bg-alerta-monitoramento-bg text-alerta-monitoramento-text border-alerta-monitoramento-border',
    ponto: 'bg-alerta-monitoramento-text',
  },
  'sem-base': {
    rotulo: 'Sem base comparável',
    classes:
      'bg-alerta-sem-base-bg text-alerta-sem-base-text border-alerta-sem-base-border',
    ponto: 'bg-alerta-sem-base-text',
  },
  'sem-alerta': {
    rotulo: 'Estável',
    classes: 'bg-surface-subtle text-text-secondary border-border-subtle',
    ponto: 'bg-text-muted',
  },
};

export function BadgeNivel({ nivel }: BadgeNivelProps) {
  const config = CONFIG_NIVEL[nivel];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${config.classes}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.ponto}`}
        aria-hidden="true"
      />
      <span>{config.rotulo}</span>
    </span>
  );
}
