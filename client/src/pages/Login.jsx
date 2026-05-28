import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { motion } from 'framer-motion';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (e) { alert('Credenciales inválidas'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Bienvenido</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona tus finanzas con elegancia</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
            <input
              type="email" required
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Contraseña</label>
            <input
              type="password" required
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none"
          >
            Entrar
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-slate-500">
          ¿No tienes cuenta? <a href="/register" className="text-primary-600 font-semibold">Regístrate aquí</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
