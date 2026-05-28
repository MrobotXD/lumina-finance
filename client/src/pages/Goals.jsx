import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, TrendingUp, Calendar } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '', currentAmount: 0, deadline: '' });

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', form);
      await fetchGoals();
      setIsModalOpen(false);
      setForm({ name: '', targetAmount: '', currentAmount: 0, deadline: '' });
      toast.success('Meta creada con éxito');
    } catch (e) { toast.error('Error al crear meta'); }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
      toast.success('Meta eliminada');
    } catch (e) { toast.error('Error al eliminar'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Metas de Ahorro</h1>
          <p className="text-slate-500 dark:text-slate-400">Visualiza y alcanza tus objetivos financieros</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={20} /> Nueva Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, i) => {
          const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
          return (
            <motion.div key={goal._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <Target size={24} />
                  </div>
                  <button onClick={() => deleteGoal(goal._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{goal.name}</h3>
                <p className="text-xs text-slate-500 mb-6">Meta: ${goal.targetAmount.toLocaleString()}</p>

                <div className="relative h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary-500 shadow-lg shadow-primary-500/30"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{Math.round(progress)}%</span>
                  <span className="text-xs text-slate-500">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Sin fecha'}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {goals.length === 0 && <div className="col-span-full py-20 text-center text-slate-400">No tienes metas activas. ¡Crea una para empezar!</div>}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Nueva Meta</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Nombre de la meta</label>
                  <input required className="premium-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Monto Objetivo</label>
                    <input type="number" required className="premium-input" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: parseFloat(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Ahorro Actual</label>
                    <input type="number" className="premium-input" value={form.currentAmount} onChange={e => setForm({ ...form, currentAmount: parseFloat(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Fecha Límite</label>
                  <input type="date" className="premium-input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button variant="primary" className="flex-1" type="submit">Guardar Meta</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Goals;
