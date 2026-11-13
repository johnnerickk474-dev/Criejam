import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageHeader } from './components/PageHeader';
import { VisaoGeral } from './pages/VisaoGeral';
import { MapaConflitos } from './pages/MapaConflitos';
import { AlertasPreventivos } from './pages/AlertasPreventivos';
import { AlertaDetalhe } from './pages/AlertaDetalhe';
import { LaboratorioCausas } from './pages/LaboratorioCausas';

function PaginaNaoEncontrada() {
  return (
    <section aria-labelledby="titulo-pagina">
      <PageHeader
        rotulo="ERRO 404"
        titulo="Página não encontrada"
        subtitulo="O endereço acessado não corresponde a nenhuma tela disponível no protótipo."
      />
      <div className="card-base p-8">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 rounded-md bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<VisaoGeral />} />
          <Route path="/mapa" element={<MapaConflitos />} />
          <Route path="/alertas" element={<AlertasPreventivos />} />
          <Route path="/alertas/:id" element={<AlertaDetalhe />} />
          <Route path="/laboratorio" element={<LaboratorioCausas />} />
          <Route path="/laboratorio/:alertaId" element={<LaboratorioCausas />} />
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
