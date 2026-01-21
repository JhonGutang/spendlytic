import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { categoryApi } from '../services/api.service';
import type { CategoryFormData } from '../types';
import type { MaybeRef } from 'vue';
import { unref } from 'vue';

/**
 * Query Keys for Categories
 * Used for caching, refetching, and invalidation
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (type?: 'income' | 'expense') => [...categoryKeys.lists(), { type }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

/**
 * Fetch all categories with optional type filter
 * 
 * @param type - Optional filter by category type ('income' or 'expense')
 * @returns Query result with categories data, loading state, and error
 */
export function useCategories(type?: MaybeRef<'income' | 'expense' | undefined>) {
  return useQuery({
    queryKey: categoryKeys.list(unref(type)),
    queryFn: () => categoryApi.getAll(unref(type)),
  });
}

/**
 * Fetch a single category by ID
 * 
 * @param id - Category ID
 * @returns Query result with category data, loading state, and error
 */
export function useCategoryById(id: MaybeRef<number>) {
  return useQuery({
    queryKey: categoryKeys.detail(unref(id)),
    queryFn: () => categoryApi.getById(unref(id)),
    enabled: !!unref(id), // Only fetch if ID is provided
  });
}

/**
 * Create a new category
 * 
 * @returns Mutation object with mutate function and state
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryFormData) => categoryApi.create(data),
    onSuccess: () => {
      // Invalidate all category queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

/**
 * Update an existing category
 * 
 * @returns Mutation object with mutate function and state
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryFormData> }) =>
      categoryApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      // Also invalidate the specific category detail
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
}

/**
 * Delete a category
 * 
 * @returns Mutation object with mutate function and state
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryApi.delete(id),
    onSuccess: () => {
      // Invalidate all category queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
