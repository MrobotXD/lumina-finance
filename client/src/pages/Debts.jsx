import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import { MonthlyBarChart } from '../components/charts/FinanceCharts';
import { Plus, Trash2, Edit2, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Debts = () => {
  const [debts, setDebts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ creditor: '', amount: '', dueDate: '', status: 'Pendiente', description: '' });

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const { data } = await api.get('/debts');
      setDebts(data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/debts', form);
      await fetchDebts();
      setIsModalOpen(false);
      setForm({ creditor: '', amount: '', dueDate: '', status: 'Pendiente', description: '' });
    } catch (e) { console.error(e); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/debts/${id}`, { status });
      await fetchDebts();
    } catch (e) { console.error(e); }
  };

  const deleteDebt = async (id) => {
    try {
      await api.delete(`/debts/${id}`);
      setDebts(debts.filter(d => d._id !== id));
    } catch (e) { console.error(e); }
  };

  const chartData = [
    { name: 'Pendientes', value: debts.filter(d => d.status === 'Pendiente').reduce((a, b) => a + b.amount, 0) },
    { name: 'Pagadas', value: debts.filter(d => d.status === 'Pagada').reduce((a, b) => a + b.amount, 0) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Control de Deudas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-200 dark:shadow-none"
        >
          <Plus size={20} /> Nueva Deuda
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Resumen de Deuda" className="lg:col-span-1">
          <MonthlyBarChart data={chartData} />
        </Card>
        <Card title="Alertas de Vencimiento" className="lg:col-span-2 flex flex-col gap-4">
          {debts.filter(d => d.status === 'Pendiente').slice(0, 5).map(d => (
            <div key={d._id} className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
              <div className="flex items-center gap-3">
                <Calendar className="text-red-500" size={20} />
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300">{d.creditor}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">Vence el {new Date(d.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="font-bold text-red-600 dark:text-red-400">${d.amount.toFixed(2)}</p>
            </div>
          ))}
          {debts.filter(d => d.status === 'Pendiente').length === 0 && <p className="text-slate-400 text-center py-8">No hay deudas pendientes</p>}
        </Card>
      </div>

      <Card title="Detalle de Deudas">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 font-medium">Acreedor</th>
                <th className="pb-3 font-medium">Fecha Límite</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Monto</th>
                <th className="pb-3 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {debts.map(d => (
                <tr key={d._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 font-medium text-slate-800 dark:text-slate-100">{d.creditor}</td>
                  <td className="py-4 text-slate-600 dark:text-slate-300">{new Date(d.dueDate).toLocaleDateString()}</td>
                  <td className="py-4">
                    <button
                      onClick={() => updateStatus(d._id, d.status === 'Pendiente' ? 'Pagada' : 'Pendiente')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        d.status === 'Pendiente'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}
                    >
                      {d.status}
                    </button>
                  </td>
                  <td className="py-4 text-right font-semibold text-slate-800 dark:text-slate-100">${d.amount.toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteDebt(d._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Nueva Deuda</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Acreedor</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text" required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                        value={form.creditor}
                        onChange={e => setForm({ ...form, creditor: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Monto</label>
                      <input
                        type="number" required
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                        value={form.amount}
                        onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Fecha Límite</label>
                      <input
                        type="date" required
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                        value={form.dueDate}
                        onChange={e => setForm({ ...form, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
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

export default Debts;
