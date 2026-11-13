import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { BellRing, CheckCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export function Notificacoes() {
  const [email, setEmail] = useState('');
  const [emailAtivo, setEmailAtivo] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [cadastrado, setCadastrado] = useState(false);
  const temporizadorRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (temporizadorRef.current !== null) {
        window.clearTimeout(temporizadorRef.current);
      }
    };
  }, []);

  function aoSubmeter(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const emailSubmetido = email.trim();
    if (!emailSubmetido || enviando) return;

    setEnviando(true);
    temporizadorRef.current = window.setTimeout(() => {
      setEmailAtivo(emailSubmetido);
      setEnviando(false);
      setCadastrado(true);
      temporizadorRef.current = null;
    }, 500);
  }

  function aoCancelarInscricao() {
    if (cancelando) return;

    setCancelando(true);
    temporizadorRef.current = window.setTimeout(() => {
      setCancelando(false);
      setEmailAtivo(null);
      setCadastrado(false);
      setEmail('');
      temporizadorRef.current = null;
    }, 400);
  }

  return (
    <section aria-labelledby="titulo-pagina" className="space-y-6">
      <PageHeader
        rotulo="CONFIGURAÇÕES"
        titulo="Notificações"
        subtitulo="Cadastre seu e-mail para receber alertas automáticos quando um conflito atingir o nível Prioritário."
      />

      <div className="card-base p-6 sm:p-8 max-w-2xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-accent-light/50 border border-teal-200 shrink-0">
            <BellRing
              className="w-6 h-6 text-accent"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-navy">
              Alertas proativos por e-mail
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sempre que um foco de litigiosidade atingir variação igual ou
              superior a 50% (nível Prioritário), o sistema poderá notificar os
              destinatários cadastrados para agilizar a atuação preventiva.
            </p>
            <p className="text-xs text-text-muted pt-1">
              Simulação visual de demonstração: nenhum e-mail é gravado ou
              enviado externamente.
            </p>
          </div>
        </div>

        {cadastrado && emailAtivo ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-card bg-emerald-50 border border-emerald-200 p-5 space-y-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-950 leading-relaxed">
                  Alertas Ativos. As notificações de nível Prioritário serão
                  enviadas para o e-mail:{' '}
                  <strong className="font-bold text-emerald-950">
                    {emailAtivo}
                  </strong>
                </p>
                <p className="text-xs text-emerald-900">
                  Em conformidade com a LGPD (simulação), você pode revogar o
                  recebimento a qualquer momento.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={cancelando}
              onClick={aoCancelarInscricao}
              className="inline-flex items-center px-4 py-2 rounded-md border border-red-300 bg-white text-red-700 text-sm font-semibold hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              {cancelando ? 'Cancelando...' : 'Cancelar Inscrição'}
            </button>
          </div>
        ) : (
          <form onSubmit={aoSubmeter} className="space-y-4">
            <div>
              <label
                htmlFor="email-notificacao"
                className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
              >
                E-mail para recebimento dos alertas
              </label>
              <input
                id="email-notificacao"
                type="email"
                required
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="exemplo@orgao-ficticio.gov.br"
                className="w-full rounded-md border border-border-subtle bg-surface-card px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {enviando ? 'Cadastrando...' : 'Cadastrar E-mail'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
