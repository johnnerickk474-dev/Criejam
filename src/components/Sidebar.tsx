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
            <svg
              viewBox="0 0 48 48"
              className="w-12 h-12 shrink-0 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Fundo do Radar e Anel Externo */}
              <circle cx="24" cy="24" r="22" stroke="#06b6d4" strokeWidth="2" />

              {/* Anéis Internos */}
              <circle cx="24" cy="24" r="15" stroke="#06b6d4" strokeWidth="1" opacity="0.6" />
              <circle cx="24" cy="24" r="8" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />

              {/* Linhas de Mira (Crosshairs) */}
              <line x1="2" y1="24" x2="46" y2="24" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
              <line x1="24" y1="2" x2="24" y2="46" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />

              {/* Varredura do Radar (Efeito Neon) */}
              <path d="M24 24 L24 2 A22 22 0 0 1 43.5 14 Z" fill="#06b6d4" opacity="0.4" />
              <path d="M24 24 L38.5 7.5" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />

              {/* Ícone de Usuários Central (Branco) */}
              <path d="M24 25 C22.34 25 21 23.66 21 22 C21 20.34 22.34 19 24 19 C25.66 19 27 20.34 27 22 C27 23.66 25.66 25 24 25 Z M24 27 C20.13 27 15 28.87 15 33 L15 34 L33 34 L33 33 C33 28.87 27.87 27 24 27 Z" fill="#ffffff" />
              <path d="M16 23 C14.9 23 14 22.1 14 21 C14 19.9 14.9 19 16 19 C16.35 19 16.68 19.09 16.96 19.25 C16.36 19.92 16 20.9 16 22 C16 22.5 16.09 22.97 16.26 23.4 C16.17 23.4 16.09 23 16 23 Z" fill="#ffffff" />
              <path d="M32 23 C31.91 23 31.83 23.4 31.74 23.4 C31.91 22.97 32 22.5 32 22 C32 20.9 31.64 19.92 31.04 19.25 C31.32 19.09 31.65 19 32 19 C33.1 19 34 19.9 34 21 C34 22.1 33.1 23 32 23 Z" fill="#ffffff" />
              <path d="M14.5 26.5 C12.8 27.19 11 28.63 11 31.5 L11 32.5 L14 32.5 L14 31.5 C14 29.84 14.96 28.53 16.28 27.68 C15.72 27.35 15.12 26.96 14.5 26.5 Z" fill="#ffffff" />
              <path d="M33.5 26.5 C32.88 26.96 32.28 27.35 31.72 27.68 C33.04 28.53 34 29.84 34 31.5 L34 32.5 L37 32.5 L37 31.5 C37 28.63 35.2 27.19 33.5 26.5 Z" fill="#ffffff" />
            </svg>
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
