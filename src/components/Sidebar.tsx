import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  LayoutDashboard,
  Map,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ItemNavegacao {
  rotulo: string;
  caminho: string;
  icone: LucideIcon;
  exato?: boolean;
}

interface GrupoNavegacao {
  titulo: string;
  itens: ItemNavegacao[];
}

const GRUPOS_NAVEGACAO: GrupoNavegacao[] = [
  {
    titulo: 'OBSERVAR E DETECTAR',
    itens: [
      {
        rotulo: 'Visão Geral',
        caminho: '/',
        icone: LayoutDashboard,
        exato: true,
      },
      {
        rotulo: 'Mapa de Conflitos',
        caminho: '/mapa',
        icone: Map,
      },
      {
        rotulo: 'Alertas Preventivos',
        caminho: '/alertas',
        icone: AlertTriangle,
      },
    ],
  },
  {
    titulo: 'CONFIGURAÇÕES',
    itens: [
      {
        rotulo: 'Notificações',
        caminho: '/notificacoes',
        icone: Bell,
      },
    ],
  },
];

export interface SidebarProps {
  aberto: boolean;
  aoFechar: () => void;
}

export function Sidebar({ aberto, aoFechar }: SidebarProps) {
  useEffect(() => {
    if (!aberto) return;

    const tratarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        aoFechar();
      }
    };

    window.addEventListener('keydown', tratarTecla);
    return () => window.removeEventListener('keydown', tratarTecla);
  }, [aberto, aoFechar]);

  return (
    <>
      {/* Overlay escuro para telas estreitas quando a gaveta está aberta */}
      {aberto && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={aoFechar}
          aria-hidden="true"
        />
      )}

      <aside
        id="menu-lateral"
        aria-label="Barra lateral de navegação"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy text-white flex flex-col shrink-0 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          aberto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 pt-6 border-b border-white/10">
          <div className="flex items-center gap-3 px-2 mb-6">
            <img
              src="/logo.jpeg"
              alt="Logo Radar de Conflitos"
              className="w-12 h-12 rounded-full object-cover shadow-md shrink-0"
            />
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-bold tracking-widest text-white leading-none">
                RADAR
              </span>
              <span className="text-sm font-semibold tracking-widest text-teal-400 leading-tight mt-1">
                CONFLITOS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar menu de navegação"
            className="lg:hidden mb-6 p-1.5 rounded-md text-slate-200 hover:bg-navy-light hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-onDark"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Menu principal"
          className="flex-1 overflow-y-auto px-3 py-6 space-y-6"
        >
          {GRUPOS_NAVEGACAO.map((grupo) => (
            <div key={grupo.titulo}>
              <h2 className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                {grupo.titulo}
              </h2>
              <ul className="space-y-1">
                {grupo.itens.map((item) => {
                  const Icone = item.icone;
                  return (
                    <li key={item.caminho}>
                      <NavLink
                        to={item.caminho}
                        end={item.exato}
                        onClick={aoFechar}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors border-l-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-onDark ${
                            isActive
                              ? 'bg-navy-light border-accent-onDark text-white font-semibold'
                              : 'border-transparent text-slate-200 hover:bg-navy-light/60 hover:text-white font-medium'
                          }`
                        }
                      >
                        <Icone
                          className="w-4 h-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{item.rotulo}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
