// store.js
import { create } from "zustand";

interface ChatState {
  responses: string[];
  addResponse: (newResponse: string) => void;
  clearResponse: () => void;
}

const useStore = create<ChatState>((set) => ({
  responses: [],
  addResponse: (newResponse: string) =>
    set((state) => ({
      responses: [...state.responses, newResponse]
    })),
  clearResponse: () => set({ responses: [] }),
}));

export default useStore;
