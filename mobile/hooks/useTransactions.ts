import { API_URL } from "@/assets/constants/api";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  created_at: string;
  user_id: string;
}

interface Summary {
  balance: number;
  income: number;
  expenses: number;
}

export const useTransactions = (userId: string | null) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
const fetchTransactions = useCallback(async () => {
  if (!userId) return;
  try {
    const response = await fetch(`${API_URL}/transactions/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setTransactions(data);
  } catch (error) {
    console.error('Error fetching transactions', error);
    setTransactions([]);
  }
}, [userId]);


  const fetchSummary = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/summary/${userId}`);
      const text = await response.text();
      const data = JSON.parse(text);
      setSummary({
        balance: data.balance ?? 0,
        income: data.income ?? 0,
        expenses: data.expenses ?? 0,
      });
    } catch (error) {
      console.error('Error fetching summary', error);
      setSummary({ balance: 0, income: 0, expenses: 0 });
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setSummary({
        balance: 0,
        income: 0,
        expenses: 0,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error('Error loading data', error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh data
      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error('Error deleting transaction', error);
      Alert.alert("Error", "Failed to delete transaction");
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { 
    transactions, 
    summary, 
    isLoading, 
    loadData, 
    deleteTransaction,
    fetchTransactions,
    fetchSummary,
  };
};