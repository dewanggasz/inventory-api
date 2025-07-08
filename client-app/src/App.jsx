import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import ItemsListPage from './pages/ItemsListPage';
import ItemDetailPage from './pages/ItemDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemsListPage />} />
        <Route path="/items/:code" element={<ItemDetailPage />} /> 
        {/* Rute terproteksi lainnya bisa ditambahkan di sini */}
      </Route>
    </Routes>
  );
}

export default App;