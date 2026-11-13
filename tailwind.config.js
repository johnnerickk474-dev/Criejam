/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        'navy-light': 'var(--color-navy-light)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          light: 'var(--color-accent-light)',
          onDark: 'var(--color-accent-on-dark)',
        },
        surface: {
          page: 'var(--color-bg-page)',
          card: 'var(--color-bg-card)',
          subtle: 'var(--color-bg-subtle)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        alerta: {
          prioritario: {
            text: 'var(--color-alerta-prioritario-text)',
            bg: 'var(--color-alerta-prioritario-bg)',
            border: 'var(--color-alerta-prioritario-border)',
          },
          atencao: {
            text: 'var(--color-alerta-atencao-text)',
            bg: 'var(--color-alerta-atencao-bg)',
            border: 'var(--color-alerta-atencao-border)',
          },
          monitoramento: {
            text: 'var(--color-alerta-monitoramento-text)',
            bg: 'var(--color-alerta-monitoramento-bg)',
            border: 'var(--color-alerta-monitoramento-border)',
          },
          'sem-base': {
            text: 'var(--color-alerta-sem-base-text)',
            bg: 'var(--color-alerta-sem-base-bg)',
            border: 'var(--color-alerta-sem-base-border)',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
    },
  },
  plugins: [],
};
