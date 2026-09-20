/**
 * src/store/zustand/useUIStore.ts
 *
 * Global UI state managed with Zustand:
 *   - Transient toasts (success, error, info, warning)
 *   - Global full-screen loading indicator
 *   - Generic modal / bottom-sheet registry state
 *
 * Ephemeral memory-only state (never persisted across sessions).
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  durationMs: number;
};

type UIState = {
  // ── Toast State ──────────────────────────────
  activeToast: Toast | null;
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
  hideToast: () => void;

  // ── Loader State ─────────────────────────────
  isLoading: boolean;
  loadingMessage: string | null;
  showLoader: (message?: string) => void;
  hideLoader: () => void;

  // ── Modal / Sheet State ──────────────────────
  activeSheet: string | null;
  sheetPayload: unknown;
  openSheet: <T = unknown>(sheetName: string, payload?: T) => void;
  closeSheet: () => void;
};

export const useUIStore = create<UIState>()((set) => ({
  // Toast
  activeToast: null,
  showToast: (message, type = 'info', durationMs = 3000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    set({
      activeToast: {
        id,
        message,
        type,
        durationMs,
      },
    });
  },
  hideToast: () => {
    set({ activeToast: null });
  },

  // Loader
  isLoading: false,
  loadingMessage: null,
  showLoader: (message = 'Loading...') => {
    set({ isLoading: true, loadingMessage: message });
  },
  hideLoader: () => {
    set({ isLoading: false, loadingMessage: null });
  },

  // Sheet / Modal
  activeSheet: null,
  sheetPayload: null,
  openSheet: (sheetName, payload) => {
    set({ activeSheet: sheetName, sheetPayload: payload ?? null });
  },
  closeSheet: () => {
    set({ activeSheet: null, sheetPayload: null });
  },
}));
