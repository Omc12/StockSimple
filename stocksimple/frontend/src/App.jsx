import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProductCatalog from './pages/ProductCatalog';
import InventoryLog from './pages/InventoryLog';
import StockUpdate from './pages/StockUpdate';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductCatalog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory-log"
                element={
                  <ProtectedRoute>
                    <InventoryLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stock-update"
                element={
                  <ProtectedRoute>
                    <StockUpdate />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;