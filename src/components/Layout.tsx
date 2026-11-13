import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { BannerDemo } from './BannerDemo';

export function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface-page text-text-primary">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-navy focus:text-white focus:rounded-md focus:font-semibold focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      <Sidebar aberto={menuAberto} aoFechar={() => setMenuAberto(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 shadow-sm">
          <BannerDemo />

          <div className="lg:hidden flex items-center justify-between bg-navy text-white px-4 py-3 border-b border-white/10">
            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              aria-expanded={menuAberto}
              aria-controls="menu-lateral"
              aria-label="Abrir menu de navegação"
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium text-white hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-onDark"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
              <span>Menu</span>
            </button>
            <span className="text-sm font-bold tracking-wider">
              RADAR CONFLITOS PE
            </span>
          </div>
        </header>

        <main
          id="conteudo-principal"
          tabIndex={-1}
          className="flex-1 w-full max-w-7xl mx-auto p-6 sm:p-8 outline-none"
        >
          <Outlet />
        </main>

        <footer className="relative z-10 border-t border-border-subtle bg-surface-card px-6 py-4 text-xs text-text-secondary">
          <div className="max-w-7xl mx-auto">
            RADAR DE CONFLITOS PE · Inteligência para agir antes do processo.
            Protótipo demonstrativo com dados sintéticos para a CRIEJAM 2026.
            Nenhum número desta interface representa a realidade de Pernambuco.
          </div>
        </footer>
      </div>
    </div>
  );
}
