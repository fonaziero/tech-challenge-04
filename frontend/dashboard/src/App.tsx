import { Route, Routes } from 'react-router-dom';
import Dashboard from "./presentation/pages/dashboard";

const NotFoundModule = await import('host/NotFound');
const NotFound = NotFoundModule.default;

const DashboardApp = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default DashboardApp;
