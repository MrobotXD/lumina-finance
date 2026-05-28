/**
 * AnalyticsEngine
 * Core logic for processing financial data and generating human-like insights.
 */

export const calculateFinancialHealth = (expenses, debts, budgets) => {
  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalDebt = debts.filter(d => d.status === 'Pendiente').reduce((acc, d) => acc + d.amount, 0);
  const currentBudget = budgets[0]?.limit || 1;

  // Health Score (0-100)
  // Factors: Budget adherence (40%), Debt ratio (40%), Budget existence (20%)
  const budgetRatio = Math.min(totalSpent / currentBudget, 1);
  const budgetScore = (1 - budgetRatio) * 40;

  const debtRatio = totalDebt > 0 ? Math.min(totalDebt / (totalSpent || 1), 1) : 0;
  const debtScore = (1 - debtRatio) * 40;

  const budgetExistsScore = budgets.length > 0 ? 20 : 0;

  const healthScore = Math.round(budgetScore + debtScore + budgetExistsScore);

  return {
    score: Math.max(0, Math.min(100, healthScore)),
    status: healthScore > 70 ? 'Excellent' : healthScore > 40 ? 'Stable' : 'Risk',
    metrics: {
      totalSpent,
      totalDebt,
      budgetRatio: budgetRatio * 100,
      debtPressure: debtRatio * 100
    }
  };
};

export const generateInsights = (expenses, debts, budgets) => {
  const insights = [];
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
  });

  const totalSpent = currentMonthExpenses.reduce((acc, exp) => acc + exp.amount, 0);
  const currentBudget = budgets[0]?.limit || 0;

  // 1. Budget Alert
  if (currentBudget > 0) {
    const diff = ((totalSpent / currentBudget) * 100).toFixed(0);
    if (totalSpent > currentBudget) {
      insights.push({
        type: 'warning',
        text: `Has excedido tu presupuesto mensual en un ${Math.round(diff - 100)}%. Considera reducir gastos en categorías no esenciales.`,
        icon: 'AlertTriangle'
      });
    } else if (totalSpent > currentBudget * 0.8) {
      insights.push({
        type: 'info',
        text: `Estás al ${diff}% de tu límite mensual. Te quedan $${(currentBudget - totalSpent).toFixed(2)} para el resto del mes.`,
        icon: 'Info'
      });
    }
  }

  // 2. Category Dominance
  const categories = {};
  currentMonthExpenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    const [name, amount] = topCategory;
    const percentage = ((amount / totalSpent) * 100).toFixed(0);
    insights.push({
      type: 'neutral',
      text: `Tu categoría más costosa es ${name}, representando el ${percentage}% de tus gastos actuales.`,
      icon: 'PieChart'
    });
  }

  // 3. Debt Pressure
  const pendingDebts = debts.filter(d => d.status === 'Pendiente');
  if (pendingDebts.length > 0) {
    const totalDebt = pendingDebts.reduce((acc, d) => acc + d.amount, 0);
    if (totalDebt > totalSpent * 0.5) {
      insights.push({
        type: 'danger',
        text: `Tu deuda actual es muy alta respecto a tus gastos. Prioriza la liquidación de deudas pendientes.`,
        icon: 'AlertCircle'
      });
    }
  }

  // 4. Positive Insight
  if (totalSpent < currentBudget * 0.5 && currentBudget > 0) {
    insights.push({
      type: 'success',
      text: `¡Excelente control! Estás gastando mucho menos de lo presupuestado. Podrías mover el excedente a una meta de ahorro.`,
      icon: 'TrendingUp'
    });
  }

  return insights;
};
