# PROJECT_CONTEXT.md — Radar de Conflitos PE

## 1. O que é o projeto
O **Radar de Conflitos PE** é um protótipo de painel de gestão voltado ao **NUPEMEC** e aos **CEJUSCs** (Judiciário de Pernambuco — TJPE), desenvolvido para maratona de inovação (**CRIEJAM 2026**). Seu objetivo é sinalizar aumentos expressivos no ajuizamento de processos agrupados por **assunto**, **parte ré (empresas)** e **município**, apoiando a atuação preventiva e autocompositiva antes da consolidação de demandas repetitivas.

---

## 2. Regras obrigatórias de negócio e escopo
- **Dados 100% fictícios e mockados no front-end**: nenhum dado exibido representa números ou casos reais do Judiciário de Pernambuco.
- **Empresas SEMPRE fictícias**: nunca utilizar nomes reais de empresas, bancos, operadoras ou instituições privadas nos dados de exemplo.
- **Zero back-end / zero persistência**: sem servidor, sem banco de dados, sem Docker. Nada é gravado ou enviado para APIs externas.
- **Sem botões de ação operacional persistente**: não incluir botões como `"Criar plano"`, `"Registrar"`, `"Salvar"` ou equivalentes que simulem escrita em banco.
- **Transparência de demonstração**: a interface deve deixar explícito em todas as telas (banner superior fixo e rodapé) que se trata de um ambiente de demonstração independente com dados sintéticos, sem vínculo oficial com TJPE, CNJ ou ESMAPE.

---

## 3. Regra de cálculo e classificação de alertas
A variação e o nível do alerta são **SEMPRE calculados no código** (em `src/lib/` ou `src/services/`), **nunca escritos manualmente nos dados**.

- **Fórmula da variação percentual** (quando `anterior > 0`):
  `variacaoPercentual = ((atual - anterior) / anterior) * 100`
- **Caso especial (`anterior === 0`)**:
  Classificar/exibir como `"nova ocorrência no período"`, sem percentual numérico e com nível `sem-base` (sem base comparável).
- **Níveis de alerta** (quando `anterior > 0`):
  - **Monitoramento**: `10%` até `< 25%`
  - **Atenção**: `25%` até `< 50%`
  - **Prioritário**: `>= 50%`

---

## 4. Convenções técnicas
- **Stack**: Vite + React + TypeScript (`strict: true`) + Tailwind CSS + React Router + Recharts + `lucide-react`.
- **Tipagem**: TypeScript estrito; é proibido usar `any`. Sem código morto ou dependências desnecessárias.
- **Sem recursos externos em tempo de execução**: proibido usar CDNs, Google Fonts, imagens remotas ou tiles externos de mapa. Usar pilha de fontes do sistema (`system-ui`) e ícones exclusivamente via `lucide-react`.
- **Idioma e nomenclatura**:
  - Interface 100% em português do Brasil (`<html lang="pt-BR">`).
  - Identificadores de domínio em português (`alerta`, `parteRe`, `municipio`, `alertaId`).
  - Infraestrutura e configuração em inglês (`Layout`, `Sidebar`, `PageHeader`, `tokens.css`).
- **Acessibilidade**: landmarks semânticos (`header`, `nav`, `main`, `footer`), link `"Pular para o conteúdo"`, foco visível em todos os elementos interativos, contraste mínimo WCAG AA e navegação completa por teclado.

---

## 5. Estrutura de pastas e rotas

### Estrutura em `src/`
```
src/
  data/         # Dados sintéticos e mockados (vazio na base inicial)
  lib/          # Funções utilitárias e cálculos puros (vazio na base inicial)
  services/     # Camada de consulta/agregação em memória (vazio na base inicial)
  components/   # Layout.tsx, Sidebar.tsx, BannerDemo.tsx, PageHeader.tsx
  pages/        # VisaoGeral.tsx, MapaConflitos.tsx, AlertasPreventivos.tsx, AlertaDetalhe.tsx, LaboratorioCausas.tsx
  styles/       # tokens.css (CSS variables) e global.css
  App.tsx
  main.tsx
```

### Rotas (`BrowserRouter`)
- `/` → `VisaoGeral`
- `/mapa` → `MapaConflitos`
- `/alertas` → `AlertasPreventivos`
- `/alertas/:id` → `AlertaDetalhe`
- `/laboratorio` → `LaboratorioCausas`
- `/laboratorio/:alertaId` → `LaboratorioCausas`
- `*` → Página `"Página não encontrada"` com link para `/`
