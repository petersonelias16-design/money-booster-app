import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Award, 
  Settings, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Trash2,
  Calculator,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button, Card, Input, Badge, Modal } from './components/Components';
import { 
  ViewState, 
  UserProfile, 
  Transaction, 
  TransactionType, 
  DailyTask, 
  MOCK_TASKS,
  DashboardStats
} from './types';
import { generateFinancialInsight } from './services/geminiService';

// --- INITIAL STATE ---
const INITIAL_USER: UserProfile = {
  name: 'Empreendedor',
  email: 'usuario@moneybooster.com',
  level: 1,
  xp: 0,
  monthlyGoal: 5000,
  hasAccess: true,
};

type Theme = 'light' | 'dark';

// --- SUB-COMPONENTS ---

const DashboardView = ({ 
  user, stats, tasks, toggleTask, aiInsight, loadingAi, onGetInsight, setView 
}: {
  user: UserProfile;
  stats: DashboardStats;
  tasks: DailyTask[];
  toggleTask: (id: string) => void;
  aiInsight: string;
  loadingAi: boolean;
  onGetInsight: () => void;
  setView: (v: ViewState) => void;
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Olá, {user.name} 👋</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Você está no caminho para a liberdade financeira.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge color="yellow">Nível {user.level}</Badge>
          <Badge color="purple">{user.xp} XP</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden border-primary/30">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Saldo Atual</p>
          <h3 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mt-1">
            R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center text-sm text-green-600 dark:text-accent">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12% essa semana</span>
          </div>
        </Card>

        <Card>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Entradas (Mês)</p>
          <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mt-1">
            R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <div className="w-full bg-gray-200 dark:bg-surfaceLight h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 dark:bg-accent h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </Card>

        <Card>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Saídas (Mês)</p>
          <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mt-1">
            R$ {stats.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <div className="w-full bg-gray-200 dark:bg-surfaceLight h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: '32%' }} />
          </div>
        </Card>
      </div>

      {/* AI Insight */}
      <Card title="Consultor Money Booster (IA)" className="border-primary/20 bg-gradient-to-br from-white to-purple-50 dark:from-surface dark:to-primary/5">
        {aiInsight ? (
           <div className="prose prose-sm">
             <p className="text-gray-700 dark:text-gray-300 italic">"{aiInsight}"</p>
             <Button variant="ghost" size="sm" className="mt-2 text-xs pointer-events-none opacity-50">Dica gerada</Button>
           </div>
        ) : (
          <div className="text-center py-4">
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Receba uma análise personalizada das suas finanças agora.</p>
             <Button onClick={onGetInsight} variant="secondary" disabled={loadingAi}>
               {loadingAi ? 'Analisando...' : (
                 <>
                   <Sparkles className="w-4 h-4 mr-2 text-yellow-500 dark:text-highlight" />
                   Gerar Análise Inteligente
                 </>
               )}
             </Button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <Card title="Tarefas Diárias" action={<Button variant="ghost" className="text-xs">Ver todas</Button>}>
          <div className="space-y-3">
            {tasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${
                  task.completed 
                    ? 'bg-gray-100 dark:bg-surfaceLight/30 border-transparent opacity-60' 
                    : 'bg-white dark:bg-surface border-gray-200 dark:border-surfaceLight hover:border-primary/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  task.completed 
                    ? 'bg-green-500 dark:bg-accent border-green-500 dark:border-accent' 
                    : 'border-gray-400 dark:border-gray-500'
                }`}>
                  {task.completed && <div className="w-2 h-2 bg-white dark:bg-black rounded-full" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>{task.title}</p>
                </div>
                <Badge color="purple">+{task.xpReward} XP</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Acesso Rápido">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="h-24 flex flex-col gap-2 border-dashed" onClick={() => setView(ViewState.TOOLS)}>
              <Calculator className="w-6 h-6 text-primary" />
              <span className="text-xs">Calculadora</span>
            </Button>
            <Button variant="secondary" className="h-24 flex flex-col gap-2 border-dashed" onClick={() => setView(ViewState.FINANCE)}>
              <Wallet className="w-6 h-6 text-green-500 dark:text-accent" />
              <span className="text-xs">Nova Receita</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ToolsView = ({ user }: { user: UserProfile }) => {
  const [goal, setGoal] = useState(user.monthlyGoal);
  const dailyNeeded = goal / 30;
  const hourlyNeeded = dailyNeeded / 8; 

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Multiplicador Financeiro</h2>
        <p className="text-gray-500 dark:text-gray-400">Calcule exatamente o que você precisa fazer para atingir sua meta.</p>
      </div>

      <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-surface dark:to-[#151515]">
        <div className="p-4">
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">Qual sua meta mensal de renda?</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">R$</span>
              <input 
                type="number" 
                value={goal} 
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-primary/50 rounded-xl py-4 pl-12 pr-4 text-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 border-t border-gray-200 dark:border-surfaceLight pt-6">
          <div className="text-center p-4 rounded-xl bg-gray-100 dark:bg-[#0D0D0D]">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Meta Diária</p>
            <p className="text-2xl font-bold text-green-600 dark:text-accent">R$ {dailyNeeded.toFixed(2)}</p>
          </div>
            <div className="text-center p-4 rounded-xl bg-gray-100 dark:bg-[#0D0D0D]">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Meta Semanal</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {(dailyNeeded * 7).toFixed(2)}</p>
          </div>
            <div className="text-center p-4 rounded-xl bg-gray-100 dark:bg-[#0D0D0D]">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Por Hora (8h)</p>
            <p className="text-2xl font-bold text-primary">R$ {hourlyNeeded.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card title="Estratégias Sugeridas" className="border-l-4 border-l-primary">
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">1</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Para atingir <span className="text-gray-900 dark:text-white font-bold">R$ {dailyNeeded.toFixed(0)}</span> hoje, venda 1 produto de Ticket Alto ou 5 de Ticket Baixo.</p>
          </li>
          <li className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">2</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Revise seus custos fixos. Cortar R$ 100 em custos é igual a vender R$ 300 a mais (com margem de 30%).</p>
          </li>
        </ul>
      </Card>
    </div>
  );
};

const TransactionHistory = ({ 
  transactions, 
  onDeleteRequest 
}: { 
  transactions: Transaction[], 
  onDeleteRequest: (id: string) => void 
}) => {
  return (
    <Card title="Histórico de Transações">
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-surfaceLight rounded-full flex items-center justify-center mb-3">
              <Wallet className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">Nenhuma transação registrada ainda.</p>
          </div>
        )}
        {transactions.map(t => (
          <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0D0D0D] rounded-xl border border-gray-200 dark:border-surfaceLight hover:border-primary/30 transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                t.type === TransactionType.INCOME 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-accent' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400'
              }`}>
                {t.type === TransactionType.INCOME ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{t.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                  <span>•</span>
                  <span className={t.category === 'Geral' ? 'opacity-50' : 'text-primary'}>{t.category}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`font-bold whitespace-nowrap ${
                  t.type === TransactionType.INCOME ? 'text-green-600 dark:text-accent' : 'text-red-500 dark:text-red-400'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <button 
                  onClick={() => onDeleteRequest(t.id)} 
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Excluir transação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const FinanceView = ({ 
  transactions, 
  onAdd, 
  onDelete 
}: { 
  transactions: Transaction[], 
  onAdd: (t: Omit<Transaction, 'id'>) => void, 
  onDelete: (id: string) => void
}) => {
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amt || !date) return;
    
    onAdd({
      description: desc,
      amount: parseFloat(amt),
      type: type,
      date: new Date(date + 'T12:00:00Z').toISOString(), // Simple date handling
      category: 'Geral'
    });
    
    setDesc('');
    setAmt('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const chartData = useMemo(() => {
    // Simple data aggregation for chart
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTrans = transactions.filter(t => t.date.startsWith(date));
      const income = dayTrans.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
      const expense = dayTrans.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
      return {
        name: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
        income,
        expense
      };
    });
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Input Form */}
        <div className="w-full md:w-1/3">
          <Card title="Nova Transação">
            <form onSubmit={handleAdd} className="space-y-4">
              <Input 
                label="Descrição" 
                placeholder="Ex: Venda Consultoria, Mercado" 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              
              <div className="grid grid-cols-2 gap-3">
                 <Input 
                    label="Valor (R$)" 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01"
                    value={amt}
                    onChange={(e) => setAmt(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Data</label>
                    <div className="relative">
                      <input 
                        type="date"
                        className="w-full bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-surfaceLight rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
              </div>

              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-[#0D0D0D] rounded-xl">
                <button 
                  type="button"
                  onClick={() => setType(TransactionType.INCOME)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === TransactionType.INCOME ? 'bg-white dark:bg-surfaceLight text-green-600 dark:text-accent shadow-sm' : 'text-gray-500'}`}
                >
                  Entrada
                </button>
                <button 
                  type="button"
                  onClick={() => setType(TransactionType.EXPENSE)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-surfaceLight text-red-500 shadow-sm' : 'text-gray-500'}`}
                >
                  Saída
                </button>
              </div>

              <Button type="submit" fullWidth icon={<Plus className="w-4 h-4" />}>
                Adicionar
              </Button>
            </form>
          </Card>
        </div>

        {/* Chart */}
        <div className="w-full md:w-2/3">
          <Card title="Fluxo da Semana" className="h-full min-h-[300px]">
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    dy={10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="income" name="Entradas" fill="#52FFB8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Saídas" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* History Component */}
      <TransactionHistory 
        transactions={transactions} 
        onDeleteRequest={(id) => setDeleteId(id)} 
      />

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)}
        title="Excluir Transação"
      >
        <p className="mb-6">Tem certeza que deseja excluir esta transação? Essa ação não pode ser desfeita.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const RewardsView = ({ user }: { user: UserProfile }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Central de Recompensas</h2>
        <p className="text-gray-500 dark:text-gray-400">Suas conquistas valem muito aqui.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nível {user.level}</h3>
                <p className="text-gray-500 text-sm">Empreendedor Iniciante</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>XP Atual</span>
                <span>{user.xp} / 1000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-surfaceLight h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full" style={{ width: `${(user.xp / 1000) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Faltam {1000 - user.xp} XP para o próximo nível</p>
            </div>
         </Card>

         <Card title="Conquistas Recentes">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-secondary rounded-xl border border-gray-200 dark:border-surfaceLight">
                 <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center text-highlight">
                   <TrendingUp className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-medium text-gray-900 dark:text-white">Primeira Venda</p>
                   <p className="text-xs text-gray-500">Registrou a primeira entrada</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-secondary rounded-xl border border-gray-200 dark:border-surfaceLight opacity-50">
                 <div className="w-10 h-10 bg-gray-200 dark:bg-surfaceLight rounded-full flex items-center justify-center text-gray-500">
                   <Award className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-medium text-gray-900 dark:text-white">Mestre da Economia</p>
                   <p className="text-xs text-gray-500">Reduziu 10% dos gastos</p>
                 </div>
              </div>
            </div>
         </Card>
      </div>
    </div>
  );
};

const SettingsView = ({ 
  user, 
  theme, 
  toggleTheme 
}: { 
  user: UserProfile; 
  theme: Theme; 
  toggleTheme: () => void;
}) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Configurações</h2>

      <Card title="Perfil">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-800 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <Button variant="secondary" fullWidth>Editar Perfil</Button>
      </Card>

      <Card title="Aparência">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-surfaceLight rounded-lg text-gray-900 dark:text-white">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Tema do Aplicativo</p>
              <p className="text-xs text-gray-500">{theme === 'dark' ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={toggleTheme}>
            Alternar
          </Button>
        </div>
      </Card>

      <Card title="Dados">
        <div className="space-y-4">
          <Button variant="secondary" fullWidth>Fazer Backup</Button>
          <Button variant="secondary" fullWidth>Restaurar Dados</Button>
        </div>
      </Card>
      
      <div className="text-center pt-8">
        <p className="text-xs text-gray-500">Money Booster v1.0.0</p>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>(MOCK_TASKS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  // Initialize Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Initial Transaction Load (Mock)
  useEffect(() => {
    const saved = localStorage.getItem('mb_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([
        { id: '1', description: 'Venda Consultoria', amount: 1500, type: TransactionType.INCOME, date: new Date().toISOString(), category: 'Serviços' },
        { id: '2', description: 'Software SaaS', amount: 299, type: TransactionType.EXPENSE, date: new Date().toISOString(), category: 'Ferramentas' },
      ]);
    }
  }, []);

  // Persist Transactions
  useEffect(() => {
    localStorage.setItem('mb_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
      dailyProgress: 45
    };
  }, [transactions]);

  const handleTransactionAdd = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);
    // Add XP logic here in real app
    setUser(prev => ({ ...prev, xp: prev.xp + 10 }));
  };

  const handleTransactionDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.completed) setUser(u => ({ ...u, xp: u.xp + t.xpReward }));
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const getAiInsight = async () => {
    setLoadingAi(true);
    const insight = await generateFinancialInsight(user, transactions, stats.balance);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  // Navigation Items
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: ViewState.TOOLS, label: 'Money Booster', icon: <TrendingUp className="w-5 h-5" /> },
    { id: ViewState.FINANCE, label: 'Finanças', icon: <Wallet className="w-5 h-5" /> },
    { id: ViewState.REWARDS, label: 'Recompensas', icon: <Award className="w-5 h-5" /> },
    { id: ViewState.SETTINGS, label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D] text-gray-900 dark:text-white font-sans transition-colors duration-300 flex">
      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-full w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-surfaceLight z-50 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200 dark:border-surfaceLight flex justify-between items-center">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <TrendingUp className="text-white w-5 h-5" />
             </div>
             <h1 className="font-heading font-bold text-xl tracking-tight text-gray-900 dark:text-white">Money<span className="text-primary">Booster</span></h1>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500">
             <X className="w-6 h-6" />
           </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                view === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surfaceLight hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col h-screen">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-surfaceLight bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-600 dark:text-gray-400">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 md:flex-none" /> {/* Spacer */}

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold text-xs">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {view === ViewState.DASHBOARD && (
              <DashboardView 
                user={user} 
                stats={stats} 
                tasks={tasks} 
                toggleTask={toggleTask}
                aiInsight={aiInsight}
                loadingAi={loadingAi}
                onGetInsight={getAiInsight}
                setView={setView}
              />
            )}
            {view === ViewState.TOOLS && <ToolsView user={user} />}
            {view === ViewState.FINANCE && (
              <FinanceView 
                transactions={transactions} 
                onAdd={handleTransactionAdd} 
                onDelete={handleTransactionDelete}
              />
            )}
            {view === ViewState.REWARDS && <RewardsView user={user} />}
            {view === ViewState.SETTINGS && (
              <SettingsView user={user} theme={theme} toggleTheme={toggleTheme} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}