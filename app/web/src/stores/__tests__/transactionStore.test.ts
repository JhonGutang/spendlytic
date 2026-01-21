import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionStore } from '../transactionStore';
import * as apiService from '../../services/api.service';
import { createApp } from 'vue';
import { installVueQueryPlugin } from './testUtils';

vi.mock('../../services/api.service');

describe('TransactionStore', () => {
  beforeEach(() => {
    // Create a test app and install Vue Query
    const app = createApp({});
    installVueQueryPlugin(app);
    
    // Set up Pinia with the app context
    const pinia = createPinia();
    app.use(pinia);
    setActivePinia(pinia);
    
    vi.clearAllMocks();
  });

  it('initializes with empty state', async () => {
    (apiService.transactionApi.getAll as any).mockResolvedValue([]);
    (apiService.transactionApi.getSummary as any).mockResolvedValue({
      summary: {
        total_income: 0,
        total_expenses: 0,
        net_balance: 0,
        transaction_count: 0,
      },
      expenses_by_category: [],
    });
    
    const store = useTransactionStore();
    
    // Wait for initial queries to settle
    await vi.waitFor(() => {
      expect(store.loading).toBe(false);
    });
    
    expect(store.transactions).toEqual([]);
    expect(store.summary).toEqual({
      total_income: 0,
      total_expenses: 0,
      net_balance: 0,
      transaction_count: 0,
    });
    expect(store.expensesByCategory).toEqual([]);
    expect(store.error).toBeNull();
  });

  it('fetches transactions successfully', async () => {
    const mockTransactions = [
      {
        id: 1,
        type: 'income' as const,
        amount: 5000,
        date: '2026-01-15',
        category_id: 1,
        description: 'Salary',
        created_at: '',
        updated_at: '',
      },
    ];

    (apiService.transactionApi.getAll as any).mockResolvedValue(mockTransactions);

    const store = useTransactionStore();
    await store.fetchTransactions();

    expect(store.transactions).toEqual(mockTransactions);
    expect(store.loading).toBe(false);
  });

  it('fetches summary successfully', async () => {
    const mockSummary = {
      summary: {
        total_income: 5000,
        total_expenses: 1500,
        net_balance: 3500,
        transaction_count: 10,
      },
      expenses_by_category: [],
    };

    (apiService.transactionApi.getSummary as any).mockResolvedValue(mockSummary);

    const store = useTransactionStore();
    await store.fetchSummary();

    expect(store.summary).toEqual(mockSummary.summary);
    expect(store.expensesByCategory).toEqual(mockSummary.expenses_by_category);
  });

  it('creates transaction and refreshes summary', async () => {
    const newTransaction = {
      id: 2,
      type: 'expense' as const,
      amount: 150,
      date: '2026-01-20',
      category_id: 2,
      description: 'Groceries',
      created_at: '',
      updated_at: '',
    };

    const mockSummary = {
      summary: {
        total_income: 5000,
        total_expenses: 150,
        net_balance: 4850,
        transaction_count: 1,
      },
      expenses_by_category: [],
    };

    (apiService.transactionApi.getAll as any).mockResolvedValue([]);
    (apiService.transactionApi.getSummary as any).mockResolvedValue({
      summary: { total_income: 0, total_expenses: 0, net_balance: 0, transaction_count: 0 },
      expenses_by_category: [],
    });
    (apiService.transactionApi.create as any).mockResolvedValue(newTransaction);

    const store = useTransactionStore();
    
    // Mock the refetch to return new transaction
    (apiService.transactionApi.getAll as any).mockResolvedValue([newTransaction]);
    (apiService.transactionApi.getSummary as any).mockResolvedValue(mockSummary);
    
    await store.createTransaction({
      type: 'expense',
      amount: 150,
      date: '2026-01-20',
      category_id: 2,
      description: 'Groceries',
    });

    // After mutation, queries are invalidated and refetched
    await vi.waitFor(() => {
      expect(store.transactions).toContainEqual(newTransaction);
      expect(store.summary.total_expenses).toBe(150);
    });
  });

  it('updates transaction and refreshes summary', async () => {
    const initialTransaction = {
      id: 1,
      type: 'expense' as const,
      amount: 150,
      date: '2026-01-20',
      category_id: 2,
      description: 'Initial',
      created_at: '',
      updated_at: '',
    };

    const updatedTransaction = {
      id: 1,
      type: 'expense' as const,
      amount: 200,
      date: '2026-01-20',
      category_id: 2,
      description: 'Updated',
      created_at: '',
      updated_at: '',
    };

    const initialSummary = {
      summary: {
        total_income: 0,
        total_expenses: 150,
        net_balance: -150,
        transaction_count: 1,
      },
      expenses_by_category: [],
    };

    const updatedSummary = {
      summary: {
        total_income: 0,
        total_expenses: 200,
        net_balance: -200,
        transaction_count: 1,
      },
      expenses_by_category: [],
    };

    (apiService.transactionApi.getAll as any).mockResolvedValue([initialTransaction]);
    (apiService.transactionApi.getSummary as any).mockResolvedValue(initialSummary);
    (apiService.transactionApi.update as any).mockResolvedValue(updatedTransaction);

    const store = useTransactionStore();
    await store.fetchTransactions();
    await store.fetchSummary();
    
    expect(store.transactions[0]?.amount).toBe(150);
    expect(store.summary.total_expenses).toBe(150);

    // Mock the refetch to return updated data
    (apiService.transactionApi.getAll as any).mockResolvedValue([updatedTransaction]);
    (apiService.transactionApi.getSummary as any).mockResolvedValue(updatedSummary);
    
    await store.updateTransaction(1, { amount: 200 });

    // After mutation, queries are invalidated and refetched
    await vi.waitFor(() => {
      expect(store.transactions[0]?.amount).toBe(200);
      expect(store.summary.total_expenses).toBe(200);
    });
  });

  it('deletes transaction and refreshes summary', async () => {
    const transaction = {
      id: 1,
      type: 'expense' as const,
      amount: 150,
      date: '2026-01-20',
      category_id: 2,
      description: 'Test',
      created_at: '',
      updated_at: '',
    };

    const initialSummary = {
      summary: {
        total_income: 0,
        total_expenses: 150,
        net_balance: -150,
        transaction_count: 1,
      },
      expenses_by_category: [],
    };

    const emptySummary = {
      summary: {
        total_income: 0,
        total_expenses: 0,
        net_balance: 0,
        transaction_count: 0,
      },
      expenses_by_category: [],
    };

    (apiService.transactionApi.getAll as any).mockResolvedValue([transaction]);
    (apiService.transactionApi.getSummary as any).mockResolvedValue(initialSummary);
    (apiService.transactionApi.delete as any).mockResolvedValue(undefined);

    const store = useTransactionStore();
    await store.fetchTransactions();
    await store.fetchSummary();
    
    expect(store.transactions).toHaveLength(1);
    expect(store.summary.transaction_count).toBe(1);

    // Mock the refetch to return empty data
    (apiService.transactionApi.getAll as any).mockResolvedValue([]);
    (apiService.transactionApi.getSummary as any).mockResolvedValue(emptySummary);
    
    await store.deleteTransaction(1);

    // After mutation, queries are invalidated and refetched
    await vi.waitFor(() => {
      expect(store.transactions).toHaveLength(0);
      expect(store.summary.transaction_count).toBe(0);
    });
  });

  it('handles fetch error', async () => {
    (apiService.transactionApi.getAll as any).mockRejectedValue(new Error('API Error'));
    (apiService.transactionApi.getSummary as any).mockResolvedValue({
      summary: { total_income: 0, total_expenses: 0, net_balance: 0, transaction_count: 0 },
      expenses_by_category: [],
    });

    const store = useTransactionStore();
    
    // Wait for query to fail
    await vi.waitFor(() => {
      expect(store.error).toBe('API Error');
    });
  });
});
