import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCategoryStore } from '../categoryStore';
import * as apiService from '../../services/api.service';
import { createApp } from 'vue';
import { installVueQueryPlugin } from './testUtils';

vi.mock('../../services/api.service');

describe('CategoryStore', () => {
  beforeEach(() => {
    const app = createApp({});
    installVueQueryPlugin(app);
    
    const pinia = createPinia();
    app.use(pinia);
    setActivePinia(pinia);
    
    vi.clearAllMocks();
  });

  it('initializes with empty categories', async () => {
    (apiService.categoryApi.getAll as any).mockResolvedValue([]);
    
    const store = useCategoryStore();
    
    // Wait for initial query to settle
    await vi.waitFor(() => {
      expect(store.loading).toBe(false);
    });
    
    expect(store.categories).toEqual([]);
    expect(store.error).toBeNull();
  });

  it('fetches categories successfully', async () => {
    const mockCategories = [
      { id: 1, name: 'Salary', type: 'income' as const, is_default: true, created_at: '', updated_at: '' },
      { id: 2, name: 'Food', type: 'expense' as const, is_default: true, created_at: '', updated_at: '' },
    ];

    (apiService.categoryApi.getAll as any).mockResolvedValue(mockCategories);

    const store = useCategoryStore();
    await store.fetchCategories();

    expect(store.categories).toEqual(mockCategories);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('handles fetch error', async () => {
    (apiService.categoryApi.getAll as any).mockRejectedValue(new Error('Network error'));

    const store = useCategoryStore();
    
    // Wait for query to fail
    await vi.waitFor(() => {
      expect(store.error).toBe('Network error');
    });
  });

  it('filters income categories', async () => {
    const mockCategories = [
      { id: 1, name: 'Salary', type: 'income' as const, is_default: true, created_at: '', updated_at: '' },
      { id: 2, name: 'Food', type: 'expense' as const, is_default: true, created_at: '', updated_at: '' },
      { id: 3, name: 'Freelance', type: 'income' as const, is_default: false, created_at: '', updated_at: '' },
    ];

    (apiService.categoryApi.getAll as any).mockResolvedValue(mockCategories);

    const store = useCategoryStore();
    await store.fetchCategories();

    expect(store.incomeCategories).toHaveLength(2);
    expect(store.incomeCategories.every(c => c.type === 'income')).toBe(true);
  });

  it('filters expense categories', async () => {
    const mockCategories = [
      { id: 1, name: 'Salary', type: 'income' as const, is_default: true, created_at: '', updated_at: '' },
      { id: 2, name: 'Food', type: 'expense' as const, is_default: true, created_at: '', updated_at: '' },
      { id: 3, name: 'Transport', type: 'expense' as const, is_default: false, created_at: '', updated_at: '' },
    ];

    (apiService.categoryApi.getAll as any).mockResolvedValue(mockCategories);

    const store = useCategoryStore();
    await store.fetchCategories();

    expect(store.expenseCategories).toHaveLength(2);
    expect(store.expenseCategories.every(c => c.type === 'expense')).toBe(true);
  });

  it('creates category successfully', async () => {
    const newCategory = { id: 3, name: 'Entertainment', type: 'expense' as const, is_default: false, created_at: '', updated_at: '' };
    const allCategories = [newCategory];
    
    (apiService.categoryApi.create as any).mockResolvedValue(newCategory);
    (apiService.categoryApi.getAll as any).mockResolvedValue(allCategories);

    const store = useCategoryStore();
    const result = await store.createCategory({ name: 'Entertainment', type: 'expense' });

    expect(result).toEqual(newCategory);
    // After mutation, query is invalidated and refetched
    await vi.waitFor(() => {
      expect(store.categories).toContainEqual(newCategory);
    });
  });

  it('updates category successfully', async () => {
    const initialCategory = { id: 1, name: 'Salary', type: 'income' as const, is_default: true, created_at: '', updated_at: '' };
    const updatedCategory = { id: 1, name: 'Updated Name', type: 'income' as const, is_default: true, created_at: '', updated_at: '' };
    
    (apiService.categoryApi.getAll as any).mockResolvedValue([initialCategory]);
    (apiService.categoryApi.update as any).mockResolvedValue(updatedCategory);

    const store = useCategoryStore();
    await store.fetchCategories();
    
    expect(store.categories[0]?.name).toBe('Salary');

    // Mock the refetch to return updated data
    (apiService.categoryApi.getAll as any).mockResolvedValue([updatedCategory]);
    await store.updateCategory(1, { name: 'Updated Name' });

    // After mutation, query is invalidated and refetched
    await vi.waitFor(() => {
      expect(store.categories[0]?.name).toBe('Updated Name');
    });
  });

  it('deletes category successfully', async () => {
    const categories = [
      { id: 1, name: 'Salary', type: 'income' as const, is_default: true, created_at: '', updated_at: '' },
      { id: 2, name: 'Food', type: 'expense' as const, is_default: true, created_at: '', updated_at: '' },
    ];
    
    (apiService.categoryApi.getAll as any).mockResolvedValue(categories);
    (apiService.categoryApi.delete as any).mockResolvedValue(undefined);

    const store = useCategoryStore();
    await store.fetchCategories();
    
    expect(store.categories).toHaveLength(2);

    // Mock the refetch to return data without deleted category
    (apiService.categoryApi.getAll as any).mockResolvedValue([categories[1]]);
    await store.deleteCategory(1);

    // After mutation, query is invalidated and refetched
    await vi.waitFor(() => {
      expect(store.categories).toHaveLength(1);
      expect(store.categories.find(c => c.id === 1)).toBeUndefined();
    });
  });
});
