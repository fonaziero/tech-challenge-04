import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import DashboardApp from 'dashboard/DashboardApp';
import NotFound from './presentation/pages/not-found/not-found';
import MainContent from './presentation/pages/home';
import Container from './presentation/components/home/container';

function App() {

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<Container><div className='text-white'>Carregando o Dashboard...</div></Container>}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/dashboard/*" element={<DashboardApp />} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;