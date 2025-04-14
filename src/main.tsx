import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Auth';
import Home from './pages/Home/Home';
import { ProtectedRoute } from './ProtectedRoute';

import './index.css'
import CreateUser from './pages/Auth/createUser';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/createuser" element={<CreateUser />} />

      <Route path="/login" element={<Login />} />
      
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
