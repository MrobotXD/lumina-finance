import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const ExportService = {
  exportCSV: (data, filename = 'reporte.csv') => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    link.click();
  },
  exportExcel: (data, filename = 'reporte.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, filename);
  },
  exportPDF: ({ title, summary, columns, tableData }, filename = 'reporte.pdf') => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    doc.autoTable({
      head: [columns],
      body: tableData,
      startY: 25,
    });
    doc.save(filename);
  }
};