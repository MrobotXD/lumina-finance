import { supabase } from '../lib/supabase'

// Profiles
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
  return data
}

// Expenses
export const getExpenses = async (userId) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const addExpense = async (expenseData) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expenseData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateExpense = async (id, updates) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteExpense = async (id) => {
  const { data, error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) throw error
  return data
}

// Debts
export const getDebts = async (userId) => {
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const addDebt = async (debtData) => {
  const { data, error } = await supabase
    .from('debts')
    .insert(debtData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateDebt = async (id, updates) => {
  const { data, error } = await supabase
    .from('debts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteDebt = async (id) => {
  const { data, error } = await supabase
    .from('debts')
    .delete()
    .eq('id', id)

  if (error) throw error
  return data
}

// Budgets
export const getBudgets = async (userId) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const addBudget = async (budgetData) => {
  const { data, error } = await supabase
    .from('budgets')
    .insert(budgetData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateBudget = async (id, updates) => {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteBudget = async (id) => {
  const { data, error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)

  if (error) throw error
  return data
}

// Goals
export const getGoals = async (userId) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const addGoal = async (goalData) => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goalData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateGoal = async (id, updates) => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteGoal = async (id) => {
  const { data, error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)

  if (error) throw error
  return data
}