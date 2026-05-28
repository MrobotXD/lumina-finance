import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Card from '../components/ui/Card';
import { PremiumDonutChart, PremiumAreaChart } from '../components/charts/FinanceCharts';
import { Wallet, HandCoins, Target, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { calculateFinancialHealth, generateInsights } from '../utils/analyticsEngine';
import SmartInsights from '../components/ui/SmartInsights';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const [data, setData] = useState({
    expenses: [],
    debts: [],
    budgets: [],
    health: { score: 0, status: 'Stable' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exp, debt, bud] = await Promise.all([
          api.get('/expenses'),
          api.get('/debts'),
          api.get('/budgets')
        ]);

        const health = calculateFinancialHealth(exp.data, debt.data, bud.data);
        setData({
          expenses: exp.data,
          debts: debt.data,
          budgets: bud.data,
          health
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const insights = generateInsights(data.expenses, data.debts, data.budgets);
  const totalSpent = data.expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const totalDebt = data.debts.filter(d => d.status === 'Pendiente').reduce((acc, d) => acc + Number(d.amount), 0);
  const budgetLimit = data.budgets[0]?.limit || 0;

  const chartData = data.expenses.reduce((acc, exp) => {
    const existing = acc.find(a => a.name === exp.category);
    if (existing) existing.value += Number(exp.amount);
    else acc.push({ name: exp.category, value: Number(exp.amount) });
    return acc;
  }, []);

  const trendData = [
    { name: 'Ene', value: totalSpent * 0.8 },
    { name: 'Feb', value: totalSpent * 0.9 },
    { name: 'Mar', value: totalSpent * 0.7 },
    { name: 'Abr', value: totalSpent * 1.1 },
    { name: 'May', value: totalSpent },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center">Cargando analíticas premium...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Dashboard Financiero</h1>
          <p className="text-slate-500 dark:text-slate-400">Análisis inteligente de tu estado económico</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full animate-pulse",
              data.health.score > 70 ? "bg-emerald-500" : data.health.score > 40 ? "bg-amber-500" : "bg-red-500"
            )} />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Salud: {data.health.score}% ({data.health.status})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Balance Total', value: totalSpent, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: 'up' },
          { title: 'Deudas Activas', value: totalDebt, icon: HandCoins, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trend: 'down' },
          { title: 'Límite Presupuesto', value: budgetLimit, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: 'neutral' },
          { title: 'Ahorro Proyectado', value: budgetLimit - totalSpent, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', trend: 'up' },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                  <stat.icon size={22} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                  stat.trend === 'up' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" :
                  stat.trend === 'down' ? "text-red-600 bg-red-50 dark:bg-red-900/30" : "text-slate-500 bg-slate-100 dark:bg-slate-800"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight size={12} /> : stat.trend === 'down' ? <ArrowDownRight size={12} /> : null}
                  {stat.trend === 'up' ? '+2.4%' : stat.trend === 'down' ? '-1.1%' : 'Stable'}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">${stat.value.toLocaleString()}</p>
            </Card>
          </motion.div>
        ))}
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Distribución de Gastos" subtitle="Análisis por categoría" className="lg:col-span-1">
          <PremiumDonutChart data={chartData} />
        </Card>
        <Card title="Tendencia de Gasto" subtitle="Evolución mensual" className="lg:col-span-2">
          <PremiumAreaChart data={trendData} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Actividad Reciente" subtitle="Movimientos más relevantes">
            <div className="space-y-4">
              {data.expenses.slice(0, 5).map((exp, i) => (
                <div key={exp._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{exp.description || 'Sin descripción'}</p>
                      <p className="text-xs text-slate-500">{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">-${exp.amount.toFixed(2)}</p>
                </div>
              ))}
              {data.expenses.length === 0 && <p className="text-center py-8 text-slate-400">No hay movimientos recientes</p>}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <SmartInsights insights={insights} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
