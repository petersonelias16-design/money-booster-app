import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Award, 
  Settings, 
  Lock, 
  Bell, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Trash2,
  Calculator,
  Target,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon
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
  user, stats, tasks, toggleTask, aiInsight, loadingAi, onGetInsight, setView, theme 
}: {
  user: UserProfile;
  stats: DashboardStats;
  tasks: DailyTask[];
  toggleTask: (id: string) => void;
  aiInsight: string;
  loadingAi: boolean;
  onGetInsight: () => void;
  setView: (v: ViewState) => void;
  theme: Theme;
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
             <Button variant="ghost" size="sm" onClick={() => {}} className="mt-2 text-xs pointer-events-none opacity-50">Dica gerada</Button>
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
                  <span>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
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
  transactions, stats, onAdd, onDelete, theme 
}: { 
  transactions: Transaction[], 
  stats: DashboardStats, 
  onAdd: (t: Omit<Transaction, 'id'>) => void, 
  onDelete: (id: string) => void,
  theme: Theme
}) => {
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  
  // State for deletion modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amt) return;
    onAdd({
      description: desc,
      amount: parseFloat(amt),
      type: type,
      date: new Date().toISOString(),
      category: 'Geral'
    });
    setDesc('');
    setAmt('');
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const data = [
    { name: 'Entradas', value: stats.income, color: '#10B981' }, // Green 500
    { name: 'Saídas', value: stats.expense, color: '#EF4444' },
  ];
  
  // Adjust chart colors for theme
  const chartData = theme === 'dark' ? [
    { name: 'Entradas', value: stats.income, color: '#52FFB8' },
    { name: 'Saídas', value: stats.expense, color: '#EF4444' },
  ] : data;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Controle Financeiro</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1 space-y-6">
            <Card title="Nova Transação">
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-[#0D0D0D] rounded-lg">
                  <button 
                  type="button"
                  onClick={() => setType(TransactionType.INCOME)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${type === TransactionType.INCOME ? 'bg-white dark:bg-surfaceLight text-green-600 dark:text-accent shadow-sm' : 'text-gray-500'}`}
                  >
                    Entrada
                  </button>
                  <button 
                  type="button"
                  onClick={() => setType(TransactionType.EXPENSE)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-surfaceLight text-red-500 dark:text-red-400 shadow-sm' : 'text-gray-500'}`}
                  >
                    Saída
                  </button>
                </div>

                <Input 
                placeholder="Descrição (ex: Venda Consultoria)" 
                value={desc} 
                onChange={e => setDesc(e.target.value)} 
              />
                <Input 
                type="number" 
                placeholder="Valor (R$)" 
                value={amt} 
                onChange={e => setAmt(e.target.value)} 
              />
                <Button type="submit" fullWidth variant={type === TransactionType.INCOME ? 'accent' : 'primary'} className={type === TransactionType.EXPENSE ? '!bg-red-600 !shadow-none border-red-800 text-white' : ''}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </form>
            </Card>

            <Card>
              <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke={theme === 'dark' ? "#4B5563" : "#9CA3AF"} fontSize={12} />
                      <YAxis stroke={theme === 'dark' ? "#4B5563" : "#9CA3AF"} fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF', 
                          border: theme === 'dark' ? '1px solid #292929' : '1px solid #E5E7EB',
                          borderRadius: '8px',
                          color: theme === 'dark' ? '#fff' : '#111827'
                        }}
                        itemStyle={{ color: theme === 'dark' ? '#fff' : '#111827' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <TransactionHistory 
            transactions={transactions} 
            onDeleteRequest={setDeleteId} 
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)}
        title="Confirmar Exclusão"
      >
        <p className="mb-6">Tem certeza que deseja excluir esta transação? Essa ação não pode ser desfeita.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};

