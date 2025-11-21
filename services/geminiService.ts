
import { GoogleGenAI } from "@google/genai";
import { Transaction, UserProfile } from '../types';

// FIX: Aligned with @google/genai SDK guidelines by initializing the client directly with the API key from environment variables and removing the unnecessary check.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialInsight = async (
  user: UserProfile, 
  transactions: Transaction[], 
  balance: number
): Promise<string> => {
  // Prepare context for the AI
  const recentTransactions = transactions.slice(0, 5).map(t => 
    `${t.type === 'INCOME' ? '+' : '-'} R$${t.amount} (${t.description})`
  ).join(', ');

  const prompt = `
    Atue como um consultor financeiro especialista do aplicativo "Money Booster".
    O usuário ${user.name} tem uma meta mensal de R$ ${user.monthlyGoal}.
    Saldo atual: R$ ${balance}.
    Transações recentes: ${recentTransactions || 'Nenhuma transação recente'}.
    
    Forneça uma dica curta, motivadora e acionável (máximo 2 parágrafos) para ajudar o usuário a multiplicar seu dinheiro ou cortar gastos desnecessários hoje.
    Use um tom motivador, sem ser exagerado. Fale em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar uma dica no momento.";
  } catch (error) {
    console.error("Error fetching Gemini insight:", error);
    return "O oráculo financeiro está indisponível temporariamente. Continue focado nas metas!";
  }
};