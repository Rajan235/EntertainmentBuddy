import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TrackingEntry,
  Category,
  ProgressStatus,
} from "@/types/tracking.types";
import { apiClient } from "@/lib/client/client"; // Your axios wrapper
import { MOCK_USER_LIST } from "@/lib/mock-data"; // 👈 Import your mock data

// 🚨 SIMULATION TOGGLE
// Set to TRUE to test UI without Backend
// Set to FALSE when you are ready to connect to Real API
const USE_MOCK_DATA = true;

export function useTracking() {
  const queryClient = useQueryClient();

  // 1. FETCH (Read)
  const {
    data: allEntries = [],
    isLoading,
    isError,
  } = useQuery<TrackingEntry[]>({
    queryKey: ["trackingEntries"],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simulate Network Delay (500ms)
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("📢 [Mock] Fetched User List:", MOCK_USER_LIST);
        return [...MOCK_USER_LIST]; // Return copy to trigger re-render
      }
      return apiClient<TrackingEntry[]>("/api/tracking");
    },
  });

  // 2. MUTATION (Write - Add/Update)
  const mutation = useMutation({
    mutationFn: async (newItem: Partial<TrackingEntry>) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate saving delay

        if (!newItem.id) throw new Error("ID required for mock update");

        const index = MOCK_USER_LIST.findIndex((e) => e.id === newItem.id);

        if (index > -1) {
          // UPDATE Existing
          console.log(`📢 [Mock] Updating ${newItem.title}...`);
          MOCK_USER_LIST[index] = { ...MOCK_USER_LIST[index], ...newItem };
        } else {
          // INSERT New
          console.log(`📢 [Mock] Adding ${newItem.title}...`);
          // We cast to TrackingEntry because we know the form provides the required fields
          MOCK_USER_LIST.push(newItem as TrackingEntry);
        }
        return newItem;
      }

      // Real Backend Call
      return apiClient("/api/tracking", {
        method: "POST",
        data: newItem,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackingEntries"] });
    },
  });
  // 3. DELETE Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`📢 [Mock] Deleting ID: ${id}...`);

        const index = MOCK_USER_LIST.findIndex((e) => e.id === id);
        if (index > -1) {
          MOCK_USER_LIST.splice(index, 1);
        }
        return true;
      }

      return apiClient(`/api/tracking/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackingEntries"] });
    },
  });

  // 3. Filtering Logic (Client-Side is fine for < 1000 items)
  const inProgressEntries = useMemo(
    () => allEntries.filter((e) => e.status === ProgressStatus.IN_PROGRESS),
    [allEntries],
  );

  const plannedEntries = useMemo(
    () => allEntries.filter((e) => e.status === ProgressStatus.PLANNING),
    [allEntries],
  );

  const completedEntries = useMemo(
    () => allEntries.filter((e) => e.status === ProgressStatus.COMPLETED),
    [allEntries],
  );
  const completedCount = completedEntries.length;

  // 4. Categorization Helpers
  // Helper function to avoid duplicating the reduce logic
  const groupByCategory = (entries: TrackingEntry[]) => {
    return entries.reduce(
      (acc, entry) => {
        return {
          ...acc,
          [entry.category]: [...(acc[entry.category] || []), entry],
        };
      },
      {} as Record<Category, TrackingEntry[]>,
    );
  };

  const inProgressByCategory = useMemo(
    () => groupByCategory(inProgressEntries),
    [inProgressEntries],
  );

  // 🟢 FIXED: Added this calculation
  const plannedByCategory = useMemo(
    () => groupByCategory(plannedEntries),
    [plannedEntries],
  );

  return {
    // Data
    allEntries,
    inProgressEntries,
    plannedEntries,
    completedEntries,
    completedCount,

    // Grouped Data
    inProgressByCategory,
    plannedByCategory, // 🟢 FIXED: Now checking this won't crash your app

    // Meta
    isLoading,
    isError,
    deleteEntry: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    // Actions
    addOrUpdateEntry: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
