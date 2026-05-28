import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import { CategoryPieChart, MonthlyBarChart } from '../components/charts/FinanceCharts';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({ category: '', date: '', search: '' });
  const [form, setForm] = useState({ amount: '', category: 'Comida', date: new Date().toISOString().split('T')[0], description: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get('/expenses');
      setExpenses(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', form);
      await fetchExpenses();
      setIsModalOpen(false);
      setForm({ amount: '', category: 'Comida', date: new Date().toISOString().split('T')[0], description: '' });
    } catch (e) { console.error(e); }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (e) { console.error(e); }
  };

  const chartData = expenses.reduce((acc, exp) => {
    const existing = acc.find(a => a.name === exp.category);
    if (existing) existing.value += Number(exp.amount);
    else acc.push({ name: exp.category, value: Number(exp.amount) });
    return acc;
  }, []);

  const filteredExpenses = expenses.filter(exp =>
    (!filter.category || exp.category === filter.category) &&
    (!filter.date || exp.date.startsWith(filter.date)) &&
    (!filter.search || (exp.description || '').toLowerCase().includes(filter.search.toLowerCase()))
  );

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-500">Cargando gestión de gastos...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Gestión de Gastos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-200 dark:shadow-none"
        >
          <Plus size={20} /> Añadir Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Distribución por Categoría" className="lg:col-span-1">
          <CategoryPieChart data={chartData} />
        </Card>
        <Card title="Tendencia de Gastos" className="lg:col-span-2">
          <MonthlyBarChart data={chartData} />
        </Card>
      </div>

      <Card title="Lista de Gastos">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar descripción..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">Todas las categorías</option>
            {['Comida', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Otros'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Categoría</th>
                <th className="pb-3 font-medium">Descripción</th>
                <th className="pb-3 font-medium text-right">Monto</th>
                <th className="pb-3 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredExpenses.map(exp => (
                <tr key={exp._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 text-slate-600 dark:text-slate-300">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-4 text-slate-600 dark:text-slate-300">{exp.description}</td>
                  <td className="py-4 text-right font-semibold text-slate-800 dark:text-slate-100">${exp.amount.toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-primary-500 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteExpense(exp._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
              <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Nuevo Gasto</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="block text-sm font-medium text-slate-500 mb-1">Categoría</label>
                    <select
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      {['Comida', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Otros'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Fecha</label>
                  <input
                    type="date" required
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Descripción</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 ring-primary-400"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
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

export default Expenses;
