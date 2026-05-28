import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, Bell, User, CreditCard } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ currency: 'USD', preferences: { notifications: true } });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/user/profile');
        setProfile(data);
        setForm({ currency: data.currency, preferences: data.preferences });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadProfile();
  }, []);

  const updateProfile = async () => {
    try {
      await api.put('/user/profile', form);
      toast.success('Ajustes actualizados');
    } catch (e) { toast.error('Error al guardar'); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Cargando configuración...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Configuración</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Perfil de Usuario" subtitle="Información básica de la cuenta" className="lg:col-span-1">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary-500 to-blue-300 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
              {profile?.username?.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 dark:text-slate-100">{profile?.username}</p>
              <p className="text-sm text-slate-500">{profile?.email}</p>
            </div>
            <Button variant="outline" className="w-full text-xs">Cambiar Avatar</Button>
          </div>
        </Card>

        <Card title="Preferencias Financieras" subtitle="Ajustes de visualización y moneda" className="lg:col-span-2">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Moneda Base</label>
                <select
                  className="premium-input"
                  value={form.currency}
                  onChange={e => setForm({ ...form, currency: e.target.value })}
                >
                  <option value="USD">Dólar estadounidense (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="MXN">Peso Mexicano (MXN)</option>
                  <option value="ARS">Peso Argentino (ARS)</option>
                  <option value="CLP">Peso Chileno (CLP)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Notificaciones</label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    checked={form.preferences.notifications}
                    onChange={e => setForm({ ...form, preferences: { ...form.preferences, notifications: e.target.checked } })}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Habilitar alertas inteligentes</span>
                </div>
              </div>
            </div>
            <Button variant="primary" className="w-full py-3" onClick={updateProfile}>Guardar Cambios</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Seguridad de Cuenta" subtitle="Protege tu información financiera">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-primary-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Autenticación de Dos Factores (2FA)</span>
              </div>
              <Button variant="outline" className="text-xs">Configurar</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Alertas de Gasto Crítico</span>
              </div>
              <Button variant="outline" className="text-xs">Gestionar</Button>
            </div>
          </div>
        </Card>

        <Card title="Soporte y Cuenta" subtitle="Administración de suscripción">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-primary-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Plan Premium Activo</span>
              </div>
              <span className="text-xs font-bold text-primary-600">Ver Factura</span>
            </div>
            <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Eliminar Cuenta Permanentemente</Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Settings;
