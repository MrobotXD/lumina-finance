import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import { MonthlyBarChart } from '../components/charts/FinanceCharts';
import { Plus, AlertTriangle, Target, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), limit: '' });

  useEffect(() => {
    fetchBudgets();
    fetchStats();
  }, []);

  const fetchBudgets = async () => {
    try {
      const { data } = await api.get('/budgets');
      setBudgets(data);
    } catch (e) { console.error(e); }
  };

  const fetchStats = async () => {
    try {
      const m = new Date().getMonth() + 1;
      const y = new Date().getFullYear();
      const { data } = await api.get(`/budgets/stats?month=${m}&year=${y}`);
      setStats(data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', form);
      await fetchBudgets();
      await fetchStats();
      setIsModalOpen(false);
      setForm({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), limit: '' });
    } catch (e) { console.error(e); }
  };

  const progress = (stats && stats.limit > 0) ? (stats.spent / stats.limit) * 100 : 0;
  const isExceeded = progress > 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Planificación de Presupuesto</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-200 dark:shadow-none"
        >
          <Plus size={20} /> Definir Presupuesto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Estado Actual" className="lg:col-span-1 flex flex-col justify-center items-center text-center py-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-200 dark:text-slate-700" />
              <circle
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * Math.min(progress, 100)) / 100}
                className={`transition-all duration-1000 ${isExceeded ? 'text-red-500' : 'text-primary-500'}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{Math.round(progress)}%</span>
              <span className="text-xs text-slate-500">del límite</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 mb-1">Gasto Total</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">${stats?.spent.toFixed(2) || '0.00'}</p>
          </div>
        </Card>
        <Card title="Comparativa Mensual" className="lg:col-span-2">
          <MonthlyBarChart data={budgets.map(b => ({ name: `${b.month}/${b.year}`, value: b.limit }))} />
        </Card>
      </div>

      {isExceeded && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle size={20} />
          <p className="font-medium">¡Has excedido tu presupuesto mensual! Te has pasado por ${ (stats.spent - stats.limit).toFixed(2) }</p>
        </div>
      )}

      <Card title="Detalles del Plan">
        <div className="space-y-4">
          {budgets.map(b => (
            <div key={b._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Target className="text-primary-500" size={20} />
                <span className="font-medium text-slate-700 dark:text-slate-300">Presupuesto {b.month}/{b.year}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Límite</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">${b.limit.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => { setForm({ ...b, limit: b.limit }); setIsModalOpen(true); }}
                  className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-500 hover:text-primary-500 transition-all shadow-sm"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Configurar Presupuesto</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Mes</label>
                    <input
                      type="number" min="1" max="12" required
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                      value={form.month}
                      onChange={e => setForm({ ...form, month: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Año</label>
                    <input
                      type="number" required
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                      value={form.year}
                      onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Límite de Gasto</label>
                  <input
                    type="number" required
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                    value={form.limit}
                    onChange={e => setForm({ ...form, limit: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Budgets;