const RewardsView = ({ user }: { user: UserProfile }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center py-8">
         <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-primary via-purple-400 to-accent mb-4">
           <div className="w-24 h-24 rounded-full bg-white dark:bg-[#0D0D0D] flex items-center justify-center">
             <Award className="w-12 h-12 text-yellow-500 dark:text-highlight" />
           </div>
         </div>
         <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Central de Conquistas</h2>
         <p className="text-gray-500 dark:text-gray-400 mt-2">Nível {user.level} • {user.xp} XP Total</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card title="Próxima Conquista" className="border-yellow-500/20 dark:border-highlight/20">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-gray-100 dark:bg-surfaceLight rounded-lg flex items-center justify-center">
               <Target className="w-6 h-6 text-gray-400" />
             </div>
             <div>
               <h4 className="font-bold text-gray-900 dark:text-white">Mestre da Poupança</h4>
               <p className="text-xs text-gray-500">Economize R$ 1.000 em um mês</p>
             </div>
           </div>
           <div className="w-full bg-gray-200 dark:bg-surfaceLight h-2 rounded-full overflow-hidden">
             <div className="bg-yellow-500 dark:bg-highlight h-full rounded-full" style={{ width: '45%' }} />
           </div>
           <p className="text-right text-xs text-yellow-600 dark:text-highlight mt-2">45%</p>
         </Card>

         <Card title="Ranking Pessoal">
            <div className="space-y-4">
              {[
                { label: 'Consistência', val: '5 dias', icon: <TrendingUp className="w-4 h-4 text-green-600 dark:text-accent" /> },
                { label: 'Maior Lucro', val: 'R$ 2.400', icon: <Wallet className="w-4 h-4 text-primary" /> },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-200 dark:border-surfaceLight pb-2 last:border-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    {item.icon} {item.label}
                  </div>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{item.val}</span>
                </div>
              ))}
            </div>
         </Card>
      </div>
    </div>
  );
};

