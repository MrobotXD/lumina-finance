import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  X,
  Download
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import api from '../services/api';
import { ExportService } from '../services/ExportService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const ReportCenter = () => {
  const [activeTab, setActiveTab] = useState('export');
  const [importData, setImportData] = useState(null);
  const [mapping, setMapping] = useState({});
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target.result;
      let data = [];

      if (file.name.endsWith('.csv')) {
        const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
        data = parsed.data;
      } else {
        const workbook = XLSX.read(content, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(sheet);
      }
      setImportData(data);
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const autoMapColumns = (data) => {
    if (!data || data.length === 0) return;
    const firstRow = data[0];
    const map = {};
    const keys = Object.keys(firstRow);

    const labels = {
      amount: ['monto', 'amount', 'valor', 'total'],
      category: ['categoría', 'category', 'tipo', 'rubro'],
      date: ['fecha', 'date', 'día'],
      description: ['descripción', 'description', 'nota', 'concepto']
    };

    Object.entries(labels).forEach(([target, options]) => {
      const match = keys.find(k => options.some(opt => k.toLowerCase().includes(opt)));
      if (match) map[match] = target;
    });

    setMapping(map);
  };

  const commitImport = async (type) => {
    setIsImporting(true);
    try {
      const mappedData = importData.map(row => {
        const newItem = {};
        Object.entries(mapping).forEach(([src, target]) => {
          newItem[target] = row[src];
        });
        return newItem;
      });

      const endpoint = type === 'expenses' ? '/reports/import/expenses' : '/reports/import/debts';
      const { data } = await api.post(endpoint, { data: mappedData });

      toast.success(`Importación exitosa: ${data.success} registros añadidos`);
      setImportData(null);
      setMapping({});
    } catch (e) {
      toast.error('Error durante la importación');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Centro de Reportes</h1>
          <p className="text-slate-500 dark:text-slate-400">Exporta tus datos o importa información externa</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('export')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === 'export' ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500"
            )}
          >
            Exportar
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === 'import' ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500"
            )}
          >
            Importar
          </button>
        </div>
      </div>

      {activeTab === 'export' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Exportar Gastos" subtitle="Descarga tu historial detallado">
            <div className="space-y-3">
              <Button
                variant="outline" className="w-full justify-start"
                onClick={() => ExportService.exportCSV([])}
              >
                <FileText size={18} /> Exportar CSV
              </Button>
              <Button
                variant="outline" className="w-full justify-start"
                onClick={() => ExportService.exportExcel([])}
              >
                <FileText size={18} /> Exportar Excel (.xlsx)
              </Button>
              <Button
                variant="primary" className="w-full justify-start"
                onClick={() => ExportService.exportPDF({
                  title: 'Reporte Financiero Premium',
                  summary: [{ label: 'Total Gastos', value: 1200 }, { label: 'Ahorro', value: 400 }],
                  columns: ['Fecha', 'Categoría', 'Descripción', 'Monto'],
                  tableData: [['2023-05-01', 'Comida', 'Cena', 25.00]]
                })}
              >
                <Download size={18} /> Generar PDF Premium
              </Button>
            </div>
          </Card>
          <Card title="Exportar Deudas" subtitle="Estado de cuentas pendientes">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => {}}><FileText size={18} /> Exportar CSV</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {}}><FileText size={18} /> Exportar Excel</Button>
              <Button variant="primary" className="w-full justify-start" onClick={() => {}}><Download size={18} /> Generar PDF</Button>
            </div>
          </Card>
          <Card title="Ajustes de Reporte" subtitle="Personaliza tu salida">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Rango de Fechas</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="premium-input text-xs" />
                  <input type="date" className="premium-input text-xs" />
                </div>
              </div>
              <Button variant="secondary" className="w-full">Aplicar Filtros</Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!importData ? (
              <motion.div
                key="upload-zone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm hover:border-primary-400 transition-colors cursor-pointer relative"
              >
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-500">
                    <Upload size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sube tu archivo financiero</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Arrastra y suelta CSV o Excel aquí</p>
                  </div>
                  <div className="text-xs font-medium text-slate-400">Soporta archivos hasta 10MB</div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="validation-zone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card title="Validación de Importación" subtitle="Mapea tus columnas y verifica los datos">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {['amount', 'category', 'date', 'description'].map(field => (
                          <div key={field} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                            {field}
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" onClick={() => setImportData(null)} className="text-xs">
                        <X size={14} /> Cancelar
                      </Button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                          <tr>
                            {Object.keys(importData[0]).map(key => (
                              <th key={key} className="p-3 font-bold text-slate-600 dark:text-slate-400 border-b dark:border-slate-800">
                                <div className="flex flex-col gap-2">
                                  <span>{key}</span>
                                  <select
                                    className="w-full p-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                                    value={mapping[key] || ''}
                                    onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })}
                                  >
                                    <option value="">Ignorar</option>
                                    <option value="amount">Monto</option>
                                    <option value="category">Categoría</option>
                                    <option value="date">Fecha</option>
                                    <option value="description">Descripción</option>
                                  </select>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {importData.slice(0, 5).map((row, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="p-3 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        variant="secondary"
                        onClick={() => autoMapColumns(importData)}
                      >
                        Auto-mapear
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => commitImport('expenses')}
                          disabled={isImporting}
                        >
                          Importar como Gastos
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => commitImport('debts')}
                          disabled={isImporting}
                        >
                          Importar como Deudas
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ReportCenter;
