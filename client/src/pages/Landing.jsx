import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <nav className="relative z-10 h-16 px-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">L</div>
          <span className="text-xl font-bold tracking-tight">Lumina Finance</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
          <a href="#features" className="hover:text-primary-600 transition-colors">Características</a>
          <a href="#pricing" className="hover:text-primary-600 transition-colors">Precios</a>
          <Button variant="outline" className="rounded-full py-1 px-4" onClick={() => navigate('/login')}>Iniciar Sesión</Button>
          <Button variant="primary" className="rounded-full py-1 px-4" onClick={() => navigate('/register')}>Empezar Gratis</Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block">
            Ahora con IA Financiera 2.0
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Ilumina tu riqueza, <br /> domina tu futuro.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Lumina es la plataforma de gestión financiera de próxima generación. Inteligencia artificial, visualizaciones premium y control total de tus activos en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg gap-2" onClick={() => navigate('/register')}>
              Comenzar ahora <ChevronRight size={20} />
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg">
              Ver Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-600 rounded-3xl blur opacity-20" />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-2">
            <img
              src="https://images.unsplash.com/photo-1551288049-beb807B88370?auto=format&fit=crop&q=80&w=2070"
              className="rounded-2xl w-full h-auto"
              alt="Lumina Dashboard Preview"
            />
          </div>
        </motion.div>
      </main>

      <section id="features" className="relative z-10 bg-slate-50 dark:bg-slate-900/50 py-24 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Diseñado para la perfección</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Todo lo que necesitas para una salud financiera impecable.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Análisis Instantáneo', desc: ' la IA de Lumina analiza tus patrones de gasto y te ofrece insights accionables en tiempo real.' },
              { icon: ShieldCheck, title: 'Seguridad Enterprise', desc: 'Tus datos están cifrados con estándares bancarios y protegidos por autenticación JWT avanzada.' },
              { icon: TrendingUp, title: 'Metas Inteligentes', desc: 'No solo ahorres. Planifica hitos financieros con predicciones basadas en tu comportamiento real.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 py-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Planes Transparentes</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Crece tu patrimonio con el plan que mejor se adapte a ti.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card title="Plan Basic" subtitle="Ideal para el control personal">
            <div className="text-4xl font-bold mb-6">$0 <span className="text-sm text-slate-400 font-medium">/mes</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" /> Gestión de Gastos Ilimitada
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" /> Presupuestos Mensuales
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" /> Soporte Comunitario
              </li>
            </ul>
            <Button variant="outline" className="w-full">Empezar Gratis</Button>
          </Card>
          <Card title="Plan Premium" subtitle="Para optimizadores financieros" className="ring-2 ring-primary-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Popular</div>
            <div className="text-4xl font-bold mb-6">$12 <span className="text-sm text-slate-400 font-medium">/mes</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" /> Todo lo del plan Basic
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" /> AI Financial Insights Premium
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" /> Exportaciones PDF/Excel Avanzadas
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" /> Soporte Prioritario 24/7
              </li>
            </ul>
            <Button variant="primary" className="w-full">Subirse a Premium</Button>
          </Card>
        </div>
      </section>

      <footer className="relative z-10 py-12 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
        <p>© 2026 Lumina Finance. All rights reserved. Built for the future of wealth.</p>
      </footer>
    </div>
  );
};

export default Landing;  