const SettingsView = ({ 
  user, theme, toggleTheme 
}: { 
  user: UserProfile; 
  theme: Theme; 
  toggleTheme: () => void;
}) => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <Card title="Aparência">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-surfaceLight' : 'bg-gray-100'}`}>
              {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Tema do Aplicativo</p>
              <p className="text-xs text-gray-500">{theme === 'dark' ? 'Modo Escuro (Padrão)' : 'Modo Claro'}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={toggleTheme} className="min-w-[100px]">
            {theme === 'dark' ? 'Mudar p/ Claro' : 'Mudar p/ Escuro'}
          </Button>
        </div>
      </Card>

      <Card title="Perfil">
        <div className="space-y-4">
          <Input label="Nome Completo" defaultValue={user.name} />
          <Input label="Email" defaultValue={user.email} disabled />
          <Input label="Meta Mensal (R$)" type="number" defaultValue={user.monthlyGoal} />
          <Button>Salvar Alterações</Button>
        </div>
      </Card>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>(MOCK_TASKS);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>('dark');

  // Toggle Theme Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Stats Calculation
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;
    
    // Simple projection
    const dailyAvg = transactions.length > 0 ? income / Math.max(1, new Date().getDate()) : 0;
    const projected = dailyAvg * 30;

    return { income, expense, balance, projected, dailyProgress: 0 };
  }, [transactions]);

  // --- HANDLERS ---

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT: Transaction = { ...t, id: Date.now().toString() };
    setTransactions([newT, ...transactions]);
    addXp(10);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        if (!t.completed) addXp(t.xpReward);
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const addXp = (amount: number) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const handleGetInsight = async () => {
    setLoadingAi(true);
    const insight = await generateFinancialInsight(user, transactions, stats.balance);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  // --- RENDER LOGIC ---

  const NavItem = ({ icon, label, target, active }: any) => (
    <button
      onClick={() => { setView(target); setMobileMenuOpen(false); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full ${
        active 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surfaceLight hover:text-primary dark:hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D] text-gray-900 dark:text-white flex font-sans selection:bg-primary/30 selection:text-white transition-colors duration-300">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-surfaceLight bg-white/80 dark:bg-surface/30 backdrop-blur-md fixed h-full z-20 transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-surfaceLight">
          <h1 className="text-xl font-heading font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            Money <span className="text-primary">Booster</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" target={ViewState.DASHBOARD} active={view === ViewState.DASHBOARD} />
          <NavItem icon={<Calculator size={20} />} label="Multiplicador" target={ViewState.TOOLS} active={view === ViewState.TOOLS} />
          <NavItem icon={<Wallet size={20} />} label="Finanças" target={ViewState.FINANCE} active={view === ViewState.FINANCE} />
          <NavItem icon={<Award size={20} />} label="Recompensas" target={ViewState.REWARDS} active={view === ViewState.REWARDS} />
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-surfaceLight">
             <NavItem icon={<Settings size={20} />} label="Configurações" target={ViewState.SETTINGS} active={view === ViewState.SETTINGS} />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-surfaceLight">
          <div className="bg-gradient-to-r from-primary/10 to-purple-100 dark:from-primary/20 dark:to-accent/10 p-4 rounded-xl border border-primary/10 dark:border-primary/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assinatura Vitalícia</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
              <Lock className="w-3 h-3 text-green-600 dark:text-accent" /> Premium Ativo
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white/90 dark:bg-surface/90 backdrop-blur-md z-30 border-b border-gray-200 dark:border-surfaceLight px-4 py-3 flex justify-between items-center transition-colors duration-300">
         <div className="font-heading font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
            Money Booster
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-900 dark:text-white">
           {mobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-black/95 z-20 pt-20 px-6 space-y-4 md:hidden animate-in slide-in-from-top-10">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" target={ViewState.DASHBOARD} active={view === ViewState.DASHBOARD} />
          <NavItem icon={<Calculator size={20} />} label="Multiplicador" target={ViewState.TOOLS} active={view === ViewState.TOOLS} />
          <NavItem icon={<Wallet size={20} />} label="Finanças" target={ViewState.FINANCE} active={view === ViewState.FINANCE} />
          <NavItem icon={<Award size={20} />} label="Recompensas" target={ViewState.REWARDS} active={view === ViewState.REWARDS} />
          <NavItem icon={<Settings size={20} />} label="Configurações" target={ViewState.SETTINGS} active={view === ViewState.SETTINGS} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen pt-20 md:pt-0 transition-colors duration-300">
        {/* Top Bar Desktop */}
        <header className="hidden md:flex justify-between items-center px-8 py-5 border-b border-gray-200 dark:border-surfaceLight bg-white/50 dark:bg-[#0D0D0D]/50 backdrop-blur sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {view === ViewState.DASHBOARD && 'Visão Geral'}
            {view === ViewState.TOOLS && 'Ferramentas'}
            {view === ViewState.FINANCE && 'Fluxo de Caixa'}
            {view === ViewState.REWARDS && 'Suas Conquistas'}
            {view === ViewState.SETTINGS && 'Configurações'}
          </h2>
          <div className="flex items-center gap-4">
             <button className="relative p-2 text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 dark:bg-accent rounded-full border border-white dark:border-[#0D0D0D]"></span>
             </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 border-2 border-white dark:border-surfaceLight shadow-sm"></div>
          </div>
        </header>

        <div className="p-4 md:p-8 pb-24">
          {view === ViewState.DASHBOARD && (
            <DashboardView 
              user={user} 
              stats={stats} 
              tasks={tasks} 
              toggleTask={toggleTask} 
              aiInsight={aiInsight} 
              loadingAi={loadingAi} 
              onGetInsight={handleGetInsight} 
              setView={setView}
              theme={theme}
            />
          )}
          {view === ViewState.TOOLS && <ToolsView user={user} />}
          {view === ViewState.FINANCE && (
            <FinanceView 
              transactions={transactions} 
              stats={stats} 
              onAdd={addTransaction} 
              onDelete={deleteTransaction} 
              theme={theme}
            />
          )}
          {view === ViewState.REWARDS && <RewardsView user={user} />}
          {view === ViewState.SETTINGS && <SettingsView user={user} theme={theme} toggleTheme={toggleTheme} />}
        </div>
      </main>
    </div>
  );
}