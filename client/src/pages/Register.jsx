import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (e) { alert('Error al registrar usuario'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Crea tu Cuenta</h1>
          <p className="text-slate-500 dark:text-slate-400">Comienza a organizar tu dinero hoy</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Usuario</label>
            <input
              type="text" required
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>
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
            Registrarse
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-slate-500">
          ¿Ya tienes cuenta? <a href="/login" className="text-primary-600 font-semibold">Inicia sesión</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
