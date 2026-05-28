import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export const ExportService = {
  async exportCSV(data, filename = 'export.csv') {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  async exportExcel(data, filename = 'export.xlsx') {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, filename);
  },

  async exportPDF(reportData) {
    const doc = new jsPDF();
    const { title, summary, tableData, columns } = reportData;

    // Premium Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(title, 15, 13);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);

    // Summary Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.text('Resumen Financiero', 15, 35);

    let yPos = 42;
    summary.forEach(item => {
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text(item.label, 15, yPos);
      doc.setTextColor(30, 41, 59);
      doc.text(`$${item.value.toLocaleString()}`, 50, yPos);
      yPos += 8;
    });

    // Table Section
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Detalle de Movimientos', 15, yPos + 10);

    doc.autoTable({
      startY: yPos + 15,
      head: [columns],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 4 },
    });

    doc.save(`${reportData.filename || 'report'}.pdf`);
  }
};
