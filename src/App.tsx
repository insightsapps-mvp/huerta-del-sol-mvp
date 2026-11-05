import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import Catalogo from '@/pages/Catalogo';
import Producto from '@/pages/Producto';
import Checkout from '@/pages/Checkout';
import Mayoristas from '@/pages/Mayoristas';
import Creditos from '@/pages/Creditos';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalogo />} />
          <Route path="/productos/:categoria" element={<Catalogo />} />
          <Route path="/producto/:slug" element={<Producto />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mayoristas" element={<Mayoristas />} />
          <Route path="/creditos" element={<Creditos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
