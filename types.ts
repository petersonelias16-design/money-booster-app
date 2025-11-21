
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const TRANSACTION_CATEGORIES = [
  'Vendas', 'Serviços', 'Salário', 'Investimentos', 'Alimentação', 
  'Transporte', 'Moradia', 'Ferramentas', 'Marketing', 'Outros'
];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  monthlyGoal: number;
  hasAccess: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  TOOLS = 'TOOLS',
  FINANCE = 'FINANCE',
  REWARDS = 'REWARDS',
  SETTINGS = 'SETTINGS',
}

export interface DashboardStats {
  balance: number;
  income: number;
  expense: number;
  dailyProgress: number; // 0-100
}

export const MOCK_TASKS: DailyTask[] = [
  { id: '1', title: 'Registrar gastos de ontem', completed: false, xpReward: 50 },
  { id: '2', title: 'Revisar meta semanal', completed: false, xpReward: 30 },
  { id: '3', title: 'Ler dica do dia', completed: true, xpReward: 20 },
];